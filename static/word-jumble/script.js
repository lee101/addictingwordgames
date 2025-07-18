const easyWords = ['cat', 'dog', 'rain', 'code', 'game'];
const mediumWords = ['python', 'giraffe', 'computer', 'puzzle'];
const hardWords = ['javascript', 'encyclopedia', 'programming', 'algorithm', 'variable'];

let currentWord = '';
let score = 0;
let highScore = 0;
let timer;
let timeLeft = 0;
let initialTime = 0;
let paused = false;
let difficulty = 'easy';
let lives = 3;
let scores = [];
let streak = 0;
const unusedWords = { easy: [...easyWords], medium: [...mediumWords], hard: [...hardWords] };

function loadHighScore() {
    if (typeof localStorage !== 'undefined') {
        highScore = Number(localStorage.getItem('wordJumbleHighScore')) || 0;
        const el = document.getElementById('high-score');
        if (el) el.textContent = highScore;
    }
}

function loadScores() {
    if (typeof localStorage !== 'undefined') {
        try {
            scores = JSON.parse(localStorage.getItem('wordJumbleScores')) || [];
        } catch (_) {
            scores = [];
        }
    }
}

function saveScores() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordJumbleScores', JSON.stringify(scores));
    }
}

function saveHighScore() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordJumbleHighScore', String(highScore));
    }
}

function toggleTheme() {
    const body = document.body;
    const dark = body.classList.toggle('dark');
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordJumbleTheme', dark ? 'dark' : 'light');
    }
}

function getWordList(currentScore = score) {
    if (difficulty === 'auto') {
        if (currentScore < 5) return easyWords;
        if (currentScore < 10) return mediumWords;
        return hardWords;
    }
    if (difficulty === 'easy') return easyWords;
    if (difficulty === 'medium') return mediumWords;
    return hardWords;
}

function getUniqueWord(list, key) {
    if (!unusedWords[key] || unusedWords[key].length === 0) {
        unusedWords[key] = [...list];
    }
    const idx = Math.floor(Math.random() * unusedWords[key].length);
    return unusedWords[key].splice(idx, 1)[0];
}

function updateScoreboard() {
    const list = document.getElementById('scores-list');
    if (!list) return;
    list.innerHTML = '';
    scores.slice(0, 5).forEach((s) => {
        const li = document.createElement('li');
        li.textContent = s;
        list.appendChild(li);
    });
}

function showScores() {
    const sb = document.getElementById('scoreboard');
    sb.classList.remove('hidden', 'fade-out');
    sb.classList.add('visible');
    updateScoreboard();
}

function hideScores() {
    const sb = document.getElementById('scoreboard');
    sb.classList.remove('visible');
    sb.classList.add('fade-out');
    setTimeout(() => {
        sb.classList.add('hidden');
        sb.classList.remove('fade-out');
    }, 500);
}

function endGame() {
    clearInterval(timer);
    scores.push(score);
    scores.sort((a, b) => b - a);
    saveScores();
    showScores();
    score = 0;
    streak = 0;
    lives = 3;
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('streak').textContent = streak;
    pickWord();
}

function loseLife() {
    lives--;
    document.getElementById('lives').textContent = lives;
    if (lives <= 0) {
        document.getElementById('message').textContent += ' Game over!';
        endGame();
    } else {
        pickWord();
        startTimer();
        const container = document.querySelector('.container');
        container.classList.add('shake', 'flash');
        setTimeout(() => container.classList.remove('flash'), 500);
        streak = 0;
        document.getElementById('streak').textContent = streak;
    }
}

function shuffle(word) {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function pickWord() {
    const list = getWordList();
    let diffKey = difficulty;
    if (difficulty === 'auto') {
        diffKey = score < 5 ? 'easy' : score < 10 ? 'medium' : 'hard';
    }
    currentWord = getUniqueWord(list, diffKey);
    const scrambledEl = document.getElementById('scrambled');
    scrambledEl.textContent = shuffle(currentWord);
    scrambledEl.classList.add('fade-in');
    setTimeout(() => scrambledEl.classList.remove('fade-in'), 300);
    document.getElementById('guess').value = '';
    document.getElementById('message').textContent = '';
    const baseTime = 30;
    const reduction = Math.min(score * 2, 20);
    timeLeft = Math.max(10, baseTime - reduction);
    initialTime = timeLeft;
    document.getElementById('progress').style.width = '100%';
    document.querySelector('.container').classList.remove('shake', 'correct');
}

function startTimer() {
    clearInterval(timer);
    document.getElementById('timer').textContent = timeLeft;
    timer = setInterval(() => {
        if (!paused) {
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft;
            document.getElementById('progress').style.width = `${Math.max(0, (timeLeft / initialTime) * 100)}%`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                document.getElementById('message').textContent = `Time's up! The word was ${currentWord}.`;
                loseLife();
            }
        }
    }, 1000);
}

function checkGuess() {
    const guess = document.getElementById('guess').value.trim().toLowerCase();
    if (guess === currentWord) {
        score++;
        document.getElementById('score').textContent = score;
        streak++;
        document.getElementById('streak').textContent = streak;
        if (score > highScore) {
            highScore = score;
            document.getElementById('high-score').textContent = highScore;
            saveHighScore();
        }
        document.getElementById('message').textContent = 'Correct!';
        document.querySelector('.container').classList.add('correct');
        pickWord();
        startTimer();
    } else {
        document.getElementById('message').textContent = 'Try again!';
        loseLife();
    }
}

function togglePause() {
    paused = !paused;
    document.getElementById('pause').textContent = paused ? 'Resume' : 'Pause';
}

function setDifficulty(val) {
    difficulty = val;
}

function setScore(val) {
    score = val;
}

function showHint() {
    document.getElementById('message').textContent = `Hint: starts with ${currentWord.charAt(0)}`;
}

if (typeof window !== 'undefined') {
    document.getElementById('check').addEventListener('click', checkGuess);

    document.getElementById('skip').addEventListener('click', () => {
        pickWord();
        startTimer();
    });

    document.getElementById('pause').addEventListener('click', togglePause);
    document.getElementById('hint').addEventListener('click', showHint);
    document.getElementById('difficulty').addEventListener('change', (e) => {
        difficulty = e.target.value;
        pickWord();
        startTimer();
    });

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    if (typeof localStorage !== 'undefined') {
        const savedTheme = localStorage.getItem('wordJumbleTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
        }
    }

    document.getElementById('show-scores').addEventListener('click', showScores);
    document.getElementById('close-scores').addEventListener('click', hideScores);

    document.getElementById('guess').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkGuess();
        }
    });
    loadHighScore();
    loadScores();
    document.getElementById('lives').textContent = lives;
    pickWord();
    startTimer();
}

// Export for tests if running in Node
if (typeof module !== 'undefined') {
    module.exports = {
        shuffle,
        loadScores,
        saveScores,
        getWordList,
        setDifficulty,
        setScore,
        getUniqueWord,
        toggleTheme,
        easyWords,
        mediumWords,
        hardWords
    };
}
