#!/usr/bin/env python3
"""CLI entry point for orchestrating crawler runs."""

import argparse
import json
import logging
from typing import Optional

from crawlers.factory import create_default_orchestrator, ImmediateTaskScheduler


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Trigger crawler executions')
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--full', action='store_true', help='Run a full crawl')
    group.add_argument('--incremental', action='store_true', help='Run an incremental crawl')
    parser.add_argument('--metadata', help='Optional JSON metadata to attach to the run')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    return parser.parse_args()


def main():
    args = parse_args()

    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO)

    run_type = 'incremental' if args.incremental else 'full'
    metadata: Optional[dict] = None
    if args.metadata:
        try:
            metadata = json.loads(args.metadata)
        except json.JSONDecodeError as exc:
            raise SystemExit(f'Invalid metadata JSON: {exc}')

    orchestrator = create_default_orchestrator(task_scheduler=ImmediateTaskScheduler())
    run_key = orchestrator.trigger_run(run_type, triggered_by='cli', metadata=metadata)

    summary = orchestrator.get_run_summary(run_key)
    if summary is None:
        logging.error('Crawler run did not produce a summary (run may not exist).')
        return

    logging.info("Crawler run complete: %s", json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
