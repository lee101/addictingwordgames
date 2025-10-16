import logging
from typing import Dict, List, Optional

import pytest

from crawlers.orchestrator import (
    BaseTaskScheduler,
    BinaryDownloadJob,
    CrawlResult,
    CrawlerOrchestrator,
    TransientCrawlError,
)


class FakeKey:
    def __init__(self, identifier: str, entity: "FakeRunModel"):
        self._identifier = identifier
        self._entity = entity

    def id(self) -> str:
        return self._identifier

    def get(self):
        return self._entity


class FakeRunModel:
    _storage: Dict[str, "FakeRunModel"] = {}
    _counter = 0

    def __init__(self, **kwargs):
        self.run_type = kwargs.get('run_type')
        self.status = kwargs.get('status', 'scheduled')
        self.triggered_by = kwargs.get('triggered_by')
        self.metadata = kwargs.get('metadata')
        self.failure_details = list(kwargs.get('failure_details', []))
        self.retry_attempts = kwargs.get('retry_attempts', 0)
        self.total_items = kwargs.get('total_items', 0)
        self.success_count = kwargs.get('success_count', 0)
        self.failure_count = kwargs.get('failure_count', 0)
        self.metrics = kwargs.get('metrics')
        self.started_at = kwargs.get('started_at')
        self.finished_at = kwargs.get('finished_at')
        self.key: Optional[FakeKey] = None

    @classmethod
    def reset(cls):
        cls._storage = {}
        cls._counter = 0

    @classmethod
    def save(cls, entity: "FakeRunModel"):
        return entity.put()

    @classmethod
    def recent(cls, limit: int = 20) -> List["FakeRunModel"]:
        ordered = sorted(cls._storage.values(), key=lambda e: int(e.key.id()) if e.key else 0, reverse=True)
        return ordered[:limit]

    @classmethod
    def get_last(cls) -> Optional["FakeRunModel"]:
        if not cls._storage:
            return None
        latest_id = max(cls._storage.keys(), key=lambda i: int(i))
        return cls._storage[latest_id]

    def put(self):
        if not self.key:
            FakeRunModel._counter += 1
            identifier = str(FakeRunModel._counter)
            self.key = FakeKey(identifier, self)
        FakeRunModel._storage[self.key.id()] = self
        return self.key


class RecordingScheduler(BaseTaskScheduler):
    def __init__(self, auto_run: bool = False):
        self.calls: List = []
        self.auto_run = auto_run

    def enqueue(self, func, *args, **kwargs):
        record = (func, args, dict(kwargs))
        self.calls.append(record)
        if self.auto_run:
            return func(*args, **kwargs)
        return None


class DummyFuture:
    def __init__(self, value=None, exc: Optional[Exception] = None):
        self._value = value
        self._exc = exc

    def result(self):
        if self._exc:
            raise self._exc
        return self._value


class DummyExecutor:
    def __init__(self, max_workers: int):
        self.max_workers = max_workers

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def submit(self, fn, *args, **kwargs):
        try:
            value = fn(*args, **kwargs)
            return DummyFuture(value=value)
        except Exception as exc:  # pragma: no cover - defensive
            return DummyFuture(exc=exc)


def immediate_as_completed(mapping):
    if isinstance(mapping, dict):
        return list(mapping.keys())
    return list(mapping)


@pytest.fixture(autouse=True)
def reset_state():
    FakeRunModel.reset()


def make_orchestrator(
    jobs,
    scheduler=None,
    **kwargs,
):
    return CrawlerOrchestrator(
        jobs,
        task_scheduler=scheduler or RecordingScheduler(),
        run_model=FakeRunModel,
        ndb_client_instance=None,
        logger=logging.getLogger('test'),
        **kwargs,
    )


def test_trigger_run_enqueues_job():
    scheduler = RecordingScheduler()
    orchestrator = make_orchestrator({'full': lambda: CrawlResult()}, scheduler=scheduler)

    orchestrator.trigger_run('full', triggered_by='cron')

    assert len(scheduler.calls) == 1
    func, args, kwargs = scheduler.calls[0]
    assert callable(func)
    assert kwargs['attempt'] == 0
    assert args[1] == 'full'


def test_execute_run_success_updates_history():
    download_calls: List[str] = []

    def record(name: str):
        download_calls.append(name)

    jobs = {
        'full': lambda: CrawlResult(
            ingested_count=2,
            skipped_count=1,
            binary_jobs=[
                BinaryDownloadJob(name='one', func=lambda: record('one')),
                BinaryDownloadJob(name='two', func=lambda: record('two')),
            ],
        )
    }

    scheduler = RecordingScheduler(auto_run=True)
    captured: Dict[str, int] = {}

    def executor_factory(max_workers: int):
        captured['max_workers'] = max_workers
        return DummyExecutor(max_workers)

    orchestrator = make_orchestrator(
        jobs,
        scheduler=scheduler,
        max_binary_concurrency=4,
        executor_factory=executor_factory,
        as_completed_fn=immediate_as_completed,
    )

    run_key = orchestrator.trigger_run('full', triggered_by='cli')
    summary = orchestrator.get_run_summary(run_key)

    assert summary['status'] == 'succeeded'
    assert summary['metrics']['ingested'] == 2
    assert summary['metrics']['binary_succeeded'] == 2
    assert download_calls == ['one', 'two']
    assert captured['max_workers'] == 4


def test_retry_on_transient_error_schedules_retry():
    attempts = {'count': 0}

    def flaky_job():
        attempts['count'] += 1
        if attempts['count'] == 1:
            raise TransientCrawlError('temporary')
        return CrawlResult()

    scheduler = RecordingScheduler()
    orchestrator = make_orchestrator(
        {'full': flaky_job},
        scheduler=scheduler,
        retry_attempts=2,
        retry_backoff=1,
        executor_factory=lambda max_workers: DummyExecutor(max_workers),
        as_completed_fn=immediate_as_completed,
    )

    orchestrator.trigger_run('full', triggered_by='cron')

    assert len(scheduler.calls) == 1
    func, args, kwargs = scheduler.calls.pop(0)
    func(*args, **kwargs)

    # retry should have been scheduled
    assert len(scheduler.calls) == 1
    retry_func, retry_args, retry_kwargs = scheduler.calls.pop(0)
    countdown = retry_kwargs.pop('countdown')
    assert pytest.approx(countdown, rel=0.01) == 1

    retry_func(*retry_args, **retry_kwargs)

    run = FakeRunModel.get_last()
    assert run is not None
    assert run.status == 'succeeded'
    assert attempts['count'] == 2


def test_binary_download_concurrency_limit():
    calls: List[str] = []

    jobs = {
        'full': lambda: CrawlResult(
            binary_jobs=[
                BinaryDownloadJob(name='a', func=lambda: calls.append('a')),
            ]
        )
    }

    captured: Dict[str, int] = {}

    def executor_factory(max_workers: int):
        captured['max_workers'] = max_workers
        return DummyExecutor(max_workers)

    orchestrator = make_orchestrator(
        jobs,
        scheduler=RecordingScheduler(auto_run=True),
        max_binary_concurrency=3,
        executor_factory=executor_factory,
        as_completed_fn=immediate_as_completed,
    )

    orchestrator.trigger_run('full', triggered_by='cli')

    assert captured['max_workers'] == 3
    assert calls == ['a']
