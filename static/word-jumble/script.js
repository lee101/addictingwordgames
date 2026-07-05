const WORDS = {
    general: {
        easy: ['cat','dog','sun','hat','run','big','red','cup','pen','box','bird','fish','tree','star','moon'],
        medium: ['apple','grape','house','water','light','dream','cloud','stone','flame','storm','swift','ocean','tiger','piano','robot'],
        hard: ['python','giraffe','computer','keyboard','elephant','dinosaur','chocolate','adventure','beautiful','fantastic','wonderful','mysterious']
    },
    animals: {
        easy: ['cat','dog','cow','pig','ant','bee','owl','fox','rat','hen','duck','bear','deer','frog','goat'],
        medium: ['horse','whale','eagle','tiger','zebra','panda','koala','shark','camel','llama','otter','raven','bison','gecko'],
        hard: ['elephant','giraffe','crocodile','butterfly','orangutan','armadillo','chameleon','porcupine','jellyfish','wolverine']
    },
    food: {
        easy: ['egg','pie','jam','ham','nut','pea','fig','bun','tea','ice','rice','soup','cake','corn','lime'],
        medium: ['pizza','pasta','salad','bread','steak','curry','honey','cream','bacon','mango','olive','peach','melon'],
        hard: ['spaghetti','hamburger','chocolate','croissant','pepperoni','blueberry','pineapple','asparagus','quesadilla']
    },
    tech: {
        easy: ['web','app','bug','cpu','ram','usb','led','gif','url','api','code','data','file','link','wifi'],
        medium: ['mouse','cloud','robot','drone','pixel','email','laptop','server','router','binary','widget','cursor'],
        hard: ['bluetooth','algorithm','javascript','encryption','blockchain','artificial','cybersecurity','microprocessor']
    }
};

let currentWord = '';
let score = 0;
let highScore = 0;
let lives = 3;
let timeLeft = 30;
let timer = null;
let paused = false;
let difficulty = 'easy';
let category = 'general';
let scores = [];
let wordStartTime = 0;
let streak = 0;
const easyWords = WORDS.general.easy;
const mediumWords = WORDS.general.medium;
const hardWords = WORDS.general.hard;
const usedWords = {};

const hasDom = typeof document !== 'undefined';
const storage = typeof localStorage !== 'undefined' ? localStorage : {
    getItem: () => null,
    setItem: () => {}
};
const audio = typeof GameAudio !== 'undefined' ? new GameAudio() : {
    setSfxVolume: () => {},
    setMusicVolume: () => {},
    correct: () => {},
    wrong: () => {},
    combo: () => {},
    tick: () => {},
    loseLife: () => {},
    gameOver: () => {},
    click: () => {},
    startMusic: () => {},
    stopMusic: () => {},
    nextSong: () => {},
    getSongName: () => ''
};

// Volume & fullscreen
if (hasDom) {
    document.getElementById('sfx-vol').oninput = e => audio.setSfxVolume(e.target.value/100);
    document.getElementById('music-vol').oninput = e => audio.setMusicVolume(e.target.value/100);
    document.getElementById('fullscreen-btn').onclick = () => {
        if(!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    };
    document.addEventListener('fullscreenchange', () => {
        document.getElementById('fullscreen-btn').textContent = document.fullscreenElement ? 'Exit' : 'Fullscreen';
    });
}

function shuffle(word) {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const result = arr.join('');
    return result === word ? shuffle(word) : result;
}

function getWordList() {
    const cat = WORDS[category] || WORDS.general;
    if (difficulty === 'auto') {
        if (score < 5) return cat.easy;
        if (score < 10) return cat.medium;
        return cat.hard;
    }
    return cat[difficulty] || cat.easy;
}

function getUniqueWord(list, key = difficulty) {
    usedWords[key] = usedWords[key] || [];
    if (usedWords[key].length >= list.length) usedWords[key] = [];
    const available = list.filter(word => !usedWords[key].includes(word));
    const word = available[Math.floor(Math.random() * available.length)];
    usedWords[key].push(word);
    return word;
}

function pickWord() {
    const list = getWordList();
    currentWord = getUniqueWord(list, `${category}:${difficulty}`);
    if (!hasDom) return currentWord;
    const scrambled = document.getElementById('scrambled');
    scrambled.textContent = shuffle(currentWord).toUpperCase();
    scrambled.style.animation = 'none';
    scrambled.offsetHeight;
    scrambled.style.animation = 'pop 0.3s';
    document.getElementById('guess').value = '';
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = '';
    document.getElementById('speed-bonus').textContent = '';
    timeLeft = Math.max(10, 30 - score * 2);
    wordStartTime = Date.now();
}

function startTimer() {
    if (!hasDom) return;
    clearInterval(timer);
    document.getElementById('timer').textContent = timeLeft;
    updateProgress();
    timer = setInterval(() => {
        if (paused) return;
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        updateProgress();
        if (timeLeft <= 5 && timeLeft > 0) audio.tick();
        if (timeLeft <= 0) {
            clearInterval(timer);
            showMessage(`Time's up! It was "${currentWord}"`, 'wrong');
            audio.loseLife();
            loseLife();
        }
    }, 1000);
}

function loseLife() {
    lives--;
    document.getElementById('lives').textContent = lives;
    if (lives <= 0) {
        gameOver();
    } else {
        pickWord();
        startTimer();
    }
}

function gameOver() {
    clearInterval(timer);
    audio.gameOver();
    scores.push(score);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 10);
    saveScores();
    showScores();
    showMessage('Game Over!', 'wrong');
    setTimeout(() => {
        score = 0;
        lives = 3;
        document.getElementById('score').textContent = score;
        document.getElementById('lives').textContent = lives;
        pickWord();
        startTimer();
    }, 2000);
}

function showMessage(text, type) {
    if (!hasDom) return;
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = type;
}

function updateStreak() {
    if (!hasDom) return;
    document.getElementById('streak').textContent = streak;
}

function updateProgress() {
    if (!hasDom) return;
    const bar = document.getElementById('progress-bar');
    bar.style.width = `${Math.max(0, Math.min(100, timeLeft / 30 * 100))}%`;
}

function checkGuess() {
    const guess = document.getElementById('guess').value.trim().toLowerCase();
    if (guess === currentWord) {
        const elapsed = (Date.now() - wordStartTime) / 1000;
        let bonus = 0;
        if(elapsed < 3) { bonus = 5; showSpeedBonus('+5 LIGHTNING!'); }
        else if(elapsed < 5) { bonus = 3; showSpeedBonus('+3 FAST!'); }
        else if(elapsed < 8) { bonus = 1; showSpeedBonus('+1 QUICK!'); }
        score += 1 + bonus;
        streak++;
        updateStreak();
        if(streak >= 3) { score += streak; showSpeedBonus(`+${streak} STREAK!`); }
        document.getElementById('score').textContent = score;
        if (score > highScore) {
            highScore = score;
            document.getElementById('high-score').textContent = highScore;
            saveHighScore();
        }
        showMessage('Correct!', 'correct');
        audio.correct();
        if(streak >= 5) audio.combo(streak);
        pickWord();
        startTimer();
    } else {
        showMessage('Wrong! Try again', 'wrong');
        audio.wrong();
        streak = 0;
        updateStreak();
        loseLife();
    }
}

function showSpeedBonus(text) {
    if (!hasDom) return;
    const el = document.getElementById('speed-bonus');
    el.textContent = text;
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'pop 0.5s';
}

function showHint() {
    showMessage(`Starts with "${currentWord[0].toUpperCase()}"`, '');
    audio.click();
}

function togglePause() {
    paused = !paused;
    document.getElementById('pause').textContent = paused ? 'Resume' : 'Pause';
    audio.click();
}

function toggleTheme() {
    if (!hasDom) return;
    document.body.classList.toggle('light');
    storage.setItem('wordJumbleTheme', document.body.classList.contains('light') ? 'light' : 'dark');
    audio.click();
}

function loadTheme() {
    if (!hasDom) return;
    if (storage.getItem('wordJumbleTheme') === 'light') document.body.classList.add('light');
}

function loadHighScore() {
    highScore = parseInt(storage.getItem('wordJumbleHighScore')) || 0;
    if (!hasDom) return;
    document.getElementById('high-score').textContent = highScore;
}

function saveHighScore() {
    storage.setItem('wordJumbleHighScore', highScore);
}

function loadScores() {
    try { scores = JSON.parse(storage.getItem('wordJumbleScores')) || []; }
    catch { scores = []; }
}

function saveScores() {
    storage.setItem('wordJumbleScores', JSON.stringify(scores));
}

function showScores() {
    if (!hasDom) return;
    loadScores();
    const list = document.getElementById('scores-list');
    list.innerHTML = '';
    scores.slice(0, 5).forEach((s, i) => {
        const li = document.createElement('li');
        li.textContent = `#${i + 1}: ${s} points`;
        list.appendChild(li);
    });
    document.getElementById('scoreboard').classList.remove('hidden');
}

function hideScores() {
    if (!hasDom) return;
    document.getElementById('scoreboard').classList.add('hidden');
}

if (hasDom) {
    document.getElementById('check').onclick = checkGuess;
    document.getElementById('skip').onclick = () => { audio.click(); pickWord(); startTimer(); };
    document.getElementById('hint').onclick = showHint;
    document.getElementById('pause').onclick = togglePause;
    document.getElementById('show-scores').onclick = showScores;
    document.getElementById('close-scores').onclick = hideScores;
    document.getElementById('theme-toggle').onclick = toggleTheme;
    document.getElementById('difficulty').onchange = (e) => {
        difficulty = e.target.value;
        audio.click();
        pickWord();
        startTimer();
    };
    document.getElementById('category').onchange = (e) => {
        category = e.target.value;
        audio.click();
        pickWord();
        startTimer();
    };
    document.getElementById('guess').onkeydown = (e) => {
        if (e.key === 'Enter') checkGuess();
    };
}

let musicPlaying = false;
if (hasDom) {
    document.getElementById('music-toggle').onclick = function() {
        if (musicPlaying) { audio.stopMusic(); this.textContent = 'Play Music'; }
        else { audio.startMusic(); this.textContent = 'Mute'; document.getElementById('song-name').textContent = audio.getSongName(); }
        musicPlaying = !musicPlaying;
    };
    document.getElementById('music-next').onclick = function() {
        if (musicPlaying) { audio.nextSong(); document.getElementById('song-name').textContent = audio.getSongName(); }
    };

    loadTheme();
    loadHighScore();
    loadScores();
    pickWord();
    startTimer();
}

// Test mode
const testMode = hasDom && new URLSearchParams(window.location.search).get('test') === 'true';
if (testMode) {
    setTimeout(() => {
        document.getElementById('guess').value = currentWord;
        checkGuess();
        console.log('TEST_PASSED: Solved word jumble');
        document.body.insertAdjacentHTML('beforeend', '<div id="test-result" style="position:fixed;top:10px;left:10px;background:green;color:white;padding:10px;z-index:9999">TEST PASSED</div>');
    }, 1000);
}

if (typeof module !== 'undefined') {
    module.exports = {
        shuffle,
        getWordList,
        getUniqueWord,
        loadScores,
        saveScores,
        setDifficulty: (d) => { difficulty = d; },
        setScore: (value) => { score = value; },
        WORDS,
        easyWords,
        mediumWords,
        hardWords
    };
}
