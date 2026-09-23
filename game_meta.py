SITE = 'https://addictingwordgames.com'

SELF_HOSTED = {
    'typing-tower-defense': dict(new=True, title='Typing Tower Defense', short='Tower Defense', path='/typing-tower-defense', colors=('#7c2d12', '#c2410c'),
                                 tagline='Type words to destroy enemies! Build Arrow, Cannon and Frost towers and survive increasingly difficult waves.'),
    'typing-game': dict(title='Typing Game', short='Typing Game', path='/typing-game', colors=('#0f766e', '#115e59'),
                        tagline='Type falling letters before they hit the ground! Build combos and level up for higher scores.'),
    'wordle': dict(title='Infinite Wordle', short='Infinite Wordle', path='/wordle', colors=('#14532d', '#1f2937'),
                   tagline='Unlimited Wordle puzzles! Guess the 5-letter word in 6 tries, track your streak and chase the best score.'),
    'word-phzzle': dict(title='Word Phzzle', short='Word Phzzle', path='/word-phzzle', colors=('#6d28d9', '#4c1d95'),
                        tagline='Unscramble letters to form words across multiple difficulty levels, with dark mode support.'),
    'word-jumble': dict(title='Word Jumble', short='Word Jumble', path='/word-jumble', colors=('#be185d', '#831843'),
                        tagline='Race against the clock to unscramble words before time runs out. Lives, hints and high scores.'),
    'word-search': dict(new=True, title='Word Search', short='Word Search', path='/word-search', colors=('#1d4ed8', '#1e3a8a'),
                        tagline='Find hidden words in letter grids with hints, timers and difficulty levels.'),
    'gravity-words': dict(new=True, title='Gravity Words', short='Gravity Words', path='/gravity-words', colors=('#4338ca', '#0f172a'),
                          tagline='Catch falling letters, build valid words, chain combos and survive the drop.'),
    'typing-race': dict(new=True, title='Typing Race', short='Typing Race', path='/typing-race', colors=('#b91c1c', '#7f1d1d'),
                        tagline='Race the clock with real-time WPM and accuracy, plus difficulty and duration settings.'),
    'word-reactor': dict(title='Word Reactor', short='Word Reactor', path='/word-reactor', colors=('#047857', '#064e3b'),
                         tagline='Chain words under pressure before the reactor overheats.'),
    'syllable-shuffle': dict(title='Syllable Shuffle', short='Syllable Shuffle', path='/syllable-shuffle', colors=('#0e7490', '#164e63'),
                             tagline='Words are broken into syllables and scrambled. Drag and drop to reassemble them correctly!'),
    'word-evolution': dict(title='Word Evolution', short='Word Evolution', path='/word-evolution', colors=('#15803d', '#14532d'),
                           tagline='Transform one word into another one letter at a time. Each step must be a valid word.'),
    'word-duel': dict(title='Word Duel', short='Word Duel', path='/word-duel', colors=('#1e1b4b', '#0f3460'),
                      tagline="Two-player word battle! Add letters without completing a word and challenge your opponent's bluffs."),
    'speed-speller': dict(title='Speed Speller', short='Speed Speller', path='/speed-speller', colors=('#0f172a', '#1e3a5f'),
                          tagline='Listen to words spoken aloud and type them as fast as you can. Test your spelling and speed!'),
    'word-detective': dict(title='Word Detective', short='Word Detective', path='/word-detective', colors=('#3f2a14', '#78350f'),
                           tagline='Crack the case! Guess the mystery word from its definition and first letter. Use hints wisely.'),
    'word-ring': dict(title='Word Ring Puzzle', short='Word Ring', path='/word-ring', colors=('#a16207', '#713f12'),
                      tagline='Build words from a ring of letters and clear each puzzle.'),
}
EXISTING_LOGOS = {'word-detective', 'speed-speller', 'word-duel', 'word-evolution', 'syllable-shuffle'}
for _slug, _m in SELF_HOSTED.items():
    _m['slug'] = _slug
    _m['tile'] = f'/static/img/{_slug}-logo256.svg' if _slug in EXISTING_LOGOS else f'/static/img/tiles/{_slug}.svg'
    _m['og'] = f'/static/img/og/{_slug}.png'

BY_PATH = {m['path']: m for m in SELF_HOSTED.values()}

SIBLINGS = [
    ('Word Smashing', 'https://wordsmashing.com', 'Slide letters, smash words'),
    ('reWord Game', 'https://rewordgame.com', 'Swap words to make sense'),
    ('Multiplication Master', 'https://multiplicationmaster.com', 'Fast-paced maths puzzles'),
    ('Big Multiplayer Chess', 'https://bigmultiplayerchess.com', '6+ player online chess'),
    ('V5 Games', 'https://v5games.com', 'More free browser games'),
]
