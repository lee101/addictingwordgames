// Audio context for sound effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Word lists by difficulty
const easyWords = [
    'cat', 'dog', 'run', 'jump', 'play', 'book', 'tree', 'bird', 'fish', 'rain',
    'sun', 'moon', 'star', 'blue', 'red', 'green', 'ball', 'home', 'door', 'hand',
    'foot', 'head', 'eye', 'ear', 'nose', 'milk', 'cake', 'hat', 'cup', 'bed',
    'car', 'bus', 'pen', 'box', 'key', 'map', 'bag', 'top', 'end', 'day',
    'way', 'new', 'old', 'big', 'hot', 'cold', 'good', 'bad', 'fast', 'slow'
];

const mediumWords = [
    'apple', 'banana', 'orange', 'purple', 'yellow', 'garden', 'flower', 'animal',
    'planet', 'ocean', 'river', 'mountain', 'forest', 'desert', 'island', 'castle',
    'bridge', 'window', 'kitchen', 'bedroom', 'picture', 'camera', 'guitar', 'piano',
    'rocket', 'dragon', 'wizard', 'knight', 'princess', 'monster', 'rainbow', 'thunder',
    'winter', 'summer', 'spring', 'autumn', 'morning', 'evening', 'midnight', 'journey',
    'adventure', 'mystery', 'treasure', 'diamond', 'crystal', 'magical', 'ancient', 'modern',
    'fantastic', 'amazing', 'beautiful', 'wonderful', 'excellent', 'brilliant', 'powerful', 'peaceful'
];

const hardWords = [
    'javascript', 'programming', 'algorithm', 'development', 'architecture', 'synchronize',
    'asynchronous', 'encyclopedia', 'revolutionary', 'extraordinary', 'sophisticated',
    'philosophical', 'psychological', 'communication', 'infrastructure', 'authentication',
    'cryptocurrency', 'electromagnetic', 'thermodynamics', 'photosynthesis', 'biodiversity',
    'constellation', 'manifestation', 'contemplation', 'determination', 'administrator',
    'acknowledgment', 'accomplishment', 'comprehensive', 'substantially', 'significantly',
    'characteristic', 'environmental', 'international', 'responsibility', 'unfortunately',
    'collaboration', 'configuration', 'demonstration', 'documentation', 'implementation',
    'optimization', 'transformation', 'visualization', 'recommendation', 'refrigerator'
];

// Game state
let gameState = {
    isPlaying: false,
    score: 0,
    wordsTyped: 0,
    correctChars: 0,
    totalChars: 0,
    currentWordIndex: 0,
    words: [],
    startTime: null,
    timeRemaining: 60,
    timerInterval: null,
    difficulty: 'medium',
    duration: 60
};

// High scores
let highScore = Number(localStorage.getItem('typingRaceHighScore')) || 0;
let highWpm = Number(localStorage.getItem('typingRaceHighWpm')) || 0;

// DOM Elements
const scoreEl = document.getElementById('score');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const timerEl = document.getElementById('timer');
const highScoreEl = document.getElementById('high-score');
const highWpmEl = document.getElementById('high-wpm');
const currentWordEl = document.getElementById('current-word');
const nextWordsEl = document.getElementById('next-words');
const inputField = document.getElementById('input-field');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty');
const durationSelect = document.getElementById('duration');
const typedIndicator = document.getElementById('typed-indicator');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreEl = document.getElementById('final-score');
const finalWpmEl = document.getElementById('final-wpm');
const finalAccuracyEl = document.getElementById('final-accuracy');
const finalWordsEl = document.getElementById('final-words');
const newRecordEl = document.getElementById('new-record');
const playAgainBtn = document.getElementById('play-again-btn');

// Music
let musicGen = null;
let musicPlaying = false;

// Sound effects
function playTone(freq, duration, type = 'sine') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playKeySound() {
    playTone(800 + Math.random() * 200, 0.05, 'sine');
}

function playCorrectWord() {
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.12, 'sine'), i * 50);
    });
}

function playWrongKey() {
    playTone(200, 0.15, 'sawtooth');
}

function playGameOver() {
    const notes = [392, 349.23, 329.63, 293.66];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.3, 'triangle'), i * 150);
    });
}

function playGameStart() {
    const notes = [261.63, 329.63, 392, 523.25];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.15, 'sine'), i * 100);
    });
}

// Get words based on difficulty
function getWordList() {
    switch (gameState.difficulty) {
        case 'easy': return easyWords;
        case 'hard': return hardWords;
        default: return mediumWords;
    }
}

// Generate random words for the game
function generateWords(count = 100) {
    const wordList = getWordList();
    const words = [];
    for (let i = 0; i < count; i++) {
        words.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return words;
}

// Shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Update display
function updateDisplay() {
    const currentWord = gameState.words[gameState.currentWordIndex];
    const inputValue = inputField.value;

    // Render current word with character highlighting
    let html = '';
    for (let i = 0; i < currentWord.length; i++) {
        if (i < inputValue.length) {
            if (inputValue[i] === currentWord[i]) {
                html += `<span class="correct">${currentWord[i]}</span>`;
            } else {
                html += `<span class="incorrect">${currentWord[i]}</span>`;
            }
        } else {
            html += `<span class="pending">${currentWord[i]}</span>`;
        }
    }
    currentWordEl.innerHTML = html;

    // Show next words
    const nextWords = gameState.words.slice(gameState.currentWordIndex + 1, gameState.currentWordIndex + 6);
    nextWordsEl.textContent = nextWords.join(' ');

    // Update stats
    scoreEl.textContent = gameState.score;

    // Calculate WPM
    if (gameState.startTime) {
        const elapsedMinutes = (Date.now() - gameState.startTime) / 60000;
        if (elapsedMinutes > 0) {
            const wpm = Math.round(gameState.wordsTyped / elapsedMinutes);
            wpmEl.textContent = wpm;
        }
    }

    // Calculate accuracy
    if (gameState.totalChars > 0) {
        const accuracy = Math.round((gameState.correctChars / gameState.totalChars) * 100);
        accuracyEl.textContent = accuracy + '%';
    }

    timerEl.textContent = gameState.timeRemaining;

    // Update high scores display
    highScoreEl.textContent = highScore;
    highWpmEl.textContent = highWpm;
}

// Start game
function startGame() {
    gameState.difficulty = difficultySelect.value;
    gameState.duration = parseInt(durationSelect.value);
    gameState.timeRemaining = gameState.duration;
    gameState.isPlaying = true;
    gameState.score = 0;
    gameState.wordsTyped = 0;
    gameState.correctChars = 0;
    gameState.totalChars = 0;
    gameState.currentWordIndex = 0;
    gameState.words = generateWords(200);
    gameState.startTime = Date.now();

    inputField.value = '';
    inputField.disabled = false;
    inputField.focus();

    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    gameOverModal.style.display = 'none';

    playGameStart();
    updateDisplay();
    startTimer();
}

// Start timer
function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        timerEl.textContent = gameState.timeRemaining;

        if (gameState.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

// End game
function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    inputField.disabled = true;

    playGameOver();

    // Calculate final stats
    const elapsedMinutes = gameState.duration / 60;
    const finalWpm = Math.round(gameState.wordsTyped / elapsedMinutes);
    const finalAccuracy = gameState.totalChars > 0
        ? Math.round((gameState.correctChars / gameState.totalChars) * 100)
        : 100;

    // Check for new records
    let isNewRecord = false;
    if (gameState.score > highScore) {
        highScore = gameState.score;
        localStorage.setItem('typingRaceHighScore', String(highScore));
        isNewRecord = true;
    }
    if (finalWpm > highWpm) {
        highWpm = finalWpm;
        localStorage.setItem('typingRaceHighWpm', String(highWpm));
        isNewRecord = true;
    }

    // Show game over modal
    finalScoreEl.textContent = gameState.score;
    finalWpmEl.textContent = finalWpm;
    finalAccuracyEl.textContent = finalAccuracy + '%';
    finalWordsEl.textContent = gameState.wordsTyped;
    newRecordEl.style.display = isNewRecord ? 'block' : 'none';
    gameOverModal.style.display = 'flex';

    updateDisplay();
}

// Handle input
function handleInput(e) {
    if (!gameState.isPlaying) return;

    const inputValue = inputField.value;
    const currentWord = gameState.words[gameState.currentWordIndex];

    // Check if word is complete (space pressed or exact match)
    if (e.data === ' ' || e.inputType === 'insertText' && inputValue.trim() === currentWord) {
        const typedWord = inputValue.trim();

        if (typedWord === currentWord) {
            // Correct word
            gameState.score += currentWord.length * 10;
            gameState.wordsTyped++;
            gameState.correctChars += currentWord.length;
            gameState.totalChars += currentWord.length;
            playCorrectWord();

            // Add visual feedback
            currentWordEl.classList.add('word-complete');
            setTimeout(() => currentWordEl.classList.remove('word-complete'), 200);
        } else {
            // Incorrect word - count characters
            for (let i = 0; i < typedWord.length; i++) {
                gameState.totalChars++;
                if (i < currentWord.length && typedWord[i] === currentWord[i]) {
                    gameState.correctChars++;
                }
            }
            playWrongKey();

            // Add shake animation
            currentWordEl.classList.add('word-error');
            setTimeout(() => currentWordEl.classList.remove('word-error'), 300);
        }

        // Move to next word
        gameState.currentWordIndex++;
        inputField.value = '';

        // Generate more words if needed
        if (gameState.currentWordIndex >= gameState.words.length - 10) {
            gameState.words = gameState.words.concat(generateWords(50));
        }
    } else {
        // Character typed - play key sound
        if (e.inputType === 'insertText') {
            const charIndex = inputValue.length - 1;
            if (charIndex >= 0 && charIndex < currentWord.length) {
                if (inputValue[charIndex] === currentWord[charIndex]) {
                    playKeySound();
                } else {
                    playWrongKey();
                }
            }
        }
    }

    updateDisplay();
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

inputField.addEventListener('input', handleInput);

inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !gameState.isPlaying) {
        startGame();
    }
});

difficultySelect.addEventListener('change', () => {
    gameState.difficulty = difficultySelect.value;
});

durationSelect.addEventListener('change', () => {
    gameState.duration = parseInt(durationSelect.value);
    gameState.timeRemaining = gameState.duration;
    timerEl.textContent = gameState.timeRemaining;
});

// Music controls
document.getElementById('music-toggle').addEventListener('click', function() {
    if (!musicGen) {
        musicGen = new PianoMusicGenerator();
    }

    if (musicPlaying) {
        musicGen.stop();
        this.textContent = '🎵 Play Music';
        document.getElementById('song-name').textContent = '';
        musicPlaying = false;
    } else {
        musicGen.start();
        this.textContent = '🔇 Mute Music';
        document.getElementById('song-name').textContent = musicGen.getCurrentSongName();
        musicPlaying = true;
    }
});

document.getElementById('music-next').addEventListener('click', function() {
    if (musicGen && musicPlaying) {
        musicGen.nextSong();
        document.getElementById('song-name').textContent = musicGen.getCurrentSongName();
    }
});

// Initialize display
updateDisplay();

// Focus input on page load
window.addEventListener('load', () => {
    inputField.focus();
});

// Prevent losing focus during game
inputField.addEventListener('blur', () => {
    if (gameState.isPlaying) {
        setTimeout(() => inputField.focus(), 10);
    }
});

// Export for testing
if (typeof module !== 'undefined') {
    module.exports = {
        easyWords,
        mediumWords,
        hardWords,
        generateWords,
        shuffleArray,
        getWordList,
        gameState
    };
}
