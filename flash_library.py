"""Flash game catalog and search helpers backed by discovered SWF records."""
from __future__ import annotations

import math
from typing import Dict, Iterable, List, Optional, Sequence

import flash_services
from flash_services import FlashGameEntity

DEFAULT_PAGE_SIZE = 12
MAX_PAGE_SIZE = 48
DEFAULT_WIDTH = 800
DEFAULT_HEIGHT = 600
PLACEHOLDER_THUMBNAIL = "/static/img/flash-placeholder.svg"


def _short_description(description: str, limit: int = 150) -> str:
    if len(description) <= limit:
        return description
    return f"{description[: limit - 3].rstrip()}..."


def _aspect_ratio(width: int, height: int) -> float:
    if width <= 0 or height <= 0:
        return 1.0
    return round(width / float(height), 3)


def _normalise(value: object) -> str:
    return str(value or "").strip().lower()


def _unique(items: Iterable[str]) -> List[str]:
    return sorted({item for item in items if item})


def _source_for(game: FlashGameEntity) -> str:
    return game.developer or "Discovered Flash"


def _active_flash_games() -> List[FlashGameEntity]:
    return [
        game
        for game in flash_services.flash_repository.list_active_games()
        if game.is_active and flash_services.is_flash_storage_path(game.storage_path)
    ]


def serialize_game(game: FlashGameEntity) -> Dict[str, object]:
    description = game.description or ""
    width = DEFAULT_WIDTH
    height = DEFAULT_HEIGHT
    scripts = [game.actionscript_version] if game.actionscript_version else []
    return {
        "id": game.game_id,
        "title": game.title,
        "description": description,
        "short_description": _short_description(description),
        "tags": list(game.tags or []),
        "source": _source_for(game),
        "thumbnail": game.thumbnail_url or PLACEHOLDER_THUMBNAIL,
        "stream_path": game.storage_path,
        "width": width,
        "height": height,
        "aspect_ratio": _aspect_ratio(width, height),
        "actionscripts": scripts,
        "file_size": game.file_size,
        "play_count": game.play_count,
    }


def list_tags() -> List[str]:
    """Return all tags from discovered Flash records."""
    return _unique(tag for game in _active_flash_games() for tag in game.tags)


def list_sources() -> List[str]:
    """Return all source/developer values from discovered Flash records."""
    return _unique(_source_for(game) for game in _active_flash_games())


def get_game(game_id: str) -> Optional[Dict[str, object]]:
    game = flash_services.flash_repository.get(game_id)
    if not game or not game.is_active:
        return None
    if not flash_services.is_flash_storage_path(game.storage_path):
        return None
    return serialize_game(game)


def _filter_by_query(games: Sequence[FlashGameEntity], query: str) -> List[FlashGameEntity]:
    if not query:
        return list(games)
    terms = [term for term in _normalise(query).split() if term]
    if not terms:
        return list(games)
    result = []
    for game in games:
        haystack = " ".join(
            [
                _normalise(game.title),
                _normalise(game.description),
                _normalise(_source_for(game)),
                " ".join(_normalise(tag) for tag in game.tags),
            ]
        )
        if all(term in haystack for term in terms):
            result.append(game)
    return result


def _filter_by_tags(games: Sequence[FlashGameEntity], tags: Sequence[str]) -> List[FlashGameEntity]:
    wanted = {_normalise(tag) for tag in tags if _normalise(tag)}
    if not wanted:
        return list(games)
    filtered = []
    for game in games:
        game_tags = {_normalise(tag) for tag in game.tags}
        if wanted.issubset(game_tags):
            filtered.append(game)
    return filtered


def _filter_by_source(games: Sequence[FlashGameEntity], source: Optional[str]) -> List[FlashGameEntity]:
    if not source:
        return list(games)
    needle = _normalise(source)
    return [game for game in games if _normalise(_source_for(game)) == needle]


def search_games(
    *,
    query: str = "",
    tags: Optional[Sequence[str]] = None,
    source: Optional[str] = None,
    page: int = 1,
    page_size: int = DEFAULT_PAGE_SIZE,
) -> Dict[str, object]:
    """Search discovered Flash games only."""

    tags = tags or []
    working = _active_flash_games()
    working = _filter_by_query(working, query)
    working = _filter_by_tags(working, tags)
    working = _filter_by_source(working, source)
    working.sort(key=lambda game: (game.title or "").lower())

    total = len(working)
    safe_page_size = max(1, min(int(page_size or DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE))
    total_pages = max(1, math.ceil(total / float(safe_page_size))) if total else 1

    safe_page = max(1, int(page or 1))
    if safe_page > total_pages:
        safe_page = total_pages

    start = (safe_page - 1) * safe_page_size
    end = start + safe_page_size
    page_items = working[start:end]

    return {
        "results": [serialize_game(game) for game in page_items],
        "total": total,
        "page": safe_page,
        "page_size": safe_page_size,
        "pages": total_pages,
    }


def build_playback_context(game_id: str) -> Optional[Dict[str, object]]:
    game = get_game(game_id)
    if not game:
        return None
    return {
        "game": game,
        "stream_url": f"/flash/stream/{game['id']}",
        "actionscripts": game.get("actionscripts", []),
        "aspect_ratio": game.get("aspect_ratio", 1.0),
    }


__all__ = [
    "DEFAULT_PAGE_SIZE",
    "build_playback_context",
    "get_game",
    "list_sources",
    "list_tags",
    "search_games",
    "serialize_game",
]
