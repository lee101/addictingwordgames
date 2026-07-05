from __future__ import annotations

import json
from typing import Any, Dict, List, Optional, Tuple
from xml.etree import ElementTree as ET

from .base import BaseCrawler, FlashGame, ListingEntry


ATOM_NS = {"atom": "http://www.w3.org/2005/Atom"}


class ItchIoCrawler(BaseCrawler):
    source = "itch-io"
    listing_url = "https://itch.io/games/tag-flash?format=rss"
    site_base_url = "https://itch.io"
    cdn_rewrites = {
        "https://uploads.itch.io/": "https://static.itch.io/",
        "//uploads.itch.io/": "https://static.itch.io/",
    }

    def parse_listing(self, page_text: str, page_url: str, token: Any) -> Tuple[List[ListingEntry], Any]:
        feed = ET.fromstring(page_text)
        entries: List[ListingEntry] = []
        for entry_el in feed.findall("atom:entry", ATOM_NS):
            link_el = entry_el.find("atom:link", ATOM_NS)
            href = link_el.get("href") if link_el is not None else ""
            title = (entry_el.findtext("atom:title", default="", namespaces=ATOM_NS) or "").strip()
            slug = href.rstrip("/").split("/")[-1] if href else title.lower().replace(" ", "-")
            summary = (entry_el.findtext("atom:summary", default="", namespaces=ATOM_NS) or "").strip()
            entries.append(
                ListingEntry(
                    slug=slug,
                    title=title,
                    detail_url=href,
                    payload={"summary": summary},
                )
            )
        next_link = feed.find("atom:link[@rel='next']", ATOM_NS)
        next_token: Any = None
        if next_link is not None and next_link.get("href"):
            next_token = {"href": next_link.get("href")}
        return entries, next_token

    def _extract_author(self, root: ET.Element) -> Optional[str]:
        for script in root.findall(".//script"):
            if script.attrib.get("type") != "application/ld+json":
                continue
            script_text = script.text or ""
            try:
                data = json.loads(script_text)
            except json.JSONDecodeError:
                continue
            candidates: List[Any]
            if isinstance(data, dict):
                candidates = [data]
            elif isinstance(data, list):
                candidates = list(data)
            else:
                continue
            for item in candidates:
                if not isinstance(item, dict):
                    continue
                if item.get("@type") in {"VideoGame", "Game"}:
                    author = item.get("author")
                    if isinstance(author, dict):
                        return author.get("name") or author.get("@id")
                    if isinstance(author, list) and author:
                        first = author[0]
                        if isinstance(first, dict):
                            return first.get("name") or first.get("@id")
                        if isinstance(first, str):
                            return first
                    if isinstance(author, str):
                        return author
        return None

    def _extract_swf(self, root: ET.Element) -> Tuple[str, Optional[int], Optional[int]]:
        raw_swf = None
        width: Optional[int] = None
        height: Optional[int] = None
        for element in root.findall(".//*"):
            download_url = element.attrib.get("data-download_url")
            game_swf = element.attrib.get("data-game-swf")
            if download_url and not raw_swf:
                raw_swf = download_url
                width = element.attrib.get("data-width")
                height = element.attrib.get("data-height")
            if game_swf and not raw_swf:
                raw_swf = game_swf
                width = width or element.attrib.get("data-width")
                height = height or element.attrib.get("data-height")
            if raw_swf:
                break
        if raw_swf:
            raw_swf = raw_swf.split("?")[0]
        try:
            width = int(width) if width is not None else None
        except (TypeError, ValueError):
            width = None
        try:
            height = int(height) if height is not None else None
        except (TypeError, ValueError):
            height = None
        return raw_swf or "", width, height

    def build_game(self, entry: ListingEntry, detail_text: str) -> FlashGame:
        root = self.parse_html(detail_text)
        description = ""
        desc_section = self.find_first(root, None, "formatted_description")
        if desc_section is None:
            desc_section = self.find_first(root, None, "game_description")
        if desc_section is not None:
            description = self.text_content(desc_section)
        if not description:
            description = entry.payload.get("summary") or ""

        instructions = None
        instructions_section = self.find_by_id(root, "instructions")
        if instructions_section is None:
            instructions_section = self.find_first(root, None, "game_instructions")
        if instructions_section is not None:
            instructions = self.text_content(instructions_section)

        raw_swf, width, height = self._extract_swf(root)
        swf_url = self.rewrite_cdn_url(raw_swf) if raw_swf else ""

        thumbnail = self.rewrite_cdn_url(self.meta_content(root, property="og:image"))

        tag_values: List[str] = []
        for container_class in ["game_tags", "tags"]:
            container = self.find_first(root, None, container_class)
            if container is not None:
                for link in container.findall(".//a"):
                    text = self.text_content(link)
                    if text:
                        tag_values.append(text)

        author = self._extract_author(root)

        metadata = {
            "summary": entry.payload.get("summary"),
        }

        return FlashGame(
            source=self.source,
            source_id=entry.slug,
            title=entry.title,
            description=description,
            swf_url=swf_url,
            page_url=self.resolve_detail_url(entry),
            thumbnail_url=thumbnail,
            instructions=instructions,
            tags=tuple(tag_values),
            width=width,
            height=height,
            author=author,
            metadata=metadata,
        )


__all__ = ["ItchIoCrawler"]
