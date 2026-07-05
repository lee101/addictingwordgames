import subprocess
import time
import urllib.request
import urllib.error
import os
import pytest

SERVER_PORT = 7998
SERVER_URL = f'http://localhost:{SERVER_PORT}'

def start_server():
    env = os.environ.copy()
    env['LOCAL_DEBUG'] = 'true'
    import sys
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    proc = subprocess.Popen(
        [sys.executable, '-m', 'gunicorn', '-b', f'0.0.0.0:{SERVER_PORT}', 'main:app', '-w', '1'],
        env=env,
        cwd=project_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    time.sleep(3)
    return proc

def stop_server(proc):
    proc.terminate()
    proc.wait(timeout=5)

def fetch(path):
    try:
        resp = urllib.request.urlopen(f'{SERVER_URL}{path}', timeout=10)
        return resp.status, resp.read().decode('utf-8', errors='ignore')
    except urllib.error.HTTPError as e:
        return e.code, ''
    except urllib.error.URLError:
        return None, ''

def server_available():
    status, _ = fetch('/')
    return status == 200

@pytest.mark.skipif(not os.environ.get('RUN_E2E_TESTS'), reason="E2E tests require RUN_E2E_TESTS=1")
class TestE2EGames:
    @classmethod
    def setup_class(cls):
        cls.server = start_server()

    @classmethod
    def teardown_class(cls):
        stop_server(cls.server)

    # Homepage tests
    def test_homepage_loads(self):
        status, body = fetch('/')
        assert status == 200
        assert 'Addicting Word Games' in body

    def test_homepage_has_all_self_hosted_games(self):
        status, body = fetch('/')
        assert status == 200
        games = [
            ('Typing Tower Defense', '/typing-tower-defense'),
            ('Typing Game', '/typing-game'),
            ('Infinite Wordle', '/wordle'),
            ('Word Phzzle', '/word-phzzle'),
            ('Word Jumble', '/word-jumble'),
        ]
        for name, url in games:
            assert name in body, f'{name} not found on homepage'
            assert url in body, f'{url} not found on homepage'

    # Typing Tower Defense tests
    def test_typing_tower_defense_loads(self):
        status, body = fetch('/typing-tower-defense')
        assert status == 200
        assert 'Typing Tower Defense' in body
        assert 'gameCanvas' in body

    def test_typing_tower_defense_has_game_elements(self):
        status, body = fetch('/typing-tower-defense')
        assert status == 200
        assert 'game-audio.js' in body
        assert 'GameAudio' in body
        assert 'Wave' in body
        assert 'Gold' in body
        assert 'Lives' in body
        assert 'Arrow' in body
        assert 'Cannon' in body
        assert 'Frost' in body

    # Typing Game tests
    def test_typing_game_loads(self):
        status, body = fetch('/typing-game')
        assert status == 200
        assert 'Typing Game' in body
        assert 'gameCanvas' in body

    def test_typing_game_has_game_elements(self):
        status, body = fetch('/typing-game')
        assert status == 200
        assert 'game-audio.js' in body
        assert 'GameAudio' in body
        assert 'Health' in body
        assert 'Score' in body
        assert 'Combo' in body
        assert 'Level' in body

    # Infinite Wordle tests
    def test_wordle_loads(self):
        status, body = fetch('/wordle')
        assert status == 200
        assert 'Wordle' in body

    def test_wordle_has_game_elements(self):
        status, body = fetch('/wordle')
        assert status == 200
        assert 'game-audio.js' in body
        assert 'GameAudio' in body
        assert 'board' in body
        assert 'keyboard' in body
        assert 'Attempts' in body
        assert 'Streak' in body

    # Word Phzzle tests
    def test_word_phzzle_loads(self):
        status, body = fetch('/word-phzzle')
        assert status == 200
        assert 'Word Phzzle' in body

    def test_word_phzzle_has_game_elements(self):
        status, body = fetch('/word-phzzle')
        assert status == 200
        assert 'game-audio.js' in body
        assert 'scrambled' in body
        assert 'difficulty' in body
        assert 'Score' in body
        assert 'Streak' in body
        assert 'Hint' in body
        assert 'theme-toggle' in body

    # Word Jumble tests
    def test_word_jumble_loads(self):
        status, body = fetch('/word-jumble')
        assert status == 200
        assert 'Word Jumble' in body

    def test_word_jumble_has_game_elements(self):
        status, body = fetch('/word-jumble')
        assert status == 200
        assert 'game-audio.js' in body
        assert 'scrambled' in body
        assert 'difficulty' in body
        assert 'Score' in body
        assert 'Lives' in body
        assert 'Time' in body
        assert 'Hint' in body
        assert 'Pause' in body

    # Static file tests
    def test_game_audio_js_loads(self):
        status, body = fetch('/static/js/game-audio.js')
        assert status == 200
        assert 'class GameAudio' in body
        assert 'class PianoMusicGenerator' in body
        assert 'correct()' in body
        assert 'wrong()' in body
        assert 'startMusic' in body
        assert 'stopMusic' in body

    # Music controls test
    def test_all_games_have_music_controls(self):
        games = [
            '/typing-tower-defense',
            '/typing-game',
            '/wordle',
            '/word-phzzle',
            '/word-jumble',
        ]
        for url in games:
            status, body = fetch(url)
            assert status == 200
            assert 'music-toggle' in body, f'{url} missing music-toggle'
            assert 'music-next' in body, f'{url} missing music-next'
            assert 'song-name' in body, f'{url} missing song-name'

    # 404 test
    def test_nonexistent_page_returns_404(self):
        status, _ = fetch('/nonexistent-page-12345')
        assert status == 404

    # External games on homepage
    def test_homepage_has_external_games(self):
        status, body = fetch('/')
        assert status == 200
        assert 'Joy Drop' in body
        assert 'Netwrck' in body
