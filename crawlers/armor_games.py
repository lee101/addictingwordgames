from __future__ import annotations

import json
import re
from typing import Any, Dict, List, Optional, Tuple

from .base import BaseCrawler, FlashGame, ListingEntry


class ArmorGamesCrawler(BaseCrawler):
    source = "armor-games"
    listing_url = "https://armorgames.com/tag/flash"
    site_base_url = "https://armorgames.com"
    cdn_rewrites = {
        "https://cache.armorgames.com/": "https://cdn.armorgames.com/",
        "//cache.armorgames.com/": "https://cdn.armorgames.com/",
    }

    def parse_listing(self, page_text: str, page_url: str, token: Any) -> Tuple[List[ListingEntry], Any]:
        root = self.parse_html(page_text)
        entries: List[ListingEntry] = []
        for article in self.iter_elements(root, "article", "game-tile"):
            anchor = self.find_first(article, "a", "game-link")
            if anchor is None:
                continue
            href = anchor.attrib.get("href", "")
            slug = article.attrib.get("data-game-slug") or href.rstrip("/").split("/")[-1]
            title = self.text_content(anchor)
            thumb = self.find_first(article, "img")
            thumb_url = None
            if thumb is not None:
                thumb_url = thumb.attrib.get("data-src") or thumb.attrib.get("src")
            tags = []
            for badge in self.iter_elements(article, None, "badge"):
                text = self.text_content(badge)
                if text:
                    tags.append(text)
            entries.append(
                ListingEntry(
                    slug=slug,
                    title=title,
                    detail_url=href,
                    thumbnail_url=thumb_url,
                    tags=tuple(tags),
                )
            )
        next_token: Any = None
        for link in self.iter_elements(root, "a"):
            rel = link.attrib.get("rel")
            data_page = link.attrib.get("data-page")
            href_value = link.attrib.get("href")
            if rel == "next" or data_page:
                if data_page and data_page.isdigit():
                    next_token = {"page": int(data_page)}
                elif href_value:
                    next_token = {"href": href_value}
                break
        return entries, next_token

    def build_game(self, entry: ListingEntry, detail_text: str) -> FlashGame:
        root = self.parse_html(detail_text)

        description = self.meta_content(root, property="og:description") or self.meta_content(root, name="description") or ""
        if not description:
            desc_block = self.find_first(root, None, "game-description")
            if desc_block is None:
                desc_block = self.find_by_id(root, "game-description")
            if desc_block is not None:
                description = self.text_content(desc_block)

        instructions = None
        instructions_block = self.find_first(root, None, "game-instructions")
        if instructions_block is None:
            instructions_block = self.find_by_id(root, "instructions")
        if instructions_block is not None:
            instructions = self.text_content(instructions_block)

        data: Dict[str, Any] = {}
        for script in root.findall(".//script"):
            script_text = script.text or ""
            if "gameData" not in script_text:
                continue
            match = re.search(r"gameData\s*=\s*({.*?})\s*;", script_text, re.DOTALL)
            if match:
                try:
                    data = json.loads(match.group(1))
                except json.JSONDecodeError:
                    data = {}
            break

        raw_swf = data.get("flashUrl") or data.get("swfUrl")
        swf_url = self.rewrite_cdn_url(raw_swf) if raw_swf else None
        width = data.get("width")
        height = data.get("height")
        try:
            width = int(width) if width is not None else None
        except (ValueError, TypeError):
            width = None
        try:
            height = int(height) if height is not None else None
        except (ValueError, TypeError):
            height = None

        metadata = {k: v for k, v in data.items() if k not in {"flashUrl", "swfUrl", "width", "height"}}
        author = metadata.get("developer") or metadata.get("author")

        thumbnail = self.rewrite_cdn_url(entry.thumbnail_url)
        page_url = self.resolve_detail_url(entry)

        return FlashGame(
            source=self.source,
            source_id=entry.slug,
            title=entry.title,
            description=description,
            swf_url=swf_url or "",
            page_url=page_url,
            thumbnail_url=thumbnail,
            instructions=instructions,
            tags=entry.tags,
            width=width,
            height=height,
            author=author,
            metadata=metadata,
        )


__all__ = ["ArmorGamesCrawler"]
