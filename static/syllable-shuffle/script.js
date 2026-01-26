// Syllable Shuffle Game
// Reassemble scrambled syllables to form valid words

// Word database with syllable breakdowns and hints
const wordDatabase = {
    easy: [
        { word: 'apple', syllables: ['ap', 'ple'], hint: 'A round fruit, often red or green' },
        { word: 'water', syllables: ['wa', 'ter'], hint: 'Essential liquid for life' },
        { word: 'happy', syllables: ['hap', 'py'], hint: 'Feeling of joy' },
        { word: 'baby', syllables: ['ba', 'by'], hint: 'A very young child' },
        { word: 'candy', syllables: ['can', 'dy'], hint: 'Sweet treat' },
        { word: 'monkey', syllables: ['mon', 'key'], hint: 'Primate that loves bananas' },
        { word: 'tiger', syllables: ['ti', 'ger'], hint: 'Striped big cat' },
        { word: 'robot', syllables: ['ro', 'bot'], hint: 'Mechanical helper' },
        { word: 'paper', syllables: ['pa', 'per'], hint: 'Used for writing' },
        { word: 'music', syllables: ['mu', 'sic'], hint: 'Art of sound' },
        { word: 'garden', syllables: ['gar', 'den'], hint: 'Where flowers grow' },
        { word: 'silver', syllables: ['sil', 'ver'], hint: 'Precious metal, color' },
        { word: 'funny', syllables: ['fun', 'ny'], hint: 'Makes you laugh' },
        { word: 'sunny', syllables: ['sun', 'ny'], hint: 'Bright weather' },
        { word: 'window', syllables: ['win', 'dow'], hint: 'Glass opening in a wall' },
        { word: 'purple', syllables: ['pur', 'ple'], hint: 'Color mixing red and blue' },
        { word: 'button', syllables: ['but', 'ton'], hint: 'Fastener on clothing' },
        { word: 'kitten', syllables: ['kit', 'ten'], hint: 'Baby cat' },
        { word: 'rabbit', syllables: ['rab', 'bit'], hint: 'Animal with long ears' },
        { word: 'pencil', syllables: ['pen', 'cil'], hint: 'Writing tool with graphite' },
        { word: 'picnic', syllables: ['pic', 'nic'], hint: 'Outdoor meal' },
        { word: 'basket', syllables: ['bas', 'ket'], hint: 'Container for carrying things' },
        { word: 'planet', syllables: ['plan', 'et'], hint: 'Body orbiting a star' },
        { word: 'lemon', syllables: ['lem', 'on'], hint: 'Sour yellow fruit' },
        { word: 'melon', syllables: ['mel', 'on'], hint: 'Large sweet fruit' }
    ],
    medium: [
        { word: 'adventure', syllables: ['ad', 'ven', 'ture'], hint: 'Exciting experience' },
        { word: 'beautiful', syllables: ['beau', 'ti', 'ful'], hint: 'Pleasing to look at' },
        { word: 'butterfly', syllables: ['but', 'ter', 'fly'], hint: 'Colorful flying insect' },
        { word: 'calendar', syllables: ['cal', 'en', 'dar'], hint: 'Shows days and months' },
        { word: 'celebrate', syllables: ['cel', 'e', 'brate'], hint: 'Mark a special occasion' },
        { word: 'chocolate', syllables: ['choc', 'o', 'late'], hint: 'Sweet treat from cocoa' },
        { word: 'computer', syllables: ['com', 'pu', 'ter'], hint: 'Electronic device for work' },
        { word: 'dinosaur', syllables: ['di', 'no', 'saur'], hint: 'Extinct giant reptile' },
        { word: 'elephant', syllables: ['el', 'e', 'phant'], hint: 'Large animal with trunk' },
        { word: 'fantastic', syllables: ['fan', 'tas', 'tic'], hint: 'Amazing or wonderful' },
        { word: 'hamburger', syllables: ['ham', 'bur', 'ger'], hint: 'Popular sandwich' },
        { word: 'hospital', syllables: ['hos', 'pi', 'tal'], hint: 'Place for medical care' },
        { word: 'important', syllables: ['im', 'por', 'tant'], hint: 'Having great significance' },
        { word: 'kangaroo', syllables: ['kan', 'ga', 'roo'], hint: 'Australian jumping animal' },
        { word: 'library', syllables: ['li', 'brar', 'y'], hint: 'Place with many books' },
        { word: 'magazine', syllables: ['mag', 'a', 'zine'], hint: 'Periodic publication' },
        { word: 'musician', syllables: ['mu', 'si', 'cian'], hint: 'Person who plays music' },
        { word: 'natural', syllables: ['nat', 'u', 'ral'], hint: 'From nature' },
        { word: 'octopus', syllables: ['oc', 'to', 'pus'], hint: 'Eight-armed sea creature' },
        { word: 'passenger', syllables: ['pas', 'sen', 'ger'], hint: 'Person traveling' },
        { word: 'pineapple', syllables: ['pine', 'ap', 'ple'], hint: 'Tropical spiky fruit' },
        { word: 'raspberry', syllables: ['rasp', 'ber', 'ry'], hint: 'Small red berry' },
        { word: 'Saturday', syllables: ['Sat', 'ur', 'day'], hint: 'Day before Sunday' },
        { word: 'telephone', syllables: ['tel', 'e', 'phone'], hint: 'Device for calling' },
        { word: 'umbrella', syllables: ['um', 'brel', 'la'], hint: 'Rain protection' },
        { word: 'tomorrow', syllables: ['to', 'mor', 'row'], hint: 'Day after today' },
        { word: 'remember', syllables: ['re', 'mem', 'ber'], hint: 'To recall' },
        { word: 'September', syllables: ['Sep', 'tem', 'ber'], hint: 'Ninth month' },
        { word: 'November', syllables: ['No', 'vem', 'ber'], hint: 'Eleventh month' },
        { word: 'December', syllables: ['De', 'cem', 'ber'], hint: 'Twelfth month' }
    ],
    hard: [
        { word: 'absolutely', syllables: ['ab', 'so', 'lute', 'ly'], hint: 'Completely, without doubt' },
        { word: 'accidentally', syllables: ['ac', 'ci', 'den', 'tal', 'ly'], hint: 'By chance, not planned' },
        { word: 'anniversary', syllables: ['an', 'ni', 'ver', 'sa', 'ry'], hint: 'Yearly celebration' },
        { word: 'appreciate', syllables: ['ap', 'pre', 'ci', 'ate'], hint: 'To value or be grateful' },
        { word: 'architecture', syllables: ['ar', 'chi', 'tec', 'ture'], hint: 'Art of building design' },
        { word: 'autobiography', syllables: ['au', 'to', 'bi', 'og', 'ra', 'phy'], hint: 'Self-written life story' },
        { word: 'cafeteria', syllables: ['caf', 'e', 'te', 'ri', 'a'], hint: 'Self-service restaurant' },
        { word: 'calculator', syllables: ['cal', 'cu', 'la', 'tor'], hint: 'Device for math' },
        { word: 'caterpillar', syllables: ['cat', 'er', 'pil', 'lar'], hint: 'Butterfly larva' },
        { word: 'communicate', syllables: ['com', 'mu', 'ni', 'cate'], hint: 'To share information' },
        { word: 'concentration', syllables: ['con', 'cen', 'tra', 'tion'], hint: 'Focused attention' },
        { word: 'declaration', syllables: ['dec', 'la', 'ra', 'tion'], hint: 'Formal announcement' },
        { word: 'dictionary', syllables: ['dic', 'tion', 'ar', 'y'], hint: 'Book of word meanings' },
        { word: 'electricity', syllables: ['e', 'lec', 'tric', 'i', 'ty'], hint: 'Power for lights' },
        { word: 'elementary', syllables: ['el', 'e', 'men', 'ta', 'ry'], hint: 'Basic or primary' },
        { word: 'entertainment', syllables: ['en', 'ter', 'tain', 'ment'], hint: 'Fun activities' },
        { word: 'environment', syllables: ['en', 'vi', 'ron', 'ment'], hint: 'Natural surroundings' },
        { word: 'extraordinary', syllables: ['ex', 'tra', 'or', 'di', 'nar', 'y'], hint: 'Very unusual' },
        { word: 'hippopotamus', syllables: ['hip', 'po', 'pot', 'a', 'mus'], hint: 'Large river animal' },
        { word: 'imagination', syllables: ['i', 'mag', 'i', 'na', 'tion'], hint: 'Creative thinking' },
        { word: 'independent', syllables: ['in', 'de', 'pen', 'dent'], hint: 'Self-reliant' },
        { word: 'information', syllables: ['in', 'for', 'ma', 'tion'], hint: 'Facts or knowledge' },
        { word: 'investigation', syllables: ['in', 'ves', 'ti', 'ga', 'tion'], hint: 'Careful examination' },
        { word: 'mathematics', syllables: ['math', 'e', 'mat', 'ics'], hint: 'Study of numbers' },
        { word: 'refrigerator', syllables: ['re', 'frig', 'er', 'a', 'tor'], hint: 'Kitchen cooling device' },
        { word: 'responsibility', syllables: ['re', 'spon', 'si', 'bil', 'i', 'ty'], hint: 'Duty or obligation' },
        { word: 'temperature', syllables: ['tem', 'per', 'a', 'ture'], hint: 'Measure of hot or cold' },
        { word: 'understanding', syllables: ['un', 'der', 'stand', 'ing'], hint: 'Comprehension' },
        { word: 'vocabulary', syllables: ['vo', 'cab', 'u', 'lar', 'y'], hint: 'Collection of words' },
        { word: 'watermelon', syllables: ['wa', 'ter', 'mel', 'on'], hint: 'Large green fruit, red inside' }
    ]
};

// Game state
let currentWord = null;
let currentSyllables = [];
let selectedSyllables = [];
let score = 0;
let highScore = 0;
let streak = 0;
let level = 1;
let difficulty = 'medium';
let timedMode = false;
let timeRemaining = 30;
let timerInterval = null;
let usedWords = [];
let draggedElement = null;

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

function playDropSound() {
    playTone(440, 0.1, 'triangle');
}

function playPickupSound() {
    playTone(660, 0.08, 'sine');
}

// Load/save functions
function loadProgress() {
    if (typeof localStorage !== 'undefined') {
        highScore = Number(localStorage.getItem('syllableShuffleHighScore')) || 0;
        const savedDifficulty = localStorage.getItem('syllableShuffleDifficulty');
        if (savedDifficulty) {
            difficulty = savedDifficulty;
            document.getElementById('difficulty').value = difficulty;
        }
        const savedTheme = localStorage.getItem('syllableShuffleTheme');
        if (savedTheme === 'light') {
            document.body.classList.add('light');
            document.getElementById('theme-toggle').textContent = 'Dark Mode';
        }
        const savedTimedMode = localStorage.getItem('syllableShuffleTimedMode');
        if (savedTimedMode === 'true') {
            timedMode = true;
            document.getElementById('timed-mode').checked = true;
        }
    }
    updateStats();
}

function saveProgress() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('syllableShuffleHighScore', String(highScore));
        localStorage.setItem('syllableShuffleDifficulty', difficulty);
        localStorage.setItem('syllableShuffleTimedMode', String(timedMode));
    }
}

function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('high-score').textContent = highScore;
    document.getElementById('streak').textContent = streak;
    document.getElementById('level').textContent = level;
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get words based on difficulty
function getWordsForDifficulty() {
    if (difficulty === 'easy') {
        return wordDatabase.easy;
    } else if (difficulty === 'medium') {
        return [...wordDatabase.easy, ...wordDatabase.medium];
    } else {
        return [...wordDatabase.medium, ...wordDatabase.hard];
    }
}

// Get a random word
function getRandomWord() {
    const words = getWordsForDifficulty();
    const availableWords = words.filter(w => !usedWords.includes(w.word));

    if (availableWords.length === 0) {
        usedWords = [];
        return words[Math.floor(Math.random() * words.length)];
    }

    return availableWords[Math.floor(Math.random() * availableWords.length)];
}

// Create syllable element
function createSyllableElement(syllable, index) {
    const el = document.createElement('div');
    el.className = 'syllable';
    el.textContent = syllable;
    el.dataset.syllable = syllable;
    el.dataset.originalIndex = index;
    el.draggable = true;

    // Drag events
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('dragend', handleDragEnd);

    // Click to move (mobile friendly)
    el.addEventListener('click', handleSyllableClick);

    // Touch events for mobile
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return el;
}

// Drag and drop handlers
function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    playPickupSound();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.syllable);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDropOnZone(e) {
    e.preventDefault();
    if (draggedElement) {
        const dropZone = document.getElementById('drop-zone');
        const bank = document.getElementById('syllable-bank');

        if (draggedElement.parentElement === bank) {
            dropZone.appendChild(draggedElement);
            selectedSyllables.push(draggedElement.dataset.syllable);
        }

        draggedElement.classList.remove('dragging');
        playDropSound();
        updateDropZoneHighlight();
    }
}

function handleDropOnBank(e) {
    e.preventDefault();
    if (draggedElement) {
        const bank = document.getElementById('syllable-bank');
        const dropZone = document.getElementById('drop-zone');

        if (draggedElement.parentElement === dropZone) {
            bank.appendChild(draggedElement);
            const idx = selectedSyllables.indexOf(draggedElement.dataset.syllable);
            if (idx > -1) {
                selectedSyllables.splice(idx, 1);
            }
        }

        draggedElement.classList.remove('dragging');
        playDropSound();
        updateDropZoneHighlight();
    }
}

// Click handler for syllables
function handleSyllableClick(e) {
    const el = e.target;
    const bank = document.getElementById('syllable-bank');
    const dropZone = document.getElementById('drop-zone');

    playPickupSound();

    if (el.parentElement === bank) {
        dropZone.appendChild(el);
        selectedSyllables.push(el.dataset.syllable);
    } else {
        bank.appendChild(el);
        const idx = selectedSyllables.indexOf(el.dataset.syllable);
        if (idx > -1) {
            selectedSyllables.splice(idx, 1);
        }
    }

    updateDropZoneHighlight();
}

// Touch handlers for mobile
let touchStartX, touchStartY, touchElement, touchClone;

function handleTouchStart(e) {
    touchElement = e.target;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;

    // Create visual clone for dragging
    touchClone = touchElement.cloneNode(true);
    touchClone.classList.add('touch-dragging');
    touchClone.style.position = 'fixed';
    touchClone.style.left = (touchStartX - 40) + 'px';
    touchClone.style.top = (touchStartY - 25) + 'px';
    touchClone.style.zIndex = '1000';
    touchClone.style.pointerEvents = 'none';
    document.body.appendChild(touchClone);

    touchElement.classList.add('dragging');
    playPickupSound();
}

function handleTouchMove(e) {
    if (!touchClone) return;
    e.preventDefault();

    const touch = e.touches[0];
    touchClone.style.left = (touch.clientX - 40) + 'px';
    touchClone.style.top = (touch.clientY - 25) + 'px';
}

function handleTouchEnd(e) {
    if (!touchClone || !touchElement) return;

    const touch = e.changedTouches[0];
    const dropZone = document.getElementById('drop-zone');
    const bank = document.getElementById('syllable-bank');

    // Remove clone
    document.body.removeChild(touchClone);
    touchClone = null;
    touchElement.classList.remove('dragging');

    // Check where the touch ended
    const dropRect = dropZone.getBoundingClientRect();
    const bankRect = bank.getBoundingClientRect();

    if (touch.clientY >= dropRect.top && touch.clientY <= dropRect.bottom &&
        touch.clientX >= dropRect.left && touch.clientX <= dropRect.right) {
        // Dropped on drop zone
        if (touchElement.parentElement === bank) {
            dropZone.appendChild(touchElement);
            selectedSyllables.push(touchElement.dataset.syllable);
            playDropSound();
        }
    } else if (touch.clientY >= bankRect.top && touch.clientY <= bankRect.bottom &&
               touch.clientX >= bankRect.left && touch.clientX <= bankRect.right) {
        // Dropped on bank
        if (touchElement.parentElement === dropZone) {
            bank.appendChild(touchElement);
            const idx = selectedSyllables.indexOf(touchElement.dataset.syllable);
            if (idx > -1) {
                selectedSyllables.splice(idx, 1);
            }
            playDropSound();
        }
    }

    touchElement = null;
    updateDropZoneHighlight();
}

function updateDropZoneHighlight() {
    const dropZone = document.getElementById('drop-zone');
    if (dropZone.children.length > 0) {
        dropZone.classList.add('has-syllables');
    } else {
        dropZone.classList.remove('has-syllables');
    }
}

// Setup new word
function newWord() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const wordData = getRandomWord();
    currentWord = wordData;
    currentSyllables = [...wordData.syllables];
    selectedSyllables = [];
    usedWords.push(wordData.word);

    // Keep only last 15 words in memory
    if (usedWords.length > 15) {
        usedWords.shift();
    }

    // Setup UI
    document.getElementById('hint').textContent = wordData.hint;

    // Shuffle and display syllables
    const shuffled = shuffleArray(currentSyllables);
    const bank = document.getElementById('syllable-bank');
    const dropZone = document.getElementById('drop-zone');

    bank.innerHTML = '';
    dropZone.innerHTML = '';

    shuffled.forEach((syllable, idx) => {
        bank.appendChild(createSyllableElement(syllable, idx));
    });

    updateDropZoneHighlight();
    clearMessage();

    // Start timer if timed mode
    if (timedMode) {
        startTimer();
    } else {
        document.getElementById('timer-bar').style.width = '0%';
    }
}

// Timer functions
function startTimer() {
    timeRemaining = getTimeForDifficulty();
    updateTimerBar();

    timerInterval = setInterval(() => {
        timeRemaining -= 0.1;
        updateTimerBar();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            handleTimeOut();
        }
    }, 100);
}

function getTimeForDifficulty() {
    switch (difficulty) {
        case 'easy': return 20;
        case 'medium': return 25;
        case 'hard': return 30;
        default: return 25;
    }
}

function updateTimerBar() {
    const maxTime = getTimeForDifficulty();
    const percent = (timeRemaining / maxTime) * 100;
    const timerBar = document.getElementById('timer-bar');
    timerBar.style.width = percent + '%';

    if (percent > 50) {
        timerBar.className = 'timer-bar';
    } else if (percent > 25) {
        timerBar.className = 'timer-bar warning';
    } else {
        timerBar.className = 'timer-bar danger';
    }
}

function handleTimeOut() {
    streak = 0;
    showMessage(`Time's up! The word was "${currentWord.word}"`, 'error');
    revealCorrectOrder();

    setTimeout(() => {
        newWord();
    }, 2500);
}

// Reveal correct order
function revealCorrectOrder() {
    const dropZone = document.getElementById('drop-zone');
    const bank = document.getElementById('syllable-bank');

    // Clear both areas
    dropZone.innerHTML = '';
    bank.innerHTML = '';

    // Show correct order
    currentWord.syllables.forEach((syllable, idx) => {
        const el = document.createElement('div');
        el.className = 'syllable revealed';
        el.textContent = syllable;
        dropZone.appendChild(el);

        setTimeout(() => {
            el.classList.add('pop');
        }, idx * 150);
    });
}

// Check answer
function checkAnswer() {
    const dropZone = document.getElementById('drop-zone');
    const syllablesInZone = Array.from(dropZone.children).map(el => el.dataset.syllable);

    if (syllablesInZone.length !== currentWord.syllables.length) {
        showMessage('Place all syllables in the drop zone!', 'info');
        return;
    }

    // Compare with correct order
    const isCorrect = syllablesInZone.every((syl, idx) => syl === currentWord.syllables[idx]);

    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

function handleCorrectAnswer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const basePoints = { easy: 50, medium: 100, hard: 150 }[difficulty];
    const streakBonus = Math.min(streak * 10, 100);
    const timeBonus = timedMode ? Math.floor(timeRemaining * 2) : 0;
    const pointsEarned = basePoints + streakBonus + timeBonus;

    score += pointsEarned;
    streak++;

    // Level up every 5 streaks
    if (streak > 0 && streak % 5 === 0) {
        level++;
    }

    if (score > highScore) {
        highScore = score;
    }

    playCorrectSound();

    // Animate syllables
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.add('celebrate');
    Array.from(dropZone.children).forEach((el, idx) => {
        setTimeout(() => el.classList.add('correct'), idx * 100);
    });

    setTimeout(() => dropZone.classList.remove('celebrate'), 600);

    let msg = `Correct! +${basePoints}`;
    if (streakBonus > 0) msg += ` +${streakBonus} streak`;
    if (timeBonus > 0) msg += ` +${timeBonus} time`;
    showMessage(msg, 'success');

    saveProgress();
    updateStats();

    setTimeout(() => {
        newWord();
    }, 1800);
}

function handleWrongAnswer() {
    streak = 0;
    playWrongSound();

    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.add('shake');
    setTimeout(() => dropZone.classList.remove('shake'), 400);

    showMessage('Not quite right. Try again!', 'error');
    updateStats();
}

// Clear drop zone
function clearDropZone() {
    const bank = document.getElementById('syllable-bank');
    const dropZone = document.getElementById('drop-zone');

    Array.from(dropZone.children).forEach(el => {
        bank.appendChild(el);
    });

    selectedSyllables = [];
    updateDropZoneHighlight();
}

// Skip word
function skipWord() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    streak = 0;
    showMessage(`Skipped! The word was "${currentWord.word}"`, 'info');
    revealCorrectOrder();
    saveProgress();
    updateStats();

    setTimeout(() => {
        newWord();
    }, 2000);
}

// Show message
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
        localStorage.setItem('syllableShuffleTheme', isLight ? 'light' : 'dark');
    }
}

// Initialize game
if (typeof window !== 'undefined') {
    loadProgress();
    newWord();

    // Event listeners
    document.getElementById('submit-btn').addEventListener('click', checkAnswer);
    document.getElementById('clear-btn').addEventListener('click', clearDropZone);
    document.getElementById('skip-btn').addEventListener('click', skipWord);

    document.getElementById('difficulty').addEventListener('change', (e) => {
        difficulty = e.target.value;
        saveProgress();
        score = 0;
        streak = 0;
        level = 1;
        updateStats();
        newWord();
    });

    document.getElementById('timed-mode').addEventListener('change', (e) => {
        timedMode = e.target.checked;
        saveProgress();
        if (!timedMode && timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            document.getElementById('timer-bar').style.width = '0%';
        } else if (timedMode) {
            startTimer();
        }
    });

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Drop zone events
    const dropZone = document.getElementById('drop-zone');
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDropOnZone);

    // Bank events
    const bank = document.getElementById('syllable-bank');
    bank.addEventListener('dragover', handleDragOver);
    bank.addEventListener('drop', handleDropOnBank);

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

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
        wordDatabase,
        shuffleArray,
        getWordsForDifficulty
    };
}
