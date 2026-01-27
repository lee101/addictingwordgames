// Letter Blocks - Word Tetris Game
// A Tetris-style puzzle where letter blocks fall and players form words horizontally

// ==================== WORD DATABASE ====================
// Common English words organized by length for validation
const wordLists = {
    3: new Set([
        'ace', 'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and',
        'ant', 'any', 'ape', 'arc', 'are', 'ark', 'arm', 'art', 'ash', 'ask',
        'ate', 'awe', 'axe', 'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed',
        'bee', 'beg', 'bet', 'bid', 'big', 'bin', 'bit', 'bow', 'box', 'boy',
        'bud', 'bug', 'bun', 'bus', 'but', 'buy', 'cab', 'can', 'cap', 'car',
        'cat', 'cop', 'cow', 'cry', 'cub', 'cup', 'cut', 'dad', 'dam', 'day',
        'den', 'dew', 'did', 'die', 'dig', 'dim', 'dip', 'dog', 'dot', 'dry',
        'dub', 'dud', 'due', 'dug', 'dye', 'ear', 'eat', 'eel', 'egg', 'ego',
        'elk', 'elm', 'end', 'era', 'eve', 'eye', 'fab', 'fad', 'fan', 'far',
        'fat', 'fax', 'fed', 'fee', 'few', 'fig', 'fin', 'fir', 'fit', 'fix',
        'fly', 'foe', 'fog', 'for', 'fox', 'fry', 'fun', 'fur', 'gag', 'gap',
        'gas', 'gel', 'gem', 'get', 'gin', 'got', 'gum', 'gun', 'gut', 'guy',
        'gym', 'had', 'ham', 'has', 'hat', 'hay', 'hem', 'hen', 'her', 'hid',
        'him', 'hip', 'his', 'hit', 'hob', 'hog', 'hop', 'hot', 'how', 'hub',
        'hue', 'hug', 'hum', 'hut', 'ice', 'icy', 'ill', 'imp', 'ink', 'inn',
        'ion', 'irk', 'its', 'ivy', 'jab', 'jam', 'jar', 'jaw', 'jay', 'jet',
        'jig', 'job', 'jog', 'jot', 'joy', 'jug', 'jut', 'keg', 'ken', 'key',
        'kid', 'kin', 'kit', 'lab', 'lad', 'lag', 'lap', 'law', 'lay', 'lea',
        'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lot', 'low',
        'lug', 'mad', 'man', 'map', 'mar', 'mat', 'maw', 'may', 'men', 'met',
        'mid', 'mix', 'mob', 'mop', 'mud', 'mug', 'nab', 'nag', 'nap', 'net',
        'new', 'nil', 'nip', 'nit', 'nod', 'nor', 'not', 'now', 'nun', 'nut',
        'oak', 'oar', 'oat', 'odd', 'ode', 'off', 'oft', 'oil', 'old', 'one',
        'opt', 'orb', 'ore', 'our', 'out', 'owe', 'owl', 'own', 'pad', 'pal',
        'pan', 'pap', 'par', 'pat', 'paw', 'pay', 'pea', 'peg', 'pen', 'pep',
        'per', 'pet', 'pew', 'pie', 'pig', 'pin', 'pit', 'ply', 'pod', 'pop',
        'pot', 'pow', 'pro', 'pry', 'pub', 'pug', 'pun', 'pup', 'pus', 'put',
        'rag', 'ram', 'ran', 'rap', 'rat', 'raw', 'ray', 'red', 'ref', 'rep',
        'rib', 'rid', 'rig', 'rim', 'rip', 'rob', 'rod', 'rot', 'row', 'rub',
        'rug', 'rum', 'run', 'rut', 'rye', 'sac', 'sad', 'sag', 'sap', 'sat',
        'saw', 'say', 'sea', 'set', 'sew', 'she', 'shy', 'sin', 'sip', 'sir',
        'sis', 'sit', 'six', 'ski', 'sky', 'sly', 'sob', 'sod', 'son', 'sop',
        'sot', 'sow', 'soy', 'spa', 'spy', 'sub', 'sue', 'sum', 'sun', 'sup',
        'tab', 'tad', 'tag', 'tan', 'tap', 'tar', 'tax', 'tea', 'ten', 'the',
        'thy', 'tic', 'tie', 'tin', 'tip', 'tit', 'toe', 'tom', 'ton', 'too',
        'top', 'tot', 'tow', 'toy', 'try', 'tub', 'tug', 'two', 'urn', 'use',
        'van', 'vat', 'vet', 'via', 'vie', 'vim', 'vow', 'wad', 'wag', 'war',
        'was', 'wax', 'way', 'web', 'wed', 'wee', 'wet', 'who', 'why', 'wig',
        'win', 'wit', 'woe', 'wok', 'won', 'woo', 'wow', 'yak', 'yam', 'yap',
        'yaw', 'yea', 'yes', 'yet', 'yew', 'yin', 'you', 'zap', 'zed', 'zen',
        'zip', 'zit', 'zoo'
    ]),
    4: new Set([
        'able', 'ache', 'acid', 'aged', 'aide', 'ally', 'also', 'amid', 'arch',
        'area', 'army', 'away', 'baby', 'back', 'bait', 'bake', 'bald', 'ball',
        'band', 'bank', 'bare', 'bark', 'barn', 'base', 'bath', 'bead', 'beak',
        'beam', 'bean', 'bear', 'beat', 'beef', 'been', 'beer', 'bell', 'belt',
        'bend', 'bent', 'best', 'bike', 'bind', 'bird', 'bite', 'blow', 'blue',
        'blur', 'boat', 'body', 'boil', 'bold', 'bolt', 'bomb', 'bond', 'bone',
        'book', 'boom', 'boot', 'bore', 'born', 'boss', 'both', 'bout', 'bowl',
        'bred', 'brew', 'bulb', 'bulk', 'bull', 'bump', 'burn', 'bury', 'bush',
        'busy', 'cafe', 'cage', 'cake', 'calf', 'call', 'calm', 'came', 'camp',
        'cane', 'cape', 'card', 'care', 'carp', 'cart', 'case', 'cash', 'cast',
        'cave', 'cell', 'chat', 'chef', 'chin', 'chip', 'chop', 'city', 'clad',
        'clam', 'clap', 'claw', 'clay', 'clip', 'club', 'clue', 'coal', 'coat',
        'code', 'coil', 'coin', 'cold', 'comb', 'come', 'cone', 'cook', 'cool',
        'cope', 'copy', 'cord', 'core', 'cork', 'corn', 'cost', 'cosy', 'coup',
        'crab', 'crew', 'crib', 'crop', 'crow', 'cube', 'cult', 'curb', 'cure',
        'curl', 'cute', 'dame', 'damp', 'dare', 'dark', 'dart', 'dash', 'data',
        'date', 'dawn', 'dead', 'deaf', 'deal', 'dean', 'dear', 'debt', 'deck',
        'deed', 'deem', 'deep', 'deer', 'demo', 'dent', 'deny', 'desk', 'dial',
        'dice', 'diet', 'dire', 'dirt', 'disc', 'dish', 'disk', 'dive', 'dock',
        'does', 'dome', 'done', 'doom', 'door', 'dose', 'down', 'drag', 'draw',
        'drew', 'drip', 'drop', 'drug', 'drum', 'dual', 'duck', 'dude', 'duel',
        'dues', 'duke', 'dull', 'dumb', 'dump', 'dune', 'dunk', 'dusk', 'dust',
        'duty', 'each', 'earn', 'ease', 'east', 'easy', 'echo', 'edge', 'edit',
        'else', 'emit', 'envy', 'epic', 'euro', 'even', 'ever', 'exam', 'exit',
        'expo', 'eyed', 'face', 'fact', 'fade', 'fail', 'fair', 'fake', 'fall',
        'fame', 'farm', 'fast', 'fate', 'fawn', 'fear', 'feat', 'feed', 'feel',
        'fell', 'felt', 'fend', 'fern', 'fest', 'file', 'fill', 'film', 'find',
        'fine', 'fire', 'firm', 'fish', 'fist', 'flag', 'flap', 'flat', 'flaw',
        'flea', 'fled', 'flee', 'flew', 'flip', 'flog', 'flow', 'foam', 'fold',
        'folk', 'fond', 'font', 'food', 'fool', 'foot', 'ford', 'fore', 'fork',
        'form', 'fort', 'foul', 'four', 'fowl', 'free', 'fret', 'frog', 'from',
        'fuel', 'full', 'fund', 'funk', 'fuse', 'fuss', 'gain', 'gale', 'game',
        'gang', 'gate', 'gave', 'gaze', 'gear', 'gene', 'gift', 'girl', 'give',
        'glad', 'glow', 'glue', 'goal', 'goat', 'goes', 'gold', 'golf', 'gone',
        'good', 'gore', 'grab', 'gram', 'gray', 'grew', 'grey', 'grid', 'grim',
        'grin', 'grip', 'grit', 'grow', 'gulf', 'guru', 'gust', 'hack', 'hail',
        'hair', 'half', 'hall', 'halt', 'hand', 'hang', 'hard', 'hare', 'harm',
        'harp', 'hash', 'hate', 'haul', 'have', 'hawk', 'haze', 'hazy', 'head',
        'heal', 'heap', 'hear', 'heat', 'heck', 'heel', 'heir', 'held', 'hell',
        'helm', 'help', 'hemp', 'herb', 'herd', 'here', 'hero', 'hide', 'high',
        'hike', 'hill', 'hint', 'hire', 'hiss', 'hive', 'hoax', 'hold', 'hole',
        'holy', 'home', 'hood', 'hook', 'hoop', 'hope', 'horn', 'hose', 'host',
        'hour', 'howl', 'huge', 'hull', 'hung', 'hunt', 'hurt', 'hush', 'hymn',
        'icon', 'idea', 'idle', 'idol', 'inch', 'info', 'into', 'iron', 'isle',
        'item', 'jack', 'jade', 'jail', 'jazz', 'jean', 'jerk', 'jest', 'join',
        'joke', 'jolt', 'jump', 'June', 'July', 'junk', 'jury', 'just', 'keen',
        'keep', 'kelp', 'kept', 'kick', 'kill', 'kind', 'king', 'kiss', 'kite',
        'knee', 'knew', 'knit', 'knob', 'knot', 'know', 'lace', 'lack', 'lady',
        'laid', 'lake', 'lamb', 'lame', 'lamp', 'land', 'lane', 'lard', 'lark',
        'last', 'late', 'lava', 'lawn', 'lead', 'leaf', 'leak', 'lean', 'leap',
        'left', 'lend', 'lens', 'less', 'liar', 'lice', 'lick', 'lift', 'like',
        'limb', 'lime', 'limp', 'line', 'link', 'lion', 'list', 'live', 'load',
        'loaf', 'loan', 'lock', 'loft', 'logo', 'lone', 'long', 'look', 'loop',
        'lord', 'lore', 'lose', 'loss', 'lost', 'lots', 'loud', 'love', 'luck',
        'lump', 'lung', 'lure', 'lurk', 'lush', 'lust', 'made', 'maid', 'mail',
        'main', 'make', 'male', 'mall', 'malt', 'many', 'mare', 'mark', 'mars',
        'mask', 'mass', 'mast', 'mate', 'math', 'maze', 'meal', 'mean', 'meat',
        'meek', 'meet', 'melt', 'memo', 'mend', 'menu', 'mere', 'mesh', 'mess',
        'mild', 'mile', 'milk', 'mill', 'mind', 'mine', 'mint', 'miss', 'mist',
        'moan', 'mock', 'mode', 'mold', 'mole', 'molt', 'monk', 'mood', 'moon',
        'more', 'moss', 'most', 'moth', 'move', 'much', 'muck', 'mule', 'muse',
        'mush', 'must', 'mute', 'myth', 'nail', 'name', 'navy', 'near', 'neat',
        'neck', 'need', 'neon', 'nerd', 'nest', 'news', 'next', 'nice', 'nick',
        'nine', 'node', 'none', 'noon', 'norm', 'nose', 'note', 'noun', 'nude',
        'numb', 'oath', 'obey', 'odds', 'odor', 'okay', 'once', 'only', 'onto',
        'open', 'oral', 'ours', 'oust', 'oven', 'over', 'pace', 'pack', 'pact',
        'page', 'paid', 'pail', 'pain', 'pair', 'pale', 'palm', 'pane', 'park',
        'part', 'pass', 'past', 'path', 'pave', 'peak', 'pear', 'peat', 'peck',
        'peek', 'peel', 'peer', 'perk', 'pest', 'pick', 'pier', 'pike', 'pile',
        'pill', 'pine', 'pink', 'pint', 'pipe', 'piss', 'pity', 'plan', 'play',
        'plea', 'plod', 'plop', 'plot', 'plow', 'ploy', 'plug', 'plum', 'plus',
        'pock', 'poem', 'poet', 'poke', 'pole', 'poll', 'polo', 'pond', 'pony',
        'pool', 'poor', 'pope', 'pork', 'port', 'pose', 'post', 'pour', 'pray',
        'prep', 'prey', 'prod', 'prop', 'pull', 'pulp', 'pump', 'punk', 'pure',
        'push', 'quit', 'quiz', 'race', 'rack', 'raft', 'rage', 'raid', 'rail',
        'rain', 'rake', 'ramp', 'rang', 'rank', 'rare', 'rash', 'rate', 'rave',
        'read', 'real', 'ream', 'reap', 'rear', 'reed', 'reef', 'reel', 'rely',
        'rent', 'rest', 'rice', 'rich', 'ride', 'rift', 'ring', 'riot', 'ripe',
        'rise', 'risk', 'rite', 'road', 'roam', 'roar', 'robe', 'rock', 'rode',
        'role', 'roll', 'roof', 'room', 'root', 'rope', 'rose', 'rosy', 'rout',
        'rude', 'ruin', 'rule', 'rung', 'runt', 'rush', 'rust', 'sack', 'safe',
        'saga', 'sage', 'said', 'sail', 'sake', 'sale', 'salt', 'same', 'sand',
        'sane', 'sang', 'sank', 'save', 'scan', 'scar', 'seal', 'seam', 'sear',
        'seat', 'sect', 'seed', 'seek', 'seem', 'seen', 'self', 'sell', 'send',
        'sent', 'sewn', 'shed', 'ship', 'shoe', 'shoo', 'shop', 'shot', 'show',
        'shut', 'sick', 'side', 'sift', 'sigh', 'sign', 'silk', 'silo', 'sine',
        'sing', 'sink', 'site', 'size', 'skim', 'skin', 'skip', 'slab', 'slag',
        'slam', 'slap', 'slat', 'slay', 'sled', 'slew', 'slid', 'slim', 'slip',
        'slit', 'slob', 'slop', 'slot', 'slow', 'slug', 'slum', 'slur', 'smog',
        'snap', 'snob', 'snow', 'snub', 'snug', 'soak', 'soap', 'soar', 'sock',
        'sofa', 'soft', 'soil', 'sold', 'sole', 'solo', 'some', 'song', 'soon',
        'soot', 'sore', 'sort', 'soul', 'soup', 'sour', 'span', 'spar', 'spec',
        'sped', 'spin', 'spit', 'spot', 'spun', 'spur', 'stab', 'stag', 'star',
        'stay', 'stem', 'step', 'stew', 'stir', 'stop', 'stub', 'stud', 'stun',
        'such', 'suck', 'suit', 'sulk', 'surf', 'sway', 'swim', 'swum', 'tack',
        'tact', 'tail', 'take', 'tale', 'talk', 'tall', 'tame', 'tank', 'tape',
        'tart', 'task', 'team', 'tear', 'tech', 'teem', 'teen', 'tell', 'tend',
        'tent', 'term', 'test', 'text', 'than', 'that', 'them', 'then', 'they',
        'thin', 'this', 'thud', 'thug', 'thus', 'tick', 'tide', 'tidy', 'tied',
        'tier', 'tile', 'till', 'tilt', 'time', 'tiny', 'tire', 'toad', 'toed',
        'toil', 'told', 'toll', 'tomb', 'tone', 'took', 'tool', 'tops', 'tore',
        'torn', 'tort', 'toss', 'tour', 'town', 'tram', 'trap', 'tray', 'tree',
        'trek', 'trim', 'trio', 'trip', 'trod', 'trot', 'true', 'tube', 'tuck',
        'tuft', 'tuna', 'tune', 'turf', 'turn', 'tusk', 'tutu', 'twig', 'twin',
        'twit', 'type', 'ugly', 'undo', 'unit', 'upon', 'urge', 'used', 'user',
        'vain', 'vale', 'vane', 'vary', 'vase', 'vast', 'veal', 'veer', 'veil',
        'vein', 'vent', 'verb', 'very', 'vest', 'veto', 'vice', 'view', 'vile',
        'vine', 'visa', 'void', 'volt', 'vote', 'wade', 'wage', 'wail', 'wait',
        'wake', 'walk', 'wall', 'wand', 'want', 'ward', 'warm', 'warn', 'warp',
        'wart', 'wary', 'wash', 'wasp', 'wave', 'wavy', 'waxy', 'weak', 'wean',
        'wear', 'weed', 'week', 'weep', 'weld', 'well', 'went', 'wept', 'were',
        'west', 'what', 'when', 'whim', 'whip', 'whom', 'wick', 'wide', 'wife',
        'wild', 'will', 'wilt', 'wimp', 'wind', 'wine', 'wing', 'wink', 'wipe',
        'wire', 'wise', 'wish', 'with', 'woke', 'wolf', 'womb', 'wont', 'wood',
        'wool', 'word', 'wore', 'work', 'worm', 'worn', 'wrap', 'wren', 'writ',
        'yard', 'yarn', 'yawn', 'year', 'yell', 'yelp', 'yoga', 'yoke', 'yolk',
        'your', 'zeal', 'zero', 'zest', 'zinc', 'zone', 'zoom'
    ]),
    5: new Set([
        'about', 'above', 'abuse', 'actor', 'adapt', 'admit', 'adopt', 'adult',
        'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert',
        'alien', 'align', 'alike', 'alive', 'alley', 'allow', 'alloy', 'alone',
        'along', 'alter', 'amaze', 'ample', 'angel', 'angle', 'angry', 'anime',
        'ankle', 'annex', 'annoy', 'antic', 'apple', 'apply', 'arena', 'argue',
        'arise', 'armor', 'aroma', 'array', 'arrow', 'aside', 'asset', 'attic',
        'audio', 'audit', 'avoid', 'awake', 'award', 'aware', 'awful', 'bacon',
        'badge', 'badly', 'bagel', 'baker', 'basic', 'basin', 'basis', 'batch',
        'beach', 'beard', 'beast', 'begin', 'being', 'belly', 'below', 'bench',
        'berry', 'birth', 'black', 'blade', 'blame', 'blank', 'blast', 'blaze',
        'bleak', 'bleed', 'blend', 'bless', 'blind', 'blink', 'bliss', 'block',
        'blond', 'blood', 'bloom', 'blown', 'blues', 'bluff', 'blunt', 'blurb',
        'blurt', 'blush', 'board', 'boast', 'boost', 'booth', 'bound', 'brain',
        'brake', 'brand', 'brass', 'brave', 'bread', 'break', 'breed', 'brick',
        'bride', 'brief', 'bring', 'brink', 'brisk', 'broad', 'broke', 'brook',
        'broom', 'broth', 'brown', 'brush', 'brute', 'buddy', 'build', 'built',
        'bunch', 'burst', 'buyer', 'cabin', 'cable', 'cache', 'camel', 'candy',
        'cargo', 'carry', 'carve', 'catch', 'cater', 'cause', 'cease', 'chain',
        'chair', 'chalk', 'champ', 'chant', 'chaos', 'charm', 'chart', 'chase',
        'cheap', 'cheat', 'check', 'cheek', 'cheer', 'chess', 'chest', 'chick',
        'chief', 'child', 'chill', 'china', 'chirp', 'choir', 'choke', 'chord',
        'chore', 'chunk', 'cider', 'cigar', 'cinch', 'claim', 'clamp', 'clash',
        'clasp', 'class', 'clean', 'clear', 'clerk', 'click', 'cliff', 'climb',
        'cling', 'cloak', 'clock', 'clone', 'close', 'cloth', 'cloud', 'clown',
        'coach', 'coast', 'cobra', 'colon', 'color', 'comet', 'comic', 'coral',
        'couch', 'cough', 'could', 'count', 'coupe', 'court', 'cover', 'crack',
        'craft', 'cramp', 'crane', 'crash', 'crate', 'crave', 'crawl', 'craze',
        'crazy', 'creak', 'cream', 'creed', 'creek', 'creep', 'crest', 'crime',
        'crisp', 'croak', 'crock', 'crook', 'cross', 'crowd', 'crown', 'crude',
        'cruel', 'crush', 'crust', 'cubic', 'curly', 'curry', 'curse', 'curve',
        'cycle', 'daily', 'dairy', 'dance', 'darts', 'death', 'debut', 'decay',
        'decor', 'decoy', 'delay', 'delta', 'demon', 'dense', 'depot', 'depth',
        'derby', 'detox', 'digit', 'diner', 'dirty', 'disco', 'ditch', 'diver',
        'dizzy', 'dodge', 'doing', 'donor', 'donut', 'doubt', 'dough', 'draft',
        'drain', 'drake', 'drama', 'drank', 'drawl', 'drawn', 'dread', 'dream',
        'dress', 'dried', 'drift', 'drill', 'drink', 'drive', 'droit', 'droll',
        'drone', 'drool', 'droop', 'drown', 'drunk', 'dully', 'dummy', 'dunes',
        'dusty', 'dwarf', 'dwell', 'eager', 'eagle', 'early', 'earth', 'eaten',
        'eater', 'eaves', 'edema', 'eight', 'elbow', 'elder', 'elect', 'elite',
        'elope', 'elude', 'email', 'ember', 'empty', 'ended', 'enemy', 'enjoy',
        'enter', 'entry', 'envoy', 'equal', 'equip', 'erase', 'erect', 'erode',
        'error', 'erupt', 'essay', 'ethic', 'evade', 'event', 'every', 'exact',
        'exalt', 'exams', 'excel', 'exist', 'exile', 'expat', 'extra', 'fable',
        'facet', 'faint', 'fairy', 'faith', 'false', 'fancy', 'fatal', 'fatty',
        'fault', 'fauna', 'favor', 'feast', 'fence', 'feral', 'ferry', 'fetch',
        'fever', 'fiber', 'field', 'fiend', 'fiery', 'fifth', 'fifty', 'fight',
        'filth', 'final', 'finch', 'finer', 'first', 'fixer', 'fizzy', 'flack',
        'flair', 'flake', 'flaky', 'flame', 'flank', 'flare', 'flash', 'flask',
        'flaxy', 'fleet', 'flesh', 'flick', 'flier', 'fling', 'flint', 'float',
        'flock', 'flood', 'floor', 'flora', 'floss', 'flour', 'flout', 'flown',
        'fluid', 'fluke', 'flung', 'flunk', 'flush', 'flute', 'focal', 'focus',
        'foggy', 'folio', 'force', 'forge', 'forgo', 'forth', 'forty', 'forum',
        'fossil', 'found', 'foyer', 'frail', 'frame', 'frank', 'fraud', 'freak',
        'freed', 'fresh', 'friar', 'fried', 'frill', 'frisk', 'fritz', 'frizz',
        'frock', 'front', 'frost', 'froth', 'frown', 'froze', 'fruit', 'fudge',
        'fully', 'fumed', 'funds', 'fungi', 'funky', 'funny', 'furry', 'fused',
        'fussy', 'fuzzy', 'gaffe', 'gauge', 'genre', 'ghost', 'giant', 'given',
        'giver', 'gland', 'glare', 'glass', 'gleam', 'glide', 'glint', 'globe',
        'gloom', 'glory', 'gloss', 'glove', 'glyph', 'going', 'goose', 'gorge',
        'gouge', 'grace', 'grade', 'grain', 'grand', 'grant', 'grape', 'graph',
        'grasp', 'grass', 'grate', 'grave', 'gravy', 'graze', 'great', 'greed',
        'greek', 'green', 'greet', 'grief', 'grill', 'grind', 'gripe', 'groan',
        'groom', 'grope', 'gross', 'group', 'grove', 'growl', 'grown', 'guard',
        'guess', 'guest', 'guide', 'guild', 'guilt', 'guise', 'gulch', 'gummy',
        'guppy', 'habit', 'hairy', 'handy', 'happy', 'hardy', 'harsh', 'haste',
        'hasty', 'hatch', 'haven', 'havoc', 'hazel', 'heard', 'heart', 'heath',
        'heavy', 'hedge', 'heels', 'heist', 'hello', 'hence', 'heron', 'hinge',
        'hippo', 'hitch', 'hobby', 'hoist', 'holly', 'homer', 'honey', 'honor',
        'hoped', 'horde', 'horny', 'horse', 'hotel', 'hound', 'house', 'hover',
        'howdy', 'human', 'humid', 'humor', 'humus', 'hunch', 'hurry', 'ideal',
        'idiom', 'idiot', 'image', 'imply', 'inbox', 'index', 'indie', 'inner',
        'input', 'intro', 'issue', 'itchy', 'ivory', 'japan', 'jazzy', 'jeans',
        'jelly', 'jesus', 'jewel', 'jiffy', 'joint', 'joker', 'jolly', 'joust',
        'judge', 'juice', 'juicy', 'jumbo', 'jumpy', 'kebab', 'khaki', 'kinky',
        'kiosk', 'kitty', 'knack', 'knead', 'kneel', 'knife', 'knock', 'knoll',
        'known', 'kudos', 'label', 'labor', 'laden', 'ladle', 'lager', 'lance',
        'large', 'larva', 'laser', 'lasso', 'latch', 'later', 'latex', 'lathe',
        'laugh', 'layer', 'leach', 'leafy', 'leaky', 'leapt', 'learn', 'lease',
        'leash', 'least', 'leave', 'ledge', 'leech', 'legal', 'lemon', 'lemur',
        'level', 'lever', 'libel', 'light', 'liked', 'liken', 'lilac', 'limbo',
        'limit', 'linen', 'liner', 'lingo', 'lipid', 'liver', 'llama', 'lobby',
        'local', 'locus', 'lodge', 'lofty', 'logic', 'login', 'loins', 'loose',
        'lorry', 'loser', 'lotus', 'louse', 'lousy', 'loved', 'lover', 'lower',
        'loyal', 'lucid', 'lucky', 'lumen', 'lunar', 'lunch', 'lunge', 'lupus',
        'lurch', 'lusty', 'lying', 'lymph', 'lyric', 'macho', 'macro', 'madam',
        'madly', 'magic', 'major', 'maker', 'manga', 'mango', 'manor', 'maple',
        'march', 'marsh', 'mason', 'match', 'matte', 'mayor', 'medal', 'media',
        'medic', 'melee', 'melon', 'mercy', 'merge', 'merit', 'merry', 'messy',
        'metal', 'meter', 'metro', 'micro', 'midst', 'might', 'mimic', 'mince',
        'miner', 'minor', 'minus', 'mirth', 'miser', 'misty', 'mixed', 'mixer',
        'model', 'modem', 'moist', 'molar', 'moldy', 'money', 'month', 'moody',
        'moose', 'moral', 'morph', 'mossy', 'motel', 'motif', 'motor', 'motto',
        'mould', 'moult', 'mound', 'mount', 'mourn', 'mouse', 'mouth', 'movie',
        'mower', 'muddy', 'mulch', 'mummy', 'munch', 'mural', 'murky', 'mushy',
        'music', 'musky', 'musty', 'naive', 'named', 'nanny', 'nasal', 'nasty',
        'natal', 'naval', 'nerve', 'never', 'newer', 'newly', 'niche', 'niece',
        'night', 'nimby', 'ninja', 'ninth', 'noble', 'noise', 'noisy', 'nomad',
        'north', 'notch', 'noted', 'novel', 'nudge', 'nurse', 'nutty', 'nylon',
        'oasis', 'occur', 'ocean', 'offer', 'often', 'olive', 'omega', 'onion',
        'onset', 'opera', 'optic', 'orbit', 'order', 'organ', 'other', 'otter',
        'ought', 'ounce', 'outdo', 'outer', 'owned', 'owner', 'oxide', 'ozone',
        'paddy', 'pagan', 'paint', 'panda', 'panel', 'panic', 'paper', 'party',
        'pasta', 'paste', 'pasty', 'patch', 'patio', 'pause', 'peace', 'peach',
        'pearl', 'pedal', 'penny', 'perch', 'peril', 'perky', 'petal', 'petty',
        'phase', 'phone', 'photo', 'piano', 'piece', 'pilot', 'pinch', 'pitch',
        'pithy', 'pivot', 'pixel', 'pizza', 'place', 'plaid', 'plain', 'plane',
        'plank', 'plant', 'plate', 'plaza', 'plead', 'pleat', 'pledge', 'plier',
        'pluck', 'plumb', 'plume', 'plump', 'plunk', 'plush', 'poach', 'point',
        'poise', 'polar', 'polka', 'polyp', 'pooch', 'poppy', 'porch', 'posed',
        'poser', 'posse', 'potty', 'pouch', 'pound', 'power', 'prank', 'prawn',
        'press', 'price', 'prick', 'pride', 'prime', 'print', 'prior', 'prism',
        'privy', 'prize', 'probe', 'promo', 'prone', 'prong', 'proof', 'prose',
        'proud', 'prove', 'prowl', 'proxy', 'prune', 'psalm', 'pubic', 'pulse',
        'punch', 'pupil', 'puppy', 'puree', 'purge', 'purse', 'pushy', 'putty',
        'quack', 'quake', 'qualm', 'quart', 'queen', 'query', 'quest', 'queue',
        'quick', 'quiet', 'quill', 'quilt', 'quirk', 'quite', 'quota', 'quote',
        'rabbi', 'rabid', 'radar', 'radio', 'rainy', 'raise', 'rally', 'ranch',
        'range', 'rapid', 'ratio', 'raven', 'rayon', 'razor', 'reach', 'react',
        'ready', 'realm', 'reams', 'rebel', 'recap', 'recur', 'refer', 'regal',
        'reign', 'relax', 'relay', 'relic', 'remit', 'renal', 'renew', 'repay',
        'repel', 'reply', 'rerun', 'reset', 'resin', 'retch', 'retry', 'reuse',
        'revel', 'rhino', 'rhyme', 'rider', 'ridge', 'rifle', 'right', 'rigid',
        'rigor', 'rinse', 'ripen', 'risen', 'risky', 'ritzy', 'rival', 'river',
        'rivet', 'roach', 'roast', 'robin', 'robot', 'rocky', 'rodeo', 'rogue',
        'roman', 'roomy', 'roost', 'roots', 'rouge', 'rough', 'round', 'route',
        'rowdy', 'royal', 'rugby', 'ruler', 'rumor', 'rupee', 'rural', 'rusty',
        'sadly', 'safer', 'saint', 'salad', 'salon', 'salsa', 'salty', 'salve',
        'sandy', 'sassy', 'satay', 'satin', 'sauce', 'saucy', 'sauna', 'savor',
        'savvy', 'scale', 'scalp', 'scaly', 'scamp', 'scant', 'scare', 'scarf',
        'scary', 'scene', 'scent', 'scoff', 'scold', 'scone', 'scoop', 'scope',
        'score', 'scorn', 'scout', 'scowl', 'scram', 'scrap', 'screw', 'scrub',
        'seams', 'sedan', 'seize', 'sense', 'serum', 'serve', 'setup', 'seven',
        'sever', 'shade', 'shady', 'shaft', 'shake', 'shaky', 'shall', 'shame',
        'shape', 'shard', 'share', 'shark', 'sharp', 'shave', 'shawl', 'shear',
        'sheen', 'sheep', 'sheer', 'sheet', 'shelf', 'shell', 'shift', 'shine',
        'shiny', 'shire', 'shirt', 'shock', 'shone', 'shook', 'shoot', 'shore',
        'short', 'shout', 'shove', 'shown', 'showy', 'shrub', 'shrug', 'shuck',
        'sight', 'sigma', 'silky', 'silly', 'since', 'singe', 'siren', 'sissy',
        'sixty', 'skate', 'sketc', 'skill', 'skimp', 'skirt', 'skull', 'skunk',
        'slack', 'slain', 'slang', 'slant', 'slash', 'slate', 'slave', 'sleek',
        'sleep', 'sleet', 'slept', 'slice', 'slick', 'slide', 'slime', 'slimy',
        'sling', 'slink', 'slope', 'slosh', 'sloth', 'slump', 'slung', 'slunk',
        'slurp', 'slush', 'slyly', 'smack', 'small', 'smart', 'smash', 'smear',
        'smell', 'smelt', 'smile', 'smirk', 'smith', 'smock', 'smoke', 'smoky',
        'snack', 'snail', 'snake', 'snaky', 'snare', 'snarl', 'snazz', 'sneak',
        'sneer', 'snide', 'sniff', 'snipe', 'snoop', 'snore', 'snort', 'snout',
        'snowy', 'snuck', 'snuff', 'soapy', 'sober', 'solar', 'solid', 'solve',
        'sonar', 'sonic', 'sorry', 'sound', 'south', 'space', 'spade', 'spank',
        'spare', 'spark', 'spasm', 'spawn', 'speak', 'spear', 'specs', 'speed',
        'spell', 'spend', 'spent', 'spice', 'spicy', 'spiel', 'spike', 'spiky',
        'spill', 'spine', 'spiny', 'spite', 'splat', 'split', 'spoil', 'spoke',
        'spoof', 'spook', 'spool', 'spoon', 'sport', 'spout', 'spray', 'spree',
        'sprig', 'spunk', 'spurn', 'spurt', 'squad', 'squat', 'squid', 'stack',
        'staff', 'stage', 'staid', 'stain', 'stair', 'stake', 'stale', 'stalk',
        'stall', 'stamp', 'stand', 'stank', 'staph', 'stare', 'stark', 'start',
        'stash', 'state', 'stave', 'stead', 'steak', 'steal', 'steam', 'steel',
        'steep', 'steer', 'stern', 'stick', 'stiff', 'still', 'sting', 'stink',
        'stint', 'stock', 'stoic', 'stomp', 'stone', 'stony', 'stood', 'stool',
        'stoop', 'store', 'stork', 'storm', 'story', 'stout', 'stove', 'strap',
        'straw', 'stray', 'strip', 'strut', 'stuck', 'study', 'stuff', 'stump',
        'stung', 'stunk', 'stunt', 'style', 'suave', 'sucks', 'sugar', 'suite',
        'sulky', 'sunny', 'super', 'surge', 'surly', 'sushi', 'swamp', 'swank',
        'swarm', 'swash', 'swath', 'swear', 'sweat', 'sweep', 'sweet', 'swell',
        'swept', 'swift', 'swill', 'swine', 'swing', 'swipe', 'swirl', 'swiss',
        'swoon', 'swoop', 'sword', 'swore', 'sworn', 'swung', 'syrup', 'tabby',
        'table', 'taboo', 'tacit', 'tacky', 'taffy', 'taint', 'taken', 'taker',
        'tally', 'talon', 'tango', 'tangy', 'taper', 'tapir', 'tardy', 'taste',
        'tasty', 'taunt', 'tawny', 'teach', 'teary', 'tease', 'teddy', 'teens',
        'teeth', 'tempo', 'tense', 'tenth', 'tepid', 'terms', 'terra', 'terse',
        'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thief',
        'thigh', 'thing', 'think', 'third', 'thorn', 'those', 'three', 'threw',
        'thrift', 'throw', 'thrum', 'thumb', 'thump', 'thunk', 'tiara', 'tidal',
        'tiger', 'tight', 'tilde', 'timer', 'timid', 'tinge', 'tipsy', 'titan',
        'title', 'toast', 'today', 'token', 'tonal', 'tonic', 'tooth', 'topaz',
        'topic', 'torch', 'torso', 'total', 'totem', 'touch', 'tough', 'towel',
        'tower', 'toxic', 'trace', 'track', 'tract', 'trade', 'trail', 'train',
        'trait', 'tramp', 'trash', 'trawl', 'tread', 'treat', 'trend', 'triad',
        'trial', 'tribe', 'trick', 'tried', 'trier', 'trike', 'trill', 'trite',
        'troll', 'troop', 'trope', 'trout', 'truce', 'truck', 'truly', 'trump',
        'trunk', 'truss', 'trust', 'truth', 'tubby', 'tulip', 'tumid', 'tummy',
        'tumor', 'tuner', 'tunic', 'turbo', 'tutor', 'twain', 'twang', 'tweak',
        'tweed', 'tweet', 'twice', 'twill', 'twine', 'twirl', 'twist', 'tying',
        'udder', 'ulcer', 'ultra', 'umber', 'umbra', 'uncle', 'uncut', 'under',
        'undue', 'unfit', 'unfed', 'unify', 'union', 'unite', 'unity', 'unmet',
        'unset', 'untie', 'until', 'unwed', 'unzip', 'upper', 'upset', 'urban',
        'urine', 'usage', 'usher', 'using', 'usual', 'utter', 'vague', 'valid',
        'valor', 'value', 'valve', 'vapid', 'vapor', 'vault', 'vaunt', 'vegan',
        'veins', 'veldt', 'venom', 'venue', 'verge', 'verse', 'vicar', 'video',
        'vigil', 'vigor', 'vinyl', 'viola', 'viper', 'viral', 'virus', 'visor',
        'vista', 'vital', 'vivid', 'vixen', 'vocal', 'vodka', 'vogue', 'voice',
        'voila', 'vomit', 'voter', 'vouch', 'vowel', 'wacky', 'wafer', 'wager',
        'wagon', 'waist', 'waive', 'watch', 'water', 'waver', 'weary', 'weave',
        'wedge', 'weedy', 'weigh', 'weird', 'welsh', 'whale', 'wharf', 'wheat',
        'wheel', 'where', 'which', 'whiff', 'while', 'whine', 'whiny', 'whirl',
        'whisk', 'white', 'whole', 'whose', 'widen', 'wider', 'widow', 'width',
        'wield', 'willy', 'wimp', 'wince', 'winch', 'windy', 'wired', 'wiser',
        'witch', 'witty', 'woken', 'woman', 'women', 'woody', 'woozy', 'world',
        'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'woven', 'wrack',
        'wrath', 'wreak', 'wreck', 'wrest', 'wring', 'wrist', 'write', 'wrong',
        'wrote', 'wrung', 'yacht', 'yearn', 'yeast', 'yield', 'young', 'yours',
        'youth', 'zebra', 'zesty', 'zippy', 'zonal', 'zones'
    ]),
    6: new Set([
        'absorb', 'accept', 'access', 'accord', 'across', 'action', 'active',
        'actual', 'advice', 'advise', 'affair', 'affect', 'afford', 'afraid',
        'agency', 'agenda', 'almost', 'always', 'amount', 'animal', 'annual',
        'answer', 'anyone', 'anyway', 'appeal', 'appear', 'around', 'arrive',
        'artist', 'aspect', 'assess', 'assist', 'assume', 'attack', 'attend',
        'author', 'backed', 'backup', 'banner', 'barely', 'barrel', 'basket',
        'battle', 'beauty', 'become', 'before', 'behalf', 'behave', 'behind',
        'belief', 'belong', 'beyond', 'binary', 'bitter', 'blanket', 'border',
        'borrow', 'bottom', 'bought', 'bounce', 'branch', 'breast', 'breath',
        'bridge', 'bright', 'broken', 'bronze', 'budget', 'buffer', 'burden',
        'bureau', 'button', 'camera', 'campus', 'cancer', 'cannot', 'canvas',
        'carbon', 'career', 'castle', 'casual', 'caught', 'center', 'change',
        'charge', 'choose', 'chosen', 'church', 'circle', 'client', 'climax',
        'closed', 'closer', 'coffee', 'column', 'combat', 'comedy', 'coming',
        'commit', 'common', 'comply', 'cookie', 'copper', 'corner', 'costly',
        'cotton', 'county', 'couple', 'course', 'cousin', 'covers', 'create',
        'credit', 'crisis', 'custom', 'damage', 'danger', 'dealer', 'debate',
        'decade', 'decide', 'defeat', 'defend', 'define', 'degree', 'delete',
        'demand', 'dental', 'depend', 'deploy', 'deputy', 'derive', 'desert',
        'design', 'desire', 'detail', 'detect', 'device', 'differ', 'dinner',
        'direct', 'disney', 'doctor', 'domain', 'dollar', 'donate', 'double',
        'driven', 'driver', 'during', 'easily', 'eating', 'editor', 'effect',
        'effort', 'eighth', 'either', 'eleven', 'emerge', 'empire', 'enable',
        'ending', 'energy', 'engage', 'engine', 'enough', 'ensure', 'entire',
        'entity', 'equity', 'escape', 'estate', 'ethnic', 'evolve', 'exceed',
        'except', 'excuse', 'expand', 'expect', 'expert', 'export', 'extend',
        'extent', 'fabric', 'facing', 'factor', 'failed', 'fairly', 'fallen',
        'family', 'famous', 'farmer', 'father', 'faucet', 'favour', 'fellow',
        'female', 'figure', 'filter', 'finale', 'finger', 'finish', 'fiscal',
        'flight', 'flower', 'follow', 'forest', 'forget', 'formal', 'format',
        'former', 'fossil', 'foster', 'fought', 'fourth', 'freeze', 'french',
        'friend', 'frozen', 'future', 'galaxy', 'garden', 'gather', 'gender',
        'genius', 'gentle', 'german', 'giving', 'global', 'golden', 'google',
        'govern', 'ground', 'growth', 'guitar', 'handle', 'happen', 'harbor',
        'hardly', 'health', 'heaven', 'height', 'hidden', 'holder', 'honest',
        'horror', 'impose', 'import', 'income', 'indeed', 'inform', 'injury',
        'inside', 'intact', 'intend', 'invest', 'invite', 'island', 'itself',
        'jersey', 'jewish', 'joined', 'jungle', 'junior', 'keeper', 'kernel',
        'kicked', 'kidney', 'killer', 'knight', 'labor', 'laptop', 'latter',
        'launch', 'lawyer', 'layout', 'leader', 'league', 'legacy', 'legend',
        'lesson', 'letter', 'level', 'liable', 'lifted', 'lights', 'likely',
        'linear', 'liquid', 'listen', 'little', 'lively', 'living', 'locate',
        'locked', 'london', 'lonely', 'losing', 'lovely', 'luxury', 'magnet',
        'mainly', 'making', 'manage', 'manual', 'margin', 'marine', 'marker',
        'market', 'master', 'matter', 'medium', 'member', 'memory', 'mental',
        'mentor', 'merely', 'merger', 'method', 'middle', 'miller', 'minute',
        'mirror', 'mobile', 'modern', 'modify', 'module', 'moment', 'monkey',
        'months', 'mother', 'motion', 'moving', 'murder', 'muscle', 'museum',
        'mutual', 'myself', 'narrow', 'nation', 'native', 'nature', 'nearby',
        'nearly', 'needle', 'nephew', 'neural', 'nicely', 'ninety', 'nobody',
        'normal', 'notice', 'notion', 'number', 'object', 'obtain', 'occupy',
        'offset', 'online', 'oppose', 'option', 'orange', 'origin', 'output',
        'owner', 'oxygen', 'packed', 'palace', 'parade', 'parent', 'parish',
        'parked', 'partly', 'passes', 'patent', 'patrol', 'patron', 'paying',
        'peanut', 'pencil', 'people', 'pepper', 'period', 'permit', 'person',
        'phrase', 'pickup', 'planet', 'plants', 'plasma', 'player', 'please',
        'plenty', 'plunge', 'pocket', 'poetry', 'police', 'policy', 'polish',
        'poorly', 'portal', 'poster', 'potato', 'potter', 'powder', 'praise',
        'prayer', 'prefer', 'pretty', 'priest', 'prince', 'prison', 'profit',
        'prompt', 'proper', 'proven', 'public', 'purple', 'pursue', 'puzzle',
        'rabbit', 'racial', 'random', 'rarely', 'rather', 'rating', 'reader',
        'really', 'reason', 'recall', 'recent', 'recipe', 'record', 'reduce',
        'reform', 'refuge', 'refund', 'refuse', 'regard', 'regime', 'region',
        'regret', 'reject', 'relate', 'relief', 'remain', 'remark', 'remedy',
        'remind', 'remote', 'remove', 'render', 'rental', 'repair', 'repeat',
        'replay', 'report', 'rescue', 'resist', 'resort', 'result', 'resume',
        'retail', 'retain', 'retire', 'return', 'reveal', 'review', 'reward',
        'rhythm', 'ribbon', 'riding', 'rising', 'ritual', 'robust', 'rocket',
        'roller', 'rubber', 'ruling', 'runner', 'sacred', 'saddle', 'safari',
        'safely', 'safety', 'salary', 'salmon', 'sample', 'saving', 'saying',
        'scheme', 'school', 'screen', 'script', 'scroll', 'search', 'season',
        'second', 'secret', 'sector', 'secure', 'seeing', 'select', 'seller',
        'senate', 'senior', 'series', 'server', 'settle', 'severe', 'sexual',
        'shadow', 'shaped', 'shared', 'shield', 'shorts', 'should', 'shower',
        'signal', 'signed', 'silent', 'silver', 'simple', 'simply', 'singer',
        'single', 'sister', 'sketch', 'slider', 'slight', 'slowly', 'smooth',
        'soccer', 'social', 'socket', 'sodium', 'solely', 'solved', 'sorter',
        'sought', 'source', 'speech', 'sphere', 'spider', 'spirit', 'splash',
        'spoken', 'spread', 'spring', 'square', 'stable', 'statue', 'status',
        'steady', 'stereo', 'sticky', 'stolen', 'stored', 'strain', 'strand',
        'stream', 'street', 'stress', 'strict', 'strike', 'string', 'strong',
        'struck', 'studio', 'stupid', 'submit', 'subtle', 'suburb', 'sudden',
        'suffer', 'summit', 'sunday', 'sunset', 'supply', 'surely', 'survey',
        'switch', 'symbol', 'syntax', 'system', 'tablet', 'tactic', 'taking',
        'talent', 'target', 'tender', 'tennis', 'terror', 'tested', 'thanks',
        'theory', 'thirty', 'though', 'threat', 'thrill', 'thrive', 'throne',
        'thrown', 'thrust', 'ticket', 'timber', 'timing', 'tissue', 'toggle',
        'tongue', 'topics', 'toward', 'tracks', 'trader', 'travel', 'treaty',
        'tribal', 'tricky', 'triple', 'trophy', 'troops', 'trying', 'tunnel',
        'turkey', 'twelve', 'twenty', 'typing', 'unable', 'unique', 'united',
        'unless', 'unlike', 'unlock', 'update', 'upload', 'upward', 'urgent',
        'useful', 'vacant', 'vacuum', 'valley', 'varied', 'vector', 'vendor',
        'verbal', 'verify', 'versus', 'vessel', 'victim', 'viewer', 'violin',
        'virgin', 'virtue', 'vision', 'visual', 'volume', 'voting', 'walker',
        'wallet', 'warmth', 'wealth', 'weapon', 'weekly', 'weight', 'whales',
        'wholly', 'wicked', 'widely', 'widget', 'wilson', 'window', 'winner',
        'winter', 'wisdom', 'within', 'wizard', 'wonder', 'wooden', 'worker',
        'worthy', 'wright', 'writer', 'yellow', 'yields', 'zombie'
    ])
};

// ==================== GAME CONFIGURATION ====================
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;

const difficultySettings = {
    easy: {
        dropInterval: 1200,
        pointsMultiplier: 1,
        vowelFrequency: 0.4,
        minWordLength: 3
    },
    medium: {
        dropInterval: 800,
        pointsMultiplier: 1.5,
        vowelFrequency: 0.35,
        minWordLength: 3
    },
    hard: {
        dropInterval: 500,
        pointsMultiplier: 2,
        vowelFrequency: 0.3,
        minWordLength: 4
    }
};

// Letter frequencies for natural distribution
const letterFrequencies = {
    common: ['E', 'T', 'A', 'O', 'I', 'N', 'S', 'R', 'H', 'L'],
    medium: ['D', 'C', 'U', 'M', 'F', 'P', 'G', 'W', 'Y', 'B'],
    rare: ['V', 'K', 'X', 'J', 'Q', 'Z']
};

const vowels = ['A', 'E', 'I', 'O', 'U'];

// Tetromino shapes with letters
const tetrominoShapes = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    L: [[1, 0], [1, 0], [1, 1]],
    J: [[0, 1], [0, 1], [1, 1]]
};

const shapeKeys = Object.keys(tetrominoShapes);

// ==================== GAME STATE ====================
let score = 0;
let highScore = 0;
let level = 1;
let linesCleared = 0;
let gameActive = false;
let gamePaused = false;
let difficulty = 'medium';
let isLight = false;

let board = [];
let currentPiece = null;
let nextPiece = null;
let dropInterval = null;
let lastDropTime = 0;
let animationFrameId = null;

let audioCtx = null;

// ==================== AUDIO SYSTEM ====================
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.12) {
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

function playMoveSound() {
    playTone(300, 0.05, 'square', 0.08);
}

function playRotateSound() {
    playTone(400, 0.08, 'sine', 0.1);
}

function playDropSound() {
    playTone(200, 0.15, 'triangle', 0.1);
}

function playWordSound(wordLength) {
    const baseFreq = 400 + (wordLength * 50);
    playTone(baseFreq, 0.1, 'sine', 0.12);
    setTimeout(() => playTone(baseFreq * 1.25, 0.1, 'sine', 0.1), 80);
    setTimeout(() => playTone(baseFreq * 1.5, 0.15, 'sine', 0.08), 160);
}

function playComboSound(combo) {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.slice(0, Math.min(combo, 4)).forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.15, 'sine', 0.1), i * 100);
    });
}

function playGameOverSound() {
    const notes = [400, 350, 300, 250, 200];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.25, 'sawtooth', 0.08), i * 150);
    });
}

function playLevelUpSound() {
    const notes = [523, 659, 784, 1047, 1319]; // Ascending
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.12, 'sine', 0.1), i * 80);
    });
}

// ==================== WORD VALIDATION ====================
function isValidWord(word) {
    const lowerWord = word.toLowerCase();
    const length = lowerWord.length;

    if (length < 3 || length > 6) return false;

    return wordLists[length] && wordLists[length].has(lowerWord);
}

function findWordsInRow(row, rowIndex) {
    const words = [];
    const rowLetters = row.map(cell => cell ? cell.letter : null);

    // Find all possible words in the row
    for (let start = 0; start < BOARD_WIDTH; start++) {
        if (!rowLetters[start]) continue;

        let word = '';
        let positions = [];

        for (let end = start; end < BOARD_WIDTH && rowLetters[end]; end++) {
            word += rowLetters[end];
            positions.push({ x: end, y: rowIndex });

            if (word.length >= 3 && isValidWord(word)) {
                words.push({
                    word: word,
                    positions: [...positions],
                    length: word.length
                });
            }
        }
    }

    return words;
}

// ==================== LETTER GENERATION ====================
function getRandomLetter() {
    const settings = difficultySettings[difficulty];

    // Increase vowel chance based on difficulty
    if (Math.random() < settings.vowelFrequency) {
        return vowels[Math.floor(Math.random() * vowels.length)];
    }

    // Weighted letter selection
    const rand = Math.random();
    let letters;
    if (rand < 0.6) {
        letters = letterFrequencies.common;
    } else if (rand < 0.9) {
        letters = letterFrequencies.medium;
    } else {
        letters = letterFrequencies.rare;
    }

    return letters[Math.floor(Math.random() * letters.length)];
}

function getLetterColor(letter) {
    if (vowels.includes(letter)) {
        return { bg: '#2ed573', shadow: '#26c963' }; // Green for vowels
    }
    if (letterFrequencies.common.includes(letter)) {
        return { bg: '#48dbfb', shadow: '#0abde3' }; // Blue for common
    }
    if (letterFrequencies.medium.includes(letter)) {
        return { bg: '#feca57', shadow: '#f39c12' }; // Yellow for medium
    }
    return { bg: '#ff6b6b', shadow: '#ee5a5a' }; // Red for rare
}

// ==================== PIECE MANAGEMENT ====================
function createPiece() {
    const shapeKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    const shape = tetrominoShapes[shapeKey];

    // Generate letters for each block in the shape
    const letters = [];
    for (let y = 0; y < shape.length; y++) {
        letters[y] = [];
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                letters[y][x] = getRandomLetter();
            } else {
                letters[y][x] = null;
            }
        }
    }

    return {
        shape: shape,
        letters: letters,
        x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
        y: 0
    };
}

function rotatePiece(piece) {
    const rows = piece.shape.length;
    const cols = piece.shape[0].length;

    // Create rotated shape and letters
    const newShape = [];
    const newLetters = [];

    for (let x = 0; x < cols; x++) {
        newShape[x] = [];
        newLetters[x] = [];
        for (let y = rows - 1; y >= 0; y--) {
            newShape[x][rows - 1 - y] = piece.shape[y][x];
            newLetters[x][rows - 1 - y] = piece.letters[y][x];
        }
    }

    return {
        ...piece,
        shape: newShape,
        letters: newLetters
    };
}

function canPlace(piece, offsetX = 0, offsetY = 0) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const newX = piece.x + x + offsetX;
                const newY = piece.y + y + offsetY;

                // Check bounds
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                    return false;
                }

                // Check collision with existing blocks (only if within board)
                if (newY >= 0 && board[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placePiece() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                const boardY = currentPiece.y + y;
                const boardX = currentPiece.x + x;

                if (boardY >= 0 && boardY < BOARD_HEIGHT) {
                    board[boardY][boardX] = {
                        letter: currentPiece.letters[y][x],
                        color: getLetterColor(currentPiece.letters[y][x])
                    };
                }
            }
        }
    }

    playDropSound();
    checkAndClearWords();
    spawnNextPiece();
}

function spawnNextPiece() {
    currentPiece = nextPiece || createPiece();
    nextPiece = createPiece();

    // Check if spawn position is blocked
    if (!canPlace(currentPiece)) {
        gameOver();
        return;
    }

    updateNextPieceDisplay();
}

// ==================== WORD DETECTION & CLEARING ====================
function checkAndClearWords() {
    let totalWordsFound = [];
    let rowsToProcess = new Set();

    // Check each row for words
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        const words = findWordsInRow(board[y], y);
        if (words.length > 0) {
            // Find the longest word in this row
            const longestWord = words.reduce((a, b) => a.length > b.length ? a : b);
            totalWordsFound.push(longestWord);
            rowsToProcess.add(y);
        }
    }

    if (totalWordsFound.length > 0) {
        // Calculate score
        let points = 0;
        const combo = totalWordsFound.length;

        totalWordsFound.forEach(wordData => {
            const basePoints = wordData.length * 10;
            const lengthBonus = wordData.length >= 5 ? 50 : (wordData.length >= 4 ? 20 : 0);
            points += Math.floor((basePoints + lengthBonus) * difficultySettings[difficulty].pointsMultiplier);
        });

        // Combo bonus
        if (combo > 1) {
            points = Math.floor(points * (1 + (combo - 1) * 0.5));
            playComboSound(combo);
            showMessage(`${combo}x COMBO! +${points} points`, 'combo');
        } else {
            playWordSound(totalWordsFound[0].length);
        }

        score += points;

        // Show found words
        const wordStrings = totalWordsFound.map(w => w.word.toUpperCase()).join(', ');
        showWordFound(wordStrings);

        if (combo === 1) {
            showMessage(`"${totalWordsFound[0].word.toUpperCase()}" +${points}`, 'success');
        }

        // Clear the rows with words
        clearRows(Array.from(rowsToProcess));

        // Update stats
        linesCleared += rowsToProcess.size;
        checkLevelUp();
        updateStats();
        saveProgress();
    }
}

function clearRows(rows) {
    // Sort rows in descending order to clear from bottom to top
    rows.sort((a, b) => b - a);

    rows.forEach(rowIndex => {
        // Remove the row
        board.splice(rowIndex, 1);
        // Add empty row at top
        board.unshift(new Array(BOARD_WIDTH).fill(null));
    });
}

function checkLevelUp() {
    const newLevel = Math.floor(linesCleared / 5) + 1;
    if (newLevel > level) {
        level = newLevel;
        playLevelUpSound();
        showMessage(`LEVEL ${level}!`, 'info');

        // Highlight container
        document.querySelector('.container').classList.add('level-up');
        setTimeout(() => {
            document.querySelector('.container').classList.remove('level-up');
        }, 1000);
    }
}

// ==================== GAME LOOP ====================
function gameLoop(timestamp) {
    if (!gameActive || gamePaused) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
    }

    const settings = difficultySettings[difficulty];
    const currentDropInterval = Math.max(100, settings.dropInterval - (level - 1) * 50);

    if (timestamp - lastDropTime > currentDropInterval) {
        if (canPlace(currentPiece, 0, 1)) {
            currentPiece.y++;
        } else {
            placePiece();
        }
        lastDropTime = timestamp;
    }

    render();
    animationFrameId = requestAnimationFrame(gameLoop);
}

// ==================== RENDERING ====================
function render() {
    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= BOARD_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= BOARD_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(canvas.width, y * CELL_SIZE);
        ctx.stroke();
    }

    // Draw placed blocks
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x]) {
                drawBlock(ctx, x, y, board[y][x].letter, board[y][x].color);
            }
        }
    }

    // Draw ghost piece (where piece will land)
    if (currentPiece && gameActive && !gamePaused) {
        let ghostY = currentPiece.y;
        while (canPlace({ ...currentPiece, y: ghostY + 1 })) {
            ghostY++;
        }

        if (ghostY > currentPiece.y) {
            for (let py = 0; py < currentPiece.shape.length; py++) {
                for (let px = 0; px < currentPiece.shape[py].length; px++) {
                    if (currentPiece.shape[py][px]) {
                        const x = currentPiece.x + px;
                        const y = ghostY + py;

                        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                        ctx.fillRect(
                            x * CELL_SIZE + 2,
                            y * CELL_SIZE + 2,
                            CELL_SIZE - 4,
                            CELL_SIZE - 4
                        );

                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                        ctx.strokeRect(
                            x * CELL_SIZE + 2,
                            y * CELL_SIZE + 2,
                            CELL_SIZE - 4,
                            CELL_SIZE - 4
                        );
                    }
                }
            }
        }
    }

    // Draw current piece
    if (currentPiece && gameActive && !gamePaused) {
        for (let py = 0; py < currentPiece.shape.length; py++) {
            for (let px = 0; px < currentPiece.shape[py].length; px++) {
                if (currentPiece.shape[py][px]) {
                    const x = currentPiece.x + px;
                    const y = currentPiece.y + py;
                    const letter = currentPiece.letters[py][px];
                    const color = getLetterColor(letter);

                    if (y >= 0) {
                        drawBlock(ctx, x, y, letter, color);
                    }
                }
            }
        }
    }
}

function drawBlock(ctx, x, y, letter, color) {
    const padding = 2;
    const blockX = x * CELL_SIZE + padding;
    const blockY = y * CELL_SIZE + padding;
    const blockSize = CELL_SIZE - padding * 2;

    // Draw shadow
    ctx.fillStyle = color.shadow;
    ctx.beginPath();
    ctx.roundRect(blockX + 2, blockY + 2, blockSize, blockSize, 4);
    ctx.fill();

    // Draw main block
    const gradient = ctx.createLinearGradient(blockX, blockY, blockX + blockSize, blockY + blockSize);
    gradient.addColorStop(0, color.bg);
    gradient.addColorStop(1, color.shadow);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(blockX, blockY, blockSize, blockSize, 4);
    ctx.fill();

    // Draw highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.roundRect(blockX + 2, blockY + 2, blockSize - 4, (blockSize - 4) / 2, 2);
    ctx.fill();

    // Draw letter
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText(letter, x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function updateNextPieceDisplay() {
    const container = document.getElementById('next-piece');
    container.innerHTML = '';

    if (!nextPiece) return;

    for (let y = 0; y < nextPiece.shape.length; y++) {
        for (let x = 0; x < nextPiece.shape[y].length; x++) {
            if (nextPiece.shape[y][x]) {
                const block = document.createElement('div');
                block.className = 'next-block';
                const letter = nextPiece.letters[y][x];
                const color = getLetterColor(letter);
                block.textContent = letter;
                block.style.background = `linear-gradient(145deg, ${color.bg}, ${color.shadow})`;
                container.appendChild(block);
            }
        }
    }
}

// ==================== UI UPDATES ====================
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = 'message ' + type;

    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'message';
    }, 3000);
}

function showWordFound(word) {
    const wordEl = document.getElementById('word-found');
    wordEl.textContent = word;
    wordEl.style.animation = 'none';
    wordEl.offsetHeight; // Trigger reflow
    wordEl.style.animation = 'wordPop 0.5s ease-out';

    setTimeout(() => {
        wordEl.textContent = '';
    }, 2000);
}

function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('high-score').textContent = highScore;
    document.getElementById('level').textContent = level;
    document.getElementById('lines-cleared').textContent = linesCleared;

    // Check for new high score
    if (score > highScore) {
        highScore = score;
        document.getElementById('high-score').classList.add('new-high-score');
    }
}

function showOverlay(title, message, buttonText) {
    const overlay = document.getElementById('game-overlay');
    document.getElementById('overlay-title').textContent = title;
    document.getElementById('overlay-message').textContent = message;
    document.getElementById('overlay-btn').textContent = buttonText;
    overlay.classList.remove('hidden');
}

function hideOverlay() {
    document.getElementById('game-overlay').classList.add('hidden');
}

// ==================== GAME CONTROLS ====================
function startGame() {
    // Reset game state
    board = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
    score = 0;
    level = 1;
    linesCleared = 0;
    gameActive = true;
    gamePaused = false;
    lastDropTime = performance.now();

    document.getElementById('high-score').classList.remove('new-high-score');

    // Create pieces
    currentPiece = createPiece();
    nextPiece = createPiece();
    updateNextPieceDisplay();

    // Update UI
    updateStats();
    hideOverlay();

    document.getElementById('start-btn').textContent = 'Restart';
    document.getElementById('pause-btn').disabled = false;
    document.getElementById('pause-btn').textContent = 'Pause';

    // Start game loop
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(gameLoop);

    showMessage('Form words horizontally!', 'info');
}

function pauseGame() {
    if (!gameActive) return;

    gamePaused = !gamePaused;

    if (gamePaused) {
        document.getElementById('pause-btn').textContent = 'Resume';
        showOverlay('Paused', 'Press Resume to continue', 'Resume');
    } else {
        document.getElementById('pause-btn').textContent = 'Pause';
        hideOverlay();
        lastDropTime = performance.now();
    }
}

function gameOver() {
    gameActive = false;

    if (score > highScore) {
        highScore = score;
        saveProgress();
    }

    playGameOverSound();
    showOverlay('Game Over', `Score: ${score}`, 'Play Again');

    document.getElementById('start-btn').textContent = 'Play Again';
    document.getElementById('pause-btn').disabled = true;
}

// ==================== INPUT HANDLING ====================
function movePiece(direction) {
    if (!gameActive || gamePaused || !currentPiece) return;

    if (direction === 'left' && canPlace(currentPiece, -1, 0)) {
        currentPiece.x--;
        playMoveSound();
    } else if (direction === 'right' && canPlace(currentPiece, 1, 0)) {
        currentPiece.x++;
        playMoveSound();
    } else if (direction === 'down' && canPlace(currentPiece, 0, 1)) {
        currentPiece.y++;
        score += 1; // Soft drop bonus
    }

    render();
}

function rotatePieceAction() {
    if (!gameActive || gamePaused || !currentPiece) return;

    const rotated = rotatePiece(currentPiece);

    // Try rotation, with wall kicks
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
        if (canPlace({ ...rotated, x: currentPiece.x + kick })) {
            currentPiece.shape = rotated.shape;
            currentPiece.letters = rotated.letters;
            currentPiece.x += kick;
            playRotateSound();
            render();
            return;
        }
    }
}

function hardDrop() {
    if (!gameActive || gamePaused || !currentPiece) return;

    let dropDistance = 0;
    while (canPlace(currentPiece, 0, 1)) {
        currentPiece.y++;
        dropDistance++;
    }

    score += dropDistance * 2; // Hard drop bonus
    placePiece();
    render();
}

// ==================== PERSISTENCE ====================
function saveProgress() {
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem('letterBlocksHighScore', String(highScore));
            localStorage.setItem('letterBlocksDifficulty', difficulty);
            localStorage.setItem('letterBlocksTheme', isLight ? 'light' : 'dark');
        } catch (e) {
            // Storage not available
        }
    }
}

function loadProgress() {
    if (typeof localStorage !== 'undefined') {
        try {
            highScore = Number(localStorage.getItem('letterBlocksHighScore')) || 0;
            const savedDifficulty = localStorage.getItem('letterBlocksDifficulty');
            if (savedDifficulty) {
                difficulty = savedDifficulty;
                document.getElementById('difficulty').value = difficulty;
            }
            const savedTheme = localStorage.getItem('letterBlocksTheme');
            if (savedTheme === 'light') {
                toggleTheme();
            }
        } catch (e) {
            // Storage not available
        }
    }
    updateStats();
}

function toggleTheme() {
    isLight = !isLight;
    document.body.classList.toggle('light', isLight);
    document.querySelector('.theme-icon').textContent = isLight ? '☀️' : '🌙';
    saveProgress();
    render();
}

// ==================== EVENT LISTENERS ====================
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        loadProgress();

        // Initial render
        const canvas = document.getElementById('game-board');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Button listeners
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('overlay-btn').addEventListener('click', function() {
            if (gamePaused) {
                pauseGame();
            } else {
                startGame();
            }
        });
        document.getElementById('pause-btn').addEventListener('click', pauseGame);
        document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

        document.getElementById('difficulty').addEventListener('change', function() {
            difficulty = this.value;
            saveProgress();
        });

        // Keyboard controls
        document.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    movePiece('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    movePiece('right');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    movePiece('down');
                    break;
                case 'ArrowUp':
                case ' ':
                    e.preventDefault();
                    rotatePieceAction();
                    break;
                case 'Enter':
                    e.preventDefault();
                    hardDrop();
                    break;
                case 'p':
                case 'P':
                    e.preventDefault();
                    pauseGame();
                    break;
            }
        });

        // Mobile controls
        document.getElementById('left-btn').addEventListener('click', () => movePiece('left'));
        document.getElementById('right-btn').addEventListener('click', () => movePiece('right'));
        document.getElementById('down-btn').addEventListener('click', () => movePiece('down'));
        document.getElementById('rotate-btn').addEventListener('click', rotatePieceAction);
        document.getElementById('drop-btn').addEventListener('click', hardDrop);

        // Touch controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        canvas.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        canvas.addEventListener('touchend', function(e) {
            if (!gameActive || gamePaused) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            const minSwipe = 30;

            if (Math.abs(deltaX) < minSwipe && Math.abs(deltaY) < minSwipe) {
                // Tap - rotate
                rotatePieceAction();
            } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0) {
                    movePiece('right');
                } else {
                    movePiece('left');
                }
            } else {
                // Vertical swipe
                if (deltaY > 0) {
                    if (deltaY > 100) {
                        hardDrop();
                    } else {
                        movePiece('down');
                    }
                }
            }
        }, { passive: true });

        // Music controls
        if (window.pianoMusic) {
            const musicToggle = document.getElementById('music-toggle');
            const musicNext = document.getElementById('music-next');
            const songName = document.getElementById('song-name');

            musicToggle.addEventListener('click', () => {
                window.pianoMusic.toggleMusic();
                musicToggle.textContent = window.pianoMusic.isPlaying ? '🔇' : '🎵';
            });

            musicNext.addEventListener('click', () => {
                window.pianoMusic.nextSong();
            });

            // Update song name display
            setInterval(() => {
                if (window.pianoMusic.currentSong) {
                    songName.textContent = window.pianoMusic.currentSong.name || '';
                }
            }, 1000);
        }

        // Resize handling
        function handleResize() {
            const canvas = document.getElementById('game-board');
            const container = canvas.parentElement;
            const maxWidth = Math.min(container.clientWidth - 6, 300); // Account for border

            if (window.innerWidth <= 480) {
                canvas.style.width = '200px';
                canvas.style.height = '400px';
            } else if (window.innerWidth <= 768) {
                canvas.style.width = '240px';
                canvas.style.height = '480px';
            } else {
                canvas.style.width = '300px';
                canvas.style.height = '600px';
            }

            render();
        }

        window.addEventListener('resize', handleResize);
        handleResize();
    });
}
