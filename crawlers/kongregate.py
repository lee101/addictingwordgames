from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urljoin

from .base import BaseCrawler, FlashGame, ListingEntry


class KongregateCrawler(BaseCrawler):
    source = "kongregate"
    listing_url = "https://www.kongregate.com/flash-games"
    site_base_url = "https://www.kongregate.com"
    cdn_rewrites = {
        "https://chat.kongregate.com/": "https://cdn.kongregate.com/",
        "//chat.kongregate.com/": "https://cdn.kongregate.com/",
    }

    def parse_listing(self, page_text: str, page_url: str, token: Any) -> Tuple[List[ListingEntry], Any]:
        root = self.parse_html(page_text)
        entries: List[ListingEntry] = []
        for card in self.iter_elements(root, "div", "game-card"):
            anchor = self.find_first(card, "a", "game-card__title")
            if anchor is None:
                continue
            href = anchor.attrib.get("href", "")
            slug = card.attrib.get("data-game-id") or href.rstrip("/").split("/")[-1]
            title = self.text_content(anchor)
            thumb = self.find_first(card, "img", "game-card__thumbnail")
            thumb_url = None
            if thumb is not None:
                thumb_url = thumb.attrib.get("data-src") or thumb.attrib.get("src")
            tag_values: List[str] = []
            tags_container = self.find_first(card, "ul", "game-card__tags")
            if tags_container is not None:
                for li in tags_container.findall(".//li"):
                    text = self.text_content(li)
                    if text:
                        tag_values.append(text)
            payload: Dict[str, Any] = {
                "api_url": card.attrib.get("data-api-url"),
                "developer": card.attrib.get("data-developer"),
            }
            entries.append(
                ListingEntry(
                    slug=str(slug),
                    title=title,
                    detail_url=href,
                    thumbnail_url=thumb_url,
                    tags=tuple(tag_values),
                    payload=payload,
                )
            )
        next_token: Any = None
        for link in self.iter_elements(root, "a"):
            rel = link.attrib.get("rel")
            page_value = link.attrib.get("data-page") or (link.text or "").strip()
            href_value = link.attrib.get("href")
            if rel == "next" or link.attrib.get("class") == "next" or link.attrib.get("data-page"):
                if page_value and page_value.isdigit():
                    next_token = {"page": int(page_value)}
                elif href_value:
                    next_token = {"href": href_value}
                break
        return entries, next_token

    def _resolve_api_url(self, api_url: Optional[str], entry: ListingEntry) -> Optional[str]:
        if not api_url:
            detail_path = entry.detail_url.rstrip("/")
            if detail_path:
                api_url = f"{detail_path}.json"
        if not api_url:
            return None
        return urljoin(self.site_base_url or entry.listing_url or "", api_url)

    def build_game(self, entry: ListingEntry, detail_text: str) -> FlashGame:
        root = self.parse_html(detail_text)

        description = self.meta_content(root, name="description") or ""
        if not description:
            desc_block = self.find_by_id(root, "game_description")
            if desc_block is None:
                desc_block = self.find_first(root, None, "game_description")
            if desc_block is not None:
                description = self.text_content(desc_block)

        instructions = None
        instructions_block = self.find_by_id(root, "instructions")
        if instructions_block is None:
            instructions_block = self.find_first(root, None, "game_instructions")
        if instructions_block is not None:
            instructions = self.text_content(instructions_block)

        api_url = self._resolve_api_url(entry.payload.get("api_url"), entry)
        game_info: Dict[str, Any] = {}
        if api_url:
            try:
                game_info = self.fetch_json(api_url)
            except ValueError:
                game_info = {}
        game_payload = game_info.get("game", {}) if isinstance(game_info, dict) else {}
        assets = game_payload.get("assets", {}) if isinstance(game_payload, dict) else {}
        raw_swf = assets.get("game_file_url") or game_payload.get("game_url")
        swf_url = self.rewrite_cdn_url(raw_swf) if raw_swf else ""

        width = game_payload.get("width") or game_payload.get("screen_width")
        height = game_payload.get("height") or game_payload.get("screen_height")
        try:
            width = int(width) if width is not None else None
        except (ValueError, TypeError):
            width = None
        try:
            height = int(height) if height is not None else None
        except (ValueError, TypeError):
            height = None

        author = game_payload.get("developer_name") or entry.payload.get("developer")

        detail_tags: List[str] = []
        for container_class in ["tag_list", "game-tags"]:
            container = self.find_first(root, None, container_class)
            if container is not None:
                for link in container.findall(".//a"):
                    text = self.text_content(link)
                    if text:
                        detail_tags.append(text)
        combined_tags = tuple(dict.fromkeys(entry.tags + tuple(detail_tags)))

        metadata = {"api_url": api_url} if api_url else {}

        return FlashGame(
            source=self.source,
            source_id=str(entry.slug),
            title=entry.title,
            description=description,
            swf_url=swf_url,
            page_url=self.resolve_detail_url(entry),
            thumbnail_url=self.rewrite_cdn_url(entry.thumbnail_url),
            instructions=instructions,
            tags=combined_tags,
            width=width,
            height=height,
            author=author,
            metadata=metadata,
        )


__all__ = ["KongregateCrawler"]
