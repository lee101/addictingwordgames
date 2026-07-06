// Speed Speller Game
// Listen to words being spoken and type them correctly as fast as possible

// Word database organized by difficulty
const wordDatabase = {
    easy: [
        'cat', 'dog', 'sun', 'hat', 'map', 'pen', 'cup', 'bed', 'box', 'key',
        'ice', 'egg', 'ant', 'owl', 'pie', 'car', 'bus', 'top', 'net', 'jam',
        'bat', 'fan', 'leg', 'arm', 'eye', 'ear', 'toe', 'red', 'big', 'hot',
        'run', 'sit', 'eat', 'see', 'say', 'ask', 'try', 'let', 'put', 'get',
        'moon', 'star', 'tree', 'rain', 'snow', 'fish', 'bird', 'frog', 'bear', 'lion'
    ],
    medium: [
        'apple', 'happy', 'water', 'money', 'music', 'paper', 'table', 'chair', 'plant', 'river',
        'beach', 'cloud', 'dream', 'friend', 'garden', 'heaven', 'island', 'jungle', 'kitten', 'laptop',
        'marble', 'nature', 'orange', 'pepper', 'puzzle', 'rabbit', 'silent', 'ticket', 'umbrella', 'velvet',
        'whisper', 'yellow', 'zipper', 'blanket', 'captain', 'dolphin', 'elephant', 'factory', 'grammar', 'horizon',
        'imagine', 'journey', 'kitchen', 'lantern', 'monster', 'nothing', 'observe', 'perfect', 'quickly', 'rainbow'
    ],
    hard: [
        'absolutely', 'background', 'calculator', 'dangerous', 'electricity', 'fascinating', 'government', 'horizontal', 'incredible', 'journalism',
        'knowledge', 'laboratory', 'magnificent', 'neighborhood', 'opportunity', 'philosophy', 'quarterback', 'restaurant', 'sophisticated', 'technology',
        'understand', 'vocabulary', 'wilderness', 'xylophone', 'yesterday', 'accomplish', 'beautiful', 'celebrate', 'democracy', 'experiment',
        'friendship', 'gratitude', 'happiness', 'impossible', 'javascript', 'kindness', 'literature', 'mysterious', 'navigation', 'orchestra',
        'parliament', 'quarantine', 'revolution', 'strawberry', 'thunderstorm', 'universe', 'vegetable', 'wonderful', 'extraordinary', 'psychology'
    ]
};

// Game configuration
const difficultySettings = {
    easy: { timeLimit: 15000, pointsBase: 50, hintLetters: 2 },
    medium: { timeLimit: 10000, pointsBase: 100, hintLetters: 1 },
    hard: { timeLimit: 7000, pointsBase: 200, hintLetters: 0 }
};

const speechRates = {
    slow: 0.7,
    normal: 0.9,
    fast: 1.1
};

// Game state
let currentWord = '';
let score = 0;
let highScore = 0;
let streak = 0;
let lives = 3;
let difficulty = 'medium';
let speechRate = 'normal';
let usedWords = [];
let gameActive = false;
let timerInterval = null;
let startTime = 0;
let timeRemaining = 0;
let wordsTyped = 0;
let totalTypingTime = 0;

// Audio context for sound effects
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone(freq, duration, type = 'sine') {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = type;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Audio not available
    }
}

function playCorrectSound() {
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.2), i * 60);
    });
}

function playWrongSound() {
    playTone(200, 0.4, 'sawtooth');
}

function playTickSound() {
    playTone(800, 0.05, 'square');
}

function playStartSound() {
    [392, 494, 587].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.15, 'triangle'), i * 80);
    });
}

function playGameOverSound() {
    [440, 370, 311, 262].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.3, 'sawtooth'), i * 200);
    });
}

// Check if Speech Synthesis is available
function isSpeechAvailable() {
    return 'speechSynthesis' in window;
}

// Speak a word using the Web Speech API
function speakWord(word, callback) {
    if (!isSpeechAvailable()) {
        showMessage('Speech not supported in this browser!', 'error');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = speechRates[speechRate];
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a clear English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) ||
                         voices.find(v => v.lang.startsWith('en-')) ||
                         voices[0];
    if (englishVoice) {
        utterance.voice = englishVoice;
    }

    utterance.onend = callback;
    utterance.onerror = () => {
        showMessage('Error playing audio', 'error');
        if (callback) callback();
    };

    window.speechSynthesis.speak(utterance);
}

// Load/save functions
function loadProgress() {
    if (typeof localStorage !== 'undefined') {
        highScore = Number(localStorage.getItem('speedSpellerHighScore')) || 0;
        const savedDifficulty = localStorage.getItem('speedSpellerDifficulty');
        if (savedDifficulty) {
            difficulty = savedDifficulty;
            document.getElementById('difficulty').value = difficulty;
        }
        const savedSpeed = localStorage.getItem('speedSpellerSpeed');
        if (savedSpeed) {
            speechRate = savedSpeed;
            document.getElementById('speed').value = speechRate;
        }
        const savedTheme = localStorage.getItem('speedSpellerTheme');
        if (savedTheme === 'light') {
            document.body.classList.add('light');
            document.getElementById('theme-toggle').textContent = 'Dark Mode';
        }
    }
    updateStats();
}

function saveProgress() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('speedSpellerHighScore', String(highScore));
        localStorage.setItem('speedSpellerDifficulty', difficulty);
        localStorage.setItem('speedSpellerSpeed', speechRate);
    }
}

function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('high-score').textContent = highScore;
    document.getElementById('streak').textContent = streak;

    // Calculate WPM
    const wpm = totalTypingTime > 0 ? Math.round((wordsTyped / (totalTypingTime / 60000))) : 0;
    document.getElementById('wpm').textContent = wpm;

    // Update lives display
    updateLivesDisplay();
}

function updateLivesDisplay() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart' + (i < lives ? '' : ' lost');
        heart.innerHTML = '&#10084;';
        livesContainer.appendChild(heart);
    }
}

// Get a random word that hasn't been used recently
function getRandomWord() {
    const words = wordDatabase[difficulty];
    const availableWords = words.filter(w => !usedWords.includes(w));

    // Reset used words if we've seen them all
    if (availableWords.length === 0) {
        usedWords = [];
        return words[Math.floor(Math.random() * words.length)];
    }

    return availableWords[Math.floor(Math.random() * availableWords.length)];
}

// Generate hint based on difficulty
function generateHint(word) {
    const settings = difficultySettings[difficulty];
    if (settings.hintLetters === 0) {
        return `${word.length} letters`;
    }

    const hint = word.substring(0, settings.hintLetters) + '_'.repeat(word.length - settings.hintLetters);
    return hint.split('').join(' ');
}

// Start the timer
function startTimer() {
    const settings = difficultySettings[difficulty];
    timeRemaining = settings.timeLimit;
    startTime = Date.now();

    const timerFill = document.getElementById('timer-fill');
    timerFill.style.width = '100%';
    timerFill.classList.remove('warning', 'danger');

    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timeRemaining = Math.max(0, settings.timeLimit - elapsed);
        const percentage = (timeRemaining / settings.timeLimit) * 100;

        timerFill.style.width = percentage + '%';

        // Color changes based on time remaining
        if (percentage <= 25) {
            timerFill.classList.add('danger');
            timerFill.classList.remove('warning');
        } else if (percentage <= 50) {
            timerFill.classList.add('warning');
            timerFill.classList.remove('danger');
        }

        // Tick sound for last 3 seconds
        if (timeRemaining <= 3000 && timeRemaining > 0 && Math.floor(timeRemaining / 1000) !== Math.floor((timeRemaining + 100) / 1000)) {
            playTickSound();
        }

        if (timeRemaining <= 0) {
            timeUp();
        }
    }, 50);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Time's up!
function timeUp() {
    stopTimer();
    gameActive = false;

    playWrongSound();
    lives--;
    streak = 0;

    const container = document.querySelector('.game-area');
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), 400);

    showMessage(`Time's up! The word was "${currentWord}"`, 'error');
    updateStats();

    if (lives <= 0) {
        gameOver();
    } else {
        // Enable play button for next word
        setTimeout(() => {
            resetForNextWord();
        }, 2000);
    }
}

// Setup a new word
function newWord() {
    currentWord = getRandomWord();
    usedWords.push(currentWord);

    // Keep only last 15 words in memory
    if (usedWords.length > 15) {
        usedWords.shift();
    }

    // Update hint display
    document.getElementById('word-hint').textContent = generateHint(currentWord);

    // Clear input
    document.getElementById('guess').value = '';
    document.getElementById('guess').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('replay-word').disabled = true;

    clearMessage();

    // Reset timer display
    const timerFill = document.getElementById('timer-fill');
    timerFill.style.width = '100%';
    timerFill.classList.remove('warning', 'danger');
}

function resetForNextWord() {
    document.getElementById('play-word').disabled = false;
    document.getElementById('replay-word').disabled = true;
    document.getElementById('guess').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    clearMessage();
    newWord();
}

// Play the current word
function playCurrentWord() {
    if (!currentWord) {
        newWord();
    }

    document.getElementById('play-word').disabled = true;

    playStartSound();

    speakWord(currentWord, () => {
        // After speaking, enable input and start timer
        gameActive = true;
        document.getElementById('guess').disabled = false;
        document.getElementById('submit-btn').disabled = false;
        document.getElementById('replay-word').disabled = false;
        document.getElementById('guess').focus();
        startTimer();
    });
}

// Replay the current word (costs time)
function replayWord() {
    if (!gameActive || !currentWord) return;

    // Add time penalty for replay
    startTime -= 1500; // 1.5 second penalty

    speakWord(currentWord, () => {
        document.getElementById('guess').focus();
    });
}

// Check the player's guess
function checkGuess() {
    if (!gameActive) return;

    const guessInput = document.getElementById('guess');
    const guess = guessInput.value.trim().toLowerCase();

    if (!guess) {
        showMessage('Please type the word!', 'error');
        return;
    }

    stopTimer();
    gameActive = false;

    const typingTime = Date.now() - startTime;

    if (guess === currentWord.toLowerCase()) {
        // Correct guess!
        const pointsEarned = calculatePoints(typingTime);
        score += pointsEarned;
        streak++;
        wordsTyped++;
        totalTypingTime += typingTime;

        if (score > highScore) {
            highScore = score;
        }

        playCorrectSound();

        const container = document.querySelector('.game-area');
        container.classList.add('celebrate');
        setTimeout(() => container.classList.remove('celebrate'), 500);

        showMessage(`Correct! +${pointsEarned} points! (${(typingTime / 1000).toFixed(1)}s)`, 'success');
        saveProgress();
        updateStats();

        // Load next word after delay
        setTimeout(() => {
            resetForNextWord();
        }, 1500);

    } else {
        // Wrong guess
        playWrongSound();
        lives--;
        streak = 0;

        const container = document.querySelector('.game-area');
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 400);

        showMessage(`Wrong! The word was "${currentWord}"`, 'error');
        saveProgress();
        updateStats();

        if (lives <= 0) {
            gameOver();
        } else {
            setTimeout(() => {
                resetForNextWord();
            }, 2000);
        }
    }

    guessInput.value = '';
}

// Calculate points based on time taken
function calculatePoints(typingTime) {
    const settings = difficultySettings[difficulty];
    const basePoints = settings.pointsBase;

    // Time bonus: faster typing = more points
    const timeRatio = 1 - (typingTime / settings.timeLimit);
    const timeBonus = Math.floor(basePoints * timeRatio * 0.5);

    // Streak bonus
    const streakBonus = Math.min(streak * 10, 100);

    // Word length bonus
    const lengthBonus = currentWord.length * 2;

    return Math.max(10, basePoints + timeBonus + streakBonus + lengthBonus);
}

// Game over
function gameOver() {
    playGameOverSound();

    showMessage(`Game Over! Final Score: ${score}`, 'error');

    document.getElementById('play-word').disabled = true;
    document.getElementById('replay-word').disabled = true;
    document.getElementById('guess').disabled = true;
    document.getElementById('submit-btn').disabled = true;

    // Reset game after delay
    setTimeout(() => {
        resetGame();
    }, 3000);
}

// Reset the game
function resetGame() {
    score = 0;
    streak = 0;
    lives = 3;
    wordsTyped = 0;
    totalTypingTime = 0;
    usedWords = [];
    gameActive = false;

    updateStats();
    resetForNextWord();
    showMessage('New game! Click "Play Word" to start.', 'info');
}

// Show message to player
function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = 'message ' + type;
}

function clearMessage() {
    const msg = document.getElementById('message');
    msg.textContent = '';
    msg.className = 'message';
}

// Toggle theme
function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    document.getElementById('theme-toggle').textContent = isLight ? 'Dark Mode' : 'Light Mode';

    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('speedSpellerTheme', isLight ? 'light' : 'dark');
    }
}

// Initialize game
if (typeof window !== 'undefined') {
    // Load voices (needed for some browsers)
    if (isSpeechAvailable()) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }

    // Load saved progress
    loadProgress();

    // Setup initial word
    newWord();
    showMessage('Click "Play Word" to start!', 'info');

    // Event listeners
    document.getElementById('play-word').addEventListener('click', playCurrentWord);
    document.getElementById('replay-word').addEventListener('click', replayWord);
    document.getElementById('submit-btn').addEventListener('click', checkGuess);
    document.getElementById('guess').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkGuess();
        }
    });

    document.getElementById('difficulty').addEventListener('change', (e) => {
        difficulty = e.target.value;
        saveProgress();
        if (!gameActive) {
            newWord();
        }
    });

    document.getElementById('speed').addEventListener('change', (e) => {
        speechRate = e.target.value;
        saveProgress();
    });

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Music controls
    const musicGen = new PianoMusicGenerator();
    let musicPlaying = false;

    document.getElementById('music-toggle').addEventListener('click', function() {
        if (musicPlaying) {
            musicGen.stop();
            this.textContent = 'Play Music';
            musicPlaying = false;
        } else {
            musicGen.start();
            this.textContent = 'Mute Music';
            document.getElementById('song-name').textContent = `Now playing: ${musicGen.getCurrentSongName()}`;
            musicPlaying = true;
        }
    });

    document.getElementById('music-next').addEventListener('click', function() {
        if (musicPlaying) {
            musicGen.nextSong();
            document.getElementById('song-name').textContent = `Now playing: ${musicGen.getCurrentSongName()}`;
        }
    });
}

// Export for testing
if (typeof module !== 'undefined') {
    module.exports = {
        getRandomWord,
        calculatePoints,
        wordDatabase
    };
}
