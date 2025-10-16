"""HTML parsing helpers."""

from __future__ import annotations

from typing import Any, Iterable, List, Optional, Union

try:  # pragma: no cover - fallback handled below
    from bs4 import BeautifulSoup  # type: ignore
except Exception:  # noqa: F401
    BeautifulSoup = None  # type: ignore

from html.parser import HTMLParser


class _Node:
    __slots__ = ("name", "attrs", "parent", "children", "text_chunks")

    def __init__(self, name: str, attrs: Iterable[tuple[str, str]], parent: Optional["_Node"]) -> None:
        self.name = name
        self.attrs = {key: value for key, value in attrs}
        self.parent = parent
        self.children: List["_Node"] = []
        self.text_chunks: List[str] = []


def _iter_descendants(node: "_Node") -> Iterable["_Node"]:
    for child in node.children:
        yield child
        for grandchild in _iter_descendants(child):
            yield grandchild


class _SimpleTag:
    def __init__(self, node: _Node) -> None:
        self._node = node

    def get(self, key: str, default: Optional[str] = None) -> Optional[str]:
        return self._node.attrs.get(key, default)

    @property
    def text(self) -> str:
        return "".join(self._collect_text(self._node))

    def _collect_text(self, node: _Node) -> Iterable[str]:
        for chunk in node.text_chunks:
            yield chunk
        for child in node.children:
            for sub_chunk in self._collect_text(child):
                yield sub_chunk

    def find_all(self, name: str) -> List["_SimpleTag"]:
        return [_SimpleTag(desc) for desc in _iter_descendants(self._node) if desc.name == name]


class _SimpleSoup(_SimpleTag):
    def __init__(self, markup: str) -> None:
        parser = _CollectingHTMLParser()
        parser.feed(markup)
        super().__init__(parser.root)

    def find_all(self, name: str) -> List[_SimpleTag]:  # type: ignore[override]
        return [_SimpleTag(node) for node in _iter_descendants(self._node) if node.name == name]


class _CollectingHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = _Node("document", [], None)
        self._current = self.root

    def handle_starttag(self, tag: str, attrs) -> None:
        node = _Node(tag, attrs, self._current)
        self._current.children.append(node)
        self._current = node

    def handle_endtag(self, tag: str) -> None:
        node = self._current
        while node is not None and node.name != tag:
            node = node.parent
        if node is not None and node.parent is not None:
            self._current = node.parent

    def handle_data(self, data: str) -> None:
        if data and self._current is not None:
            self._current.text_chunks.append(data)


def parse_html(content: Union[bytes, str], parser: str = "html.parser", **kwargs: Any) -> Any:
    """Return a soup-like object for *content*."""

    if isinstance(content, bytes):
        content = content.decode("utf-8", errors="replace")
    if BeautifulSoup is not None:
        return BeautifulSoup(content, parser, **kwargs)
    return _SimpleSoup(content)


__all__ = ["parse_html"]
