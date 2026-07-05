"""Flash game catalog and search helpers for the Flash library UI."""
from __future__ import annotations

import math
from typing import Dict, Iterable, List, Optional, Sequence

DEFAULT_PAGE_SIZE = 12

# Core catalog metadata. In a real deployment this would come from a database
# or external service. For the UI build-out we keep a curated sample locally so
# the search and player flows have deterministic data to work with.
_FLASH_GAMES: List[Dict[str, object]] = [
    {
        "id": "bloons-tower-defense",
        "title": "Bloons Tower Defense",
        "description": (
            "Pop your way through increasingly challenging waves of balloons in this"
            " tower-defense classic. Build dart towers, spike factories, and tackle"
            " special modes designed for the Flash original."
        ),
        "tags": ["strategy", "tower-defense", "classic"],
        "source": "Ninja Kiwi",
        "thumbnail": "/static/img/flash-placeholder.svg",
        "stream_path": "placeholder.swf",
        "width": 800,
        "height": 600,
        "actionscripts": [1, 2],
    },
    {
        "id": "portal-flash-edition",
        "title": "Portal: The Flash Edition",
        "description": (
            "Solve physics-driven test chambers using the iconic portal gun."
            " Every chamber has multiple solutions, rewarding experimentation"
            " and speed-running mastery."
        ),
        "tags": ["puzzle", "physics", "platformer"],
        "source": "Armor Games",
        "thumbnail": "/static/img/flash-placeholder.svg",
        "stream_path": "placeholder.swf",
        "width": 700,
        "height": 525,
        "actionscripts": [2],
    },
    {
        "id": "fancy-pants-adventure",
        "title": "Fancy Pants Adventure",
        "description": (
            "Sprint, flip, and slide through hand-drawn worlds in Fancy Pants."
            " Flowing movement and kinetic combat make this Flash platformer"
            " a timeless favourite."
        ),
        "tags": ["platformer", "action", "speedrun"],
        "source": "Newgrounds",
        "thumbnail": "/static/img/flash-placeholder.svg",
        "stream_path": "placeholder.swf",
        "width": 640,
        "height": 480,
        "actionscripts": [1, 2],
    },
    {
        "id": "line-rider-classic",
        "title": "Line Rider Classic",
        "description": (
            "Draw gravity-defying tracks and watch the rider sled through your"
            " creations. Share your courses and iterate to perfect each run."
        ),
        "tags": ["sandbox", "physics", "creative"],
        "source": "DeviantArt",
        "thumbnail": "/static/img/flash-placeholder.svg",
        "stream_path": "placeholder.swf",
        "width": 720,
        "height": 540,
        "actionscripts": [2],
    },
    {
        "id": "age-of-war",
        "title": "Age of War",
        "description": (
            "Command your civilisation across eras, defending your base while"
            " evolving troops and technology. Swap strategies mid-battle to"
            " counter the enemy progression."
        ),
        "tags": ["strategy", "defense", "evolution"],
        "source": "Max Games",
        "thumbnail": "/static/img/flash-placeholder.svg",
        "stream_path": "placeholder.swf",
        "width": 720,
        "height": 480,
        "actionscripts": [2],
    },
    {
        "id": "super-mario-63",
        "title": "Super Mario 63",
        "description": (
            "A lovingly-crafted fan adventure that blends Mario 64 exploration"
            " with Sunshine-inspired FLUDD mechanics and classic platforming."
        ),
        "tags": ["platformer", "fan-game", "adventure"],
        "source": "Runouw",
        "thumbnail": "/static/img/flash-placeholder.svg",
        "stream_path": "placeholder.swf",
        "width": 768,
        "height": 576,
        "actionscripts": [2],
    },
]


def _short_description(description: str, limit: int = 150) -> str:
    if len(description) <= limit:
        return description
    return f"{description[: limit - 1].rstrip()}…"


def _aspect_ratio(width: int, height: int) -> float:
    if width <= 0 or height <= 0:
        return 1.0
    return round(width / float(height), 3)


def _normalise(value: str) -> str:
    return value.strip().lower()


def _unique(items: Iterable[str]) -> List[str]:
    return sorted({item for item in items})


_ALL_TAGS: List[str] = _unique(tag for game in _FLASH_GAMES for tag in game["tags"])
_ALL_SOURCES: List[str] = _unique(game["source"] for game in _FLASH_GAMES)


def serialize_game(game: Dict[str, object]) -> Dict[str, object]:
    width = int(game.get("width", 0) or 0)
    height = int(game.get("height", 0) or 0)
    description = str(game.get("description", ""))
    serialized = {
        "id": game["id"],
        "title": game["title"],
        "description": description,
        "short_description": _short_description(description),
        "tags": list(game.get("tags", [])),
        "source": game.get("source", ""),
        "thumbnail": game.get("thumbnail", ""),
        "stream_path": game.get("stream_path", ""),
        "width": width,
        "height": height,
        "aspect_ratio": _aspect_ratio(width, height),
        "actionscripts": list(game.get("actionscripts", [])),
    }
    return serialized


def list_tags() -> List[str]:
    """Return all available tags sorted alphabetically."""
    return list(_ALL_TAGS)


def list_sources() -> List[str]:
    """Return all available sources sorted alphabetically."""
    return list(_ALL_SOURCES)


def get_game(game_id: str) -> Optional[Dict[str, object]]:
    needle = _normalise(game_id)
    for game in _FLASH_GAMES:
        if _normalise(str(game["id"])) == needle:
            return serialize_game(game)
    return None


def _filter_by_query(games: Sequence[Dict[str, object]], query: str) -> List[Dict[str, object]]:
    if not query:
        return list(games)
    needle = _normalise(query)
    result = []
    for game in games:
        title = _normalise(str(game["title"]))
        description = _normalise(str(game.get("description", "")))
        if needle in title or needle in description:
            result.append(game)
    return result


def _filter_by_tags(games: Sequence[Dict[str, object]], tags: Sequence[str]) -> List[Dict[str, object]]:
    if not tags:
        return list(games)
    wanted = {_normalise(tag) for tag in tags if tag}
    if not wanted:
        return list(games)
    filtered = []
    for game in games:
        game_tags = {_normalise(tag) for tag in game.get("tags", [])}
        if wanted.issubset(game_tags):
            filtered.append(game)
    return filtered


def _filter_by_source(games: Sequence[Dict[str, object]], source: Optional[str]) -> List[Dict[str, object]]:
    if not source:
        return list(games)
    needle = _normalise(source)
    return [game for game in games if _normalise(str(game.get("source", ""))) == needle]


def search_games(
    *,
    query: str = "",
    tags: Optional[Sequence[str]] = None,
    source: Optional[str] = None,
    page: int = 1,
    page_size: int = DEFAULT_PAGE_SIZE,
) -> Dict[str, object]:
    """Search the flash catalog applying optional filters and pagination."""

    tags = tags or []
    working: List[Dict[str, object]] = list(_FLASH_GAMES)
    working = _filter_by_query(working, query)
    working = _filter_by_tags(working, tags)
    working = _filter_by_source(working, source)

    total = len(working)
    safe_page_size = max(1, min(int(page_size or DEFAULT_PAGE_SIZE), 48))
    total_pages = max(1, math.ceil(total / float(safe_page_size))) if total else 1

    safe_page = max(1, int(page or 1))
    if safe_page > total_pages:
        safe_page = total_pages

    start = (safe_page - 1) * safe_page_size
    end = start + safe_page_size
    page_items = working[start:end]

    serialized_results = [serialize_game(game) for game in page_items]

    return {
        "results": serialized_results,
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
]
