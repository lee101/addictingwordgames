import flash_library
import flash_services
from flash_services import FlashGameEntity


class InMemoryFlashRepository:
    def __init__(self):
        self._games = {}

    def add(self, game):
        self._games[game.game_id] = game

    def list_active_games(self):
        return [game for game in self._games.values() if game.is_active]

    def get(self, game_id):
        game = self._games.get(game_id)
        if not game or not game.is_active:
            return None
        if not flash_services.is_flash_storage_path(game.storage_path):
            return None
        return game


def test_flash_library_is_empty_without_discovered_games(monkeypatch):
    repo = InMemoryFlashRepository()
    monkeypatch.setattr(flash_services, "flash_repository", repo)

    result = flash_library.search_games()

    assert result["total"] == 0
    assert result["results"] == []
    assert flash_library.list_tags() == []
    assert flash_library.list_sources() == []


def test_flash_library_lists_only_discovered_swf_games(monkeypatch):
    repo = InMemoryFlashRepository()
    repo.add(
        FlashGameEntity(
            game_id="wordsmith",
            title="Wordsmith",
            description="Forge words from letters",
            developer="Armor Games",
            tags=["word", "puzzle"],
            actionscript_version=2,
            storage_path="https://cdn.example.com/wordsmith.swf",
            thumbnail_url="https://cdn.example.com/wordsmith.png",
        )
    )
    repo.add(
        FlashGameEntity(
            game_id="html-game",
            title="HTML Word Game",
            description="Not Flash",
            developer="Example",
            tags=["word"],
            storage_path="https://cdn.example.com/index.html",
        )
    )
    repo.add(
        FlashGameEntity(
            game_id="placeholder",
            title="Placeholder",
            description="Not discovered",
            developer="Example",
            tags=["word"],
            storage_path="placeholder.swf",
        )
    )
    monkeypatch.setattr(flash_services, "flash_repository", repo)

    result = flash_library.search_games(query="word")

    assert result["total"] == 1
    game = result["results"][0]
    assert game["id"] == "wordsmith"
    assert game["stream_path"].endswith("/wordsmith.swf")
    assert flash_library.list_tags() == ["puzzle", "word"]
    assert flash_library.list_sources() == ["Armor Games"]


def test_flash_library_playback_context_uses_library_stream(monkeypatch):
    repo = InMemoryFlashRepository()
    repo.add(
        FlashGameEntity(
            game_id="wordsmith",
            title="Wordsmith",
            description="Forge words from letters",
            developer="Armor Games",
            tags=["word"],
            actionscript_version=2,
            storage_path="https://cdn.example.com/wordsmith.swf",
        )
    )
    monkeypatch.setattr(flash_services, "flash_repository", repo)

    context = flash_library.build_playback_context("wordsmith")

    assert context is not None
    assert context["stream_url"] == "/flash/stream/wordsmith"
    assert context["actionscripts"] == [2]
