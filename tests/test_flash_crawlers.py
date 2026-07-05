from __future__ import annotations

from pathlib import Path
from typing import Callable, Dict

import pytest

from crawlers import (
    ArmorGamesCrawler,
    FlashGame,
    FlashGameStore,
    ItchIoCrawler,
    KongregateCrawler,
    sponsor_registry,
)

FIXTURE_DIR = Path(__file__).parent / "fixtures" / "crawlers"


def load_fixture(name: str) -> str:
    return (FIXTURE_DIR / name).read_text(encoding="utf-8")


def build_fetcher(mapping: Dict[str, str]) -> Callable[[str], str]:
    def _fetch(url: str, **_: str) -> str:
        if url not in mapping:
            raise AssertionError(f"Unexpected URL requested: {url}")
        return mapping[url]

    return _fetch


def test_armor_games_crawler_parses_listing_and_detail():
    listing_url = ArmorGamesCrawler.listing_url
    detail_url = "https://armorgames.com/game/wordsmith"

    fetcher = build_fetcher(
        {
            listing_url: load_fixture("armor_games_listing.html"),
            f"{listing_url}?page=2": "<html></html>",
            detail_url: load_fixture("armor_games_detail_wordsmith.html"),
        }
    )

    store = FlashGameStore()
    crawler = ArmorGamesCrawler(fetcher=fetcher, store=store)
    games = crawler.crawl()

    assert len(games) == 1
    game = games[0]
    assert game.source == "armor-games"
    assert game.source_id == "wordsmith"
    assert game.swf_url == "https://cdn.armorgames.com/files/game/wordsmith.swf"
    assert "Forge" in game.description
    assert game.width == 800
    assert "Word" in game.tags and "Puzzle" in game.tags


def test_kongregate_crawler_uses_api_for_swf():
    listing_url = KongregateCrawler.listing_url
    detail_url = "https://www.kongregate.com/games/dev/word-warrior"
    api_url = "https://www.kongregate.com/games/dev/word-warrior.json"

    fetcher = build_fetcher(
        {
            listing_url: load_fixture("kongregate_listing.html"),
            f"{listing_url}?page=2": "<html></html>",
            detail_url: load_fixture("kongregate_detail_word_warrior.html"),
            api_url: load_fixture("kongregate_api_word_warrior.json"),
        }
    )

    store = FlashGameStore()
    crawler = KongregateCrawler(fetcher=fetcher, store=store)
    games = crawler.crawl()

    assert len(games) == 1
    game = games[0]
    assert game.swf_url == "https://cdn.kongregate.com/gamez/0012/3456/live/word-warrior.swf"
    assert game.author == "Dev Studio"
    assert game.width == 640 and game.height == 480
    assert "Word" in game.tags and "RPG" in game.tags
    assert "Lead" in game.description


def test_itch_io_crawler_rewrites_cdn_and_extracts_metadata():
    listing_url = ItchIoCrawler.listing_url
    detail_url = "https://example.itch.io/letter-quest"

    fetcher = build_fetcher(
        {
            listing_url: load_fixture("itch_io_feed.xml"),
            detail_url: load_fixture("itch_io_detail_letter_quest.html"),
        }
    )

    store = FlashGameStore()
    crawler = ItchIoCrawler(fetcher=fetcher, store=store)
    games = crawler.crawl()

    assert len(games) == 1
    game = games[0]
    assert game.swf_url == "https://static.itch.io/letter-quest.swf"
    assert game.thumbnail_url == "https://static.itch.io/images/letter-quest.png"
    assert game.width == 800 and game.height == 600
    assert game.author == "Example Dev"
    assert game.instructions and "Type" in game.instructions


def test_flash_game_store_deduplicates_by_source_id():
    store = FlashGameStore()
    original = FlashGame(
        source="armor-games",
        source_id="alpha",
        title="Alpha",
        description="Original description",
        swf_url="https://cdn.example.com/alpha.swf",
        page_url="https://example.com/alpha",
        instructions=None,
    )
    updated = FlashGame(
        source="armor-games",
        source_id="alpha",
        title="Alpha Deluxe",
        description="",
        swf_url="https://cdn.example.com/alpha.swf",
        page_url="https://example.com/alpha",
        instructions="New instructions",
    )

    stored_first, created_first = store.upsert(original)
    stored_second, created_second = store.upsert(updated)

    assert created_first is True
    assert created_second is False
    assert len(store.all()) == 1
    assert stored_second.description == "Original description"
    assert stored_second.title == "Alpha Deluxe"
    assert stored_second.instructions == "New instructions"


def test_registry_exposes_optional_sources():
    armor_config = sponsor_registry.get("armor-games")
    assert armor_config is not None and armor_config.enabled is True
    crawler = armor_config.create(fetcher=build_fetcher({}), store=FlashGameStore())
    assert isinstance(crawler, ArmorGamesCrawler)

    newgrounds = sponsor_registry.get("newgrounds")
    assert newgrounds is not None
    assert newgrounds.enabled is False
    with pytest.raises(ValueError):
        newgrounds.create()

