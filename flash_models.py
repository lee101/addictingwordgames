"""NDB entities for crawled Flash content."""

from __future__ import annotations

import os
from typing import Callable

os.environ.setdefault("PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION", "python")

from google.auth.credentials import AnonymousCredentials
from google.auth.exceptions import DefaultCredentialsError
from google.cloud import ndb


def _create_ndb_client() -> ndb.Client:
    try:
        return ndb.Client()
    except DefaultCredentialsError:
        os.environ.setdefault("GOOGLE_CLOUD_PROJECT", "flash-content-dev")
        os.environ.setdefault("DATASTORE_EMULATOR_HOST", "localhost:8081")
        return ndb.Client(
            project=os.environ["GOOGLE_CLOUD_PROJECT"],
            credentials=AnonymousCredentials(),
        )


client = _create_ndb_client()


class FlashGame(ndb.Model):
    """Metadata for a crawled Flash experience."""

    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

    title = ndb.StringProperty(required=True)
    description = ndb.TextProperty()
    tags = ndb.StringProperty(repeated=True)

    source_url = ndb.StringProperty()
    thumbnail_url = ndb.StringProperty()

    action_script_version = ndb.StringProperty()

    storage_path = ndb.StringProperty()
    binary_mime_type = ndb.StringProperty()
    binary_size = ndb.IntegerProperty()

    thumbnail_storage_path = ndb.StringProperty()
    thumbnail_checksum = ndb.StringProperty()
    thumbnail_mime_type = ndb.StringProperty()

    file_checksum = ndb.StringProperty(required=True)

    width = ndb.IntegerProperty()
    height = ndb.IntegerProperty()

    crawl_status = ndb.StringProperty(
        choices=("pending", "success", "failed"), default="pending"
    )
    crawled_at = ndb.DateTimeProperty()
    crawler_version = ndb.StringProperty()
    crawler_name = ndb.StringProperty()
    crawl_notes = ndb.TextProperty()
    crawl_source_id = ndb.StringProperty()
    raw_crawl_payload = ndb.JsonProperty()

    def validate(
        self, fetch_existing: Callable[[], "FlashGame | None"] | None = None
    ) -> None:
        if not self.title:
            raise ValueError("FlashGame.title is required")
        if not self.file_checksum:
            raise ValueError("FlashGame.file_checksum is required")

        if self.width is not None and self.width <= 0:
            raise ValueError("FlashGame.width must be greater than zero")
        if self.height is not None and self.height <= 0:
            raise ValueError("FlashGame.height must be greater than zero")

        self._normalise_tags()
        ensure_unique_checksum(self, fetch_existing=fetch_existing)

    def _normalise_tags(self) -> None:
        if not self.tags:
            self.tags = []
            return

        normalised: list[str] = []
        seen: set[str] = set()
        for tag in self.tags:
            if not tag:
                continue
            slug = tag.strip().lower()
            if not slug or slug in seen:
                continue
            seen.add(slug)
            normalised.append(slug)
        self.tags = normalised

    def _pre_put_hook(self) -> None:  # pragma: no cover - exercised via tests
        self.validate()

    @classmethod
    def by_checksum(cls, checksum: str) -> "FlashGame | None":
        with client.context():
            return cls.query(cls.file_checksum == checksum).get()

    @classmethod
    def for_tag(cls, tag: str, limit: int = 50) -> list["FlashGame"]:
        with client.context():
            return (
                cls.query(cls.tags == tag.strip().lower())
                .order(-cls.crawled_at, -cls.created)
                .fetch(limit)
            )


def ensure_unique_checksum(
    instance: FlashGame,
    fetch_existing: Callable[[], FlashGame | None] | None = None,
) -> None:
    if fetch_existing is None:

        def fetch_existing() -> FlashGame | None:  # type: ignore[assignment]
            with client.context():
                return FlashGame.query(
                    FlashGame.file_checksum == instance.file_checksum
                ).get()

    existing = fetch_existing()
    if existing is instance:
        return
    if existing and (instance.key is None or existing.key != instance.key):
        raise ValueError(
            f"Flash game with checksum {instance.file_checksum} already exists"
        )


def get_client() -> ndb.Client:
    return client
