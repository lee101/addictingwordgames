import os
from typing import Optional

from crawlers.crawlers import perform_mochi_crawl
from crawlers.orchestrator import (
    BaseTaskScheduler,
    CrawlerOrchestrator,
    DeferredTaskScheduler,
    ImmediateTaskScheduler,
    deferred,
)


def create_default_orchestrator(
    *,
    task_scheduler: Optional[BaseTaskScheduler] = None,
    max_binary_concurrency: Optional[int] = None,
    retry_attempts: Optional[int] = None,
    retry_backoff: Optional[float] = None,
    metrics_hook=None,
    logger=None,
    run_model=None,
):
    """Factory that wires the orchestrator with the default crawler jobs."""

    if task_scheduler is not None:
        scheduler = task_scheduler
    else:
        scheduler = DeferredTaskScheduler() if deferred is not None else ImmediateTaskScheduler()
    concurrency = max_binary_concurrency or int(os.environ.get('CRAWLER_BINARY_CONCURRENCY', '4'))
    attempts = retry_attempts or int(os.environ.get('CRAWLER_RETRY_ATTEMPTS', '3'))
    backoff = retry_backoff if retry_backoff is not None else float(os.environ.get('CRAWLER_RETRY_BACKOFF', '5.0'))

    full_limit = int(os.environ.get('CRAWLER_FULL_LIMIT', '1000'))
    incremental_limit = int(os.environ.get('CRAWLER_INCREMENTAL_LIMIT', '200'))

    jobs = {
        'full': lambda: perform_mochi_crawl(limit=full_limit),
        'incremental': lambda: perform_mochi_crawl(limit=incremental_limit),
    }

    orchestrator_kwargs = dict(
        jobs=jobs,
        task_scheduler=scheduler,
        max_binary_concurrency=concurrency,
        retry_attempts=attempts,
        retry_backoff=backoff,
        metrics_hook=metrics_hook,
        logger=logger,
    )

    if run_model is not None:
        orchestrator_kwargs['run_model'] = run_model

    return CrawlerOrchestrator(**orchestrator_kwargs)


__all__ = ['create_default_orchestrator', 'ImmediateTaskScheduler']
