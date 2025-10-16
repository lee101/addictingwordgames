from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, Iterable, Optional, Type

from .armor_games import ArmorGamesCrawler
from .base import BaseCrawler
from .itch_io import ItchIoCrawler
from .kongregate import KongregateCrawler


@dataclass
class SourceConfig:
    slug: str
    display_name: str
    crawler_cls: Optional[Type[BaseCrawler]] = None
    enabled: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)

    def create(self, **kwargs: Any) -> BaseCrawler:
        if not self.crawler_cls:
            raise ValueError(f"No crawler registered for source '{self.slug}'")
        return self.crawler_cls(**kwargs)


class CrawlerRegistry:
    def __init__(self) -> None:
        self._sources: Dict[str, SourceConfig] = {}

    def register(
        self,
        slug: str,
        display_name: str,
        crawler_cls: Optional[Type[BaseCrawler]] = None,
        *,
        enabled: bool = False,
        **metadata: Any,
    ) -> SourceConfig:
        config = SourceConfig(
            slug=slug,
            display_name=display_name,
            crawler_cls=crawler_cls,
            enabled=enabled,
            metadata=metadata,
        )
        self._sources[slug] = config
        return config

    def get(self, slug: str) -> Optional[SourceConfig]:
        return self._sources.get(slug)

    def create(self, slug: str, **kwargs: Any) -> BaseCrawler:
        config = self.get(slug)
        if not config:
            raise KeyError(f"Unknown crawler source '{slug}'")
        return config.create(**kwargs)

    def all(self) -> Iterable[SourceConfig]:
        return self._sources.values()

    def enabled(self) -> Iterable[SourceConfig]:
        return (config for config in self._sources.values() if config.enabled)


RUFFLE_SPONSOR_SOURCES = {
    "armor-games": "Armor Games",
    "kongregate": "Kongregate",
    "itch-io": "itch.io",
    "newgrounds": "Newgrounds",
    "coolmath-games": "Coolmath Games",
    "crazygames": "CrazyGames",
    "poki": "Poki",
}


def build_default_registry() -> CrawlerRegistry:
    registry = CrawlerRegistry()
    registry.register(
        "armor-games",
        RUFFLE_SPONSOR_SOURCES["armor-games"],
        ArmorGamesCrawler,
        enabled=True,
    )
    registry.register(
        "kongregate",
        RUFFLE_SPONSOR_SOURCES["kongregate"],
        KongregateCrawler,
        enabled=True,
    )
    registry.register(
        "itch-io",
        RUFFLE_SPONSOR_SOURCES["itch-io"],
        ItchIoCrawler,
        enabled=True,
    )
    # Future sponsor sources can be toggled on as crawlers are implemented
    for slug, name in RUFFLE_SPONSOR_SOURCES.items():
        if slug in {"armor-games", "kongregate", "itch-io"}:
            continue
        registry.register(slug, name, crawler_cls=None, enabled=False)
    return registry


sponsor_registry = build_default_registry()


__all__ = [
    "CrawlerRegistry",
    "SourceConfig",
    "RUFFLE_SPONSOR_SOURCES",
    "build_default_registry",
    "sponsor_registry",
]
