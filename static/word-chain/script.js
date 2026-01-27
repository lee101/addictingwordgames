// Word Chain - Link Words Together
// Create chains where each word starts with the last letter of the previous word

// Comprehensive word list organized by starting letter for validation and hints
const wordsByLetter = {
    a: ['able', 'about', 'above', 'accept', 'across', 'act', 'action', 'add', 'admit', 'adult', 'after', 'again', 'age', 'agent', 'ago', 'agree', 'air', 'all', 'allow', 'almost', 'alone', 'along', 'already', 'also', 'always', 'among', 'amount', 'animal', 'another', 'answer', 'any', 'appear', 'apply', 'area', 'arm', 'army', 'around', 'arrive', 'art', 'article', 'artist', 'ask', 'assume', 'attack', 'attention', 'avoid', 'away', 'apple', 'anchor', 'angle', 'angry', 'aunt', 'autumn'],
    b: ['back', 'bad', 'bag', 'ball', 'bank', 'bar', 'base', 'be', 'beat', 'beautiful', 'because', 'become', 'bed', 'before', 'begin', 'behavior', 'behind', 'believe', 'benefit', 'best', 'better', 'between', 'beyond', 'big', 'bill', 'billion', 'bird', 'bit', 'black', 'blood', 'blue', 'board', 'body', 'book', 'born', 'both', 'box', 'boy', 'break', 'bring', 'brother', 'budget', 'build', 'building', 'business', 'but', 'buy', 'beach', 'bear', 'bean', 'brush', 'butter', 'button'],
    c: ['call', 'camera', 'campaign', 'can', 'cancer', 'candidate', 'capital', 'car', 'card', 'care', 'career', 'carry', 'case', 'catch', 'cause', 'cell', 'center', 'central', 'century', 'certain', 'chair', 'challenge', 'chance', 'change', 'character', 'charge', 'check', 'child', 'choice', 'choose', 'church', 'citizen', 'city', 'civil', 'claim', 'class', 'clear', 'clearly', 'close', 'coach', 'cold', 'collection', 'college', 'color', 'come', 'common', 'community', 'company', 'compare', 'computer', 'concern', 'condition', 'consider', 'contain', 'continue', 'control', 'cost', 'could', 'country', 'couple', 'course', 'court', 'cover', 'create', 'cultural', 'culture', 'cup', 'current', 'customer', 'cut', 'cake', 'carpet', 'castle', 'cloud', 'cream'],
    d: ['dance', 'danger', 'dark', 'data', 'daughter', 'day', 'dead', 'deal', 'death', 'debate', 'decade', 'decide', 'decision', 'deep', 'defense', 'degree', 'democrat', 'democratic', 'describe', 'design', 'despite', 'detail', 'determine', 'develop', 'development', 'die', 'difference', 'different', 'difficult', 'dinner', 'direction', 'director', 'discover', 'discuss', 'discussion', 'disease', 'do', 'doctor', 'dog', 'door', 'down', 'draw', 'dream', 'drive', 'drop', 'drug', 'during', 'dust', 'duty', 'dolphin', 'dragon', 'drum'],
    e: ['each', 'early', 'earth', 'east', 'easy', 'eat', 'economic', 'economy', 'edge', 'education', 'effect', 'effort', 'eight', 'either', 'election', 'else', 'employee', 'end', 'energy', 'enjoy', 'enough', 'enter', 'entire', 'environment', 'especially', 'establish', 'even', 'evening', 'event', 'ever', 'every', 'everyone', 'evidence', 'exactly', 'example', 'executive', 'exist', 'expect', 'experience', 'expert', 'explain', 'eye', 'eagle', 'ear', 'elephant', 'engine', 'envelope'],
    f: ['face', 'fact', 'factor', 'fail', 'fall', 'family', 'far', 'fast', 'father', 'fear', 'federal', 'feel', 'feeling', 'few', 'field', 'fight', 'figure', 'fill', 'film', 'final', 'finally', 'financial', 'find', 'fine', 'finger', 'finish', 'fire', 'firm', 'first', 'fish', 'five', 'floor', 'fly', 'focus', 'follow', 'food', 'foot', 'for', 'force', 'foreign', 'forget', 'form', 'former', 'forward', 'four', 'free', 'friend', 'from', 'front', 'full', 'fund', 'future', 'flower', 'forest', 'fox', 'frog', 'fruit'],
    g: ['game', 'garden', 'gas', 'general', 'generation', 'get', 'girl', 'give', 'glass', 'go', 'goal', 'god', 'gold', 'good', 'government', 'great', 'green', 'ground', 'group', 'grow', 'growth', 'guess', 'gun', 'guy', 'giant', 'gift', 'giraffe', 'glove', 'goat', 'grape', 'grass', 'guitar'],
    h: ['hair', 'half', 'hand', 'hang', 'happen', 'happy', 'hard', 'have', 'he', 'head', 'health', 'hear', 'heart', 'heat', 'heavy', 'help', 'her', 'here', 'herself', 'high', 'him', 'himself', 'his', 'history', 'hit', 'hold', 'home', 'hope', 'hospital', 'hot', 'hotel', 'hour', 'house', 'how', 'however', 'huge', 'human', 'hundred', 'husband', 'hammer', 'harbor', 'hat', 'hawk', 'hero', 'hill', 'honey', 'horse', 'hunt'],
    i: ['idea', 'identify', 'if', 'image', 'imagine', 'impact', 'important', 'improve', 'in', 'include', 'including', 'increase', 'indeed', 'indicate', 'individual', 'industry', 'information', 'inside', 'instead', 'institution', 'interest', 'international', 'interview', 'into', 'investment', 'involve', 'issue', 'it', 'item', 'its', 'itself', 'ice', 'igloo', 'ink', 'insect', 'iron', 'island', 'ivory'],
    j: ['job', 'join', 'just', 'justice', 'jacket', 'jail', 'jam', 'jar', 'jazz', 'jeans', 'jelly', 'jet', 'jewel', 'joke', 'journal', 'journey', 'joy', 'judge', 'juice', 'jump', 'jungle', 'junior'],
    k: ['keep', 'key', 'kid', 'kill', 'kind', 'king', 'kitchen', 'knee', 'know', 'knowledge', 'kangaroo', 'kayak', 'kettle', 'kick', 'kite', 'kitten', 'knife', 'knight', 'knot'],
    l: ['land', 'language', 'large', 'last', 'late', 'later', 'laugh', 'law', 'lawyer', 'lay', 'lead', 'leader', 'learn', 'least', 'leave', 'left', 'leg', 'legal', 'less', 'let', 'letter', 'level', 'lie', 'life', 'light', 'like', 'likely', 'line', 'list', 'listen', 'little', 'live', 'local', 'long', 'look', 'lose', 'loss', 'lost', 'lot', 'love', 'low', 'lake', 'lamp', 'leaf', 'lemon', 'library', 'lion', 'lizard', 'lock', 'lunch'],
    m: ['machine', 'magazine', 'main', 'maintain', 'major', 'majority', 'make', 'man', 'manage', 'management', 'manager', 'many', 'market', 'marriage', 'material', 'matter', 'may', 'maybe', 'me', 'mean', 'measure', 'media', 'medical', 'meet', 'meeting', 'member', 'memory', 'mention', 'message', 'method', 'middle', 'might', 'military', 'million', 'mind', 'minute', 'miss', 'mission', 'model', 'modern', 'moment', 'money', 'month', 'more', 'morning', 'most', 'mother', 'mouth', 'move', 'movement', 'movie', 'much', 'music', 'must', 'my', 'myself', 'magic', 'map', 'mask', 'melon', 'milk', 'mirror', 'monkey', 'moon', 'mouse', 'mud', 'muffin', 'museum'],
    n: ['name', 'nation', 'national', 'natural', 'nature', 'near', 'nearly', 'necessary', 'need', 'network', 'never', 'new', 'news', 'newspaper', 'next', 'nice', 'night', 'no', 'none', 'nor', 'north', 'not', 'note', 'nothing', 'notice', 'now', 'number', 'nail', 'neck', 'needle', 'nest', 'net', 'nose', 'notebook', 'nurse', 'nut'],
    o: ['occur', 'of', 'off', 'offer', 'office', 'officer', 'official', 'often', 'oil', 'ok', 'old', 'on', 'once', 'one', 'only', 'onto', 'open', 'operation', 'opportunity', 'option', 'or', 'order', 'organization', 'other', 'others', 'our', 'out', 'outside', 'over', 'own', 'owner', 'oak', 'ocean', 'octopus', 'olive', 'orange', 'orbit', 'organ', 'otter', 'oven', 'owl', 'oxygen'],
    p: ['page', 'pain', 'paint', 'painting', 'pair', 'paper', 'parent', 'part', 'participant', 'particular', 'particularly', 'partner', 'party', 'pass', 'past', 'patient', 'pattern', 'pay', 'peace', 'people', 'per', 'perform', 'performance', 'perhaps', 'period', 'person', 'personal', 'phone', 'physical', 'pick', 'picture', 'piece', 'place', 'plan', 'plant', 'play', 'player', 'please', 'point', 'police', 'policy', 'political', 'politics', 'poor', 'popular', 'population', 'position', 'positive', 'possible', 'power', 'practice', 'prepare', 'present', 'president', 'pressure', 'pretty', 'prevent', 'price', 'private', 'probably', 'problem', 'process', 'produce', 'product', 'production', 'professional', 'professor', 'program', 'project', 'property', 'protect', 'prove', 'provide', 'public', 'pull', 'purpose', 'push', 'put', 'palace', 'panda', 'parrot', 'peach', 'pencil', 'penguin', 'piano', 'pig', 'pillow', 'pizza', 'planet', 'pocket', 'pond', 'pool', 'potato', 'pumpkin', 'puppy', 'puzzle'],
    q: ['quality', 'question', 'quick', 'quickly', 'quiet', 'quite', 'quake', 'quarrel', 'quarter', 'queen', 'quest', 'queue', 'quilt', 'quiz'],
    r: ['race', 'radio', 'raise', 'range', 'rate', 'rather', 'reach', 'read', 'ready', 'real', 'reality', 'realize', 'really', 'reason', 'receive', 'recent', 'recently', 'recognize', 'record', 'red', 'reduce', 'reflect', 'region', 'relate', 'relationship', 'religious', 'remain', 'remember', 'remove', 'report', 'represent', 'republican', 'require', 'research', 'resource', 'respond', 'response', 'rest', 'result', 'return', 'reveal', 'rich', 'right', 'rise', 'risk', 'road', 'rock', 'role', 'room', 'rule', 'run', 'rabbit', 'racket', 'rain', 'rainbow', 'rat', 'river', 'robot', 'rocket', 'roof', 'rose', 'rug'],
    s: ['safe', 'same', 'save', 'say', 'scene', 'school', 'science', 'scientist', 'score', 'sea', 'season', 'seat', 'second', 'section', 'security', 'see', 'seek', 'seem', 'sell', 'send', 'senior', 'sense', 'series', 'serious', 'serve', 'service', 'set', 'seven', 'several', 'shake', 'shall', 'shape', 'share', 'she', 'shoot', 'shop', 'short', 'shot', 'should', 'shoulder', 'show', 'side', 'sign', 'significant', 'similar', 'simple', 'simply', 'since', 'sing', 'single', 'sister', 'sit', 'site', 'situation', 'six', 'size', 'skill', 'skin', 'small', 'smile', 'so', 'social', 'society', 'soldier', 'some', 'somebody', 'someone', 'something', 'sometimes', 'son', 'song', 'soon', 'sort', 'sound', 'source', 'south', 'southern', 'space', 'speak', 'special', 'specific', 'speech', 'spend', 'spirit', 'sport', 'spring', 'staff', 'stage', 'stand', 'standard', 'star', 'start', 'state', 'statement', 'station', 'stay', 'step', 'still', 'stock', 'stop', 'store', 'story', 'strategy', 'street', 'strong', 'structure', 'student', 'study', 'stuff', 'style', 'subject', 'success', 'successful', 'such', 'suddenly', 'suffer', 'suggest', 'summer', 'sun', 'support', 'sure', 'surface', 'system', 'saddle', 'sail', 'salad', 'salmon', 'sand', 'sandwich', 'satellite', 'sauce', 'seal', 'seed', 'shark', 'sheep', 'shell', 'ship', 'shoe', 'silver', 'skirt', 'sky', 'sleep', 'snake', 'snow', 'soap', 'sock', 'sofa', 'soup', 'spider', 'spoon', 'squirrel', 'stamp', 'storm', 'straw', 'strawberry', 'sugar', 'suit', 'sunflower', 'swan', 'sweater', 'swim', 'sword'],
    t: ['table', 'take', 'talk', 'task', 'tax', 'teach', 'teacher', 'team', 'technology', 'television', 'tell', 'ten', 'tend', 'term', 'test', 'than', 'thank', 'that', 'the', 'their', 'them', 'themselves', 'then', 'theory', 'there', 'these', 'they', 'thing', 'think', 'third', 'this', 'those', 'though', 'thought', 'thousand', 'threat', 'three', 'through', 'throughout', 'throw', 'thus', 'time', 'to', 'today', 'together', 'tonight', 'too', 'top', 'total', 'tough', 'toward', 'town', 'trade', 'traditional', 'training', 'travel', 'treat', 'treatment', 'tree', 'trial', 'trip', 'trouble', 'true', 'truth', 'try', 'turn', 'two', 'type', 'tail', 'tank', 'tape', 'target', 'taxi', 'tent', 'ticket', 'tiger', 'toast', 'tomato', 'tongue', 'tool', 'tooth', 'tornado', 'tortoise', 'towel', 'tower', 'toy', 'track', 'tractor', 'traffic', 'train', 'trap', 'treasure', 'truck', 'trumpet', 'trunk', 'tulip', 'tunnel', 'turkey', 'turtle'],
    u: ['under', 'understand', 'unit', 'until', 'up', 'upon', 'us', 'use', 'usually', 'umbrella', 'uncle', 'uniform', 'union', 'unique', 'universe', 'university', 'urban', 'urgent'],
    v: ['value', 'various', 'very', 'victim', 'view', 'violence', 'visit', 'voice', 'vote', 'vacation', 'valley', 'van', 'vase', 'vegetable', 'vehicle', 'verse', 'vest', 'victory', 'video', 'village', 'vine', 'violin', 'virus', 'vision', 'volcano', 'volleyball', 'volunteer', 'voyage', 'vulture'],
    w: ['wait', 'walk', 'wall', 'want', 'war', 'warm', 'watch', 'water', 'way', 'we', 'weapon', 'wear', 'week', 'weight', 'well', 'west', 'western', 'what', 'whatever', 'when', 'where', 'whether', 'which', 'while', 'white', 'who', 'whole', 'whom', 'whose', 'why', 'wide', 'wife', 'will', 'win', 'wind', 'window', 'winter', 'wish', 'with', 'within', 'without', 'woman', 'wonder', 'word', 'work', 'worker', 'world', 'worry', 'would', 'write', 'writer', 'wrong', 'waffle', 'wagon', 'wallet', 'walnut', 'walrus', 'wand', 'wardrobe', 'waterfall', 'watermelon', 'wave', 'wax', 'whale', 'wheat', 'wheel', 'whistle', 'wig', 'wing', 'wizard', 'wolf', 'wood', 'wool', 'worm'],
    x: ['xenon', 'xerox', 'xylophone'],
    y: ['yard', 'year', 'yes', 'yesterday', 'yet', 'you', 'young', 'your', 'yourself', 'youth', 'yacht', 'yak', 'yam', 'yarn', 'yawn', 'yellow', 'yogurt'],
    z: ['zero', 'zone', 'zebra', 'zenith', 'zephyr', 'zigzag', 'zinc', 'zip', 'zipper', 'zodiac', 'zombie', 'zoo', 'zoom']
};

// Create a Set of all valid words for fast lookup
const validWords = new Set();
Object.values(wordsByLetter).forEach(words => {
    words.forEach(word => validWords.add(word.toLowerCase()));
});

// Difficulty settings
const difficultySettings = {
    easy: { timeLimit: 90, pointsMultiplier: 1 },
    medium: { timeLimit: 60, pointsMultiplier: 1.5 },
    hard: { timeLimit: 45, pointsMultiplier: 2 },
    endless: { timeLimit: Infinity, pointsMultiplier: 1 }
};

// Game state
let chain = [];
let score = 0;
let highScore = 0;
let timeLeft = 60;
let difficulty = 'medium';
let gameActive = false;
let timerInterval = null;
let requiredLetter = '';

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
    const baseFreq = 400 + (chain.length * 20);
    playTone(baseFreq, 0.15, 'sine', 0.12);
    setTimeout(() => playTone(baseFreq * 1.25, 0.15, 'sine', 0.1), 80);
    setTimeout(() => playTone(baseFreq * 1.5, 0.2, 'sine', 0.08), 160);
}

function playWrongSound() {
    playTone(200, 0.2, 'sawtooth', 0.1);
    setTimeout(() => playTone(150, 0.25, 'sawtooth', 0.08), 100);
}

function playGameOverSound() {
    const notes = [500, 400, 300, 200];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.3, 'triangle', 0.1), i * 150);
    });
}

function playStartSound() {
    const notes = [300, 400, 500, 600];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.15, 'sine', 0.1), i * 80);
    });
}

function playMilestoneSound() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.2, 'sine', 0.1), i * 80);
    });
}

// DOM functions
function loadProgress() {
    if (typeof localStorage !== 'undefined') {
        highScore = Number(localStorage.getItem('wordChainHighScore')) || 0;

        const savedDifficulty = localStorage.getItem('wordChainDifficulty');
        if (savedDifficulty && difficultySettings[savedDifficulty]) {
            difficulty = savedDifficulty;
            document.getElementById('difficulty').value = difficulty;
        }

        const savedTheme = localStorage.getItem('wordChainTheme');
        if (savedTheme === 'light') {
            document.body.classList.add('light');
            document.getElementById('theme-toggle').textContent = 'Dark Mode';
        }
    }
    updateStats();
}

function saveProgress() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordChainHighScore', String(highScore));
        localStorage.setItem('wordChainDifficulty', difficulty);
    }
}

function updateStats() {
    document.getElementById('chain-length').textContent = chain.length;
    document.getElementById('score').textContent = score;
    document.getElementById('high-score').textContent = highScore;

    if (difficulty === 'endless') {
        document.getElementById('timer').textContent = '∞';
    } else {
        document.getElementById('timer').textContent = timeLeft;
    }

    document.getElementById('required-letter').textContent = requiredLetter ? requiredLetter.toUpperCase() : '-';
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = 'message ' + type;

    setTimeout(() => {
        if (msg.textContent === text) {
            msg.textContent = '';
            msg.className = 'message';
        }
    }, 2500);
}

function updateChainDisplay() {
    const scroll = document.getElementById('chain-scroll');
    scroll.innerHTML = '';

    if (chain.length === 0) {
        scroll.innerHTML = '<div class="chain-placeholder">Your chain will appear here...</div>';
        return;
    }

    chain.forEach((word, index) => {
        const wordEl = document.createElement('div');
        wordEl.className = 'chain-word';

        // Highlight the connecting letters
        const lastChar = word.charAt(word.length - 1);
        const mainPart = word.slice(0, -1);

        wordEl.innerHTML = `
            <span class="word-number">${index + 1}</span>
            <span class="word-text">${mainPart}<span class="connecting-letter">${lastChar}</span></span>
        `;

        // Add animation for new words
        if (index === chain.length - 1) {
            wordEl.classList.add('new-word');
        }

        scroll.appendChild(wordEl);
    });

    // Scroll to the bottom to show the latest word
    const display = document.getElementById('chain-display');
    display.scrollTop = display.scrollHeight;
}

function isValidWord(word) {
    return validWords.has(word.toLowerCase());
}

function isWordInChain(word) {
    return chain.some(w => w.toLowerCase() === word.toLowerCase());
}

function getRandomStartingLetter() {
    // Prefer common letters that have many words starting with them
    const commonLetters = ['s', 't', 'c', 'p', 'b', 'm', 'r', 'd', 'a', 'f', 'h', 'l', 'w', 'g', 'n', 'e'];
    return commonLetters[Math.floor(Math.random() * commonLetters.length)];
}

function getHint() {
    if (!gameActive || score < 10) {
        if (score < 10) {
            showMessage('Need at least 10 points for a hint!', 'error');
        }
        return;
    }

    const letter = requiredLetter.toLowerCase();
    const availableWords = wordsByLetter[letter] || [];
    const unusedWords = availableWords.filter(w => !isWordInChain(w));

    if (unusedWords.length === 0) {
        showMessage('No hints available for this letter!', 'info');
        return;
    }

    // Pick a random hint word
    const hintWord = unusedWords[Math.floor(Math.random() * unusedWords.length)];

    // Deduct points
    score = Math.max(0, score - 10);
    updateStats();
    saveProgress();

    showMessage(`Hint: Try "${hintWord}"`, 'info');
    playTone(400, 0.1, 'sine', 0.08);
}

function submitWord() {
    if (!gameActive) return;

    const input = document.getElementById('word-input');
    const word = input.value.trim().toLowerCase();

    if (!word) return;

    // Validate the word
    if (word.length < 2) {
        showMessage('Word must be at least 2 letters!', 'error');
        playWrongSound();
        shakeInput();
        input.value = '';
        return;
    }

    if (!isValidWord(word)) {
        showMessage(`"${word}" is not a valid word!`, 'error');
        playWrongSound();
        shakeInput();
        input.value = '';
        return;
    }

    if (isWordInChain(word)) {
        showMessage(`"${word}" already used in this chain!`, 'error');
        playWrongSound();
        shakeInput();
        input.value = '';
        return;
    }

    // Check if word starts with required letter
    if (requiredLetter && word.charAt(0) !== requiredLetter.toLowerCase()) {
        showMessage(`Word must start with "${requiredLetter.toUpperCase()}"!`, 'error');
        playWrongSound();
        shakeInput();
        input.value = '';
        return;
    }

    // Word is valid! Add to chain
    chain.push(word);

    // Calculate points (longer words = more points)
    const settings = difficultySettings[difficulty];
    const basePoints = word.length * 10;
    const chainBonus = Math.floor(chain.length / 5) * 5; // Bonus every 5 words
    const points = Math.floor((basePoints + chainBonus) * settings.pointsMultiplier);
    score += points;

    // Check for milestones
    if (chain.length % 10 === 0) {
        playMilestoneSound();
        showMessage(`Amazing! ${chain.length} word chain! +${points} pts`, 'success');
        celebrateContainer();
    } else if (chain.length % 5 === 0) {
        showMessage(`Great streak! ${chain.length} words! +${points} pts`, 'success');
    } else {
        showMessage(`+${points} points!`, 'success');
    }

    playCorrectSound();

    // Update required letter for next word
    requiredLetter = word.charAt(word.length - 1);

    // Update high score
    if (score > highScore) {
        highScore = score;
    }

    // Update display
    updateChainDisplay();
    updateStats();
    saveProgress();

    // Clear input
    input.value = '';
    input.focus();
}

function shakeInput() {
    const input = document.getElementById('word-input');
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 400);
}

function celebrateContainer() {
    const container = document.querySelector('.container');
    container.classList.add('celebrate');
    setTimeout(() => container.classList.remove('celebrate'), 600);
}

function startGame() {
    // Reset state
    chain = [];
    score = 0;
    const settings = difficultySettings[difficulty];
    timeLeft = settings.timeLimit;
    gameActive = true;

    // Pick a random starting letter
    requiredLetter = getRandomStartingLetter();

    playStartSound();

    // Update UI
    updateChainDisplay();
    updateStats();

    // Enable input
    const input = document.getElementById('word-input');
    const submitBtn = document.getElementById('submit-btn');
    const hintBtn = document.getElementById('hint-btn');
    const startBtn = document.getElementById('start-btn');
    const difficultySelect = document.getElementById('difficulty');

    input.disabled = false;
    submitBtn.disabled = false;
    hintBtn.disabled = false;
    difficultySelect.disabled = true;
    startBtn.textContent = 'Playing...';
    startBtn.disabled = true;

    input.focus();

    showMessage(`Start with a word beginning with "${requiredLetter.toUpperCase()}"!`, 'info');

    // Start timer (unless endless mode)
    if (difficulty !== 'endless') {
        timerInterval = setInterval(() => {
            timeLeft--;
            updateStats();

            if (timeLeft <= 10 && timeLeft > 0) {
                playTone(800, 0.1, 'sine', 0.05);
            }

            if (timeLeft <= 0) {
                gameOver();
            }
        }, 1000);
    }
}

function gameOver() {
    gameActive = false;

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    playGameOverSound();

    // Disable input
    const input = document.getElementById('word-input');
    const submitBtn = document.getElementById('submit-btn');
    const hintBtn = document.getElementById('hint-btn');
    const startBtn = document.getElementById('start-btn');
    const difficultySelect = document.getElementById('difficulty');

    input.disabled = true;
    submitBtn.disabled = true;
    hintBtn.disabled = true;
    difficultySelect.disabled = false;
    startBtn.textContent = 'Play Again';
    startBtn.disabled = false;

    // Update high score
    if (score > highScore) {
        highScore = score;
        showMessage(`Game Over! New High Score: ${score}!`, 'success');
    } else {
        showMessage(`Game Over! Chain: ${chain.length} words, Score: ${score}`, 'info');
    }

    saveProgress();
    updateStats();
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    document.getElementById('theme-toggle').textContent = isLight ? 'Dark Mode' : 'Light Mode';

    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordChainTheme', isLight ? 'light' : 'dark');
    }
}

// Initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        loadProgress();

        const input = document.getElementById('word-input');
        const submitBtn = document.getElementById('submit-btn');
        const startBtn = document.getElementById('start-btn');
        const hintBtn = document.getElementById('hint-btn');
        const difficultySelect = document.getElementById('difficulty');
        const themeToggle = document.getElementById('theme-toggle');

        // Start button
        startBtn.addEventListener('click', startGame);

        // Submit word
        submitBtn.addEventListener('click', submitWord);

        // Input handling
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitWord();
            }
        });

        // Hint button
        hintBtn.addEventListener('click', getHint);

        // Difficulty change
        difficultySelect.addEventListener('change', function(e) {
            difficulty = e.target.value;
            saveProgress();
        });

        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);

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
            if (e.key === 'Enter' && e.target === input) {
                e.preventDefault();
            }
        });
    });
}
