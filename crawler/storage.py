"""Flash game storage helpers used by the crawler framework."""

from __future__ import annotations

from typing import Any, Callable, Optional

from awgutils import urlEncode


class FlashGameStorageHelper:
    """Provides deduplication and ingestion helpers for Flash games."""

    def __init__(
        self,
        lookup: Optional[Callable[[str], Any]] = None,
        save: Optional[Callable[[dict], Any]] = None,
    ) -> None:
        self._lookup = lookup or self._default_lookup
        self._save = save or self._noop_save
        self._seen: set[str] = set()

    def _default_lookup(self, urltitle: str) -> Any:
        try:
            from models import Game
        except Exception:
            return None
        return Game.oneByUrlTitle(urltitle)

    def _noop_save(self, metadata: dict) -> None:  # pragma: no cover - default noop
        return None

    def is_duplicate(self, metadata: dict) -> bool:
        urltitle = metadata.get("urltitle") or self._derive_urltitle(metadata)
        if not urltitle:
            return False
        if urltitle in self._seen:
            return True
        existing = self._lookup(urltitle)
        if existing:
            self._seen.add(urltitle)
            return True
        return False

    def ingest(self, metadata: dict) -> bool:
        """Persist *metadata* if it is not already present."""

        urltitle = metadata.get("urltitle") or self._derive_urltitle(metadata)
        if not urltitle:
            return False
        if self.is_duplicate({"urltitle": urltitle}):
            return False
        self._seen.add(urltitle)
        self._save(metadata)
        return True

    def _derive_urltitle(self, metadata: dict) -> Optional[str]:
        title = metadata.get("title")
        if not title:
            return None
        return urlEncode(title)

    def reset_cache(self) -> None:
        self._seen.clear()


__all__ = ["FlashGameStorageHelper"]
