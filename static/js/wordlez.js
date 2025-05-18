document.addEventListener('DOMContentLoaded', function () {
    const WORDS = [
        'APPLE','BRAIN','TRAIN','COVER','LEVEL','PLANT','LIGHT','WORDS','MIGHT','SCORE',
        'GUESS','HOUSE','SHEEP','CLOUD','DRINK','PHOTO','RADIO','MONEY','GRAPE','SUGAR',
        'TABLE','CHAIR','BREAD','PLANE','TRUCK','CYCLE','SHARE','SMART','POWER','WATER',
        'SEVEN','EIGHT','NINTH','TENTH','JUICE','BLACK','WHITE','GREEN','YOUTH','ROBOT'
    ];

    const board = document.getElementById('board');
    const guessInput = document.getElementById('guess');
    const guessBtn = document.getElementById('guess-btn');

    let words = [];
    let currentIndex = 0;

    function randWord() {
        return WORDS[Math.floor(Math.random() * WORDS.length)];
    }

    function startLevel() {
        board.innerHTML = '';
        words = [];
        for (let i = 0; i < 3; i++) {
            const w = randWord();
            words.push(w);
            const row = document.createElement('div');
            row.className = 'row';
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                row.appendChild(cell);
            }
            board.appendChild(row);
        }
        currentIndex = 0;
        guessInput.value = '';
        guessInput.focus();
    }

    function makeGuess() {
        const guess = guessInput.value.toUpperCase();
        if (guess.length !== 5) {
            alert('Enter 5 letters');
            return;
        }
        const word = words[currentIndex];
        const row = board.children[currentIndex];
        for (let i = 0; i < 5; i++) {
            const cell = row.children[i];
            const letter = guess[i];
            cell.textContent = letter;
            if (letter === word[i]) {
                cell.classList.add('correct');
            } else if (word.includes(letter)) {
                cell.classList.add('present');
            } else {
                cell.classList.add('absent');
            }
        }
        if (guess === word) {
            currentIndex++;
            if (currentIndex >= words.length) {
                setTimeout(() => alert('Great job! Starting next level.'), 10);
                startLevel();
            } else {
                guessInput.value = '';
                guessInput.focus();
            }
        } else {
            guessInput.value = '';
            guessInput.focus();
        }
    }

    guessBtn.addEventListener('click', makeGuess);
    guessInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            makeGuess();
        }
    });

    startLevel();
});
