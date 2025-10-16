from __future__ import annotations

from typing import Any, Dict, List

import pytest

from crawler.base import BaseCrawler
from crawler.config import SourceRegistry
from crawler.http import FetchResult
from crawler.rate_limiter import RateLimiter
from crawler.state import InMemoryStateStore
from crawler.storage import FlashGameStorageHelper


class RecordingStorage(FlashGameStorageHelper):
    def __init__(self) -> None:
        self.saved: List[dict] = []
        super().__init__(lookup=lambda _: None, save=self.saved.append)


def build_response(url: str, *, status: int = 200, body: str = "", headers: Dict[str, str] | None = None) -> FetchResult:
    if isinstance(body, str):
        body_bytes = body.encode("utf-8")
    else:
        body_bytes = body
    return FetchResult(url=url, status_code=status, content=body_bytes, headers=headers or {}, reason=None)


class ArticleCrawler(BaseCrawler):
    def extract_items(self, soup, url: str, result: FetchResult):
        for article in soup.find_all("article"):
            yield {
                "title": article.get("data-title"),
                "url": article.get("data-url"),
                "description": article.text,
                "tags": [tag.strip() for tag in (article.get("data-tags") or "").split(",") if tag],
            }

    def extract_links(self, soup, url: str, result: FetchResult):
        for link in soup.find_all("a"):
            href = link.get("href")
            if href:
                yield href


def test_crawl_loop_ingests_items_and_discovers_links():
    start_url = "https://example.com/games"
    secondary_url = "https://example.com/next"

    responses = {
        "https://example.com/robots.txt": build_response(
            "https://example.com/robots.txt", body="User-agent: *\nAllow: /"
        ),
        start_url: build_response(
            start_url,
            body=(
                "<html><body>"
                "<article data-title=\" Test Game \" data-url=\"https://games.example/game\" "
                "data-tags=\"Word , Puzzle\"> Fun\n Game </article>"
                "<a href='/next'>Next</a>"
                "</body></html>"
            ),
            headers={"content-type": "text/html; charset=utf-8", "etag": "W/\"123\""},
        ),
        secondary_url: build_response(
            secondary_url,
            body="<html><body><p>No items here</p></body></html>",
            headers={"content-type": "text/html"},
        ),
    }

    calls: List[Dict[str, Any]] = []

    def fetcher(url: str, *, headers=None, timeout=None, etag=None, last_modified=None):  # type: ignore[override]
        calls.append(
            {
                "url": url,
                "headers": headers,
                "etag": etag,
                "last_modified": last_modified,
            }
        )
        if url not in responses:
            raise AssertionError(f"Unexpected URL fetched: {url}")
        return responses[url]

    storage = RecordingStorage()
    ingested: List[dict] = []

    crawler = ArticleCrawler(
        start_urls=[start_url],
        http_fetcher=fetcher,
        storage_helper=storage,
        ingestion_callback=ingested.append,
        rate_limiter=RateLimiter(min_interval=0),
        timeout=1,
    )

    processed = crawler.run()

    assert processed == 2  # start + secondary page
    assert len(storage.saved) == 1
    metadata = storage.saved[0]
    assert metadata["tags"] == ["puzzle", "word"]
    assert metadata["urltitle"] is not None
    assert len(ingested) == 1
    assert ingested[0] is metadata

    state = crawler.state_store.get(start_url)
    assert state is not None
    assert state.etag == "W/\"123\""
    assert state.last_fetched is not None

    fetched_urls = [call["url"] for call in calls]
    assert start_url in fetched_urls
    assert secondary_url in fetched_urls


def test_rate_limiter_enforces_min_interval():
    sleeps: List[float] = []

    class FakeClock:
        def __init__(self) -> None:
            self.value = 0.0

        def __call__(self) -> float:
            return self.value

        def advance(self, amount: float) -> None:
            self.value += amount

    clock = FakeClock()

    def sleeper(duration: float) -> None:
        sleeps.append(duration)
        clock.advance(duration)

    limiter = RateLimiter(min_interval=2.0, clock=clock.__call__, sleeper=sleeper)

    limiter.wait("https://example.com/page1")
    clock.advance(0.5)
    limiter.wait("https://example.com/page2")
    limiter.wait("https://other.example/page1")

    assert pytest.approx(sleeps[0], rel=1e-3) == 1.5
    assert len(sleeps) == 1


def test_state_tracking_skips_not_modified():
    start_url = "https://example.com/update"
    state_store = InMemoryStateStore()
    state_store.update(start_url, etag="W/\"xyz\"", last_modified="Wed, 01 Jan 2020 00:00:00 GMT")

    responses = {
        start_url: build_response(start_url, status=304, headers={"etag": "W/\"xyz\""}),
    }

    requests: List[Dict[str, Any]] = []

    def fetcher(url: str, *, headers=None, timeout=None, etag=None, last_modified=None):  # type: ignore[override]
        requests.append({"url": url, "etag": etag, "last_modified": last_modified})
        return responses[url]

    ingested: List[dict] = []

    class NoopCrawler(BaseCrawler):
        def extract_items(self, soup, url: str, result: FetchResult):
            return []

    crawler = NoopCrawler(
        start_urls=[start_url],
        http_fetcher=fetcher,
        state_store=state_store,
        ingestion_callback=ingested.append,
        respect_robots=False,
        rate_limiter=RateLimiter(min_interval=0),
    )

    crawler.run()

    state = state_store.get(start_url)
    assert state is not None
    assert state.status_code == 304
    assert state.last_fetched is not None
    assert ingested == []
    assert requests[0]["etag"] == "W/\"xyz\""
    assert requests[0]["last_modified"] == "Wed, 01 Jan 2020 00:00:00 GMT"


def test_robots_respected_blocks_disallowed_paths():
    start_url = "https://example.com/private/page"
    robots_url = "https://example.com/robots.txt"

    responses = {
        robots_url: build_response(
            robots_url,
            body="User-agent: *\nDisallow: /private",
            headers={"content-type": "text/plain"},
        )
    }

    fetched_pages: List[str] = []

    def fetcher(url: str, *, headers=None, timeout=None, etag=None, last_modified=None):  # type: ignore[override]
        if url == robots_url:
            return responses[url]
        fetched_pages.append(url)
        return build_response(url)

    class NoopCrawler(BaseCrawler):
        def extract_items(self, soup, url: str, result: FetchResult):
            return []

    crawler = NoopCrawler(
        start_urls=[start_url],
        http_fetcher=fetcher,
        respect_robots=True,
        rate_limiter=RateLimiter(min_interval=0),
    )

    crawler.run(max_iterations=1)
    assert fetched_pages == []


class ConfigurableCrawler(BaseCrawler):
    def __init__(self, start_urls, *, marker: str, **kwargs):
        super().__init__(start_urls=start_urls, **kwargs)
        self.marker = marker

    def extract_items(self, soup, url: str, result: FetchResult):
        return []


def test_config_registry_instantiates_crawler_from_config():
    registry = SourceRegistry()
    crawler_ref = f"{ConfigurableCrawler.__module__}.ConfigurableCrawler"
    config = {
        "sources": [
            {
                "name": "demo",
                "crawler": crawler_ref,
                "start_urls": ["https://example.com"],
                "options": {"marker": "ok", "respect_robots": False},
            }
        ]
    }

    registry.register_from_config(config)

    def dummy_fetcher(url: str, **kwargs):
        return build_response(url)

    crawler = registry.create("demo", http_fetcher=dummy_fetcher, rate_limiter=RateLimiter(min_interval=0))

    assert isinstance(crawler, ConfigurableCrawler)
    assert crawler.marker == "ok"
    assert crawler.start_urls == ["https://example.com"]
    assert "demo" in registry.names()
