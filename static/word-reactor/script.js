// Word Reactor - A tile-shifting word puzzle game
const WORDS = [
    'REACT', 'ATOMS', 'SPARK', 'POWER', 'LIGHT', 'WAVES', 'FOCUS', 'BLEND',
    'CRAFT', 'DREAM', 'FLAME', 'GHOST', 'HONEY', 'JOKER', 'KNIFE', 'LEMON',
    'MUSIC', 'NOBLE', 'OCEAN', 'PEACE', 'QUEST', 'RIVER', 'STONE', 'TIGER',
    'UNITY', 'VIVID', 'WATER', 'YOUTH', 'ZEBRA', 'BRAIN', 'CHARM', 'DRIFT'
];

let targetWord = '';
let currentWord = [];
let initialWord = [];
let moves = 0;
let streak = 0;

const targetEl = document.getElementById('target');
const reactorEl = document.getElementById('reactor');
const movesEl = document.getElementById('moves');
const streakEl = document.getElementById('streak');
const newPuzzleBtn = document.getElementById('new-puzzle');
const resetBtn = document.getElementById('reset');
const revealBtn = document.getElementById('reveal');

function randomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function shiftLetter(letter, amount) {
    const code = letter.charCodeAt(0) - 65;
    const newCode = ((code + amount) % 26 + 26) % 26;
    return String.fromCharCode(65 + newCode);
}

function generatePuzzle() {
    targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    currentWord = [];

    // Generate starting letters that are different from target
    for (let i = 0; i < targetWord.length; i++) {
        let letter;
        do {
            letter = randomLetter();
        } while (letter === targetWord[i]);
        currentWord.push(letter);
    }

    initialWord = [...currentWord];
    moves = 0;
    movesEl.textContent = moves;

    renderTarget();
    renderReactor();
}

function renderTarget() {
    targetEl.innerHTML = '';
    for (const letter of targetWord) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.textContent = letter;
        targetEl.appendChild(slot);
    }
}

function renderReactor() {
    reactorEl.innerHTML = '';
    for (let i = 0; i < currentWord.length; i++) {
        const tile = document.createElement('button');
        tile.className = 'tile';
        tile.textContent = currentWord[i];
        tile.dataset.index = i;

        // Check if this tile matches target
        if (currentWord[i] === targetWord[i]) {
            tile.classList.add('matched');
        }

        tile.addEventListener('click', () => handleTileClick(i));
        reactorEl.appendChild(tile);
    }

    checkWin();
}

function handleTileClick(index) {
    if (currentWord.join('') === targetWord) {
        return; // Already won
    }

    // Shift clicked tile and neighbors
    currentWord[index] = shiftLetter(currentWord[index], 1);

    // Shift left neighbor if exists
    if (index > 0) {
        currentWord[index - 1] = shiftLetter(currentWord[index - 1], 1);
    }

    // Shift right neighbor if exists
    if (index < currentWord.length - 1) {
        currentWord[index + 1] = shiftLetter(currentWord[index + 1], 1);
    }

    moves++;
    movesEl.textContent = moves;

    renderReactor();
}

function checkWin() {
    if (currentWord.join('') === targetWord) {
        streak++;
        streakEl.textContent = streak;

        // Add win animation
        reactorEl.querySelectorAll('.tile').forEach((tile, i) => {
            setTimeout(() => {
                tile.classList.add('victory');
            }, i * 100);
        });

        // Show celebration
        setTimeout(() => {
            showMessage(`Solved in ${moves} moves!`);
        }, 600);
    }
}

function showMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'message';
    msg.textContent = text;
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.classList.add('fade-out');
        setTimeout(() => msg.remove(), 500);
    }, 2000);
}

function resetPuzzle() {
    currentWord = [...initialWord];
    moves = 0;
    movesEl.textContent = moves;
    renderReactor();
}

function revealSolution() {
    currentWord = targetWord.split('');
    moves = 0;
    movesEl.textContent = '---';
    streak = 0;
    streakEl.textContent = streak;
    renderReactor();
}

// Event listeners
newPuzzleBtn.addEventListener('click', generatePuzzle);
resetBtn.addEventListener('click', resetPuzzle);
revealBtn.addEventListener('click', revealSolution);

// Start game
generatePuzzle();
