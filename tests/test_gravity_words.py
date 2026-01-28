import pathlib

BASE = pathlib.Path('static/gravity-words')

def test_files_exist():
    assert (BASE / 'index.html').exists(), 'index.html missing'
    assert (BASE / 'style.css').exists(), 'style.css missing'
    assert (BASE / 'script.js').exists(), 'script.js missing'

def test_html_structure():
    html = (BASE / 'index.html').read_text()
    assert 'style.css' in html
    assert 'script.js' in html
    assert 'id="game-canvas"' in html
    assert 'id="score"' in html
    assert 'id="combo"' in html
    assert 'id="words-formed"' in html
    assert 'id="high-score"' in html
    assert 'id="lives"' in html
    assert 'id="collected-letters"' in html
    assert 'id="submit-word"' in html
    assert 'id="clear-letters"' in html
    assert '<select id="difficulty"' in html
    assert 'id="start-btn"' in html
    assert 'id="pause-btn"' in html
    assert 'piano-music.js' in html
    assert 'id="game-over-modal"' in html
    assert 'id="help-btn"' in html
    assert 'id="help-text"' in html

def test_script_contains_localstorage():
    js = (BASE / 'script.js').read_text()
    assert 'localStorage' in js

def test_script_contains_valid_words():
    js = (BASE / 'script.js').read_text()
    assert 'VALID_WORDS' in js
    # Check some sample words from dictionary
    assert "'cat'" in js or '"cat"' in js
    assert "'dog'" in js or '"dog"' in js
    assert "'game'" in js or '"game"' in js

def test_script_contains_difficulty_settings():
    js = (BASE / 'script.js').read_text()
    assert 'DIFFICULTY_SETTINGS' in js
    assert 'easy' in js
    assert 'medium' in js
    assert 'hard' in js

def test_script_contains_audio():
    js = (BASE / 'script.js').read_text()
    assert 'AudioContext' in js
    assert 'playTone' in js
    assert 'playLetterCatch' in js
    assert 'playWordSuccess' in js
    assert 'playWordFail' in js
    assert 'playGameOver' in js

def test_script_contains_physics():
    js = (BASE / 'script.js').read_text()
    assert 'FallingLetter' in js
    assert 'gravity' in js
    assert 'velocity' in js or 'vy' in js
    assert 'Particle' in js

def test_script_contains_game_loop():
    js = (BASE / 'script.js').read_text()
    assert 'gameLoop' in js
    assert 'requestAnimationFrame' in js
    assert 'startGame' in js
    assert 'gameOver' in js

def test_script_contains_powerups():
    js = (BASE / 'script.js').read_text()
    assert 'Powerup' in js
    assert 'antigravity' in js
    assert 'extralife' in js

def test_css_has_canvas_styles():
    css = (BASE / 'style.css').read_text()
    assert '#game-canvas' in css
    assert 'border-radius' in css

def test_css_has_animations():
    css = (BASE / 'style.css').read_text()
    assert '@keyframes fadeIn' in css
    assert '@keyframes pulse' in css
    assert '@keyframes shake' in css
    assert '@keyframes popIn' in css

def test_css_has_responsive_design():
    css = (BASE / 'style.css').read_text()
    assert '@media' in css

def test_css_has_modal_styles():
    css = (BASE / 'style.css').read_text()
    assert '.modal' in css
    assert '.modal-content' in css

def test_css_has_music_controls():
    css = (BASE / 'style.css').read_text()
    assert '.music-controls' in css

def test_css_has_help_styles():
    css = (BASE / 'style.css').read_text()
    assert '.help-text' in css
    assert '#help-btn' in css

def test_main_py_has_route():
    main = pathlib.Path('main.py').read_text()
    assert 'GravityWordsHandler' in main
    assert '/gravity-words' in main
