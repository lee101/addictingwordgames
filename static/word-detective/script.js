// Word Detective Game
// Guess the mystery word from its definition

// Word database with definitions organized by difficulty
const wordDatabase = {
    easy: [
        { word: 'apple', definition: 'A round fruit that is typically red, green, or yellow' },
        { word: 'bread', definition: 'A food made from flour, water, and yeast, baked in an oven' },
        { word: 'chair', definition: 'A piece of furniture for one person to sit on' },
        { word: 'dance', definition: 'To move your body rhythmically to music' },
        { word: 'eagle', definition: 'A large bird of prey with a hooked beak' },
        { word: 'flame', definition: 'The visible part of a fire' },
        { word: 'grass', definition: 'Green plants that cover lawns and fields' },
        { word: 'honey', definition: 'Sweet sticky substance made by bees' },
        { word: 'juice', definition: 'Liquid from fruits or vegetables' },
        { word: 'knife', definition: 'A tool with a sharp blade for cutting' },
        { word: 'lemon', definition: 'A yellow citrus fruit with sour taste' },
        { word: 'mouse', definition: 'A small rodent with a long tail' },
        { word: 'night', definition: 'The time when the sun is below the horizon' },
        { word: 'ocean', definition: 'A vast body of salt water' },
        { word: 'piano', definition: 'A large keyboard musical instrument' },
        { word: 'queen', definition: 'A female ruler of a kingdom' },
        { word: 'river', definition: 'A large natural stream of water' },
        { word: 'storm', definition: 'Violent weather with wind, rain, or snow' },
        { word: 'table', definition: 'Furniture with a flat top and legs' },
        { word: 'voice', definition: 'Sound produced when speaking or singing' },
        { word: 'watch', definition: 'A small timepiece worn on the wrist' },
        { word: 'cloud', definition: 'A white or gray mass of water droplets in the sky' },
        { word: 'dream', definition: 'Images and thoughts during sleep' },
        { word: 'earth', definition: 'The planet we live on' },
        { word: 'fruit', definition: 'The sweet part of a plant containing seeds' }
    ],
    medium: [
        { word: 'anchor', definition: 'A heavy device that keeps a ship in place' },
        { word: 'basket', definition: 'A container made of woven material' },
        { word: 'castle', definition: 'A large fortified building from medieval times' },
        { word: 'desert', definition: 'A dry, barren area with little rainfall' },
        { word: 'engine', definition: 'A machine that converts energy into motion' },
        { word: 'forest', definition: 'A large area covered with trees' },
        { word: 'garden', definition: 'An area where flowers and vegetables grow' },
        { word: 'hidden', definition: 'Not visible or not meant to be found' },
        { word: 'island', definition: 'Land completely surrounded by water' },
        { word: 'jacket', definition: 'A short coat worn on the upper body' },
        { word: 'kitten', definition: 'A young cat' },
        { word: 'ladder', definition: 'Equipment with steps for climbing' },
        { word: 'marble', definition: 'A small glass ball used in games, or a type of stone' },
        { word: 'nature', definition: 'The physical world including plants and animals' },
        { word: 'orange', definition: 'A round citrus fruit, or a color' },
        { word: 'pencil', definition: 'A writing tool with graphite inside' },
        { word: 'quiver', definition: 'To shake with small rapid movements' },
        { word: 'rocket', definition: 'A vehicle that travels into space' },
        { word: 'shadow', definition: 'A dark area where light is blocked' },
        { word: 'temple', definition: 'A building for religious worship' },
        { word: 'unique', definition: 'Being the only one of its kind' },
        { word: 'velvet', definition: 'A soft fabric with a thick pile' },
        { word: 'whisper', definition: 'To speak very quietly' },
        { word: 'yellow', definition: 'The color of the sun or bananas' },
        { word: 'zigzag', definition: 'A line with sharp turns left and right' }
    ],
    hard: [
        { word: 'abundant', definition: 'Existing in large quantities; plentiful' },
        { word: 'bachelor', definition: 'An unmarried man' },
        { word: 'calendar', definition: 'A system showing days, weeks, and months' },
        { word: 'delicate', definition: 'Easily broken or damaged; fragile' },
        { word: 'eloquent', definition: 'Fluent and persuasive in speech or writing' },
        { word: 'fragment', definition: 'A small part broken off from something' },
        { word: 'grateful', definition: 'Feeling thankful for something' },
        { word: 'hesitate', definition: 'To pause before doing something' },
        { word: 'innocent', definition: 'Not guilty of a crime; pure' },
        { word: 'jealousy', definition: 'Feeling envious of someone else' },
        { word: 'keyboard', definition: 'A panel of keys for typing or playing music' },
        { word: 'labyrinth', definition: 'A complex maze or network of passages' },
        { word: 'magnetic', definition: 'Having the properties of a magnet' },
        { word: 'negotiate', definition: 'To discuss to reach an agreement' },
        { word: 'obsidian', definition: 'A dark volcanic glass' },
        { word: 'paragraph', definition: 'A section of text on one topic' },
        { word: 'quarantine', definition: 'Isolation to prevent disease spread' },
        { word: 'rebellion', definition: 'An uprising against authority' },
        { word: 'sanctuary', definition: 'A place of safety or protection' },
        { word: 'telegraph', definition: 'A system for sending messages over distances' },
        { word: 'umbrella', definition: 'A device for protection from rain' },
        { word: 'vegetable', definition: 'An edible plant or part of a plant' },
        { word: 'wanderlust', definition: 'A strong desire to travel' },
        { word: 'xylophone', definition: 'A musical instrument with wooden bars' },
        { word: 'yesterday', definition: 'The day before today' }
    ]
};

// Game state
let currentWord = '';
let currentDefinition = '';
let revealedLetters = [];
let attempts = 0;
let maxAttempts = 6;
let score = 0;
let highScore = 0;
let streak = 0;
let difficulty = 'medium';
let usedWords = [];

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
        setTimeout(() => playTone(f, 0.2), i * 80);
    });
}

function playWrongSound() {
    playTone(200, 0.3, 'sawtooth');
}

function playHintSound() {
    playTone(440, 0.15, 'triangle');
    setTimeout(() => playTone(550, 0.15, 'triangle'), 100);
}

function playRevealSound() {
    [392, 440, 494].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.1, 'sine'), i * 50);
    });
}

// Load/save functions
function loadProgress() {
    if (typeof localStorage !== 'undefined') {
        highScore = Number(localStorage.getItem('wordDetectiveHighScore')) || 0;
        score = Number(localStorage.getItem('wordDetectiveScore')) || 0;
        streak = Number(localStorage.getItem('wordDetectiveStreak')) || 0;
        const savedDifficulty = localStorage.getItem('wordDetectiveDifficulty');
        if (savedDifficulty) {
            difficulty = savedDifficulty;
            document.getElementById('difficulty').value = difficulty;
        }
        const savedTheme = localStorage.getItem('wordDetectiveTheme');
        if (savedTheme === 'light') {
            document.body.classList.add('light');
            document.getElementById('theme-toggle').textContent = 'Dark Mode';
        }
    }
    updateStats();
}

function saveProgress() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordDetectiveHighScore', String(highScore));
        localStorage.setItem('wordDetectiveScore', String(score));
        localStorage.setItem('wordDetectiveStreak', String(streak));
        localStorage.setItem('wordDetectiveDifficulty', difficulty);
    }
}

function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('high-score').textContent = highScore;
    document.getElementById('streak').textContent = streak;
    document.getElementById('attempts').textContent = `${attempts} / ${maxAttempts}`;
}

// Get a random word that hasn't been used recently
function getRandomWord() {
    const words = wordDatabase[difficulty];
    const availableWords = words.filter(w => !usedWords.includes(w.word));

    // Reset used words if we've seen them all
    if (availableWords.length === 0) {
        usedWords = [];
        return words[Math.floor(Math.random() * words.length)];
    }

    return availableWords[Math.floor(Math.random() * availableWords.length)];
}

// Setup a new word
function newWord() {
    const wordData = getRandomWord();
    currentWord = wordData.word.toLowerCase();
    currentDefinition = wordData.definition;
    usedWords.push(currentWord);

    // Keep only last 10 words in memory
    if (usedWords.length > 10) {
        usedWords.shift();
    }

    // Reset game state for new word
    revealedLetters = new Array(currentWord.length).fill(false);
    revealedLetters[0] = true; // Always reveal first letter
    attempts = 0;

    // Update display
    document.getElementById('definition').textContent = currentDefinition;
    renderWordDisplay();
    updateStats();
    clearMessage();
    document.getElementById('guess').value = '';
    document.getElementById('guess').focus();
    document.getElementById('hint-btn').disabled = false;
}

// Render the word display with letter boxes
function renderWordDisplay() {
    const container = document.getElementById('word-display');
    container.innerHTML = '';

    for (let i = 0; i < currentWord.length; i++) {
        const box = document.createElement('div');
        box.className = 'letter-box';

        if (revealedLetters[i]) {
            box.textContent = currentWord[i].toUpperCase();
            if (i === 0) {
                box.classList.add('first');
            } else {
                box.classList.add('hint');
            }
        } else {
            box.textContent = '_';
        }

        container.appendChild(box);
    }
}

// Reveal all letters with animation
function revealAllLetters() {
    const container = document.getElementById('word-display');
    const boxes = container.querySelectorAll('.letter-box');

    boxes.forEach((box, i) => {
        setTimeout(() => {
            box.textContent = currentWord[i].toUpperCase();
            box.classList.add('revealed');
            playRevealSound();
        }, i * 100);
    });
}

// Use a hint to reveal a random unrevealed letter
function useHint() {
    // Find unrevealed letters
    const unrevealedIndices = [];
    for (let i = 0; i < revealedLetters.length; i++) {
        if (!revealedLetters[i]) {
            unrevealedIndices.push(i);
        }
    }

    if (unrevealedIndices.length === 0) {
        showMessage('All letters revealed!', 'info');
        return;
    }

    // Reveal a random unrevealed letter
    const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    revealedLetters[randomIndex] = true;

    // Deduct points
    score = Math.max(0, score - 10);

    playHintSound();
    renderWordDisplay();
    updateStats();
    saveProgress();

    // Disable hint if all letters revealed
    const stillHidden = revealedLetters.filter(r => !r).length;
    if (stillHidden === 0) {
        document.getElementById('hint-btn').disabled = true;
    }

    showMessage(`Hint used! -10 points. ${stillHidden} letters remaining.`, 'info');
}

// Check the player's guess
function checkGuess() {
    const guessInput = document.getElementById('guess');
    const guess = guessInput.value.trim().toLowerCase();

    if (!guess) {
        showMessage('Please enter a guess!', 'error');
        return;
    }

    attempts++;
    updateStats();

    if (guess === currentWord) {
        // Correct guess!
        const pointsEarned = calculatePoints();
        score += pointsEarned;
        streak++;

        if (score > highScore) {
            highScore = score;
        }

        playCorrectSound();
        revealAllLetters();

        const container = document.getElementById('word-display');
        container.classList.add('celebrate');
        setTimeout(() => container.classList.remove('celebrate'), 500);

        showMessage(`Correct! +${pointsEarned} points!`, 'success');
        saveProgress();
        updateStats();

        // Load next word after delay
        setTimeout(() => {
            newWord();
        }, 2000);

    } else {
        // Wrong guess
        playWrongSound();

        const container = document.getElementById('word-display');
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 400);

        if (attempts >= maxAttempts) {
            // Game over for this word
            streak = 0;
            showMessage(`Out of attempts! The word was "${currentWord.toUpperCase()}"`, 'error');
            revealAllLetters();
            saveProgress();
            updateStats();

            setTimeout(() => {
                newWord();
            }, 3000);
        } else {
            const remaining = maxAttempts - attempts;
            showMessage(`Wrong! ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`, 'error');
        }
    }

    guessInput.value = '';
    guessInput.focus();
}

// Calculate points based on attempts and hints used
function calculatePoints() {
    const basePoints = { easy: 50, medium: 100, hard: 200 }[difficulty];
    const attemptBonus = Math.max(0, (maxAttempts - attempts) * 10);
    const hintsUsed = revealedLetters.filter(r => r).length - 1; // -1 for first letter
    const hintPenalty = hintsUsed * 5;
    const streakBonus = Math.min(streak * 5, 50); // Cap streak bonus at 50

    return Math.max(10, basePoints + attemptBonus - hintPenalty + streakBonus);
}

// Skip current word
function skipWord() {
    streak = 0;
    showMessage(`Skipped! The word was "${currentWord.toUpperCase()}"`, 'info');
    revealAllLetters();
    saveProgress();
    updateStats();

    setTimeout(() => {
        newWord();
    }, 2000);
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
        localStorage.setItem('wordDetectiveTheme', isLight ? 'light' : 'dark');
    }
}

// Initialize game
if (typeof window !== 'undefined') {
    // Load saved progress
    loadProgress();

    // Start first word
    newWord();

    // Event listeners
    document.getElementById('submit-btn').addEventListener('click', checkGuess);
    document.getElementById('guess').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkGuess();
        }
    });
    document.getElementById('hint-btn').addEventListener('click', useHint);
    document.getElementById('skip-btn').addEventListener('click', skipWord);
    document.getElementById('difficulty').addEventListener('change', (e) => {
        difficulty = e.target.value;
        saveProgress();
        newWord();
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
