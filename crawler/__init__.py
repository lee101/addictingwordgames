"""Modular crawler framework package."""

from .base import BaseCrawler
from .config import SourceConfig, SourceRegistry
from .http import FetchResult, HTTPError, fetch_url
from .metadata import normalize_metadata
from .parsers import parse_html
from .rate_limiter import RateLimiter
from .state import CrawlerStateEntry, InMemoryStateStore
from .storage import FlashGameStorageHelper

__all__ = [
    "BaseCrawler",
    "SourceConfig",
    "SourceRegistry",
    "FetchResult",
    "HTTPError",
    "fetch_url",
    "normalize_metadata",
    "parse_html",
    "RateLimiter",
    "CrawlerStateEntry",
    "InMemoryStateStore",
    "FlashGameStorageHelper",
]
