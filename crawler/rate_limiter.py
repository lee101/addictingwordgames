"""Politeness utilities such as rate limiting."""

from __future__ import annotations

import time
from typing import Callable, Dict, Optional
from urllib.parse import urlparse


class RateLimiter:
    """Simple per-host rate limiter using wall clock timestamps."""

    def __init__(
        self,
        min_interval: float = 1.0,
        clock: Optional[Callable[[], float]] = None,
        sleeper: Optional[Callable[[float], None]] = None,
    ) -> None:
        self.min_interval = max(0.0, float(min_interval))
        self._clock = clock or time.monotonic
        self._sleep = sleeper or time.sleep
        self._per_host: Dict[str, float] = {}

    def wait(self, url: str) -> None:
        if self.min_interval <= 0:
            return
        parsed = urlparse(url)
        host = parsed.netloc
        if not host:
            return
        now = self._clock()
        next_allowed = self._per_host.get(host, now)
        if next_allowed > now:
            self._sleep(next_allowed - now)
            now = self._clock()
        self._per_host[host] = max(next_allowed, now) + self.min_interval

    def reset(self) -> None:
        self._per_host.clear()


__all__ = ["RateLimiter"]
