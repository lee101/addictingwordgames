"""HTTP client helpers used by crawlers."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Mapping, MutableMapping, Optional
from urllib import error, request

DEFAULT_TIMEOUT = 10.0


@dataclass
class FetchResult:
    """Represents the outcome of an HTTP fetch operation."""

    url: str
    status_code: int
    content: bytes
    headers: Mapping[str, str]
    reason: Optional[str] = None

    @property
    def text(self) -> str:
        encoding = "utf-8"
        content_type = self.headers.get("content-type") if self.headers else None
        if content_type and "charset=" in content_type:
            encoding = content_type.split("charset=", 1)[1].split(";", 1)[0].strip()
        try:
            return self.content.decode(encoding, errors="replace")
        except LookupError:
            return self.content.decode("utf-8", errors="replace")


class HTTPError(Exception):
    """Raised when an HTTP operation fails."""

    def __init__(
        self,
        url: str,
        status_code: Optional[int],
        headers: Optional[Mapping[str, str]],
        reason: str,
        body: Optional[bytes] = None,
    ) -> None:
        super().__init__(reason)
        self.url = url
        self.status_code = status_code
        self.headers = headers or {}
        self.body = body or b""
        self.reason = reason

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return (
            f"HTTPError(url={self.url!r}, status_code={self.status_code}, "
            f"reason={self.reason!r})"
        )


def _lower_headers(message: Mapping[str, str]) -> MutableMapping[str, str]:
    return {k.lower(): v for k, v in message.items()}


def fetch_url(
    url: str,
    *,
    headers: Optional[Mapping[str, str]] = None,
    timeout: float = DEFAULT_TIMEOUT,
    etag: Optional[str] = None,
    last_modified: Optional[str] = None,
    opener: Optional[Callable[..., object]] = None,
    method: str = "GET",
) -> FetchResult:
    """Fetch *url* returning a :class:`FetchResult`."""

    req_headers: MutableMapping[str, str] = {}
    if headers:
        req_headers.update(headers)
    if etag and "if-none-match" not in {k.lower() for k in req_headers}:
        req_headers["If-None-Match"] = etag
    if last_modified and "if-modified-since" not in {k.lower() for k in req_headers}:
        req_headers["If-Modified-Since"] = last_modified

    req = request.Request(url, headers=req_headers, method=method)
    opener = opener or request.urlopen

    try:
        response = opener(req, timeout=timeout)
        body = response.read()
        status = getattr(response, "status", None) or response.getcode()
        headers_dict = _lower_headers(dict(response.headers.items()))
        final_url = getattr(response, "geturl", lambda: url)()
        reason = getattr(response, "reason", None)
        return FetchResult(final_url, status, body, headers_dict, reason)
    except error.HTTPError as exc:
        body = exc.read() if hasattr(exc, "read") else b""
        headers_dict = _lower_headers(dict((exc.headers or {}).items())) if exc.headers else {}
        if exc.code == 304:
            return FetchResult(url, exc.code, body, headers_dict, str(exc))
        raise HTTPError(url, exc.code, headers_dict, str(exc), body) from exc
    except error.URLError as exc:
        raise HTTPError(url, None, None, str(exc)) from exc


__all__ = ["FetchResult", "HTTPError", "fetch_url", "DEFAULT_TIMEOUT"]
