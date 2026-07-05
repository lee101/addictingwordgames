import json
from datetime import datetime

import pytest
import webapp2

import flash_services
import main
from flash_services import FlashGameEntity, FlashStreamService, FlashSearchService, IPRateLimiter


class InMemoryFlashRepository:
    def __init__(self):
        self._games = {}

    def add(self, game: FlashGameEntity):
        self._games[game.game_id] = game

    def list_active_games(self):
        return [game for game in self._games.values() if game.is_active]

    def get(self, game_id: str):
        return self._games.get(game_id)


@pytest.fixture
def flash_repo(monkeypatch):
    repo = InMemoryFlashRepository()
    search_service = FlashSearchService(repo)
    stream_service = FlashStreamService(repo, signing_secret="test-secret", expiry_seconds=60)
    limiter = IPRateLimiter(limit=5, window_seconds=60)

    monkeypatch.setattr(flash_services, "flash_repository", repo)
    monkeypatch.setattr(flash_services, "flash_search_service", search_service)
    monkeypatch.setattr(flash_services, "flash_stream_service", stream_service)
    monkeypatch.setattr(flash_services, "stream_rate_limiter", limiter)

    monkeypatch.setenv("FLASH_STREAM_AUTH_TOKEN", "test-token")
    monkeypatch.setenv("FLASH_STREAM_SIGNING_SECRET", "test-secret")
    monkeypatch.setenv("FLASH_STREAM_URL_TTL", "60")

    return repo


def _dispatch(path: str, headers=None, environ=None):
    request = webapp2.Request.blank(path, headers=headers, environ=environ)
    return request.get_response(main.app)


def _json(response):
    body = response.body
    if isinstance(body, bytes):
        body = body.decode('utf-8')
    return json.loads(body)


def test_flash_search_returns_paginated_results(flash_repo):
    flash_repo.add(
        FlashGameEntity(
            game_id="g1",
            title="Classic Flash Chess",
            description="A chess game",
            tags=["strategy", "board"],
            actionscript_version=3,
            storage_path="https://cdn.example.com/g1.swf",
            play_count=50,
        )
    )
    flash_repo.add(
        FlashGameEntity(
            game_id="g2",
            title="Flash Checkers",
            description="Board game with strategy elements",
            tags=["board", "flash"],
            actionscript_version=2,
            storage_path="https://cdn.example.com/g2.swf",
            play_count=10,
        )
    )
    flash_repo.add(
        FlashGameEntity(
            game_id="g3",
            title="Hidden Adventure",
            description="Point and click adventure",
            tags=["adventure"],
            actionscript_version=3,
            storage_path="https://cdn.example.com/g3.swf",
            play_count=5,
            is_active=False,
        )
    )

    response = _dispatch('/api/flash/search?q=board&page_size=1')
    assert response.status_int == 200
    payload = _json(response)
    assert payload['total_results'] == 2
    assert payload['page_size'] == 1
    assert len(payload['results']) == 1
    assert payload['results'][0]['actionscript_version'] in (2, 3)
    assert payload['next_page_token']

    next_token = payload['next_page_token']
    second_response = _dispatch(f'/api/flash/search?q=board&page_size=1&page_token={next_token}')
    second_payload = _json(second_response)
    assert second_response.status_int == 200
    assert len(second_payload['results']) == 1
    assert second_payload['next_page_token'] is None


def test_flash_search_invalid_page_token_returns_400(flash_repo):
    flash_repo.add(
        FlashGameEntity(
            game_id="g1",
            title="Flash Puzzle",
            description="Puzzle game",
            tags=["puzzle"],
            actionscript_version=3,
            storage_path="https://cdn.example.com/g1.swf",
        )
    )

    response = _dispatch('/api/flash/search?q=flash&page_token=@@@')
    assert response.status_int == 400
    payload = _json(response)
    assert payload['error']['code'] == 400
    assert 'Invalid page token' in payload['error']['message']


def test_flash_search_tag_filter(flash_repo):
    flash_repo.add(
        FlashGameEntity(
            game_id="g1",
            title="Flash Racer",
            description="Racing game",
            tags=["racing", "cars"],
            actionscript_version=3,
            storage_path="https://cdn.example.com/g1.swf",
        )
    )
    flash_repo.add(
        FlashGameEntity(
            game_id="g2",
            title="City Driver",
            description="Driving through city streets",
            tags=["cars"],
            actionscript_version=2,
            storage_path="https://cdn.example.com/g2.swf",
        )
    )

    response = _dispatch('/api/flash/search?q=car&tag=racing')
    assert response.status_int == 200
    payload = _json(response)
    assert payload['total_results'] == 1
    assert payload['results'][0]['id'] == 'g1'


def test_flash_search_empty_results(flash_repo):
    response = _dispatch('/api/flash/search?q=unmatched')
    assert response.status_int == 200
    payload = _json(response)
    assert payload['total_results'] == 0
    assert payload['results'] == []
    assert payload['next_page_token'] is None


def test_flash_search_excludes_non_swf_and_placeholder_records(flash_repo):
    flash_repo.add(
        FlashGameEntity(
            game_id="real",
            title="Real Flash Word Game",
            description="Actual SWF game",
            tags=["word"],
            storage_path="https://cdn.example.com/real.swf",
        )
    )
    flash_repo.add(
        FlashGameEntity(
            game_id="html5",
            title="HTML5 Word Game",
            description="Not a Flash binary",
            tags=["word"],
            storage_path="https://cdn.example.com/html5/index.html",
        )
    )
    flash_repo.add(
        FlashGameEntity(
            game_id="placeholder",
            title="Placeholder Flash Game",
            description="Placeholder asset",
            tags=["word"],
            storage_path="placeholder.swf",
        )
    )

    response = _dispatch('/api/flash/search?q=word')
    assert response.status_int == 200
    payload = _json(response)
    assert [result['id'] for result in payload['results']] == ['real']


def test_flash_metadata_returns_expected_payload(flash_repo):
    flash_repo.add(
        FlashGameEntity(
            game_id="g9",
            title="Mystery Quest",
            description="Solve the mysteries",
            tags=["mystery"],
            actionscript_version=3,
            storage_path="https://cdn.example.com/g9.swf",
            thumbnail_url="https://cdn.example.com/g9.png",
            created_at=datetime(2020, 1, 1, 12, 0, 0),
            updated_at=datetime(2020, 1, 2, 12, 0, 0),
        )
    )

    response = _dispatch('/api/flash/g9')
    assert response.status_int == 200
    payload = _json(response)
    assert payload['id'] == 'g9'
    assert payload['title'] == 'Mystery Quest'
    assert payload['actionscript_version'] == 3
    assert payload['stream_endpoint'] == '/api/flash/g9/stream'


def test_flash_metadata_not_found_returns_404(flash_repo):
    response = _dispatch('/api/flash/unknown')
    assert response.status_int == 404
    payload = _json(response)
    assert payload['error']['code'] == 404


def test_flash_metadata_rejects_non_swf_records(flash_repo):
    flash_repo.add(
        FlashGameEntity(
            game_id="html5",
            title="HTML5 Game",
            description="Not Flash",
            tags=["html5"],
            storage_path="https://cdn.example.com/game.html",
        )
    )

    response = _dispatch('/api/flash/html5')
    assert response.status_int == 404


def test_flash_stream_requires_token(flash_repo):
    flash_repo.add(
        FlashGameEntity(
            game_id="g5",
            title="Stream Test",
            description="",
            tags=[],
            actionscript_version=2,
            storage_path="https://cdn.example.com/g5.swf",
        )
    )

    response = _dispatch('/api/flash/g5/stream')
    assert response.status_int == 401
    payload = _json(response)
    assert payload['error']['code'] == 401


def test_flash_stream_happy_path(flash_repo, monkeypatch):
    flash_repo.add(
        FlashGameEntity(
            game_id="g6",
            title="Stream Game",
            description="",
            tags=[],
            actionscript_version=3,
            storage_path="https://cdn.example.com/g6.swf",
            file_size=12345,
        )
    )

    # Ensure empty limiter state
    flash_services.stream_rate_limiter.reset()

    response = _dispatch(
        '/api/flash/g6/stream',
        headers={'X-Flash-Token': 'test-token'},
        environ={'REMOTE_ADDR': '127.0.0.1'}
    )
    assert response.status_int == 200
    payload = _json(response)
    assert payload['id'] == 'g6'
    assert payload['actionscript_version'] == 3
    assert payload['content_type'] == flash_services.flash_stream_service.CONTENT_TYPE
    assert 'signature=' in payload['stream_url']
    assert 'expires=' in payload['stream_url']


def test_flash_stream_rate_limited(flash_repo, monkeypatch):
    flash_repo.add(
        FlashGameEntity(
            game_id="g7",
            title="Rate Limited",
            description="",
            tags=[],
            actionscript_version=3,
            storage_path="https://cdn.example.com/g7.swf",
        )
    )

    limiter = IPRateLimiter(limit=1, window_seconds=60)
    monkeypatch.setattr(flash_services, "stream_rate_limiter", limiter)

    first = _dispatch(
        '/api/flash/g7/stream',
        headers={'X-Flash-Token': 'test-token'},
        environ={'REMOTE_ADDR': '192.168.1.1'}
    )
    assert first.status_int == 200

    second = _dispatch(
        '/api/flash/g7/stream',
        headers={'X-Flash-Token': 'test-token'},
        environ={'REMOTE_ADDR': '192.168.1.1'}
    )
    assert second.status_int == 429
    payload = _json(second)
    assert payload['error']['code'] == 429
    assert 'retry_after' in payload['error']
    assert second.headers['Retry-After']
