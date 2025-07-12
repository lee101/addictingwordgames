import pathlib
import re

BASE = pathlib.Path('static/word-jumble')

def test_files_exist():
    assert (BASE / 'index.html').exists(), 'index.html missing'
    assert (BASE / 'style.css').exists(), 'style.css missing'
    assert (BASE / 'script.js').exists(), 'script.js missing'

def test_html_links():
    html = (BASE / 'index.html').read_text()
    assert 'style.css' in html
    assert 'script.js' in html
    assert 'high-score' in html
    assert 'id="lives"' in html
    assert '<select id="difficulty"' in html
    assert 'id="pause"' in html
    assert 'id="hint"' in html
    assert 'id="show-scores"' in html
    assert 'id="scoreboard"' in html
    assert '<option value="auto"' in html

def test_shuffle_function():
    import subprocess, json, os, textwrap
    node_script = textwrap.dedent('''
        const { shuffle } = require('./static/word-jumble/script.js');
        const result = shuffle('hello');
        console.log(JSON.stringify({result}));
    ''')
    proc = subprocess.run(['node', '-e', node_script], capture_output=True, text=True)
    assert proc.returncode == 0
    out = json.loads(proc.stdout.strip())['result']
    assert sorted(out) == sorted('hello')
    assert out != 'hello'

def test_script_contains_localstorage():
    js = (BASE / 'script.js').read_text()
    assert 'localStorage' in js

def test_css_has_animations():
    css = (BASE / 'style.css').read_text()
    assert '@keyframes pop' in css
    assert '@keyframes shake' in css
    assert '@keyframes fadeIn' in css
    assert '@keyframes fadeOut' in css
    assert '@keyframes flash' in css

def test_load_scores_function():
    import subprocess, json, textwrap
    node_script = textwrap.dedent('''
        const { loadScores, saveScores } = require('./static/word-jumble/script.js');
        saveScores();
        const data = loadScores ? typeof loadScores : null;
        console.log(JSON.stringify({data}));
    ''')
    proc = subprocess.run(['node', '-e', node_script], capture_output=True, text=True)
    assert proc.returncode == 0
    out = json.loads(proc.stdout.strip())['data']
    assert out == 'function'

def test_auto_difficulty_wordlist():
    import subprocess, json, textwrap
    node_script = textwrap.dedent('''
        const { getWordList, setDifficulty, setScore, mediumWords } = require('./static/word-jumble/script.js');
        setDifficulty('auto');
        setScore(7);
        const list = getWordList();
        console.log(JSON.stringify({ok: JSON.stringify(list) === JSON.stringify(mediumWords)}));
    ''')
    proc = subprocess.run(['node', '-e', node_script], capture_output=True, text=True)
    assert proc.returncode == 0
    out = json.loads(proc.stdout.strip())['ok']
    assert out
