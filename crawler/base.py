"""Reusable base crawler implementation."""

from __future__ import annotations

import logging
import time
from collections import deque
from typing import Deque, Iterable, Optional, Sequence, Set, Union
from urllib import robotparser
from urllib.parse import urljoin, urlparse

from .http import DEFAULT_TIMEOUT, FetchResult, HTTPError, fetch_url
from .metadata import normalize_metadata
from .parsers import parse_html
from .rate_limiter import RateLimiter
from .state import CrawlerStateEntry, InMemoryStateStore
from .storage import FlashGameStorageHelper


class BaseCrawler:
    """Generic crawl loop with politeness, state and error handling."""

    def __init__(
        self,
        start_urls: Union[Sequence[str], str],
        *,
        http_fetcher=fetch_url,
        parser=parse_html,
        metadata_normalizer=normalize_metadata,
        storage_helper: Optional[FlashGameStorageHelper] = None,
        rate_limiter: Optional[RateLimiter] = None,
        state_store: Optional[InMemoryStateStore] = None,
        ingestion_callback=None,
        user_agent: str = "awg-crawler/1.0",
        max_errors: int = 5,
        respect_robots: bool = True,
        allowed_schemes: Optional[Iterable[str]] = None,
        timeout: float = DEFAULT_TIMEOUT,
        logger: Optional[logging.Logger] = None,
        clock=time.time,
    ) -> None:
        self.start_urls = (
            [start_urls] if isinstance(start_urls, str) else list(start_urls)
        )
        self.http_fetcher = http_fetcher
        self.parser = parser
        self.metadata_normalizer = metadata_normalizer
        self.storage_helper = storage_helper or FlashGameStorageHelper()
        self.rate_limiter = rate_limiter or RateLimiter()
        self.state_store = state_store or InMemoryStateStore()
        self.ingestion_callback = ingestion_callback
        self.user_agent = user_agent
        self.max_errors = max_errors
        self.respect_robots = respect_robots
        self.allowed_schemes = (
            set(allowed_schemes) if allowed_schemes is not None else {"http", "https"}
        )
        self.timeout = timeout
        self.logger = logger or logging.getLogger(self.__class__.__name__)
        self.clock = clock

        self.queue: Deque[str] = deque()
        self.seen: Set[str] = set()
        self.errors = 0
        self.processed = 0
        self._robots_cache: dict[tuple[str, str], robotparser.RobotFileParser] = {}

        for url in self.start_urls:
            self.enqueue_url(url)

    # --- public API -----------------------------------------------------
    def run(self, max_iterations: Optional[int] = None) -> int:
        """Run the crawl loop."""

        iterations = 0
        while self.queue and (max_iterations is None or iterations < max_iterations):
            url = self.queue.popleft()
            if not self.should_fetch(url):
                iterations += 1
                if self.errors >= self.max_errors:
                    break
                continue
            try:
                self._process_url(url)
                self.processed += 1
            except Exception as exc:  # pragma: no cover - defensive
                self.errors += 1
                self.logger.exception("Unhandled error processing %s", url, exc_info=exc)
            finally:
                iterations += 1
            if self.errors >= self.max_errors:
                break
        return self.processed

    def enqueue_url(self, url: str) -> bool:
        normalized = self.make_absolute_url(None, url)
        if not normalized:
            return False
        if normalized in self.seen:
            return False
        parsed = urlparse(normalized)
        if parsed.scheme and parsed.scheme not in self.allowed_schemes:
            return False
        self.queue.append(normalized)
        self.seen.add(normalized)
        return True

    # --- overridable hooks ---------------------------------------------
    def extract_items(
        self, soup, url: str, result: FetchResult
    ) -> Iterable[dict]:  # pragma: no cover - default stub
        return []

    def extract_links(
        self, soup, url: str, result: FetchResult
    ) -> Iterable[str]:  # pragma: no cover - default stub
        return []

    def after_page_crawled(self, url: str, result: FetchResult, soup) -> None:
        return None

    def should_fetch(self, url: str) -> bool:
        return True

    def handle_duplicate(self, metadata: dict) -> None:
        return None

    def handle_bad_status(
        self, url: str, state: CrawlerStateEntry, result: FetchResult
    ) -> None:
        self.errors += 1
        self.logger.warning(
            "Bad status %s for %s", result.status_code, url
        )

    def handle_not_modified(
        self, url: str, state: CrawlerStateEntry, result: FetchResult
    ) -> None:
        return None

    def handle_error(self, url: str, error: HTTPError) -> None:
        self.errors += 1
        self.logger.warning("HTTP error for %s: %s", url, error.reason)

    # --- helpers --------------------------------------------------------
    def build_headers(self, url: str) -> dict[str, str]:
        return {"User-Agent": self.user_agent}

    def make_absolute_url(self, base_url: Optional[str], link: str) -> Optional[str]:
        if not link:
            return None
        if base_url is None:
            return link
        return urljoin(base_url, link)

    def _process_url(self, url: str) -> None:
        if self.respect_robots and not self._is_allowed(url):
            return

        state = self.state_store.get(url)
        etag = state.etag if state else None
        last_modified = state.last_modified if state else None
        headers = self.build_headers(url)

        self.rate_limiter.wait(url)
        try:
            result = self.http_fetcher(
                url,
                headers=headers,
                timeout=self.timeout,
                etag=etag,
                last_modified=last_modified,
            )
        except HTTPError as err:
            self.state_store.update(
                url,
                last_fetched=self.clock(),
                status_code=err.status_code,
                error=err.reason,
            )
            self.handle_error(url, err)
            return

        fetched_at = self.clock()
        state = self.state_store.update(
            url,
            last_fetched=fetched_at,
            status_code=result.status_code,
            etag=result.headers.get("etag"),
            last_modified=result.headers.get("last-modified"),
            error=None,
        )

        if result.status_code == 304:
            self.handle_not_modified(url, state, result)
            return

        if result.status_code >= 400:
            self.handle_bad_status(url, state, result)
            return

        soup = self.parser(result.content)
        for item in self.extract_items(soup, url, result):
            metadata = self.metadata_normalizer(item)
            if not metadata.get("title"):
                continue
            if self.storage_helper.is_duplicate(metadata):
                self.handle_duplicate(metadata)
                continue
            ingested = self.storage_helper.ingest(metadata)
            if ingested and self.ingestion_callback:
                self.ingestion_callback(metadata)

        for link in self.extract_links(soup, url, result):
            absolute = self.make_absolute_url(result.url, link)
            if absolute:
                self.enqueue_url(absolute)

        self.after_page_crawled(url, result, soup)

    def _is_allowed(self, url: str) -> bool:
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return True
        key = (parsed.scheme, parsed.netloc)
        parser = self._robots_cache.get(key)
        if parser is None:
            parser = robotparser.RobotFileParser()
            robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
            headers = self.build_headers(robots_url)
            try:
                result = self.http_fetcher(robots_url, headers=headers, timeout=self.timeout)
                if result.status_code >= 400:
                    parser.parse(["User-agent: *", "Allow: /"])
                else:
                    parser.parse(result.text.splitlines())
            except HTTPError:
                parser.parse(["User-agent: *", "Allow: /"])
            self._robots_cache[key] = parser
        return parser.can_fetch(self.user_agent, url)


__all__ = ["BaseCrawler"]
