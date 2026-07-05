import pathlib

BASE = pathlib.Path('static/word-search')

def test_files_exist():
    assert (BASE / 'index.html').exists(), 'index.html missing'
    assert (BASE / 'style.css').exists(), 'style.css missing'
    assert (BASE / 'script.js').exists(), 'script.js missing'

def test_html_structure():
    html = (BASE / 'index.html').read_text()
    assert 'style.css' in html
    assert 'script.js' in html
    assert 'id="grid"' in html
    assert 'id="words"' in html
    assert 'id="score"' in html
    assert 'id="high-score"' in html
    assert 'id="timer"' in html
    assert '<select id="difficulty"' in html
    assert 'id="new-game"' in html
    assert 'id="hint"' in html
    assert 'id="found-count"' in html
    assert 'id="total-count"' in html
    assert 'piano-music.js' in html

def test_script_contains_localstorage():
    js = (BASE / 'script.js').read_text()
    assert 'localStorage' in js

def test_script_contains_word_lists():
    js = (BASE / 'script.js').read_text()
    assert 'wordLists' in js
    assert 'easy:' in js
    assert 'medium:' in js
    assert 'hard:' in js

def test_script_contains_audio():
    js = (BASE / 'script.js').read_text()
    assert 'AudioContext' in js
    assert 'playTone' in js
    assert 'playCorrect' in js

def test_css_has_grid_layout():
    css = (BASE / 'style.css').read_text()
    assert 'display: grid' in css
    assert '.cell' in css
    assert '.found' in css

def test_css_has_animations():
    css = (BASE / 'style.css').read_text()
    assert '@keyframes pulse' in css

def test_css_has_responsive_design():
    css = (BASE / 'style.css').read_text()
    assert '@media' in css

def test_main_py_has_route():
    main = pathlib.Path('main.py').read_text()
    assert 'WordSearchHandler' in main
    assert '/word-search' in main
