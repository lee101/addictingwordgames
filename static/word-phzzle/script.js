const wordLists = {
    easy: ['cat', 'dog', 'sun', 'tree', 'ball'],
    medium: ['apple', 'banana', 'cherry', 'orange', 'grape'],
    hard: ['elephant', 'computer', 'transformer', 'javascript', 'pineapple']
};
let difficulty = 'easy';
let pipelineFunc = null;
let tts = null;
let score = 0;

async function loadPipeline() {
    if (!pipelineFunc) {
        if (typeof window !== 'undefined') {
            const lib = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js');
            pipelineFunc = lib.pipeline;
        } else {
            try {
                pipelineFunc = require('@xenova/transformers').pipeline;
            } catch (e) {
                return null;
            }
        }
    }
    if (!tts && pipelineFunc) {
        tts = await pipelineFunc('text-to-speech', 'Xenova/tts_models--en--ljspeech--tacotron2');
    }
    return tts;
}

async function speakWord(word) {
    const p = await loadPipeline();
    if (!p) return;
    const result = await p(word, { speaker_id: 'kokoro' });
    if (typeof window !== 'undefined' && result && result.audio) {
        const blob = new Blob([result.audio[0].arrayBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        new Audio(url).play();
    }
}

function scramble(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

function chooseWord() {
    const list = wordLists[difficulty] || wordLists.easy;
    return list[Math.floor(Math.random() * list.length)];
}

function setDifficulty(val) {
    difficulty = val;
}

function toggleTheme() {
    const body = typeof document === 'undefined' ? null : document.body;
    if (!body) return;
    const dark = body.classList.toggle('dark');
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('phzzleTheme', dark ? 'dark' : 'light');
    }
}

function showHint(word) {
    if (typeof document !== 'undefined') {
        document.getElementById('message').textContent = `Hint: starts with ${word.charAt(0)}`;
    }
}

if (typeof window !== 'undefined') {
    function loadScore() {
        if (typeof localStorage !== 'undefined') {
            score = Number(localStorage.getItem('phzzleScore')) || 0;
        }
        document.getElementById('score').textContent = score;
    }

    function saveScore() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('phzzleScore', String(score));
        }
    }

    function pickNewWord() {
        currentWord = chooseWord();
        document.getElementById('scrambled').textContent = scramble(currentWord);
        document.getElementById('guess').value = '';
        document.getElementById('message').textContent = '';
    }

    let currentWord = chooseWord();
    document.getElementById('scrambled').textContent = scramble(currentWord);
    loadScore();

    document.getElementById('check').addEventListener('click', () => {
        const guess = document.getElementById('guess').value.trim().toLowerCase();
        if (guess === currentWord) {
            score++;
            document.getElementById('score').textContent = score;
            saveScore();
            document.getElementById('message').textContent = 'Correct!';
            speakWord(currentWord);
            pickNewWord();
        } else {
            document.getElementById('message').textContent = 'Try again!';
        }
    });
    document.getElementById('speak').addEventListener('click', () => speakWord(currentWord));
    document.getElementById('hint').addEventListener('click', () => showHint(currentWord));
    document.getElementById('difficulty').addEventListener('change', (e) => {
        difficulty = e.target.value;
        pickNewWord();
    });
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    if (typeof localStorage !== 'undefined') {
        const savedTheme = localStorage.getItem('phzzleTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = { scramble, chooseWord, speakWord, setDifficulty, toggleTheme };
}
