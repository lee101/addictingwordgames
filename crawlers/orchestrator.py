import logging
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Callable, Dict, Iterable, List, Optional, Tuple

try:  # pragma: no cover - deferred is only available on App Engine
    from google.appengine.ext import deferred  # type: ignore
except ImportError:  # pragma: no cover - local/dev environments
    deferred = None

from models import CrawlerRun, client as ndb_client


@dataclass
class BinaryDownloadJob:
    """Represents a binary artifact that needs to be downloaded and stored."""

    name: str
    func: Callable[..., Any]
    args: Tuple[Any, ...] = field(default_factory=tuple)
    kwargs: Dict[str, Any] = field(default_factory=dict)

    def run(self) -> Any:
        return self.func(*self.args, **self.kwargs)


@dataclass
class CrawlResult:
    """Structured response returned by crawler jobs."""

    ingested_count: int = 0
    skipped_count: int = 0
    errors: List[Dict[str, Any]] = field(default_factory=list)
    binary_jobs: List[BinaryDownloadJob] = field(default_factory=list)


class TransientCrawlError(Exception):
    """Raised when a crawler job encounters a retryable issue."""


class BaseTaskScheduler:
    """Interface for enqueueing crawler execution tasks."""

    def enqueue(self, func: Callable[..., Any], *args, **kwargs) -> Any:  # pragma: no cover - interface
        raise NotImplementedError


class DeferredTaskScheduler(BaseTaskScheduler):
    """Scheduler that routes work through App Engine's deferred queue."""

    def __init__(self, queue: Optional[str] = None):
        self.queue = queue

    def enqueue(self, func: Callable[..., Any], *args, **kwargs) -> Any:
        if deferred is None:  # pragma: no cover - only executed in local environments
            raise RuntimeError("google.appengine.ext.deferred is not available in this environment")

        countdown = kwargs.pop('countdown', None)
        task_kwargs: Dict[str, Any] = {}
        if self.queue:
            task_kwargs['_queue'] = self.queue
        if countdown is not None:
            task_kwargs['_countdown'] = countdown

        return deferred.defer(func, *args, **kwargs, **task_kwargs)


class ImmediateTaskScheduler(BaseTaskScheduler):
    """Scheduler that executes work synchronously (useful for CLI or tests)."""

    def __init__(self, sleep_func: Callable[[float], None] = time.sleep):
        self.sleep_func = sleep_func

    def enqueue(self, func: Callable[..., Any], *args, **kwargs) -> Any:
        countdown = kwargs.pop('countdown', 0)
        if countdown:
            self.sleep_func(countdown)
        return func(*args, **kwargs)


class CrawlerOrchestrator:
    """Coordinates crawler executions, retries, and artifact downloads."""

    def __init__(
        self,
        jobs: Dict[str, Callable[[], CrawlResult]],
        *,
        run_model: type = CrawlerRun,
        task_scheduler: Optional[BaseTaskScheduler] = None,
        max_binary_concurrency: int = 4,
        retry_attempts: int = 3,
        retry_backoff: float = 5.0,
        metrics_hook: Optional[Callable[[Dict[str, Any]], None]] = None,
        executor_factory: Optional[Callable[[int], ThreadPoolExecutor]] = None,
        as_completed_fn: Callable[[Iterable[Any]], Iterable[Any]] = as_completed,
        sleep_func: Callable[[float], None] = time.sleep,
        logger: Optional[logging.Logger] = None,
        ndb_client_instance=ndb_client,
    ):
        if not jobs:
            raise ValueError("At least one crawler job must be provided")

        self.jobs = jobs
        self.run_model = run_model
        self.task_scheduler = task_scheduler or DeferredTaskScheduler()
        self.max_binary_concurrency = max(1, max_binary_concurrency)
        self.retry_attempts = max(1, retry_attempts)
        self.retry_backoff = max(0.0, retry_backoff)
        self.metrics_hook = metrics_hook
        self._executor_factory = executor_factory or (lambda max_workers: ThreadPoolExecutor(max_workers=max_workers))
        self._as_completed = as_completed_fn
        self.sleep_func = sleep_func
        self.logger = logger or logging.getLogger(__name__)
        self.ndb_client = ndb_client_instance

    def trigger_run(self, run_type: str, *, triggered_by: str = 'system', metadata: Optional[Dict[str, Any]] = None):
        if run_type not in self.jobs:
            raise ValueError(f"Unknown crawler run type: {run_type}")

        run = self.run_model(
            run_type=run_type,
            status='scheduled',
            triggered_by=triggered_by,
            metadata=metadata,
            failure_details=[],
        )
        run_key = self._save_entity(run)
        run_id = self._key_id(run_key)
        self.logger.info("Scheduled crawler run %s (%s)", run_id, run_type)
        self.task_scheduler.enqueue(self._execute_run, run_key, run_type, attempt=0)
        return run_key

    def _execute_run(self, run_key, run_type: str, attempt: int = 0):
        run = self._get_run(run_key)
        if not run:
            self.logger.error("Crawler run entity missing for key %s", run_key)
            return

        if attempt == 0 and not getattr(run, 'started_at', None):
            run.started_at = datetime.utcnow()
        run.status = 'running'
        run.retry_attempts = attempt
        self._put_entity(run)

        self.logger.info("Starting crawler run %s attempt %s", self._key_id(run_key), attempt + 1)

        try:
            job_callable = self.jobs[run_type]
            result = job_callable()
            if not isinstance(result, CrawlResult):
                raise ValueError("Crawler job must return a CrawlResult instance")

            binary_successes, binary_failures = self._process_binary_jobs(result.binary_jobs)

            failures = list(result.errors) + binary_failures
            run.total_items = result.ingested_count
            run.success_count = binary_successes
            run.failure_count = len(failures)
            run.failure_details = failures
            run.finished_at = datetime.utcnow()
            run.status = 'succeeded' if not failures else 'partial'
            run.metrics = {
                'ingested': result.ingested_count,
                'skipped': result.skipped_count,
                'binary_attempted': len(result.binary_jobs),
                'binary_succeeded': binary_successes,
                'binary_failed': len(binary_failures),
            }
            self._put_entity(run)

            self.logger.info(
                "Completed crawler run %s status=%s ingested=%s binaries=%s/%s",
                self._key_id(run_key),
                run.status,
                result.ingested_count,
                binary_successes,
                len(result.binary_jobs),
            )

            if self.metrics_hook:
                self.metrics_hook(self._serialize_run(run))

        except TransientCrawlError as exc:
            self.logger.warning(
                "Transient error during crawler run %s attempt %s: %s",
                self._key_id(run_key),
                attempt + 1,
                exc,
            )
            self._handle_retry(run_key, run, run_type, attempt, exc)
        except Exception as exc:  # pragma: no cover - defensive
            self.logger.exception("Crawler run %s failed", self._key_id(run_key), exc_info=exc)
            self._mark_run_failed(run, exc)

    def _handle_retry(self, run_key, run, run_type: str, attempt: int, exc: Exception):
        if attempt + 1 >= self.retry_attempts:
            self.logger.error(
                "Exhausted retries for crawler run %s after %s attempts",
                self._key_id(run_key),
                attempt + 1,
            )
            self._mark_run_failed(run, exc)
            return

        wait_seconds = self.retry_backoff * (2 ** attempt)
        run.status = 'retrying'
        run.retry_attempts = attempt + 1
        self._put_entity(run)
        self.logger.info(
            "Re-scheduling crawler run %s in %.2f seconds",
            self._key_id(run_key),
            wait_seconds,
        )
        self.task_scheduler.enqueue(
            self._execute_run,
            run_key,
            run_type,
            attempt=attempt + 1,
            countdown=wait_seconds,
        )

    def _mark_run_failed(self, run, exc: Exception):
        run.status = 'failed'
        run.finished_at = datetime.utcnow()
        failure_details = list(getattr(run, 'failure_details', []) or [])
        failure_details.append({'error': str(exc)})
        run.failure_details = failure_details
        run.failure_count = len(failure_details)
        self._put_entity(run)
        if self.metrics_hook:
            self.metrics_hook(self._serialize_run(run))

    def _process_binary_jobs(self, jobs: List[BinaryDownloadJob]) -> Tuple[int, List[Dict[str, Any]]]:
        if not jobs:
            return 0, []

        successes = 0
        failures: List[Dict[str, Any]] = []

        with self._executor_factory(self.max_binary_concurrency) as executor:
            future_to_job = {
                executor.submit(self._execute_job_with_retry, job): job for job in jobs
            }
            for future in self._as_completed(future_to_job):
                job = future_to_job[future]
                try:
                    future.result()
                    successes += 1
                except Exception as exc:  # pragma: no cover - defensive
                    self.logger.exception("Binary download failed for %s", job.name, exc_info=exc)
                    failures.append({'job': job.name, 'error': str(exc)})

        return successes, failures

    def _execute_job_with_retry(self, job: BinaryDownloadJob):
        last_error: Optional[Exception] = None
        for attempt in range(self.retry_attempts):
            try:
                return job.run()
            except TransientCrawlError as exc:
                last_error = exc
                if attempt + 1 >= self.retry_attempts:
                    break
                wait_seconds = self.retry_backoff * (2 ** attempt)
                self.logger.warning(
                    "Transient binary failure for %s (attempt %s) retrying in %.2f seconds",
                    job.name,
                    attempt + 1,
                    wait_seconds,
                )
                self.sleep_func(wait_seconds)
            except Exception as exc:
                raise exc
        if last_error:
            raise last_error

    def get_run_summary(self, run_key) -> Optional[Dict[str, Any]]:
        run = self._get_run(run_key)
        if not run:
            return None
        return self._serialize_run(run)

    def _serialize_run(self, run) -> Dict[str, Any]:
        return {
            'id': self._key_id(getattr(run, 'key', None)),
            'run_type': run.run_type,
            'status': run.status,
            'started_at': getattr(run, 'started_at', None).isoformat() if getattr(run, 'started_at', None) else None,
            'finished_at': getattr(run, 'finished_at', None).isoformat() if getattr(run, 'finished_at', None) else None,
            'metrics': getattr(run, 'metrics', {}),
            'failure_details': getattr(run, 'failure_details', []),
        }

    def _save_entity(self, entity):
        if hasattr(self.run_model, 'save'):
            return self.run_model.save(entity)
        if hasattr(entity, 'put'):
            if self.ndb_client:
                with self.ndb_client.context():
                    return entity.put()
            return entity.put()
        raise RuntimeError('Unable to persist crawler run entity')

    def _put_entity(self, entity):
        if hasattr(entity, 'put'):
            if self.ndb_client:
                with self.ndb_client.context():
                    return entity.put()
            return entity.put()
        if hasattr(self.run_model, 'save'):
            return self.run_model.save(entity)
        raise RuntimeError('Unable to persist crawler run entity')

    def _get_run(self, run_key):
        if run_key is None:
            return None
        if hasattr(run_key, 'get'):
            if self.ndb_client:
                with self.ndb_client.context():
                    return run_key.get()
            return run_key.get()
        return run_key

    def _key_id(self, key) -> Optional[str]:
        if key is None:
            return None
        if hasattr(key, 'id'):
            key_id = key.id()
            return str(key_id) if key_id is not None else None
        if hasattr(key, 'urlsafe'):
            return key.urlsafe()
        return str(key)
