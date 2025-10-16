"""Metadata normalization helpers for crawled content."""

from __future__ import annotations

from typing import Any, Dict, Iterable, List, Mapping, MutableMapping

import awgutils


def _normalize_tags(tags: Iterable[str]) -> List[str]:
    cleaned = {tag.strip().lower() for tag in tags if tag}
    return sorted(cleaned)


def normalize_metadata(raw: Mapping[str, Any]) -> MutableMapping[str, Any]:
    """Normalize raw metadata emitted by crawlers."""

    data: MutableMapping[str, Any] = dict(raw)

    title = (data.get("title") or "").strip()
    data["title"] = title

    url = data.get("url")
    if isinstance(url, str):
        data["url"] = url.strip()

    description = data.get("description")
    if isinstance(description, str):
        data["description"] = " ".join(description.split())

    if "tags" in data and isinstance(data["tags"], Iterable) and not isinstance(data["tags"], (str, bytes)):
        data["tags"] = _normalize_tags(data["tags"])  # type: ignore[arg-type]
    else:
        data["tags"] = []

    for key in ("width", "height", "imgwidth", "imgheight"):
        value = data.get(key)
        if value is None:
            continue
        try:
            data[key] = int(value)
        except (TypeError, ValueError):
            data.pop(key, None)

    if title:
        data.setdefault("urltitle", awgutils.urlEncode(title))
    else:
        data.setdefault("urltitle", None)

    etag = data.get("etag")
    if isinstance(etag, str):
        data["etag"] = etag.strip()

    last_modified = data.get("last_modified")
    if isinstance(last_modified, str):
        data["last_modified"] = last_modified.strip()

    return data


__all__ = ["normalize_metadata"]
