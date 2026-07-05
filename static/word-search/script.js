// Word lists by difficulty
const wordLists = {
    easy: ['CAT', 'DOG', 'RUN', 'FUN', 'SUN', 'HAT', 'BAT', 'RAT', 'CUP', 'MUG', 'PEN', 'BED', 'RED', 'BIG', 'TOP'],
    medium: ['APPLE', 'BEACH', 'CLOUD', 'DANCE', 'EAGLE', 'FLAME', 'GRAPE', 'HOUSE', 'JUICE', 'KNIFE', 'LEMON', 'MUSIC', 'NIGHT', 'OCEAN', 'PIANO'],
    hard: ['ADVENTURE', 'BEAUTIFUL', 'CHOCOLATE', 'DISCOVERY', 'ELEPHANT', 'FANTASTIC', 'GORGEOUS', 'HAPPINESS', 'IMPORTANT', 'JELLYFISH', 'KNOWLEDGE', 'LIGHTNING', 'MARVELOUS', 'NIGHTMARE', 'PARACHUTE']
};

const gridSizes = { easy: 8, medium: 10, hard: 12 };
const wordCounts = { easy: 5, medium: 7, hard: 9 };

let grid = [];
let gridSize = 8;
let words = [];
let foundWords = [];
let score = 0;
let highScore = 0;
let timer;
let timeElapsed = 0;
let difficulty = 'easy';
let isSelecting = false;
let selectionStart = null;
let selectionEnd = null;
let selectedCells = [];

// Audio context for sound effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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

function playCorrect() {
    [523.25, 659.25, 783.99].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.12), i * 50);
    });
}

function playComplete() {
    [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.2, 'triangle'), i * 100);
    });
}

function playSelect() {
    playTone(440, 0.05, 'square');
}

function loadHighScore() {
    if (typeof localStorage !== 'undefined') {
        highScore = Number(localStorage.getItem('wordSearchHighScore')) || 0;
        document.getElementById('high-score').textContent = highScore;
    }
}

function saveHighScore() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordSearchHighScore', String(highScore));
    }
}

function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function createEmptyGrid(size) {
    return Array(size).fill(null).map(() => Array(size).fill(''));
}

function canPlaceWord(grid, word, row, col, dRow, dCol) {
    const size = grid.length;
    for (let i = 0; i < word.length; i++) {
        const newRow = row + i * dRow;
        const newCol = col + i * dCol;
        if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
            return false;
        }
        if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
            return false;
        }
    }
    return true;
}

function placeWord(grid, word, row, col, dRow, dCol) {
    const positions = [];
    for (let i = 0; i < word.length; i++) {
        const newRow = row + i * dRow;
        const newCol = col + i * dCol;
        grid[newRow][newCol] = word[i];
        positions.push({ row: newRow, col: newCol });
    }
    return positions;
}

function generateGrid() {
    gridSize = gridSizes[difficulty];
    grid = createEmptyGrid(gridSize);
    words = [];
    foundWords = [];

    const wordList = shuffleArray(wordLists[difficulty]);
    const numWords = wordCounts[difficulty];
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal down-right
        [1, -1],  // diagonal down-left
        [-1, 1],  // diagonal up-right
        [0, -1],  // horizontal backwards
        [-1, 0],  // vertical backwards
        [-1, -1]  // diagonal up-left
    ];

    let placedCount = 0;
    let wordIndex = 0;
    let attempts = 0;
    const maxAttempts = 1000;

    while (placedCount < numWords && wordIndex < wordList.length && attempts < maxAttempts) {
        const word = wordList[wordIndex];
        const shuffledDirections = shuffleArray(directions);
        let placed = false;

        for (const [dRow, dCol] of shuffledDirections) {
            if (placed) break;

            const positions = [];
            for (let row = 0; row < gridSize && !placed; row++) {
                for (let col = 0; col < gridSize && !placed; col++) {
                    positions.push({ row, col });
                }
            }

            const shuffledPositions = shuffleArray(positions);
            for (const { row, col } of shuffledPositions) {
                if (canPlaceWord(grid, word, row, col, dRow, dCol)) {
                    const wordPositions = placeWord(grid, word, row, col, dRow, dCol);
                    words.push({ word, positions: wordPositions });
                    placedCount++;
                    placed = true;
                    break;
                }
            }
        }

        wordIndex++;
        attempts++;
    }

    // Fill empty cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
}

function renderGrid() {
    const gridEl = document.getElementById('grid');
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = grid[row][col];
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener('mousedown', handleCellMouseDown);
            cell.addEventListener('mouseenter', handleCellMouseEnter);
            cell.addEventListener('touchstart', handleTouchStart, { passive: false });
            cell.addEventListener('touchmove', handleTouchMove, { passive: false });

            gridEl.appendChild(cell);
        }
    }

    // Setup SVG overlay for drawing lines
    const svg = document.getElementById('line-overlay');
    svg.innerHTML = '';
    const gridContainer = document.getElementById('grid-container');
    svg.setAttribute('width', gridContainer.offsetWidth);
    svg.setAttribute('height', gridContainer.offsetHeight);
}

function renderWordList() {
    const wordsEl = document.getElementById('words');
    wordsEl.innerHTML = '';

    words.forEach(({ word }) => {
        const li = document.createElement('li');
        li.textContent = word;
        li.id = `word-${word}`;
        if (foundWords.includes(word)) {
            li.classList.add('found');
        }
        wordsEl.appendChild(li);
    });

    document.getElementById('found-count').textContent = foundWords.length;
    document.getElementById('total-count').textContent = words.length;
}

function getCellAt(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function getCellsInLine(start, end) {
    const cells = [];
    const dRow = Math.sign(end.row - start.row);
    const dCol = Math.sign(end.col - start.col);

    const rowDist = Math.abs(end.row - start.row);
    const colDist = Math.abs(end.col - start.col);

    // Check if it's a valid line (horizontal, vertical, or diagonal)
    if (rowDist !== colDist && rowDist !== 0 && colDist !== 0) {
        return cells;
    }

    const steps = Math.max(rowDist, colDist);
    for (let i = 0; i <= steps; i++) {
        cells.push({
            row: start.row + i * dRow,
            col: start.col + i * dCol
        });
    }

    return cells;
}

function highlightSelection(cells) {
    // Clear previous selection
    document.querySelectorAll('.cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });

    cells.forEach(({ row, col }) => {
        const cell = getCellAt(row, col);
        if (cell) {
            cell.classList.add('selected');
        }
    });
}

function drawSelectionLine(start, end) {
    const svg = document.getElementById('line-overlay');
    svg.innerHTML = '';

    if (!start || !end) return;

    const startCell = getCellAt(start.row, start.col);
    const endCell = getCellAt(end.row, end.col);

    if (!startCell || !endCell) return;

    const gridContainer = document.getElementById('grid-container');
    const containerRect = gridContainer.getBoundingClientRect();
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const x1 = startRect.left + startRect.width / 2 - containerRect.left;
    const y1 = startRect.top + startRect.height / 2 - containerRect.top;
    const x2 = endRect.left + endRect.width / 2 - containerRect.left;
    const y2 = endRect.top + endRect.height / 2 - containerRect.top;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'rgba(76, 175, 80, 0.6)');
    line.setAttribute('stroke-width', '20');
    line.setAttribute('stroke-linecap', 'round');

    svg.appendChild(line);
}

function handleCellMouseDown(e) {
    e.preventDefault();
    isSelecting = true;
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    selectionStart = { row, col };
    selectionEnd = { row, col };
    selectedCells = [{ row, col }];
    highlightSelection(selectedCells);
    playSelect();
}

function handleCellMouseEnter(e) {
    if (!isSelecting) return;
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    selectionEnd = { row, col };
    selectedCells = getCellsInLine(selectionStart, selectionEnd);
    highlightSelection(selectedCells);
    drawSelectionLine(selectionStart, selectionEnd);
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (cell && cell.classList.contains('cell')) {
        isSelecting = true;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        selectionStart = { row, col };
        selectionEnd = { row, col };
        selectedCells = [{ row, col }];
        highlightSelection(selectedCells);
        playSelect();
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isSelecting) return;
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (cell && cell.classList.contains('cell')) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        selectionEnd = { row, col };
        selectedCells = getCellsInLine(selectionStart, selectionEnd);
        highlightSelection(selectedCells);
        drawSelectionLine(selectionStart, selectionEnd);
    }
}

function handleMouseUp() {
    if (!isSelecting) return;
    isSelecting = false;

    checkSelection();

    // Clear visual selection
    document.querySelectorAll('.cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });
    document.getElementById('line-overlay').innerHTML = '';

    selectionStart = null;
    selectionEnd = null;
    selectedCells = [];
}

function checkSelection() {
    if (selectedCells.length < 2) return;

    const selectedWord = selectedCells.map(({ row, col }) => grid[row][col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    for (const wordObj of words) {
        if (foundWords.includes(wordObj.word)) continue;

        if (wordObj.word === selectedWord || wordObj.word === reversedWord) {
            // Found a word!
            foundWords.push(wordObj.word);

            // Mark cells as found
            selectedCells.forEach(({ row, col }) => {
                const cell = getCellAt(row, col);
                if (cell) {
                    cell.classList.add('found');
                }
            });

            // Update word list
            const wordEl = document.getElementById(`word-${wordObj.word}`);
            if (wordEl) {
                wordEl.classList.add('found');
            }

            // Update score
            const wordScore = wordObj.word.length * 10;
            score += wordScore;
            document.getElementById('score').textContent = score;

            document.getElementById('found-count').textContent = foundWords.length;

            playCorrect();
            showMessage(`Found "${wordObj.word}"! +${wordScore} points`);

            // Check if game is complete
            if (foundWords.length === words.length) {
                gameComplete();
            }

            return;
        }
    }
}

function showMessage(text) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.classList.add('show');
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 2000);
}

function gameComplete() {
    clearInterval(timer);

    // Time bonus
    const timeBonus = Math.max(0, 300 - timeElapsed) * 2;
    score += timeBonus;
    document.getElementById('score').textContent = score;

    if (score > highScore) {
        highScore = score;
        document.getElementById('high-score').textContent = highScore;
        saveHighScore();
        showMessage(`Congratulations! New high score: ${score}!`);
    } else {
        showMessage(`Puzzle complete! Score: ${score} (Time bonus: +${timeBonus})`);
    }

    playComplete();
}

function startTimer() {
    clearInterval(timer);
    timeElapsed = 0;
    document.getElementById('timer').textContent = timeElapsed;
    timer = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = timeElapsed;
    }, 1000);
}

function showHint() {
    // Find an unfound word and briefly highlight its first letter
    const unfoundWord = words.find(w => !foundWords.includes(w.word));
    if (unfoundWord) {
        const firstPos = unfoundWord.positions[0];
        const cell = getCellAt(firstPos.row, firstPos.col);
        if (cell) {
            cell.classList.add('hint');
            setTimeout(() => {
                cell.classList.remove('hint');
            }, 1500);
            showMessage(`Hint: Look for "${unfoundWord.word}"`);
        }
    }
}

function newGame() {
    clearInterval(timer);
    score = 0;
    document.getElementById('score').textContent = score;

    generateGrid();
    renderGrid();
    renderWordList();
    startTimer();

    showMessage('Find all the hidden words!');
}

// Event listeners
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('touchend', handleMouseUp);

document.getElementById('new-game').addEventListener('click', newGame);
document.getElementById('hint').addEventListener('click', showHint);
document.getElementById('difficulty').addEventListener('change', (e) => {
    difficulty = e.target.value;
    newGame();
});

// Initialize background music
const musicGen = new PianoMusicGenerator();
let musicPlaying = false;

document.getElementById('music-toggle').addEventListener('click', function() {
    if (musicPlaying) {
        musicGen.stop();
        this.textContent = '🎵 Play Music';
        musicPlaying = false;
    } else {
        musicGen.start();
        this.textContent = '🔇 Mute Music';
        document.getElementById('song-name').textContent = `♪ ${musicGen.getCurrentSongName()}`;
        musicPlaying = true;
    }
});

document.getElementById('music-next').addEventListener('click', function() {
    if (musicPlaying) {
        musicGen.nextSong();
        document.getElementById('song-name').textContent = `♪ ${musicGen.getCurrentSongName()}`;
    }
});

// Initialize
loadHighScore();
newGame();
