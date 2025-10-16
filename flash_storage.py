"""Helpers for persisting crawled Flash binaries and assets."""

from __future__ import annotations

import hashlib
import mimetypes
import os
from dataclasses import dataclass
from typing import Callable, Tuple
from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

import boto3
from botocore.exceptions import BotoCoreError, ClientError


@dataclass
class StoredAsset:
    checksum: str
    storage_path: str
    mime_type: str
    size: int


def _default_fetcher(url: str) -> Tuple[bytes, str | None]:
    request = Request(url, headers={"User-Agent": "FlashCrawler/1.0"})
    try:
        with urlopen(request) as response:  # type: ignore[call-arg]
            data = response.read()
            content_type = response.info().get_content_type()
            return data, content_type
    except URLError as exc:  # pragma: no cover - network failure path
        raise RuntimeError(f"failed to download asset from {url!r}: {exc}") from exc


class FlashAssetStorage:
    """Persist Flash binaries and thumbnails into S3-compatible storage."""

    def __init__(
        self,
        bucket: str | None = None,
        prefix: str | None = None,
        client=None,
        fetcher: Callable[[str], Tuple[bytes, str | None]] | None = None,
        region_name: str | None = None,
    ) -> None:
        self.bucket = bucket or os.environ.get("FLASH_STORAGE_BUCKET")
        if not self.bucket:
            raise ValueError("FLASH_STORAGE_BUCKET is not configured")

        prefix = prefix or os.environ.get("FLASH_STORAGE_PREFIX", "")
        self.prefix = prefix.strip("/")
        if self.prefix:
            self.prefix += "/"

        if client is None:
            region = region_name or os.environ.get("FLASH_STORAGE_REGION") or "us-east-1"
            client = boto3.client("s3", region_name=region)
        self.client = client
        self.fetcher = fetcher or _default_fetcher

    def persist_binary(self, url: str) -> StoredAsset:
        return self._persist(url, kind="binaries")

    def persist_thumbnail(self, url: str) -> StoredAsset:
        return self._persist(url, kind="thumbnails")

    def _persist(self, url: str, *, kind: str) -> StoredAsset:
        data, content_type = self.fetcher(url)
        checksum = hashlib.sha256(data).hexdigest()
        mime_type = self._resolve_mime(url, content_type)
        key = self._build_key(kind, checksum, mime_type, url)
        storage_path = f"{self.prefix}{key}" if self.prefix else key

        try:
            self.client.put_object(
                Bucket=self.bucket,
                Key=storage_path,
                Body=data,
                ContentType=mime_type,
            )
        except (ClientError, BotoCoreError) as exc:  # pragma: no cover - network failure
            raise RuntimeError(f"failed to persist asset {url!r}: {exc}") from exc

        return StoredAsset(
            checksum=checksum,
            storage_path=storage_path,
            mime_type=mime_type,
            size=len(data),
        )

    def _build_key(self, kind: str, checksum: str, mime_type: str, url: str) -> str:
        extension = self._extension_from_mime(mime_type)
        if not extension:
            extension = os.path.splitext(urlparse(url).path)[1]
        if not extension:
            extension = ""
        shard = checksum[:2]
        filename = f"{checksum}{extension}"
        return f"{kind}/{shard}/{filename}"

    @staticmethod
    def _extension_from_mime(mime_type: str) -> str:
        overrides = {
            "application/x-shockwave-flash": ".swf",
            "image/jpeg": ".jpg",
            "image/jpg": ".jpg",
            "image/png": ".png",
        }
        if mime_type in overrides:
            return overrides[mime_type]
        guessed = mimetypes.guess_extension(mime_type or "")
        return guessed or ""

    @staticmethod
    def _resolve_mime(url: str, declared: str | None) -> str:
        if declared:
            return declared
        guess = mimetypes.guess_type(url)[0]
        if guess:
            return guess
        return "application/octet-stream"
