from __future__ import annotations

import json
import logging
from collections import OrderedDict
from dataclasses import dataclass, field, fields
from typing import Any, Callable, Dict, Iterable, List, Optional, Tuple, Union
from urllib import request
from urllib.parse import urljoin
from xml.etree import ElementTree as ET

try:  # pragma: no cover - optional dependency inside App Engine
    from google.appengine.api import urlfetch  # type: ignore
except Exception:  # pragma: no cover - urlfetch not available locally
    urlfetch = None  # type: ignore

FetchResult = Union[str, bytes]
Fetcher = Callable[[str], FetchResult]


def _has_value(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return value.strip() != ""
    if isinstance(value, (list, tuple, set, frozenset)):
        return len(value) > 0
    if isinstance(value, dict):
        return len(value) > 0
    return True


def rewrite_cdn_url(url: Optional[str], rewrites: Optional[Dict[str, str]] = None) -> Optional[str]:
    if not url:
        return url
    rewrites = rewrites or {}
    for prefix, replacement in rewrites.items():
        if url.startswith(prefix):
            return replacement + url[len(prefix):]
    if url.startswith("//"):
        return "https:" + url
    return url


def _token_key(token: Any) -> Optional[str]:
    if token is None:
        return None
    if isinstance(token, (str, int)):
        return str(token)
    try:
        return json.dumps(token, sort_keys=True)
    except TypeError:
        return str(token)


def _class_list(element: ET.Element) -> List[str]:
    return element.attrib.get("class", "").split()


def _collect_text(element: ET.Element) -> str:
    parts: List[str] = []

    def _walk(node: ET.Element) -> None:
        if node.text and node.text.strip():
            parts.append(node.text.strip())
        for child in list(node):
            _walk(child)
            if child.tail and child.tail.strip():
                parts.append(child.tail.strip())

    _walk(element)
    return " ".join(parts)


def _parse_html(html: str) -> ET.Element:
    return ET.fromstring(html.strip())


@dataclass(frozen=True)
class FlashGame:
    source: str
    source_id: str
    title: str
    description: str
    swf_url: str
    page_url: str
    thumbnail_url: Optional[str] = None
    instructions: Optional[str] = None
    tags: Tuple[str, ...] = ()
    width: Optional[int] = None
    height: Optional[int] = None
    author: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    def merge(self, other: "FlashGame") -> "FlashGame":
        if self.source != other.source or self.source_id != other.source_id:
            raise ValueError("Cannot merge FlashGame objects from different sources")

        payload: Dict[str, Any] = {}
        for f in fields(self):
            name = f.name
            left = getattr(self, name)
            right = getattr(other, name)
            if name in {"source", "source_id"}:
                payload[name] = left
            elif name == "metadata":
                merged = dict(left)
                merged.update(right)
                payload[name] = merged
            else:
                payload[name] = right if _has_value(right) else left
        return FlashGame(**payload)


class FlashGameStore:
    def __init__(self):
        self._games: "OrderedDict[Tuple[str, str], FlashGame]" = OrderedDict()

    def upsert(self, game: FlashGame) -> Tuple[FlashGame, bool]:
        key = (game.source, game.source_id)
        existing = self._games.get(key)
        if existing:
            merged = existing.merge(game)
            self._games[key] = merged
            return merged, False
        self._games[key] = game
        return game, True

    def all(self) -> List[FlashGame]:
        return list(self._games.values())

    def __len__(self) -> int:
        return len(self._games)


@dataclass
class ListingEntry:
    slug: str
    title: str
    detail_url: str
    thumbnail_url: Optional[str] = None
    tags: Tuple[str, ...] = ()
    payload: Dict[str, Any] = field(default_factory=dict)
    listing_url: Optional[str] = None


class BaseCrawler:
    source = "base"
    listing_url: Optional[str] = None
    site_base_url: Optional[str] = None
    cdn_rewrites: Dict[str, str] = {}

    def __init__(self, fetcher: Optional[Fetcher] = None, store: Optional[FlashGameStore] = None):
        self._fetcher: Fetcher = fetcher or self._default_fetcher
        self.store = store or FlashGameStore()
        self.logger = logging.getLogger(self.__class__.__name__)

    # Default fetcher that works both locally and in production App Engine
    def _default_fetcher(self, url: str, **_: Any) -> FetchResult:  # pragma: no cover - network disabled in tests
        if urlfetch is not None:
            result = urlfetch.fetch(url)
            return result.content
        with request.urlopen(url) as response:  # type: ignore[arg-type]
            return response.read()

    def fetch(self, url: str, **kwargs: Any) -> str:
        data = self._fetcher(url, **kwargs)
        if isinstance(data, bytes):
            return data.decode("utf-8")
        return data

    def fetch_json(self, url: str, **kwargs: Any) -> Dict[str, Any]:
        text = self.fetch(url, **kwargs)
        return json.loads(text)

    def parse_html(self, html: str) -> ET.Element:
        return _parse_html(html)

    def iter_elements(self, root: ET.Element, tag: Optional[str] = None, class_name: Optional[str] = None) -> Iterable[ET.Element]:
        path = ".//*" if tag is None else f".//{tag}"
        for element in root.findall(path):
            if class_name and class_name not in _class_list(element):
                continue
            yield element

    def find_first(
        self,
        root: ET.Element,
        tag: Optional[str] = None,
        class_name: Optional[str] = None,
        *,
        attr: Optional[str] = None,
        value: Optional[str] = None,
    ) -> Optional[ET.Element]:
        for element in self.iter_elements(root, tag, class_name):
            if attr and element.attrib.get(attr) != value:
                continue
            return element
        return None

    def find_by_id(self, root: ET.Element, element_id: str) -> Optional[ET.Element]:
        for element in root.findall(".//*"):
            if element.attrib.get("id") == element_id:
                return element
        return None

    def text_content(self, element: Optional[ET.Element]) -> str:
        if element is None:
            return ""
        return _collect_text(element)

    def meta_content(self, root: ET.Element, *, name: Optional[str] = None, property: Optional[str] = None) -> Optional[str]:
        for meta in root.findall(".//meta"):
            if name and meta.attrib.get("name") == name:
                return meta.attrib.get("content", "").strip()
            if property and meta.attrib.get("property") == property:
                return meta.attrib.get("content", "").strip()
        return None

    def rewrite_cdn_url(self, url: Optional[str]) -> Optional[str]:
        return rewrite_cdn_url(url, self.cdn_rewrites)

    def get_listing_request(self, token: Any = None) -> Tuple[str, Dict[str, Any]]:
        if not self.listing_url:
            raise ValueError("listing_url must be defined for crawlers that use get_listing_request")
        if token and isinstance(token, dict) and "href" in token:
            href = token["href"]
            target = urljoin(self.site_base_url or self.listing_url, href)
            return target, {}
        if token and isinstance(token, dict) and "page" in token:
            sep = "&" if "?" in self.listing_url else "?"
            return f"{self.listing_url}{sep}page={token['page']}", {}
        return self.listing_url, {}

    def parse_listing(self, page_text: str, page_url: str, token: Any) -> Tuple[List[ListingEntry], Any]:
        raise NotImplementedError

    def build_game(self, entry: ListingEntry, detail_text: str) -> FlashGame:
        raise NotImplementedError

    def resolve_detail_url(self, entry: ListingEntry) -> str:
        base = self.site_base_url or entry.listing_url or self.listing_url or ""
        return urljoin(base, entry.detail_url)

    def walk_listing(self, initial_token: Any = None) -> Iterable[ListingEntry]:
        token = initial_token
        seen_tokens = set()
        while True:
            url, kwargs = self.get_listing_request(token)
            page_text = self.fetch(url, **kwargs)
            entries, next_token = self.parse_listing(page_text, url, token)
            for entry in entries:
                entry.listing_url = url
                yield entry
            token_key = _token_key(next_token)
            if next_token is None or token_key in seen_tokens:
                break
            if token_key is not None:
                seen_tokens.add(token_key)
            token = next_token

    def iter_games(self) -> Iterable[FlashGame]:
        for entry in self.walk_listing():
            detail_url = self.resolve_detail_url(entry)
            detail_text = self.fetch(detail_url)
            yield self.build_game(entry, detail_text)

    def crawl(self) -> List[FlashGame]:
        results: List[FlashGame] = []
        for game in self.iter_games():
            stored, _ = self.store.upsert(game)
            results.append(stored)
        return results


__all__ = [
    "BaseCrawler",
    "FlashGame",
    "FlashGameStore",
    "ListingEntry",
    "rewrite_cdn_url",
]
