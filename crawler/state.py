"""Crawler state tracking primitives."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable, Iterator, Optional, Tuple


@dataclass
class CrawlerStateEntry:
    """Represents tracking information for a crawled URL."""

    last_fetched: Optional[float] = None
    etag: Optional[str] = None
    last_modified: Optional[str] = None
    status_code: Optional[int] = None
    error: Optional[str] = None


class InMemoryStateStore:
    """A lightweight, in-memory crawler state backend."""

    def __init__(self) -> None:
        self._entries: Dict[str, CrawlerStateEntry] = {}

    def get(self, url: str) -> Optional[CrawlerStateEntry]:
        return self._entries.get(url)

    def update(self, url: str, **kwargs) -> CrawlerStateEntry:
        entry = self._entries.setdefault(url, CrawlerStateEntry())
        for key, value in kwargs.items():
            if not hasattr(entry, key):
                raise AttributeError(f"Unknown state attribute '{key}'")
            setattr(entry, key, value)
        return entry

    def delete(self, url: str) -> None:
        self._entries.pop(url, None)

    def clear(self) -> None:
        self._entries.clear()

    def items(self) -> Iterable[Tuple[str, CrawlerStateEntry]]:
        return self._entries.items()

    def __iter__(self) -> Iterator[Tuple[str, CrawlerStateEntry]]:
        return iter(self._entries.items())


__all__ = ["CrawlerStateEntry", "InMemoryStateStore"]
