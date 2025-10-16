"""Configuration helpers for registering crawler sources."""

from __future__ import annotations

import importlib
from dataclasses import dataclass, field
from typing import Any, Dict, List, Mapping, Optional, Type

if True:  # pragma: no cover - for type checking without circular imports
    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from .base import BaseCrawler


@dataclass
class SourceConfig:
    """Declarative configuration for a crawler source."""

    name: str
    crawler_class: Type["BaseCrawler"]
    start_urls: List[str] = field(default_factory=list)
    options: Dict[str, Any] = field(default_factory=dict)


def resolve_reference(ref: Any) -> Any:
    if isinstance(ref, str):
        module_name, _, attr = ref.rpartition(".")
        if not module_name:
            raise ValueError(f"Invalid reference '{ref}'")
        module = importlib.import_module(module_name)
        return getattr(module, attr)
    return ref


class SourceRegistry:
    """Runtime registry that instantiates crawlers from configuration."""

    def __init__(self) -> None:
        self._sources: Dict[str, SourceConfig] = {}

    def register(self, config: SourceConfig) -> None:
        self._sources[config.name] = config

    def register_from_config(self, config: Mapping[str, Any]) -> None:
        sources = config.get("sources", [])
        for entry in sources:
            name = entry.get("name")
            if not name:
                raise ValueError("Missing source name in configuration")
            crawler_ref = entry.get("crawler")
            if not crawler_ref:
                raise ValueError(f"Missing crawler class for source '{name}'")
            crawler_class = resolve_reference(crawler_ref)
            start_urls = list(entry.get("start_urls", []))
            options = dict(entry.get("options", {}))
            self.register(SourceConfig(name, crawler_class, start_urls, options))

    def create(self, name: str, **overrides: Any) -> "BaseCrawler":
        config = self._sources.get(name)
        if not config:
            raise KeyError(f"Source '{name}' is not registered")
        start_urls = overrides.pop("start_urls", None) or config.start_urls
        kwargs = dict(config.options)
        kwargs.update(overrides)
        crawler_class = config.crawler_class
        return crawler_class(start_urls=start_urls, **kwargs)

    def get(self, name: str) -> Optional[SourceConfig]:
        return self._sources.get(name)

    def clear(self) -> None:
        self._sources.clear()

    def names(self) -> List[str]:
        return list(self._sources.keys())


__all__ = ["SourceConfig", "SourceRegistry", "resolve_reference"]
