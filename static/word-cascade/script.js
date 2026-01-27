// Word Cascade - Typing Speed Challenge
// Type falling words before they reach the bottom!

// Word database organized by difficulty
const wordDatabase = {
    easy: [
        'cat', 'dog', 'sun', 'moon', 'star', 'tree', 'bird', 'fish', 'book', 'door',
        'lamp', 'ball', 'cake', 'rain', 'snow', 'leaf', 'hand', 'foot', 'head', 'blue',
        'red', 'green', 'hat', 'cup', 'pen', 'key', 'box', 'map', 'bag', 'toy',
        'bed', 'car', 'bus', 'ice', 'egg', 'ant', 'bee', 'owl', 'cow', 'pig',
        'fox', 'hen', 'sky', 'sea', 'day', 'eye', 'ear', 'arm', 'leg', 'run'
    ],
    medium: [
        'apple', 'happy', 'water', 'music', 'garden', 'beach', 'cloud', 'flower',
        'river', 'ocean', 'dream', 'light', 'storm', 'heart', 'smile', 'dance',
        'bread', 'chair', 'table', 'phone', 'watch', 'money', 'world', 'house',
        'sleep', 'night', 'plant', 'earth', 'stone', 'grass', 'sweet', 'fresh',
        'quick', 'smart', 'brave', 'clean', 'quiet', 'round', 'sharp', 'soft',
        'young', 'old', 'north', 'south', 'tiger', 'zebra', 'horse', 'whale',
        'snake', 'eagle', 'pizza', 'pasta', 'juice', 'fruit', 'candy', 'honey'
    ],
    hard: [
        'beautiful', 'adventure', 'chocolate', 'butterfly', 'wonderful', 'fantastic',
        'dangerous', 'important', 'different', 'mountains', 'celebrate', 'discovery',
        'education', 'happiness', 'knowledge', 'mysterious', 'incredible', 'challenge',
        'brilliant', 'excellent', 'fortunate', 'gorgeous', 'hilarious', 'imaginary',
        'legendary', 'marvelous', 'necessary', 'organized', 'practical', 'questions',
        'recognize', 'surrender', 'thousands', 'umbrella', 'vacation', 'whisper',
        'yesterday', 'zeppelin', 'algorithm', 'blueprint', 'crescendo', 'delicious'
    ],
    extreme: [
        'extraordinary', 'sophisticated', 'philosophical', 'revolutionary', 'Mediterranean',
        'congratulations', 'archaeological', 'characteristic', 'discontinuous', 'entrepreneurial',
        'fundamentalist', 'hallucination', 'infrastructure', 'jurisdiction', 'kaleidoscope',
        'meteorological', 'neurological', 'overwhelming', 'pharmaceutical', 'questionnaire',
        'reconnaissance', 'straightforward', 'transformation', 'unbelievable', 'vulnerability',
        'weatherproof', 'xenophobia', 'approximately', 'bureaucratic', 'circumstances'
    ]
};

// Difficulty settings
const difficultySettings = {
    easy: {
        spawnInterval: 2500,
        fallDuration: 6000,
        pointsBase: 50,
        maxWords: 3,
        levelUpWords: 8
    },
    medium: {
        spawnInterval: 2000,
        fallDuration: 5000,
        pointsBase: 100,
        maxWords: 4,
        levelUpWords: 10
    },
    hard: {
        spawnInterval: 1500,
        fallDuration: 4000,
        pointsBase: 150,
        maxWords: 5,
        levelUpWords: 12
    },
    extreme: {
        spawnInterval: 1200,
        fallDuration: 3500,
        pointsBase: 200,
        maxWords: 6,
        levelUpWords: 15
    }
};

// Game state
let score = 0;
let highScore = 0;
let combo = 0;
let maxCombo = 0;
let wordsCaught = 0;
let wordsInLevel = 0;
let level = 1;
let lives = 3;
let difficulty = 'medium';
let gameActive = false;
let fallingWords = [];
let nextWordId = 0;
let spawnInterval = null;
let usedWords = [];

// Audio context
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = type;
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Audio not available
    }
}

function playCorrectSound() {
    // Rising arpeggio for correct answer
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.15, 'sine', 0.12), i * 60);
    });
}

function playWrongSound() {
    playTone(200, 0.3, 'sawtooth', 0.1);
    setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.1), 100);
}

function playComboSound(comboLevel) {
    // Higher pitch for higher combos
    const baseFreq = 600 + (comboLevel * 50);
    playTone(baseFreq, 0.2, 'triangle', 0.1);
    setTimeout(() => playTone(baseFreq * 1.5, 0.15, 'triangle', 0.08), 100);
}

function playLevelUpSound() {
    // Celebratory sound
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.25, 'sine', 0.1), i * 100);
    });
}

function playGameOverSound() {
    const notes = [400, 350, 300, 250];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.3, 'triangle', 0.1), i * 150);
    });
}

// DOM Elements
function getElements() {
    return {
        gameCanvas: document.getElementById('game-canvas'),
        startOverlay: document.getElementById('start-overlay'),
        gameOverOverlay: document.getElementById('game-over-overlay'),
        startBtn: document.getElementById('start-btn'),
        restartBtn: document.getElementById('restart-btn'),
        wordInput: document.getElementById('word-input'),
        scoreEl: document.getElementById('score'),
        wordsCaughtEl: document.getElementById('words-caught'),
        comboEl: document.getElementById('combo'),
        livesEl: document.getElementById('lives'),
        levelEl: document.getElementById('level'),
        progressFill: document.getElementById('progress-fill'),
        highScoreEl: document.getElementById('high-score'),
        finalScoreEl: document.getElementById('final-score'),
        finalWordsEl: document.getElementById('final-words'),
        finalComboEl: document.getElementById('final-combo'),
        messageEl: document.getElementById('message'),
        difficultySelect: document.getElementById('difficulty'),
        themeToggle: document.getElementById('theme-toggle'),
        container: document.querySelector('.container')
    };
}

function loadProgress() {
    if (typeof localStorage !== 'undefined') {
        highScore = Number(localStorage.getItem('wordCascadeHighScore')) || 0;

        const savedDifficulty = localStorage.getItem('wordCascadeDifficulty');
        if (savedDifficulty && difficultySettings[savedDifficulty]) {
            difficulty = savedDifficulty;
            document.getElementById('difficulty').value = difficulty;
        }

        const savedTheme = localStorage.getItem('wordCascadeTheme');
        if (savedTheme === 'light') {
            document.body.classList.add('light');
            document.getElementById('theme-toggle').textContent = 'Dark Mode';
        }
    }
    updateStats();
}

function saveProgress() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordCascadeHighScore', String(highScore));
        localStorage.setItem('wordCascadeDifficulty', difficulty);
    }
}

function updateStats() {
    const els = getElements();
    els.scoreEl.textContent = score;
    els.wordsCaughtEl.textContent = wordsCaught;
    els.comboEl.textContent = combo;
    els.livesEl.textContent = lives;
    els.levelEl.textContent = level;
    els.highScoreEl.textContent = highScore;

    // Update progress bar
    const settings = difficultySettings[difficulty];
    const progress = (wordsInLevel / settings.levelUpWords) * 100;
    els.progressFill.style.width = Math.min(progress, 100) + '%';
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = 'message ' + type;

    // Clear message after delay
    setTimeout(() => {
        if (msg.textContent === text) {
            msg.textContent = '';
            msg.className = 'message';
        }
    }, 2000);
}

function getRandomWord() {
    const words = wordDatabase[difficulty];
    const availableWords = words.filter(w => !usedWords.includes(w));

    if (availableWords.length === 0) {
        usedWords = [];
        return words[Math.floor(Math.random() * words.length)];
    }

    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedWords.push(word);

    // Keep usedWords from growing too large
    if (usedWords.length > words.length / 2) {
        usedWords.shift();
    }

    return word;
}

function calculateFallDuration() {
    const settings = difficultySettings[difficulty];
    // Speed up by 5% per level, minimum 40% of original duration
    const speedMultiplier = Math.max(0.4, 1 - (level - 1) * 0.05);
    return settings.fallDuration * speedMultiplier;
}

function calculateSpawnInterval() {
    const settings = difficultySettings[difficulty];
    // Spawn faster as level increases, minimum 50% of original interval
    const speedMultiplier = Math.max(0.5, 1 - (level - 1) * 0.03);
    return settings.spawnInterval * speedMultiplier;
}

function spawnWord() {
    if (!gameActive) return;

    const settings = difficultySettings[difficulty];

    // Don't spawn if we have too many words on screen
    if (fallingWords.length >= settings.maxWords + Math.floor(level / 2)) {
        return;
    }

    const word = getRandomWord();
    const fallDuration = calculateFallDuration();

    const wordEl = document.createElement('div');
    wordEl.className = 'falling-word';
    wordEl.textContent = word;
    wordEl.dataset.wordId = nextWordId;
    wordEl.dataset.word = word;

    // Calculate position - ensure word fits within canvas
    const canvas = document.getElementById('game-canvas');
    const canvasWidth = canvas.offsetWidth;
    const wordWidth = word.length * 12 + 32; // Approximate width
    const maxLeft = canvasWidth - wordWidth - 10;
    const minLeft = 10;
    wordEl.style.left = Math.floor(Math.random() * (maxLeft - minLeft) + minLeft) + 'px';
    wordEl.style.top = '-50px';

    canvas.appendChild(wordEl);

    const wordData = {
        id: nextWordId++,
        word: word,
        element: wordEl,
        startTime: Date.now(),
        fallDuration: fallDuration
    };

    fallingWords.push(wordData);

    // Animate the word falling
    animateWord(wordData);
}

function animateWord(wordData) {
    const canvas = document.getElementById('game-canvas');
    const canvasHeight = canvas.offsetHeight;
    const startY = -50;
    const endY = canvasHeight + 10;

    function update() {
        if (!wordData.element.parentNode || wordData.caught) {
            return;
        }

        const elapsed = Date.now() - wordData.startTime;
        const progress = elapsed / wordData.fallDuration;

        if (progress >= 1) {
            // Word reached bottom - missed!
            handleMissedWord(wordData);
            return;
        }

        const currentY = startY + (endY - startY) * progress;
        wordData.element.style.top = currentY + 'px';

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function handleMissedWord(wordData) {
    if (wordData.caught || !wordData.element.parentNode) return;

    wordData.element.classList.add('missed');
    playWrongSound();

    lives--;
    combo = 0;

    const container = document.querySelector('.container');
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), 400);

    showMessage(`Missed: "${wordData.word}"`, 'error');

    setTimeout(() => {
        if (wordData.element.parentNode) {
            wordData.element.remove();
        }
        fallingWords = fallingWords.filter(w => w.id !== wordData.id);
    }, 500);

    updateStats();

    if (lives <= 0) {
        gameOver();
    }
}

function calculatePoints(word, combo) {
    const settings = difficultySettings[difficulty];
    let points = settings.pointsBase;

    // Bonus for longer words
    points += word.length * 5;

    // Combo multiplier (up to 3x)
    const comboMultiplier = Math.min(1 + combo * 0.1, 3);
    points = Math.floor(points * comboMultiplier);

    // Level bonus
    points += level * 10;

    return points;
}

function checkWord() {
    const input = document.getElementById('word-input');
    const userWord = input.value.trim().toLowerCase();

    if (!userWord || !gameActive) return;

    // Find matching word that's still falling
    const found = fallingWords.find(w =>
        w.word.toLowerCase() === userWord &&
        w.element.parentNode &&
        !w.caught
    );

    if (found) {
        // Correct!
        found.caught = true;
        found.element.classList.add('caught');

        const points = calculatePoints(found.word, combo);
        score += points;
        combo++;
        wordsCaught++;
        wordsInLevel++;

        if (combo > maxCombo) {
            maxCombo = combo;
        }

        playCorrectSound();

        if (combo >= 3) {
            playComboSound(combo);
            showMessage(`${combo}x Combo! +${points} points!`, 'combo');
        } else {
            showMessage(`+${points} points!`, 'success');
        }

        setTimeout(() => {
            if (found.element.parentNode) {
                found.element.remove();
            }
            fallingWords = fallingWords.filter(w => w.id !== found.id);
        }, 400);

        // Check for level up
        checkLevelUp();

        // Update high score
        if (score > highScore) {
            highScore = score;
        }

        updateStats();
        saveProgress();
    } else {
        // Check if it's a partial match
        const partialMatch = fallingWords.find(w =>
            w.word.toLowerCase().startsWith(userWord) &&
            w.element.parentNode &&
            !w.caught
        );

        if (partialMatch) {
            // Highlight the matching word
            partialMatch.element.classList.add('highlighted');
            setTimeout(() => partialMatch.element.classList.remove('highlighted'), 200);
        } else if (userWord.length >= 2) {
            // Wrong word
            showMessage('No matching word!', 'error');
        }
    }

    input.value = '';
}

function checkLevelUp() {
    const settings = difficultySettings[difficulty];

    if (wordsInLevel >= settings.levelUpWords) {
        level++;
        wordsInLevel = 0;

        playLevelUpSound();
        showMessage(`Level ${level}! Speed increased!`, 'info');

        const container = document.querySelector('.container');
        container.classList.add('level-up');
        setTimeout(() => container.classList.remove('level-up'), 600);

        // Restart spawn interval with new speed
        if (spawnInterval) {
            clearInterval(spawnInterval);
            spawnInterval = setInterval(spawnWord, calculateSpawnInterval());
        }

        updateStats();
    }
}

function startGame() {
    const els = getElements();

    // Reset game state
    score = 0;
    combo = 0;
    maxCombo = 0;
    wordsCaught = 0;
    wordsInLevel = 0;
    level = 1;
    lives = 3;
    fallingWords = [];
    usedWords = [];
    gameActive = true;

    // Clear any existing words
    const existingWords = els.gameCanvas.querySelectorAll('.falling-word');
    existingWords.forEach(w => w.remove());

    // Hide overlays
    els.startOverlay.style.display = 'none';
    els.gameOverOverlay.style.display = 'none';

    // Enable input
    els.wordInput.disabled = false;
    els.wordInput.focus();

    // Disable difficulty change during game
    els.difficultySelect.disabled = true;

    updateStats();

    // Start spawning words
    const settings = difficultySettings[difficulty];
    spawnWord(); // Spawn first word immediately
    spawnInterval = setInterval(spawnWord, settings.spawnInterval);
}

function gameOver() {
    gameActive = false;

    if (spawnInterval) {
        clearInterval(spawnInterval);
        spawnInterval = null;
    }

    playGameOverSound();

    const els = getElements();

    // Disable input
    els.wordInput.disabled = true;

    // Re-enable difficulty selection
    els.difficultySelect.disabled = false;

    // Update final stats
    els.finalScoreEl.textContent = score;
    els.finalWordsEl.textContent = wordsCaught;
    els.finalComboEl.textContent = maxCombo;

    // Show game over overlay
    els.gameOverOverlay.style.display = 'flex';

    // Update high score
    if (score > highScore) {
        highScore = score;
        showMessage('New High Score!', 'combo');
    }

    saveProgress();
    updateStats();
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    document.getElementById('theme-toggle').textContent = isLight ? 'Dark Mode' : 'Light Mode';

    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordCascadeTheme', isLight ? 'light' : 'dark');
    }
}

// Initialize game
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        loadProgress();

        const els = getElements();

        // Start button
        els.startBtn.addEventListener('click', startGame);
        els.restartBtn.addEventListener('click', startGame);

        // Input handling
        els.wordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                checkWord();
            }
        });

        // Also check on input for real-time matching
        els.wordInput.addEventListener('input', function() {
            if (!gameActive) return;

            const userWord = this.value.trim().toLowerCase();

            // Auto-submit if exact match
            const exactMatch = fallingWords.find(w =>
                w.word.toLowerCase() === userWord &&
                w.element.parentNode &&
                !w.caught
            );

            if (exactMatch) {
                checkWord();
            } else {
                // Highlight partial matches
                fallingWords.forEach(w => {
                    if (w.element.parentNode && !w.caught) {
                        if (userWord.length > 0 && w.word.toLowerCase().startsWith(userWord)) {
                            w.element.classList.add('highlighted');
                        } else {
                            w.element.classList.remove('highlighted');
                        }
                    }
                });
            }
        });

        // Difficulty change
        els.difficultySelect.addEventListener('change', function(e) {
            difficulty = e.target.value;
            saveProgress();
        });

        // Theme toggle
        els.themeToggle.addEventListener('click', toggleTheme);

        // Music controls
        if (typeof PianoMusicGenerator !== 'undefined') {
            const musicGen = new PianoMusicGenerator();
            let musicPlaying = false;

            document.getElementById('music-toggle').addEventListener('click', function() {
                if (musicPlaying) {
                    musicGen.stop();
                    this.textContent = 'Play Music';
                    document.getElementById('song-name').textContent = '';
                    musicPlaying = false;
                } else {
                    musicGen.start();
                    this.textContent = 'Mute Music';
                    document.getElementById('song-name').textContent =
                        'Now playing: ' + musicGen.getCurrentSongName();
                    musicPlaying = true;
                }
            });

            document.getElementById('music-next').addEventListener('click', function() {
                if (musicPlaying) {
                    musicGen.nextSong();
                    document.getElementById('song-name').textContent =
                        'Now playing: ' + musicGen.getCurrentSongName();
                }
            });
        }

        // Prevent form submission
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target === els.wordInput) {
                e.preventDefault();
            }
        });

        // Focus input when clicking on game area
        els.gameCanvas.addEventListener('click', function() {
            if (gameActive) {
                els.wordInput.focus();
            }
        });
    });
}
