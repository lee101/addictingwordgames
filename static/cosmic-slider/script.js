/**
 * Cosmic Slider - A Mystical Sliding Tile Puzzle Game
 * Features: Multiple modes, particle effects, procedural audio, combos, power-ups
 */

// ============================================
// GAME STATE
// ============================================
const state = {
    size: 3,
    tiles: [],
    emptyIndex: 8,
    moves: 0,
    startTime: null,
    timerInterval: null,
    isPlaying: false,
    isSolved: false,
    combo: 1,
    lastMoveTime: 0,
    comboTimeout: null,
    mode: 'normal', // normal, picture, chaos
    chaosInterval: null,
    customImage: null,
    sfxEnabled: true,
    powerUps: {
        freeze: 3,
        teleport: 2,
        reveal: 5
    },
    timeFrozen: false,
    teleportMode: false,
    achievements: {
        firstWin: false,
        speedDemon: false,
        perfectCombo: false,
        chaosConqueror: false,
        bigBoard: false
    }
};

// Rune symbols for tiles
const RUNES = ['', '&#9733;', '&#9734;', '&#9728;', '&#9788;', '&#9789;', '&#9790;', '&#9791;', '&#9792;',
    '&#9793;', '&#9794;', '&#9795;', '&#9796;', '&#9797;', '&#9798;', '&#9799;', '&#9800;',
    '&#9801;', '&#9802;', '&#9803;', '&#9804;', '&#9805;', '&#9806;', '&#9807;', '&#9808;'];

// ============================================
// AUDIO SYSTEM
// ============================================
let audioCtx = null;
let musicPlayer = null;

function initAudio() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (typeof PianoMusicGenerator !== 'undefined') {
            musicPlayer = new PianoMusicGenerator();
        }
    } catch (e) {
        console.log('Audio not available');
    }
}

function playTone(freq, duration = 0.15, type = 'sine', volume = 0.2) {
    if (!audioCtx || !state.sfxEnabled) return;

    try {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.frequency.value = freq;
        osc.type = type;

        filter.type = 'lowpass';
        filter.frequency.value = 2000;

        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

function playSlideSound() {
    // Wooshy slide sound
    const baseFreq = 200 + Math.random() * 100;
    playTone(baseFreq, 0.1, 'triangle', 0.15);
    setTimeout(() => playTone(baseFreq * 1.2, 0.05, 'sine', 0.1), 30);
}

function playCorrectSound() {
    // Sparkly correct position sound
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.2, 'sine', 0.15), i * 60);
    });
}

function playComboSound(level) {
    // Rising arpeggio based on combo level
    const baseFreq = 400 + (level * 50);
    for (let i = 0; i < Math.min(level, 5); i++) {
        setTimeout(() => {
            playTone(baseFreq * Math.pow(1.25, i), 0.15, 'triangle', 0.12);
        }, i * 50);
    }
}

function playVictorySound() {
    // Epic victory fanfare
    const melody = [
        { freq: 523.25, dur: 0.15 }, // C5
        { freq: 659.25, dur: 0.15 }, // E5
        { freq: 783.99, dur: 0.15 }, // G5
        { freq: 1046.50, dur: 0.3 }, // C6
        { freq: 783.99, dur: 0.1 },  // G5
        { freq: 1046.50, dur: 0.5 }, // C6
    ];

    melody.forEach((note, i) => {
        setTimeout(() => {
            playTone(note.freq, note.dur, 'sine', 0.2);
            playTone(note.freq * 0.5, note.dur, 'triangle', 0.1); // Bass
        }, i * 150);
    });
}

function playErrorSound() {
    playTone(150, 0.2, 'sawtooth', 0.1);
}

function playChaosSound() {
    // Warpy chaos sound
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            playTone(300 + Math.random() * 400, 0.1, 'sawtooth', 0.08);
        }, i * 40);
    }
}

function playPowerUpSound() {
    // Magical power-up sound
    const notes = [800, 1000, 1200, 1600];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.1, 'sine', 0.15), i * 50);
    });
}

// ============================================
// PARTICLE SYSTEM
// ============================================
const particles = [];
let particleCanvas, particleCtx;

function initParticles() {
    particleCanvas = document.getElementById('particle-canvas');
    if (!particleCanvas) return;

    particleCtx = particleCanvas.getContext('2d');
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);
    animateParticles();
}

function resizeParticleCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

function createParticle(x, y, color = '#00ffff', count = 10) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            size: 2 + Math.random() * 4,
            color: color
        });
    }
}

function createParticleBurst(x, y, colors = ['#00ffff', '#ff00ff', '#ffff00'], count = 30) {
    colors.forEach(color => {
        for (let i = 0; i < count / colors.length; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.015 + Math.random() * 0.015,
                size: 3 + Math.random() * 5,
                color: color
            });
        }
    });
}

function createVictoryParticles() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createParticleBurst(
                centerX + (Math.random() - 0.5) * 200,
                centerY + (Math.random() - 0.5) * 200,
                ['#00ffff', '#ff00ff', '#ffff00', '#ffffff'],
                20
            );
        }, i * 30);
    }
}

function animateParticles() {
    if (!particleCtx) return;

    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life -= p.decay;

        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        particleCtx.fillStyle = p.color;
        particleCtx.globalAlpha = p.life;
        particleCtx.fill();
        particleCtx.globalAlpha = 1;
    }

    requestAnimationFrame(animateParticles);
}

// ============================================
// PUZZLE LOGIC
// ============================================
function initPuzzle() {
    const totalTiles = state.size * state.size;
    state.tiles = [];

    for (let i = 1; i < totalTiles; i++) {
        state.tiles.push(i);
    }
    state.tiles.push(0); // Empty tile
    state.emptyIndex = totalTiles - 1;

    renderBoard();
}

function shufflePuzzle() {
    // Reset state
    state.moves = 0;
    state.combo = 1;
    state.isPlaying = false;
    state.isSolved = false;
    state.startTime = null;
    clearInterval(state.timerInterval);

    // Hide victory overlay
    document.getElementById('portal-overlay').classList.remove('active');

    // Perform valid random moves to ensure solvability
    const shuffleMoves = state.size * state.size * 20;

    for (let i = 0; i < shuffleMoves; i++) {
        const movable = getMovableTiles();
        if (movable.length > 0) {
            const randomIndex = movable[Math.floor(Math.random() * movable.length)];
            swapTiles(randomIndex, state.emptyIndex, false);
        }
    }

    // Ensure not already solved
    if (checkSolved()) {
        shufflePuzzle();
        return;
    }

    updateStats();
    renderBoard();
    playSlideSound();
}

function getMovableTiles() {
    const movable = [];
    const emptyRow = Math.floor(state.emptyIndex / state.size);
    const emptyCol = state.emptyIndex % state.size;

    // Check all four directions
    const directions = [
        { row: -1, col: 0 }, // Up
        { row: 1, col: 0 },  // Down
        { row: 0, col: -1 }, // Left
        { row: 0, col: 1 }   // Right
    ];

    for (const dir of directions) {
        const newRow = emptyRow + dir.row;
        const newCol = emptyCol + dir.col;

        if (newRow >= 0 && newRow < state.size && newCol >= 0 && newCol < state.size) {
            movable.push(newRow * state.size + newCol);
        }
    }

    return movable;
}

function canMove(index) {
    return getMovableTiles().includes(index);
}

function swapTiles(index1, index2, animate = true) {
    const temp = state.tiles[index1];
    state.tiles[index1] = state.tiles[index2];
    state.tiles[index2] = temp;

    if (state.tiles[index1] === 0) {
        state.emptyIndex = index1;
    } else {
        state.emptyIndex = index2;
    }
}

function moveTile(index) {
    if (!canMove(index) || state.isSolved) return;

    // Start timer on first move
    if (!state.isPlaying) {
        state.isPlaying = true;
        state.startTime = Date.now();
        startTimer();
    }

    // Get tile element for particle effect
    const tileEl = document.querySelector(`[data-index="${index}"]`);
    if (tileEl) {
        const rect = tileEl.getBoundingClientRect();
        createParticle(rect.left + rect.width / 2, rect.top + rect.height / 2, '#00ffff', 5);
    }

    // Perform swap
    swapTiles(index, state.emptyIndex);
    state.moves++;

    // Handle combo
    handleCombo();

    // Play sound
    playSlideSound();

    // Check if tile is in correct position
    if (state.tiles[index] === index + 1 || (index === state.size * state.size - 1 && state.tiles[index] === 0)) {
        playCorrectSound();
        if (tileEl) {
            const rect = tileEl.getBoundingClientRect();
            createParticle(rect.left + rect.width / 2, rect.top + rect.height / 2, '#00ff88', 8);
        }
    }

    renderBoard();
    updateStats();

    // Check win condition
    if (checkSolved()) {
        handleVictory();
    }
}

function handleCombo() {
    const now = Date.now();
    const timeSinceLastMove = now - state.lastMoveTime;

    if (timeSinceLastMove < 1000) { // Within 1 second
        state.combo = Math.min(state.combo + 1, 10);
        playComboSound(state.combo);

        document.querySelector('.combo-stat').classList.add('active');
        setTimeout(() => {
            document.querySelector('.combo-stat').classList.remove('active');
        }, 200);
    } else {
        state.combo = 1;
    }

    state.lastMoveTime = now;

    // Reset combo after inactivity
    clearTimeout(state.comboTimeout);
    state.comboTimeout = setTimeout(() => {
        state.combo = 1;
        updateStats();
    }, 2000);
}

function checkSolved() {
    const totalTiles = state.size * state.size;
    for (let i = 0; i < totalTiles - 1; i++) {
        if (state.tiles[i] !== i + 1) return false;
    }
    return state.tiles[totalTiles - 1] === 0;
}

function handleVictory() {
    state.isSolved = true;
    state.isPlaying = false;
    clearInterval(state.timerInterval);

    // Save best score
    saveBestScore();

    // Show victory animation
    document.getElementById('portal-overlay').classList.add('active');
    createVictoryParticles();
    playVictorySound();

    // Check achievements
    checkAchievements();
}

// ============================================
// RENDER
// ============================================
function renderBoard() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';
    board.className = `puzzle-board size-${state.size}`;

    state.tiles.forEach((value, index) => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.index = index;

        if (value === 0) {
            tile.classList.add('empty');
        } else {
            // Check if in correct position
            if (value === index + 1) {
                tile.classList.add('correct');
            }

            // Add movable class
            if (canMove(index)) {
                tile.classList.add('movable');
            }

            // Content
            if (state.mode === 'picture' && state.customImage) {
                tile.classList.add('picture-tile');
                const imgSize = 100 / state.size;
                const col = (value - 1) % state.size;
                const row = Math.floor((value - 1) / state.size);
                tile.style.backgroundImage = `url(${state.customImage})`;
                tile.style.backgroundSize = `${state.size * 100}% ${state.size * 100}%`;
                tile.style.backgroundPosition = `${col * imgSize}% ${row * imgSize}%`;

                // Add small number indicator
                tile.innerHTML = `<span class="tile-number" style="opacity: 0.5;">${value}</span>`;
            } else {
                tile.innerHTML = `
                    <span class="tile-number">${value}</span>
                    <span class="rune-symbol">${RUNES[value] || ''}</span>
                `;
            }

            // Click handler
            tile.addEventListener('click', () => {
                if (state.teleportMode) {
                    handleTeleport(index);
                } else {
                    moveTile(index);
                }
            });
        }

        board.appendChild(tile);
    });
}

function updateStats() {
    document.getElementById('moves').textContent = state.moves;
    document.getElementById('combo').textContent = `x${state.combo}`;

    // Update best score display
    const bestKey = `cosmic-slider-best-${state.size}`;
    const best = localStorage.getItem(bestKey);
    document.getElementById('best-score').textContent = best ? best : '-';
}

function startTimer() {
    state.timerInterval = setInterval(() => {
        if (!state.timeFrozen) {
            const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timer').textContent =
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 100);
}

// ============================================
// MODES
// ============================================
function setSize(newSize) {
    state.size = newSize;
    initPuzzle();

    // Update active button
    document.querySelectorAll('.mode-btn[data-size]').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.size) === newSize);
    });
}

function setMode(mode) {
    state.mode = mode;

    // Stop chaos mode if switching away
    if (mode !== 'chaos' && state.chaosInterval) {
        clearInterval(state.chaosInterval);
        state.chaosInterval = null;
    }

    // Handle mode-specific setup
    if (mode === 'chaos') {
        startChaosMode();
    }

    // Toggle picture upload visibility
    document.getElementById('picture-upload').style.display =
        mode === 'picture' ? 'block' : 'none';

    // Update active buttons
    document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Deactivate size buttons if in special mode
    if (mode !== 'normal') {
        document.querySelectorAll('.mode-btn[data-size]').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    initPuzzle();
}

function startChaosMode() {
    state.chaosInterval = setInterval(() => {
        if (state.isPlaying && !state.isSolved && !state.timeFrozen) {
            // Random tile swap
            const nonEmptyTiles = state.tiles
                .map((v, i) => v !== 0 ? i : -1)
                .filter(i => i !== -1);

            if (nonEmptyTiles.length >= 2) {
                const idx1 = nonEmptyTiles[Math.floor(Math.random() * nonEmptyTiles.length)];
                let idx2 = nonEmptyTiles[Math.floor(Math.random() * nonEmptyTiles.length)];
                while (idx2 === idx1) {
                    idx2 = nonEmptyTiles[Math.floor(Math.random() * nonEmptyTiles.length)];
                }

                // Swap two random non-empty tiles
                const temp = state.tiles[idx1];
                state.tiles[idx1] = state.tiles[idx2];
                state.tiles[idx2] = temp;

                playChaosSound();

                // Visual feedback
                const board = document.getElementById('puzzle-board');
                board.classList.add('chaos-mode');
                setTimeout(() => board.classList.remove('chaos-mode'), 500);

                renderBoard();
            }
        }
    }, 5000); // Every 5 seconds
}

// ============================================
// POWER-UPS
// ============================================
function useFreezeTime() {
    if (state.powerUps.freeze <= 0 || !state.isPlaying) return;

    state.powerUps.freeze--;
    state.timeFrozen = true;
    playPowerUpSound();

    document.querySelector('.puzzle-container').classList.add('time-frozen');
    updatePowerUpDisplay();

    // Create icy particles
    const board = document.getElementById('puzzle-board');
    const rect = board.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
        createParticle(
            rect.left + Math.random() * rect.width,
            rect.top + Math.random() * rect.height,
            '#88ddff',
            3
        );
    }

    setTimeout(() => {
        state.timeFrozen = false;
        document.querySelector('.puzzle-container').classList.remove('time-frozen');
    }, 5000);
}

function useTeleport() {
    if (state.powerUps.teleport <= 0 || !state.isPlaying) return;

    state.teleportMode = true;
    playPowerUpSound();

    // Visual indicator
    document.getElementById('puzzle-board').style.cursor = 'crosshair';
}

function handleTeleport(index) {
    if (!state.teleportMode || state.tiles[index] === 0) return;

    // Find correct position for this tile
    const value = state.tiles[index];
    const correctIndex = value - 1;

    // If already in correct position, ignore
    if (index === correctIndex) {
        state.teleportMode = false;
        document.getElementById('puzzle-board').style.cursor = '';
        return;
    }

    // Swap with tile in correct position (unless it's empty)
    if (state.tiles[correctIndex] !== 0) {
        const temp = state.tiles[correctIndex];
        state.tiles[correctIndex] = state.tiles[index];
        state.tiles[index] = temp;
    } else {
        // Can't teleport to empty space directly - swap with empty
        state.tiles[index] = 0;
        state.tiles[state.emptyIndex] = value;
        state.emptyIndex = index;
    }

    state.powerUps.teleport--;
    state.teleportMode = false;
    document.getElementById('puzzle-board').style.cursor = '';

    updatePowerUpDisplay();
    renderBoard();

    // Particles
    const tileEl = document.querySelector(`[data-index="${correctIndex}"]`);
    if (tileEl) {
        const rect = tileEl.getBoundingClientRect();
        createParticleBurst(rect.left + rect.width/2, rect.top + rect.height/2, ['#ff00ff', '#ffff00'], 20);
    }

    // Check win
    if (checkSolved()) {
        handleVictory();
    }
}

function useReveal() {
    if (state.powerUps.reveal <= 0) return;

    state.powerUps.reveal--;
    playPowerUpSound();

    const board = document.getElementById('puzzle-board');
    board.classList.add('reveal-numbers');
    updatePowerUpDisplay();

    setTimeout(() => {
        board.classList.remove('reveal-numbers');
    }, 3000);
}

function updatePowerUpDisplay() {
    document.querySelector('#freeze-time .power-count').textContent = state.powerUps.freeze;
    document.querySelector('#teleport .power-count').textContent = state.powerUps.teleport;
    document.querySelector('#reveal .power-count').textContent = state.powerUps.reveal;

    document.getElementById('freeze-time').disabled = state.powerUps.freeze <= 0;
    document.getElementById('teleport').disabled = state.powerUps.teleport <= 0;
    document.getElementById('reveal').disabled = state.powerUps.reveal <= 0;
}

// ============================================
// HINTS & AUTO-SOLVE
// ============================================
function showHint() {
    if (state.isSolved) return;

    // Find a tile that can move toward its correct position
    const movable = getMovableTiles();

    for (const index of movable) {
        const value = state.tiles[index];
        if (value !== 0) {
            const correctIndex = value - 1;
            // Calculate if moving improves position
            const currentDist = Math.abs(index - correctIndex);
            const newDist = Math.abs(state.emptyIndex - correctIndex);

            if (newDist < currentDist) {
                // Highlight this tile
                const tile = document.querySelector(`[data-index="${index}"]`);
                if (tile) {
                    tile.classList.add('hint');
                    setTimeout(() => tile.classList.remove('hint'), 1500);
                }
                playPowerUpSound();
                return;
            }
        }
    }

    // If no optimal move found, just highlight first movable
    if (movable.length > 0) {
        const tile = document.querySelector(`[data-index="${movable[0]}"]`);
        if (tile) {
            tile.classList.add('hint');
            setTimeout(() => tile.classList.remove('hint'), 1500);
        }
    }
}

async function autoSolve() {
    if (state.isSolved) return;

    // Simple solving algorithm - make moves that improve the state
    // This is a basic greedy approach, not optimal

    const maxIterations = 500;
    let iterations = 0;

    while (!checkSolved() && iterations < maxIterations) {
        const movable = getMovableTiles();
        let bestMove = null;
        let bestScore = -Infinity;

        for (const index of movable) {
            // Simulate move
            const originalEmpty = state.emptyIndex;
            swapTiles(index, state.emptyIndex, false);

            // Score this state
            let score = 0;
            for (let i = 0; i < state.tiles.length; i++) {
                const value = state.tiles[i];
                if (value !== 0) {
                    const correctIndex = value - 1;
                    const currentRow = Math.floor(i / state.size);
                    const currentCol = i % state.size;
                    const correctRow = Math.floor(correctIndex / state.size);
                    const correctCol = correctIndex % state.size;

                    // Manhattan distance (negative - lower is better)
                    score -= Math.abs(currentRow - correctRow) + Math.abs(currentCol - correctCol);

                    // Bonus for correct position
                    if (i === correctIndex) score += 10;
                }
            }

            // Add some randomness to prevent loops
            score += Math.random() * 0.5;

            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }

            // Undo move
            swapTiles(originalEmpty, state.emptyIndex, false);
        }

        if (bestMove !== null) {
            moveTile(bestMove);
            await new Promise(r => setTimeout(r, 100)); // Delay for animation
        }

        iterations++;
    }
}

// ============================================
// ACHIEVEMENTS
// ============================================
function checkAchievements() {
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);

    // First Win
    if (!state.achievements.firstWin) {
        showAchievement('First Portal!', 'Opened your first cosmic portal');
        state.achievements.firstWin = true;
    }

    // Speed Demon - solve in under 30 seconds
    if (elapsed < 30 && state.size >= 3 && !state.achievements.speedDemon) {
        showAchievement('Speed Demon', 'Solved in under 30 seconds!');
        state.achievements.speedDemon = true;
    }

    // Perfect Combo - reached 10x combo
    if (state.combo >= 10 && !state.achievements.perfectCombo) {
        showAchievement('Combo Master', 'Reached 10x combo!');
        state.achievements.perfectCombo = true;
    }

    // Chaos Conqueror - beat chaos mode
    if (state.mode === 'chaos' && !state.achievements.chaosConqueror) {
        showAchievement('Chaos Conqueror', 'Beat chaos mode!');
        state.achievements.chaosConqueror = true;
    }

    // Big Board - beat 5x5
    if (state.size === 5 && !state.achievements.bigBoard) {
        showAchievement('Big Brain', 'Completed a 5x5 puzzle!');
        state.achievements.bigBoard = true;
    }

    saveAchievements();
}

function showAchievement(title, desc) {
    const container = document.getElementById('achievements');
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `<h4>&#127942; ${title}</h4><p>${desc}</p>`;
    container.appendChild(popup);

    playVictorySound();

    setTimeout(() => popup.remove(), 3000);
}

// ============================================
// STORAGE
// ============================================
function saveBestScore() {
    const bestKey = `cosmic-slider-best-${state.size}`;
    const current = localStorage.getItem(bestKey);

    if (!current || state.moves < parseInt(current)) {
        localStorage.setItem(bestKey, state.moves);
    }
}

function saveAchievements() {
    localStorage.setItem('cosmic-slider-achievements', JSON.stringify(state.achievements));
}

function loadAchievements() {
    const saved = localStorage.getItem('cosmic-slider-achievements');
    if (saved) {
        state.achievements = { ...state.achievements, ...JSON.parse(saved) };
    }
}

// ============================================
// IMAGE UPLOAD
// ============================================
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        state.customImage = event.target.result;
        shufflePuzzle();
    };
    reader.readAsDataURL(file);
}

// ============================================
// KEYBOARD CONTROLS
// ============================================
function handleKeyboard(e) {
    const key = e.key;
    const emptyRow = Math.floor(state.emptyIndex / state.size);
    const emptyCol = state.emptyIndex % state.size;

    let targetIndex = -1;

    switch (key) {
        case 'ArrowUp':
            if (emptyRow < state.size - 1) {
                targetIndex = (emptyRow + 1) * state.size + emptyCol;
            }
            break;
        case 'ArrowDown':
            if (emptyRow > 0) {
                targetIndex = (emptyRow - 1) * state.size + emptyCol;
            }
            break;
        case 'ArrowLeft':
            if (emptyCol < state.size - 1) {
                targetIndex = emptyRow * state.size + (emptyCol + 1);
            }
            break;
        case 'ArrowRight':
            if (emptyCol > 0) {
                targetIndex = emptyRow * state.size + (emptyCol - 1);
            }
            break;
    }

    if (targetIndex >= 0) {
        e.preventDefault();
        moveTile(targetIndex);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Size buttons
    document.querySelectorAll('.mode-btn[data-size]').forEach(btn => {
        btn.addEventListener('click', () => {
            state.mode = 'normal';
            document.querySelectorAll('.mode-btn[data-mode]').forEach(b => b.classList.remove('active'));
            document.getElementById('picture-upload').style.display = 'none';
            if (state.chaosInterval) {
                clearInterval(state.chaosInterval);
                state.chaosInterval = null;
            }
            setSize(parseInt(btn.dataset.size));
        });
    });

    // Mode buttons
    document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    // Control buttons
    document.getElementById('shuffle-btn').addEventListener('click', shufflePuzzle);
    document.getElementById('hint-btn').addEventListener('click', showHint);
    document.getElementById('solve-btn').addEventListener('click', autoSolve);

    // Power-ups
    document.getElementById('freeze-time').addEventListener('click', useFreezeTime);
    document.getElementById('teleport').addEventListener('click', useTeleport);
    document.getElementById('reveal').addEventListener('click', useReveal);

    // Image upload
    document.getElementById('image-input').addEventListener('change', handleImageUpload);

    // Music controls
    document.getElementById('music-toggle').addEventListener('click', () => {
        if (!musicPlayer) return;

        const btn = document.getElementById('music-toggle');
        if (musicPlayer.isPlaying) {
            musicPlayer.stop();
            btn.classList.remove('active');
            btn.innerHTML = '&#127925; Music';
        } else {
            musicPlayer.start();
            btn.classList.add('active');
            btn.innerHTML = '&#9208; Pause';
        }
        document.getElementById('song-name').textContent = musicPlayer.getCurrentSongName();
    });

    document.getElementById('music-next').addEventListener('click', () => {
        if (!musicPlayer) return;
        musicPlayer.nextSong();
        document.getElementById('song-name').textContent = musicPlayer.getCurrentSongName();
    });

    document.getElementById('sfx-toggle').addEventListener('click', () => {
        state.sfxEnabled = !state.sfxEnabled;
        const btn = document.getElementById('sfx-toggle');
        btn.classList.toggle('active', state.sfxEnabled);
        btn.innerHTML = state.sfxEnabled ? '&#128266; SFX' : '&#128263; SFX';
    });

    // Instructions
    document.getElementById('instructions-toggle').addEventListener('click', () => {
        document.getElementById('instructions-panel').classList.toggle('active');
    });

    document.getElementById('close-instructions').addEventListener('click', () => {
        document.getElementById('instructions-panel').classList.remove('active');
    });

    // Keyboard
    document.addEventListener('keydown', handleKeyboard);

    // Touch support for swipe
    let touchStartX, touchStartY;
    document.getElementById('puzzle-board').addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.getElementById('puzzle-board').addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        const minSwipe = 30;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
            // Horizontal swipe
            const key = dx > 0 ? 'ArrowLeft' : 'ArrowRight';
            handleKeyboard({ key, preventDefault: () => {} });
        } else if (Math.abs(dy) > minSwipe) {
            // Vertical swipe
            const key = dy > 0 ? 'ArrowUp' : 'ArrowDown';
            handleKeyboard({ key, preventDefault: () => {} });
        }

        touchStartX = null;
        touchStartY = null;
    });
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    initAudio();
    initParticles();
    loadAchievements();
    initPuzzle();
    setupEventListeners();
    updateStats();
    updatePowerUpDisplay();

    // Add click listener to initialize audio context (browser requirement)
    document.addEventListener('click', () => {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }, { once: true });
}

// Start the game
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
