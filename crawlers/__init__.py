from .armor_games import ArmorGamesCrawler
from .base import BaseCrawler, FlashGame, FlashGameStore, ListingEntry, rewrite_cdn_url
from .itch_io import ItchIoCrawler
from .kongregate import KongregateCrawler
from .registry import (
    CrawlerRegistry,
    SourceConfig,
    build_default_registry,
    sponsor_registry,
)

__all__ = [
    "ArmorGamesCrawler",
    "BaseCrawler",
    "FlashGame",
    "FlashGameStore",
    "ListingEntry",
    "ItchIoCrawler",
    "KongregateCrawler",
    "CrawlerRegistry",
    "SourceConfig",
    "build_default_registry",
    "sponsor_registry",
    "rewrite_cdn_url",
]
