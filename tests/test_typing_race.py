import pathlib

BASE = pathlib.Path('static/typing-race')

def test_files_exist():
    assert (BASE / 'index.html').exists(), 'index.html missing'
    assert (BASE / 'style.css').exists(), 'style.css missing'
    assert (BASE / 'script.js').exists(), 'script.js missing'

def test_html_structure():
    html = (BASE / 'index.html').read_text()
    assert 'style.css' in html
    assert 'script.js' in html
    assert 'id="score"' in html
    assert 'id="high-score"' in html
    assert 'id="timer"' in html
    assert 'id="wpm"' in html
    assert 'id="accuracy"' in html
    assert '<select id="difficulty"' in html
    assert '<select id="duration"' in html
    assert 'id="input-field"' in html
    assert 'id="current-word"' in html
    assert 'piano-music.js' in html

def test_script_contains_localstorage():
    js = (BASE / 'script.js').read_text()
    assert 'localStorage' in js
    assert 'typingRaceHighScore' in js
    assert 'typingRaceHighWpm' in js

def test_script_contains_word_lists():
    js = (BASE / 'script.js').read_text()
    assert 'easyWords' in js
    assert 'mediumWords' in js
    assert 'hardWords' in js

def test_script_contains_audio():
    js = (BASE / 'script.js').read_text()
    assert 'AudioContext' in js
    assert 'playTone' in js
    assert 'playCorrectWord' in js
    assert 'playWrongKey' in js

def test_script_contains_game_logic():
    js = (BASE / 'script.js').read_text()
    assert 'generateWords' in js
    assert 'startGame' in js
    assert 'endGame' in js
    assert 'handleInput' in js
    assert 'updateDisplay' in js

def test_script_contains_wpm_calculation():
    js = (BASE / 'script.js').read_text()
    assert 'wordsTyped' in js
    assert 'elapsedMinutes' in js

def test_css_has_animations():
    css = (BASE / 'style.css').read_text()
    assert '@keyframes pop' in css
    assert '@keyframes shake' in css
    assert '@keyframes fadeIn' in css

def test_css_has_responsive_design():
    css = (BASE / 'style.css').read_text()
    assert '@media' in css

def test_css_has_modal():
    css = (BASE / 'style.css').read_text()
    assert '.game-over-modal' in css
    assert '.modal-content' in css

def test_main_py_has_route():
    main = pathlib.Path('main.py').read_text()
    assert 'TypingRaceHandler' in main
    assert '/typing-race' in main
