// Word Ring Puzzle - A word game where you form words using letters in a ring
// Each puzzle has a center letter that must be used in every word

const puzzles = [
    { center: 'a', outer: ['p', 'l', 'y', 'n', 't', 's'], words: ['plant', 'slant', 'plans', 'pants', 'nasty', 'salty', 'antsy', 'plays', 'pansy', 'aptly', 'splat', 'slap', 'plan', 'play', 'pays', 'stay', 'span', 'snap', 'naps', 'past', 'salt', 'last', 'tall', 'pals', 'taps', 'slay', 'laps', 'yaps', 'ants', 'sap', 'lap', 'tap', 'nap', 'pay', 'say', 'lay', 'ant', 'sat', 'pat', 'spa'] },
    { center: 'e', outer: ['r', 's', 't', 'a', 'n', 'm'], words: ['stream', 'master', 'faster', 'easter', 'senate', 'seater', 'serene', 'sterna', 'meters', 'neater', 'eaters', 'stare', 'steam', 'teams', 'seam', 'ears', 'near', 'tear', 'meat', 'seat', 'neat', 'rate', 'stem', 'term', 'mess', 'rest', 'nest', 'mean', 'teen', 'tree', 'ease', 'sea', 'ear', 'eat', 'tea', 'net', 'met', 'set', 'ten'] },
    { center: 'i', outer: ['n', 'g', 'h', 't', 's', 'l'], words: ['listing', 'sitting', 'hitting', 'tilting', 'silting', 'insight', 'nights', 'lights', 'tights', 'sights', 'slight', 'glints', 'stings', 'things', 'hilts', 'gilts', 'tilts', 'silts', 'night', 'light', 'sight', 'tight', 'thing', 'sting', 'sling', 'glint', 'hints', 'tins', 'sins', 'gins', 'hits', 'sits', 'this', 'thin', 'shin', 'gist', 'list', 'hint', 'silt', 'tilt', 'gilt', 'lit', 'sit', 'hit', 'tin', 'sin', 'gin', 'nit'] },
    { center: 'o', outer: ['w', 'r', 'd', 's', 'n', 'c'], words: ['crowns', 'swords', 'worlds', 'cords', 'words', 'sword', 'crown', 'drown', 'frown', 'sworn', 'scorn', 'corns', 'horns', 'sorns', 'words', 'crows', 'rows', 'cows', 'dons', 'cons', 'sons', 'owns', 'worn', 'corn', 'horn', 'word', 'cord', 'down', 'town', 'crow', 'snow', 'know', 'show', 'row', 'cow', 'don', 'con', 'son', 'own', 'nor', 'now'] },
    { center: 'u', outer: ['s', 't', 'r', 'n', 'g', 'b'], words: ['bursting', 'trusting', 'rusting', 'busting', 'strugs', 'strung', 'brunts', 'grunts', 'stunts', 'bursts', 'trusts', 'grunt', 'stung', 'burnt', 'burst', 'trust', 'strut', 'stunt', 'brunt', 'runts', 'turns', 'burns', 'urns', 'runs', 'guns', 'buns', 'nuts', 'ruts', 'guts', 'tubs', 'rubs', 'subs', 'bugs', 'rugs', 'tugs', 'turn', 'burn', 'runt', 'bunt', 'urn', 'run', 'gun', 'bun', 'nut', 'rut', 'gut', 'tub', 'rub', 'sub', 'bug', 'rug', 'tug'] },
    { center: 'a', outer: ['c', 'h', 'r', 'm', 's', 'e'], words: ['charmer', 'marches', 'arches', 'charms', 'shears', 'shares', 'search', 'harem', 'shame', 'share', 'shear', 'charm', 'march', 'reach', 'mash', 'rash', 'cash', 'hash', 'sham', 'seam', 'ream', 'cream', 'scream', 'smear', 'ears', 'arch', 'each', 'ache', 'race', 'acre', 'care', 'mare', 'hare', 'rare', 'scare', 'area', 'sea', 'ear', 'arc', 'car', 'ash', 'has'] },
    { center: 'e', outer: ['b', 'l', 'a', 't', 's', 'k'], words: ['bleats', 'stable', 'tables', 'steaks', 'beasts', 'skates', 'basket', 'bleat', 'beast', 'steal', 'steak', 'stake', 'break', 'table', 'tales', 'stale', 'slate', 'beats', 'beaks', 'bakes', 'lakes', 'takes', 'leaks', 'bleaks', 'elates', 'beat', 'beak', 'bake', 'lake', 'take', 'leak', 'teak', 'seal', 'teal', 'belt', 'melt', 'ease', 'east', 'least', 'tea', 'sea', 'ate', 'bet', 'let', 'set'] },
    { center: 'i', outer: ['p', 'r', 'n', 't', 's', 'g'], words: ['sprinting', 'printing', 'gripping', 'stripping', 'springs', 'strings', 'prints', 'grips', 'trips', 'strips', 'sprint', 'spring', 'string', 'print', 'pints', 'tints', 'stirs', 'grins', 'sprig', 'strip', 'trips', 'grits', 'pint', 'tint', 'stir', 'grin', 'grip', 'trip', 'grit', 'spit', 'spin', 'pins', 'tins', 'rigs', 'gist', 'pits', 'sit', 'pit', 'pin', 'tin', 'rig', 'rip', 'tip', 'nip', 'sip'] },
    { center: 'o', outer: ['p', 'l', 'k', 's', 'n', 'f'], words: ['folkspn', 'spoken', 'polks', 'folks', 'pools', 'spools', 'snoops', 'loops', 'fools', 'snoop', 'spool', 'spook', 'pools', 'knops', 'flops', 'plops', 'slops', 'knoll', 'polls', 'folk', 'pool', 'fool', 'loop', 'noon', 'soon', 'moon', 'boon', 'loon', 'pons', 'sons', 'fops', 'pops', 'lops', 'sops', 'nook', 'look', 'ook', 'son', 'pop', 'lop', 'sop', 'fop', 'not', 'lot'] },
    { center: 'a', outer: ['d', 'r', 'e', 'w', 's', 'n'], words: ['wanders', 'anders', 'wardens', 'warned', 'sander', 'warden', 'answer', 'awned', 'waned', 'sawed', 'drawn', 'deans', 'weans', 'wares', 'dares', 'sands', 'wands', 'rands', 'wards', 'sward', 'snared', 'wader', 'saner', 'dean', 'wean', 'ware', 'dare', 'sand', 'wand', 'rand', 'ward', 'draw', 'swan', 'dawn', 'warn', 'earn', 'near', 'ears', 'sear', 'wear', 'dear', 'read', 'ads', 'sad', 'wad', 'rad', 'saw', 'raw', 'ear', 'are', 'awn'] },
    { center: 'e', outer: ['f', 'l', 'o', 'w', 'r', 's'], words: ['flowers', 'slower', 'lowers', 'flows', 'floes', 'fowls', 'lower', 'flower', 'slower', 'rowers', 'sewer', 'fewer', 'sower', 'ewer', 'flew', 'slew', 'fowl', 'flow', 'self', 'shelf', 'serf', 'foe', 'woe', 'ore', 'owe', 'sew', 'few', 'rew', 'elf', 'ref', 'ole', 'lore', 'fore', 'wore', 'sore', 'role', 'sole', 'we', 'roe'] },
    { center: 'i', outer: ['c', 'k', 'n', 'g', 's', 'l'], words: ['slicking', 'sticking', 'licking', 'kicking', 'sicking', 'slicks', 'sticks', 'licks', 'kicks', 'nicks', 'sicks', 'clinks', 'slings', 'clings', 'slink', 'clink', 'sling', 'cling', 'kings', 'lings', 'sings', 'gins', 'sins', 'kins', 'slick', 'stick', 'lick', 'kick', 'nick', 'sick', 'king', 'ling', 'sing', 'gin', 'sin', 'kin', 'ink', 'ski', 'ilk'] },
    { center: 'o', outer: ['m', 'b', 'c', 'r', 's', 'e'], words: ['combers', 'somber', 'comber', 'combs', 'bombs', 'tombs', 'robes', 'cobs', 'mobs', 'robs', 'sobs', 'bores', 'cores', 'sores', 'more', 'bore', 'core', 'sore', 'come', 'some', 'home', 'comb', 'bomb', 'tomb', 'robe', 'cob', 'mob', 'rob', 'sob', 'ore', 'rom'] },
    { center: 'u', outer: ['p', 'l', 'n', 'g', 's', 'e'], words: ['plunges', 'lunges', 'plunge', 'lunge', 'slung', 'spung', 'plugs', 'slugs', 'lungs', 'pungs', 'plug', 'slug', 'lung', 'pung', 'sung', 'guns', 'puns', 'suns', 'buns', 'runs', 'nuns', 'gnus', 'gun', 'pun', 'sun', 'bun', 'run', 'nun', 'gnu', 'use', 'sue', 'due', 'cue'] },
    { center: 'a', outer: ['g', 'r', 'n', 'd', 's', 'e'], words: ['dangers', 'gardens', 'grandees', 'danger', 'garden', 'grades', 'grands', 'grads', 'drags', 'range', 'grange', 'snagged', 'ranged', 'grade', 'grand', 'grad', 'drag', 'darn', 'sane', 'dane', 'rage', 'sage', 'cage', 'ages', 'dens', 'rang', 'gang', 'sang', 'dare', 'rare', 'ears', 'rag', 'sag', 'nag', 'dag', 'age', 'den', 'and', 'sad', 'rad', 'ear', 'are'] },
    { center: 'e', outer: ['p', 'n', 'd', 's', 'r', 'i'], words: ['spender', 'spinner', 'spider', 'sniper', 'spine', 'spend', 'pends', 'rends', 'sends', 'pines', 'dines', 'spine', 'diner', 'inner', 'preen', 'repine', 'pend', 'rend', 'send', 'pine', 'dine', 'ripe', 'side', 'ride', 'pens', 'dens', 'hens', 'pie', 'pen', 'den', 'hen', 'per', 'her'] },
    { center: 'i', outer: ['m', 'p', 'l', 's', 'e', 'r'], words: ['simpler', 'primers', 'limpers', 'simple', 'primer', 'limper', 'primes', 'slimes', 'limes', 'mires', 'sires', 'spires', 'ripples', 'prime', 'slime', 'lime', 'mire', 'sire', 'spire', 'slim', 'prim', 'limp', 'mile', 'pile', 'rile', 'sip', 'rip', 'lip', 'rim', 'sir', 'pier', 'miser'] },
    { center: 'o', outer: ['t', 'r', 'n', 'g', 's', 'e'], words: ['strongest', 'stronger', 'surgeon', 'snorter', 'grottes', 'stoners', 'strong', 'goners', 'toners', 'snort', 'stone', 'tones', 'goner', 'toner', 'gone', 'tone', 'gore', 'sore', 'tore', 'bore', 'more', 'nose', 'rose', 'goes', 'rots', 'dots', 'got', 'rot', 'dot', 'not', 'ton', 'son', 'one', 'ego', 'ore', 'roe'] },
    { center: 'u', outer: ['c', 'k', 's', 't', 'r', 'e'], words: ['truckers', 'sucker', 'trucker', 'tuckers', 'tucker', 'struck', 'trucks', 'suck', 'tuck', 'ruck', 'duck', 'muck', 'stuck', 'truck', 'crust', 'rusty', 'ruts', 'cuts', 'guts', 'nuts', 'buts', 'juts', 'rut', 'cut', 'gut', 'nut', 'but', 'jut', 'cue', 'sue', 'rue'] },
    { center: 'a', outer: ['t', 'h', 'e', 'r', 's', 'w'], words: ['weather', 'sweater', 'shatter', 'swather', 'waster', 'shears', 'wears', 'sears', 'tears', 'swear', 'water', 'eater', 'hater', 'rates', 'haste', 'waste', 'taste', 'wheat', 'sweat', 'heart', 'earth', 'share', 'stare', 'hare', 'ware', 'rare', 'rate', 'hate', 'ate', 'sat', 'hat', 'rat', 'was', 'saw', 'raw', 'war', 'ear', 'are', 'era', 'ash', 'has'] },
    { center: 'e', outer: ['v', 'n', 't', 'r', 's', 'i'], words: ['inverts', 'servants', 'inverts', 'invert', 'siren', 'enters', 'rents', 'vents', 'tense', 'verse', 'nerve', 'serve', 'trees', 'enter', 'sever', 'never', 'event', 'rent', 'vent', 'vest', 'rest', 'nest', 'test', 'teen', 'seen', 'tree', 'even', 'eve', 'ten', 'net', 'set', 'vet', 'rev', 'see'] },
    { center: 'i', outer: ['d', 'v', 'n', 'g', 's', 'e'], words: ['divines', 'diving', 'giving', 'divine', 'vising', 'devising', 'design', 'resign', 'signs', 'vines', 'dines', 'giver', 'diver', 'siding', 'vising', 'gives', 'dives', 'vied', 'sign', 'vine', 'dine', 'give', 'dive', 'side', 'hide', 'ride', 'vie', 'sin', 'din', 'gin', 'dig', 'vid', 'die', 'dis'] },
    { center: 'o', outer: ['l', 'v', 'e', 's', 'r', 'n'], words: ['solvent', 'revolves', 'lovers', 'solver', 'loser', 'lover', 'loves', 'solve', 'coves', 'moves', 'roves', 'overs', 'cover', 'mover', 'rover', 'over', 'love', 'cove', 'move', 'rove', 'dove', 'oven', 'role', 'sole', 'pole', 'vole', 'ore', 'one', 'ole'] },
    { center: 'u', outer: ['m', 'p', 's', 'h', 'r', 'e'], words: ['thumpers', 'supremo', 'humpers', 'pumpers', 'humper', 'pumper', 'thumper', 'super', 'pumps', 'humps', 'rumps', 'sumps', 'pumped', 'pump', 'hump', 'rump', 'sump', 'plus', 'pups', 'cups', 'sups', 'hues', 'sues', 'rues', 'dues', 'pup', 'cup', 'sup', 'hue', 'sue', 'rue', 'due', 'use', 'sum', 'hum', 'rum', 'gum', 'us', 'um'] }
];

let currentPuzzleIndex = 0;
let currentPuzzle = null;
let currentWord = '';
let foundWords = [];
let score = 0;
let selectedLetters = [];

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

function playWrong() {
    playTone(200, 0.3, 'sawtooth');
}

function playClick() {
    playTone(600, 0.05, 'square');
}

function playComplete() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.2, 'triangle'), i * 100);
    });
}

function loadProgress() {
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('wordRingProgress');
        if (saved) {
            const data = JSON.parse(saved);
            currentPuzzleIndex = data.puzzleIndex || 0;
            score = data.score || 0;
        }
    }
}

function saveProgress() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordRingProgress', JSON.stringify({
            puzzleIndex: currentPuzzleIndex,
            score: score
        }));
    }
}

function positionLetters() {
    const ring = document.getElementById('letter-ring');
    const container = document.querySelector('.ring-container');
    const containerSize = container.offsetWidth;
    const radius = (containerSize / 2) - 40;
    const centerOffset = containerSize / 2;

    ring.innerHTML = '';
    const letters = currentPuzzle.outer;
    const angleStep = (2 * Math.PI) / letters.length;

    letters.forEach((letter, index) => {
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.dataset.index = index;

        const angle = angleStep * index - Math.PI / 2;
        const x = centerOffset + radius * Math.cos(angle) - 27.5;
        const y = centerOffset + radius * Math.sin(angle) - 27.5;

        btn.style.left = x + 'px';
        btn.style.top = y + 'px';

        btn.addEventListener('click', () => selectLetter(btn, letter, 'outer-' + index));
        ring.appendChild(btn);
    });

    const centerEl = document.getElementById('center-letter');
    centerEl.textContent = currentPuzzle.center;
    centerEl.dataset.letter = currentPuzzle.center;
    centerEl.onclick = () => selectLetter(centerEl, currentPuzzle.center, 'center');
}

function selectLetter(element, letter, id) {
    if (selectedLetters.includes(id)) return;

    playClick();
    element.classList.add('selected');
    selectedLetters.push(id);
    currentWord += letter;
    document.getElementById('current-word').textContent = currentWord;
}

function clearWord() {
    currentWord = '';
    selectedLetters = [];
    document.getElementById('current-word').textContent = '';
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.getElementById('center-letter').classList.remove('selected');
}

function shuffleOuter() {
    const shuffled = [...currentPuzzle.outer];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    currentPuzzle.outer = shuffled;
    clearWord();
    positionLetters();
}

function submitWord() {
    const word = currentWord.toLowerCase();
    const msgEl = document.getElementById('message');

    if (word.length < 3) {
        msgEl.textContent = 'Word must be at least 3 letters!';
        msgEl.className = 'error';
        playWrong();
        document.querySelector('.container').classList.add('shake');
        setTimeout(() => document.querySelector('.container').classList.remove('shake'), 300);
        clearWord();
        return;
    }

    if (!word.includes(currentPuzzle.center)) {
        msgEl.textContent = `Word must contain the center letter "${currentPuzzle.center.toUpperCase()}"!`;
        msgEl.className = 'error';
        playWrong();
        clearWord();
        return;
    }

    if (foundWords.includes(word)) {
        msgEl.textContent = 'Already found this word!';
        msgEl.className = 'error';
        playWrong();
        clearWord();
        return;
    }

    if (currentPuzzle.words.includes(word)) {
        foundWords.push(word);
        const points = word.length >= 7 ? word.length * 2 : word.length;
        score += points;
        msgEl.textContent = `+${points} points!`;
        msgEl.className = 'success';
        playCorrect();
        updateDisplay();
        clearWord();

        if (foundWords.length === currentPuzzle.words.length) {
            showCompletionModal();
        }
    } else {
        msgEl.textContent = 'Not a valid word!';
        msgEl.className = 'error';
        playWrong();
        document.querySelector('.container').classList.add('shake');
        setTimeout(() => document.querySelector('.container').classList.remove('shake'), 300);
        clearWord();
    }
}

function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('words-found').textContent = foundWords.length;
    document.getElementById('total-words').textContent = currentPuzzle.words.length;
    document.getElementById('puzzle-number').textContent = currentPuzzleIndex + 1;

    const foundList = document.getElementById('found-list');
    foundList.innerHTML = '';
    foundWords.sort((a, b) => b.length - a.length).forEach(word => {
        const span = document.createElement('span');
        span.className = 'found-word';
        span.textContent = word;
        foundList.appendChild(span);
    });

    saveProgress();
}

function showHint() {
    const notFound = currentPuzzle.words.filter(w => !foundWords.includes(w));
    if (notFound.length === 0) {
        document.getElementById('message').textContent = 'You found all words!';
        return;
    }

    const randomWord = notFound[Math.floor(Math.random() * notFound.length)];
    const hint = randomWord.charAt(0).toUpperCase() + '_'.repeat(randomWord.length - 1);
    document.getElementById('message').textContent = `Hint: ${hint} (${randomWord.length} letters)`;
    document.getElementById('message').className = '';
}

function showCompletionModal() {
    playComplete();
    document.getElementById('modal-words').textContent = foundWords.length;
    document.getElementById('modal-score').textContent = score;
    document.getElementById('completion-modal').classList.remove('hidden');
    document.querySelector('.container').classList.add('celebrate');
}

function hideCompletionModal() {
    document.getElementById('completion-modal').classList.add('hidden');
    document.querySelector('.container').classList.remove('celebrate');
}

function nextPuzzle() {
    hideCompletionModal();
    currentPuzzleIndex = (currentPuzzleIndex + 1) % puzzles.length;
    loadPuzzle();
}

function loadPuzzle() {
    currentPuzzle = JSON.parse(JSON.stringify(puzzles[currentPuzzleIndex]));
    foundWords = [];
    currentWord = '';
    selectedLetters = [];
    document.getElementById('current-word').textContent = '';
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = '';
    positionLetters();
    updateDisplay();
}

function getPuzzles() {
    return puzzles;
}

function getCurrentPuzzle() {
    return currentPuzzle;
}

function setCurrentPuzzleIndex(index) {
    currentPuzzleIndex = index;
}

// Initialize game
if (typeof window !== 'undefined' && document.getElementById('letter-ring')) {
    loadProgress();
    loadPuzzle();

    document.getElementById('submit-word').addEventListener('click', submitWord);
    document.getElementById('clear-word').addEventListener('click', clearWord);
    document.getElementById('shuffle').addEventListener('click', shuffleOuter);
    document.getElementById('hint').addEventListener('click', showHint);
    document.getElementById('next-puzzle').addEventListener('click', nextPuzzle);
    document.getElementById('modal-next').addEventListener('click', nextPuzzle);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitWord();
        } else if (e.key === 'Backspace') {
            if (currentWord.length > 0) {
                currentWord = currentWord.slice(0, -1);
                const lastId = selectedLetters.pop();
                document.getElementById('current-word').textContent = currentWord;

                if (lastId === 'center') {
                    document.getElementById('center-letter').classList.remove('selected');
                } else {
                    const idx = lastId.split('-')[1];
                    document.querySelectorAll('.letter-btn')[idx].classList.remove('selected');
                }
            }
        } else if (e.key === ' ') {
            e.preventDefault();
            shuffleOuter();
        } else {
            const letter = e.key.toLowerCase();
            if (letter === currentPuzzle.center && !selectedLetters.includes('center')) {
                const centerEl = document.getElementById('center-letter');
                selectLetter(centerEl, currentPuzzle.center, 'center');
            } else {
                const btns = document.querySelectorAll('.letter-btn');
                btns.forEach((btn, idx) => {
                    if (btn.dataset.letter === letter && !selectedLetters.includes('outer-' + idx)) {
                        selectLetter(btn, letter, 'outer-' + idx);
                    }
                });
            }
        }
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
}

// Export for tests if running in Node
if (typeof module !== 'undefined') {
    module.exports = {
        puzzles,
        getPuzzles,
        getCurrentPuzzle,
        setCurrentPuzzleIndex,
        loadProgress,
        saveProgress
    };
}
