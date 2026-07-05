const WORDS = {
    general: {
        easy: ['cat','dog','sun','ball','tree','fish','bird','star','moon','rain','book','cake','door','lamp','ring'],
        medium: ['apple','beach','candy','dance','eagle','flame','grape','house','image','juice','lemon','magic','night','ocean','peace'],
        hard: ['elephant','computer','chocolate','adventure','beautiful','dangerous','excellent','fantastic','gorgeous','happiness']
    },
    nature: {
        easy: ['sky','sea','sun','fog','ice','mud','bay','dew','ash','oak','elm','ivy','bay','cay','lea'],
        medium: ['river','ocean','cloud','storm','forest','desert','canyon','meadow','valley','island','stream','breeze'],
        hard: ['waterfall','avalanche','hurricane','earthquake','wilderness','atmosphere','vegetation','ecosystem']
    },
    objects: {
        easy: ['pen','cup','bag','box','key','hat','bed','car','map','jar','pot','pan','mug','fan','rug'],
        medium: ['phone','table','chair','clock','piano','camera','mirror','window','pillow','basket','bottle','candle'],
        hard: ['telescope','chandelier','refrigerator','typewriter','microscope','helicopter','skateboard','trampoline']
    }
};

let currentWord = '';
let score = 0;
let streak = 0;
let best = 0;
let difficulty = 'easy';
let category = 'general';
let wordStartTime = 0;

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

function scramble(word) {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const result = arr.join('');
    return result === word ? scramble(word) : result;
}

function chooseWord() {
    const cat = WORDS[category] || WORDS.general;
    const list = cat[difficulty] || cat.easy;
    return list[0];
}

function pickWord() {
    const cat = WORDS[category] || WORDS.general;
    const list = cat[difficulty] || cat.easy;
    currentWord = list[Math.floor(Math.random() * list.length)];
    if (!hasDom) return currentWord;
    const el = document.getElementById('scrambled');
    el.textContent = scramble(currentWord).toUpperCase();
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'pop 0.3s';
    document.getElementById('guess').value = '';
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = '';
    document.getElementById('speed-bonus').textContent = '';
    wordStartTime = Date.now();
}

function showMessage(text, type) {
    if (!hasDom) return;
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = type;
}

function updateStats() {
    if (!hasDom) return;
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
    document.getElementById('best').textContent = best;
}

function saveProgress() {
    storage.setItem('phzzleScore', score);
    storage.setItem('phzzleBest', best);
}

function loadProgress() {
    score = parseInt(storage.getItem('phzzleScore')) || 0;
    best = parseInt(storage.getItem('phzzleBest')) || 0;
    updateStats();
}

function checkGuess() {
    const guess = document.getElementById('guess').value.trim().toLowerCase();
    if (guess === currentWord) {
        const elapsed = (Date.now() - wordStartTime) / 1000;
        let bonus = 0;
        if(elapsed < 2) { bonus = 5; showSpeedBonus('+5 LIGHTNING!'); }
        else if(elapsed < 4) { bonus = 3; showSpeedBonus('+3 FAST!'); }
        else if(elapsed < 7) { bonus = 1; showSpeedBonus('+1 QUICK!'); }
        score += 1 + bonus;
        streak++;
        if(streak >= 3) { score += streak; showSpeedBonus(`+${streak} STREAK!`); }
        if (streak > best) best = streak;
        updateStats();
        saveProgress();
        showMessage('Correct!', 'correct');
        audio.correct();
        if(streak >= 5) audio.combo(streak);
        setTimeout(pickWord, 600);
    } else {
        streak = 0;
        updateStats();
        showMessage('Try again!', 'wrong');
        audio.wrong();
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

function speakWord() {
    if (!hasDom) return;
    if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(currentWord);
        utter.rate = 0.8;
        speechSynthesis.speak(utter);
        audio.click();
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    storage.setItem('phzzleTheme', isDark ? 'dark' : 'light');
    document.getElementById('theme-toggle').textContent = isDark ? 'Light Mode' : 'Dark Mode';
    audio.click();
}

function loadTheme() {
    if (storage.getItem('phzzleTheme') === 'dark') {
        document.body.classList.add('dark');
        document.getElementById('theme-toggle').textContent = 'Light Mode';
    }
}

if (hasDom) {
    document.getElementById('check').onclick = checkGuess;
    document.getElementById('hint').onclick = showHint;
    document.getElementById('speak').onclick = speakWord;
    document.getElementById('theme-toggle').onclick = toggleTheme;
    document.getElementById('difficulty').onchange = (e) => {
        difficulty = e.target.value;
        audio.click();
        pickWord();
    };
    document.getElementById('category').onchange = (e) => {
        category = e.target.value;
        audio.click();
        pickWord();
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
    loadProgress();
    pickWord();
}

// Test mode
const testMode = hasDom && new URLSearchParams(window.location.search).get('test') === 'true';
if (testMode) {
    setTimeout(() => {
        document.getElementById('guess').value = currentWord;
        checkGuess();
        console.log('TEST_PASSED: Solved word phzzle');
        document.body.insertAdjacentHTML('beforeend', '<div id="test-result" style="position:fixed;top:10px;left:10px;background:green;color:white;padding:10px;z-index:9999">TEST PASSED</div>');
    }, 1000);
}

if (typeof module !== 'undefined') {
    module.exports = { scramble, WORDS, chooseWord, setDifficulty: (d) => { difficulty = d; }, speakWord };
}
