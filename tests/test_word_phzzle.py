import pathlib
import subprocess
import json
import textwrap

BASE = pathlib.Path('static/word-phzzle')


def test_files_exist():
    assert (BASE / 'index.html').exists(), 'index.html missing'
    assert (BASE / 'style.css').exists(), 'style.css missing'
    assert (BASE / 'script.js').exists(), 'script.js missing'


def test_html_links():
    html = (BASE / 'index.html').read_text()
    assert 'style.css' in html
    assert 'script.js' in html
    assert 'id="scrambled"' in html
    assert 'id="guess"' in html
    assert 'id="check"' in html
    assert 'id="speak"' in html
    assert 'id="score"' in html
    assert 'id="hint"' in html
    assert 'id="difficulty"' in html
    assert 'id="theme-toggle"' in html


def test_script_exports():
    node_script = textwrap.dedent(
        f'''
        const mod = require('./{BASE}/script.js');
        const word = mod.chooseWord();
        const scrambled = mod.scramble(word);
        console.log(JSON.stringify({{
            speak: typeof mod.speakWord,
            valid: word && scrambled && scrambled.length === word.length
        }}));
        '''
    )
    proc = subprocess.run(['node', '-e', node_script], capture_output=True, text=True)
    assert proc.returncode == 0
    out = json.loads(proc.stdout.strip())
    assert out['speak'] == 'function'
    assert out['valid']


def test_script_contains_localstorage():
    js = (BASE / 'script.js').read_text()
    assert 'localStorage' in js


def test_set_difficulty():
    node_script = textwrap.dedent(
        '''
        const mod = require('./static/word-phzzle/script.js');
        mod.setDifficulty('hard');
        const word = mod.chooseWord();
        console.log(JSON.stringify({ok: ['elephant','computer','transformer','javascript','pineapple'].includes(word)}));
        '''
    )
    proc = subprocess.run(['node', '-e', node_script], capture_output=True, text=True)
    assert proc.returncode == 0
    out = json.loads(proc.stdout.strip())
    assert out['ok']
