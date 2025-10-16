import pytest

from flash_models import FlashGame


def test_flash_game_requires_title():
    game = FlashGame(file_checksum="abc123")
    with pytest.raises(ValueError, match="title is required"):
        game.validate(fetch_existing=lambda: None)


def test_flash_game_requires_checksum():
    game = FlashGame(title="Test Game")
    with pytest.raises(ValueError, match="file_checksum is required"):
        game.validate(fetch_existing=lambda: None)


def test_flash_game_dimensions_must_be_positive():
    game = FlashGame(title="Test", file_checksum="abc", width=0)
    with pytest.raises(ValueError):
        game.validate(fetch_existing=lambda: None)

    game = FlashGame(title="Test", file_checksum="abc", height=-1)
    with pytest.raises(ValueError):
        game.validate(fetch_existing=lambda: None)


def test_flash_game_tags_are_normalised():
    game = FlashGame(
        title="Test",
        file_checksum="abc",
        tags=[" Word ", "word", "New", "new", ""],
    )
    game.validate(fetch_existing=lambda: None)
    assert game.tags == ["word", "new"]


def test_flash_game_checksum_is_unique():
    existing = FlashGame(title="Existing", file_checksum="dup")
    game = FlashGame(title="New", file_checksum="dup")

    with pytest.raises(ValueError, match="already exists"):
        game.validate(fetch_existing=lambda: existing)


def test_flash_game_allows_self_update():
    existing = FlashGame(title="Existing", file_checksum="same")
    game = existing
    # When the fetcher returns the instance itself it should not raise.
    game.validate(fetch_existing=lambda: existing)
