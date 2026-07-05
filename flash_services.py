"""Services for Flash game discovery and secure streaming APIs."""
from __future__ import annotations

import base64
import binascii
import hashlib
import hmac
import os
import re
import threading
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List, Optional, Sequence, Tuple

from models import FlashGame, client as ndb_client


def _env_int(name: str, default: int) -> int:
    value = os.environ.get(name)
    if value is None:
        return default
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


class FlashApiError(Exception):
    """Base error for Flash API services."""


class InvalidSearchRequest(FlashApiError):
    """Raised when a search request has invalid parameters."""


class InvalidPageTokenError(FlashApiError):
    """Raised when the supplied page token cannot be decoded."""


class FlashGameNotFoundError(FlashApiError):
    """Raised when a Flash game cannot be found."""


@dataclass
class FlashGameEntity:
    """Value object representing a Flash game record."""

    game_id: str
    title: str
    description: str = ""
    developer: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    actionscript_version: int = 3
    storage_path: str = ""
    thumbnail_url: Optional[str] = None
    file_size: Optional[int] = None
    play_count: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @classmethod
    def from_model(cls, model: FlashGame) -> "FlashGameEntity":
        return cls(
            game_id=str(model.key.id()),
            title=model.title,
            description=model.description or "",
            developer=model.developer,
            tags=list(model.tags or []),
            actionscript_version=model.actionscript_version or 0,
            storage_path=model.storage_path,
            thumbnail_url=model.thumbnail_url,
            file_size=model.file_size,
            play_count=model.play_count or 0,
            is_active=model.is_active,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def to_metadata_dict(self) -> dict:
        return {
            "id": self.game_id,
            "title": self.title,
            "description": self.description,
            "developer": self.developer,
            "tags": list(self.tags),
            "actionscript_version": self.actionscript_version,
            "thumbnail_url": self.thumbnail_url,
            "file_size": self.file_size,
            "play_count": self.play_count,
            "created_at": _to_isoformat(self.created_at),
            "updated_at": _to_isoformat(self.updated_at),
        }

    def to_search_result(self, relevance: int) -> dict:
        return {
            "id": self.game_id,
            "title": self.title,
            "description": self.description,
            "developer": self.developer,
            "tags": list(self.tags),
            "thumbnail_url": self.thumbnail_url,
            "actionscript_version": self.actionscript_version,
            "relevance": relevance,
        }


def _to_isoformat(value: Optional[datetime]) -> Optional[str]:
    if value is None:
        return None
    if value.tzinfo is not None and value.utcoffset() is not None:
        return value.astimezone(timezone.utc).isoformat()
    return value.isoformat()


class FlashGameRepository:
    """Repository abstraction for FlashGame datastore entities."""

    def __init__(self, client=ndb_client):
        self._client = client

    def list_active_games(self) -> List[FlashGameEntity]:
        with self._client.context():
            models = FlashGame.query(FlashGame.is_active == True).fetch()  # noqa: E712
        return [FlashGameEntity.from_model(model) for model in models]

    def get(self, game_id: str) -> Optional[FlashGameEntity]:
        with self._client.context():
            model = FlashGame.get_by_id(game_id)
        if not model:
            return None
        return FlashGameEntity.from_model(model)


class FlashSearchService:
    """Provides in-memory relevance scoring for Flash game search."""

    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 50

    def __init__(self, repository: FlashGameRepository):
        self._repository = repository

    def search(
        self,
        query: str,
        page_size: Optional[int] = None,
        page_token: Optional[str] = None,
        tags: Optional[Sequence[str]] = None,
    ) -> dict:
        tokens = self._tokenize(query)
        if not tokens:
            raise InvalidSearchRequest("Search term must contain alphanumeric characters.")

        size = self._coerce_page_size(page_size)
        offset = self._decode_page_token(page_token) if page_token else 0
        if offset < 0:
            raise InvalidPageTokenError("Page token resolved to a negative offset.")

        tag_filter = self._normalise_tags(tags)
        candidates = []
        for game in self._repository.list_active_games():
            if tag_filter and not self._has_all_tags(game, tag_filter):
                continue
            score = self._score_game(game, tokens)
            if score <= 0:
                continue
            candidates.append((score, game))

        candidates.sort(key=lambda item: (-item[0], -(item[1].play_count or 0), item[1].title.lower()))
        total = len(candidates)

        page_slice = candidates[offset: offset + size]
        results = [game.to_search_result(score) for score, game in page_slice]

        next_page_token = None
        if offset + size < total:
            next_page_token = self._encode_page_token(offset + size)

        return {
            "query": query,
            "total_results": total,
            "results": results,
            "next_page_token": next_page_token,
        }

    def _tokenize(self, query: str) -> List[str]:
        return [token for token in re.split(r"\W+", (query or "").lower()) if token]

    def _coerce_page_size(self, size: Optional[int]) -> int:
        if size is None:
            return self.DEFAULT_PAGE_SIZE
        if not isinstance(size, int):
            raise InvalidSearchRequest(
                f"page_size must be an integer between 1 and {self.MAX_PAGE_SIZE}."
            )
        if size < 1 or size > self.MAX_PAGE_SIZE:
            raise InvalidSearchRequest(
                f"page_size must be between 1 and {self.MAX_PAGE_SIZE}."
            )
        return size

    def _decode_page_token(self, token: str) -> int:
        if not token:
            return 0
        try:
            padded = token + "=" * (-len(token) % 4)
            decoded = base64.urlsafe_b64decode(padded.encode("utf-8"))
            return int(decoded.decode("utf-8"))
        except (ValueError, TypeError, binascii.Error):
            raise InvalidPageTokenError("Invalid page token supplied.")

    def _encode_page_token(self, value: int) -> str:
        encoded = base64.urlsafe_b64encode(str(value).encode("utf-8")).decode("utf-8")
        return encoded.rstrip("=")

    def _score_game(self, game: FlashGameEntity, tokens: Sequence[str]) -> int:
        title = game.title.lower()
        description = (game.description or "").lower()
        tags = [tag.lower() for tag in game.tags or []]

        score = 0
        for token in tokens:
            if token in title:
                score += 10
            if token in description:
                score += 3
            if any(token in tag for tag in tags):
                score += 5
        score += min(game.play_count // 10, 20)
        return score

    def _has_all_tags(self, game: FlashGameEntity, tag_filter: Sequence[str]) -> bool:
        game_tags = {tag.lower() for tag in game.tags or []}
        return all(tag in game_tags for tag in tag_filter)

    def _normalise_tags(self, tags: Optional[Sequence[str]]) -> List[str]:
        if not tags:
            return []
        normalised = []
        for tag in tags:
            if tag:
                normalised.append(tag.strip().lower())
        return normalised


class FlashStreamService:
    """Generates signed streaming URLs for Flash games."""

    CONTENT_TYPE = "application/x-shockwave-flash"
    DEFAULT_EXPIRY_SECONDS = 300

    def __init__(
        self,
        repository: FlashGameRepository,
        signing_secret: Optional[str] = None,
        expiry_seconds: Optional[int] = None,
    ) -> None:
        self._repository = repository
        self._signing_secret = (
            signing_secret
            or os.environ.get("FLASH_STREAM_SIGNING_SECRET")
            or "development-signing-secret"
        )
        ttl = expiry_seconds
        if ttl is None:
            ttl = _env_int("FLASH_STREAM_URL_TTL", self.DEFAULT_EXPIRY_SECONDS)
        self._expiry_seconds = max(1, int(ttl))

    def get_stream_payload(self, game_id: str) -> dict:
        game = self._repository.get(game_id)
        if not game or not game.is_active:
            raise FlashGameNotFoundError(f"No Flash game found for id '{game_id}'.")

        expires_at = int(time.time()) + self._expiry_seconds
        signature = self._sign(game.storage_path, expires_at)
        stream_url = self._build_stream_url(game.storage_path, expires_at, signature)

        payload = {
            "id": game.game_id,
            "stream_url": stream_url,
            "expires_at": expires_at,
            "signature": signature,
            "actionscript_version": game.actionscript_version,
            "content_type": self.CONTENT_TYPE,
        }
        if game.file_size is not None:
            payload["file_size"] = game.file_size
        return payload

    def _sign(self, storage_path: str, expires_at: int) -> str:
        message = f"{storage_path}|{expires_at}".encode("utf-8")
        secret = self._signing_secret.encode("utf-8")
        return hmac.new(secret, message, hashlib.sha256).hexdigest()

    def _build_stream_url(self, storage_path: str, expires_at: int, signature: str) -> str:
        separator = "&" if "?" in storage_path else "?"
        return f"{storage_path}{separator}expires={expires_at}&signature={signature}"


class IPRateLimiter:
    """Simple in-memory rate limiter keyed by identifier (typically IP)."""

    def __init__(self, limit: int, window_seconds: int):
        self._limit = max(1, int(limit))
        self._window_seconds = max(1, int(window_seconds))
        self._lock = threading.Lock()
        self._state = {}

    def check(self, key: str) -> Tuple[bool, int]:
        now = time.time()
        with self._lock:
            entry = self._state.get(key)
            if not entry or entry["reset_at"] <= now:
                self._state[key] = {"count": 1, "reset_at": now + self._window_seconds}
                return True, self._window_seconds

            if entry["count"] >= self._limit:
                retry_after = int(entry["reset_at"] - now)
                return False, max(retry_after, 0)

            entry["count"] += 1
            return True, int(entry["reset_at"] - now)

    def reset(self) -> None:
        with self._lock:
            self._state.clear()


flash_repository = FlashGameRepository()
flash_search_service = FlashSearchService(flash_repository)
flash_stream_service = FlashStreamService(flash_repository)
stream_rate_limiter = IPRateLimiter(
    limit=_env_int("FLASH_STREAM_RATE_LIMIT", 5),
    window_seconds=_env_int("FLASH_STREAM_RATE_WINDOW", 60),
)

__all__ = [
    "FlashApiError",
    "FlashGameEntity",
    "FlashGameNotFoundError",
    "FlashGameRepository",
    "FlashSearchService",
    "FlashStreamService",
    "IPRateLimiter",
    "InvalidPageTokenError",
    "InvalidSearchRequest",
    "flash_repository",
    "flash_search_service",
    "flash_stream_service",
    "stream_rate_limiter",
]
