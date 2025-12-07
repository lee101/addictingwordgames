// Word Merge Battle - Epic Word Combat Game
// ==========================================

// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Word Lists for Validation
const validWords = new Set([
    // 2-letter words
    'at', 'be', 'by', 'do', 'go', 'he', 'if', 'in', 'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 'we',
    'an', 'as', 'am', 'ax', 'ah', 'aw', 'ay', 'bi', 'bo', 'ed', 'ef', 'eh', 'el', 'em', 'en', 'er', 'es', 'et', 'ex', 'fa', 'go',
    'ha', 'hi', 'hm', 'ho', 'id', 'jo', 'ka', 'la', 'li', 'lo', 'ma', 'mi', 'mm', 'mo', 'mu', 'na', 'ne', 'nu', 'od', 'oe', 'oh',
    'oi', 'ok', 'om', 'op', 'os', 'ow', 'ox', 'oy', 'pa', 'pe', 'pi', 'po', 're', 'sh', 'si', 'ta', 'ti', 'uh', 'um', 'un', 'ut',
    'wo', 'xi', 'xu', 'ya', 'ye', 'yo', 'za',
    // 3-letter words
    'ace', 'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and', 'ant', 'any', 'ape', 'arc', 'are', 'ark', 'arm', 'art', 'ash', 'ask',
    'ate', 'awe', 'axe', 'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed', 'bee', 'beg', 'bet', 'bid', 'big', 'bin', 'bit', 'bob', 'bog', 'bow',
    'box', 'boy', 'bud', 'bug', 'bun', 'bus', 'but', 'buy', 'cab', 'cam', 'can', 'cap', 'car', 'cat', 'cob', 'cod', 'cog', 'cop', 'cot', 'cow',
    'cry', 'cub', 'cud', 'cup', 'cur', 'cut', 'dab', 'dad', 'dam', 'day', 'den', 'dew', 'did', 'die', 'dig', 'dim', 'dip', 'doc', 'doe', 'dog',
    'don', 'dot', 'dry', 'dub', 'dud', 'due', 'dug', 'dye', 'ear', 'eat', 'eel', 'egg', 'ego', 'elf', 'elk', 'elm', 'emu', 'end', 'era', 'eve',
    'ewe', 'eye', 'fad', 'fan', 'far', 'fat', 'fax', 'fed', 'fee', 'fen', 'few', 'fib', 'fig', 'fin', 'fir', 'fit', 'fix', 'fly', 'fob', 'foe',
    'fog', 'fop', 'for', 'fox', 'fry', 'fun', 'fur', 'gab', 'gag', 'gap', 'gas', 'gay', 'gel', 'gem', 'get', 'gig', 'gin', 'gnu', 'gob', 'god',
    'got', 'gum', 'gun', 'gut', 'guy', 'gym', 'had', 'ham', 'has', 'hat', 'hay', 'hem', 'hen', 'her', 'hew', 'hex', 'hid', 'him', 'hip', 'his',
    'hit', 'hob', 'hog', 'hop', 'hot', 'how', 'hub', 'hue', 'hug', 'hum', 'hut', 'ice', 'icy', 'ill', 'imp', 'ink', 'inn', 'ion', 'ire', 'irk',
    'its', 'ivy', 'jab', 'jag', 'jam', 'jar', 'jaw', 'jay', 'jet', 'jig', 'job', 'jog', 'jot', 'joy', 'jug', 'jut', 'keg', 'ken', 'key', 'kid',
    'kin', 'kit', 'lab', 'lac', 'lad', 'lag', 'lap', 'law', 'lax', 'lay', 'lea', 'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lop',
    'lot', 'low', 'lug', 'mad', 'man', 'map', 'mar', 'mat', 'maw', 'may', 'men', 'met', 'mid', 'mix', 'mob', 'mod', 'mom', 'mop', 'mow', 'mud',
    'mug', 'mum', 'nab', 'nag', 'nap', 'nay', 'net', 'new', 'nib', 'nil', 'nip', 'nit', 'nob', 'nod', 'nor', 'not', 'now', 'nub', 'nun', 'nut',
    'oak', 'oar', 'oat', 'odd', 'ode', 'off', 'oft', 'ohm', 'oil', 'old', 'one', 'opt', 'orb', 'ore', 'our', 'out', 'owe', 'owl', 'own', 'pad',
    'pal', 'pan', 'pap', 'par', 'pat', 'paw', 'pay', 'pea', 'peg', 'pen', 'pep', 'per', 'pet', 'pew', 'pie', 'pig', 'pin', 'pit', 'ply', 'pod',
    'pop', 'pot', 'pow', 'pro', 'pry', 'pub', 'pug', 'pun', 'pup', 'pus', 'put', 'rag', 'ram', 'ran', 'rap', 'rat', 'raw', 'ray', 'red', 'ref',
    'rep', 'rib', 'rid', 'rig', 'rim', 'rip', 'rob', 'rod', 'roe', 'rot', 'row', 'rub', 'rug', 'rum', 'run', 'rut', 'rye', 'sac', 'sad', 'sag',
    'sap', 'sat', 'saw', 'say', 'sea', 'set', 'sew', 'she', 'shy', 'sin', 'sip', 'sir', 'sis', 'sit', 'six', 'ski', 'sky', 'sly', 'sob', 'sod',
    'son', 'sop', 'sot', 'sow', 'soy', 'spa', 'spy', 'sty', 'sub', 'sum', 'sun', 'sup', 'tab', 'tad', 'tag', 'tan', 'tap', 'tar', 'tat', 'tax',
    'tea', 'ten', 'the', 'thy', 'tic', 'tie', 'tin', 'tip', 'tit', 'toe', 'tog', 'tom', 'ton', 'too', 'top', 'tot', 'tow', 'toy', 'try', 'tub',
    'tug', 'tun', 'tux', 'two', 'ugh', 'urn', 'use', 'van', 'vat', 'vet', 'via', 'vie', 'vim', 'vow', 'wad', 'wag', 'war', 'was', 'wax', 'way',
    'web', 'wed', 'wee', 'wet', 'who', 'why', 'wig', 'win', 'wit', 'woe', 'wok', 'won', 'woo', 'wow', 'yak', 'yam', 'yap', 'yaw', 'yea', 'yen',
    'yes', 'yet', 'yew', 'yin', 'yip', 'you', 'yow', 'zap', 'zed', 'zee', 'zen', 'zig', 'zip', 'zit', 'zoo',
    // 4-letter words
    'able', 'ache', 'acid', 'aged', 'aide', 'ally', 'also', 'arch', 'area', 'army', 'away', 'baby', 'back', 'bake', 'ball', 'band', 'bang', 'bank', 'bare', 'bark',
    'barn', 'base', 'bath', 'bead', 'beak', 'beam', 'bean', 'bear', 'beat', 'been', 'beer', 'bell', 'belt', 'bend', 'bent', 'best', 'bird', 'bite', 'blow', 'blue',
    'boat', 'body', 'boil', 'bold', 'bolt', 'bomb', 'bond', 'bone', 'book', 'boom', 'boot', 'bore', 'born', 'boss', 'both', 'bowl', 'bred', 'brow', 'bulk', 'bull',
    'burn', 'bush', 'busy', 'buzz', 'cafe', 'cage', 'cake', 'calf', 'call', 'calm', 'came', 'camp', 'cane', 'cape', 'card', 'care', 'cart', 'case', 'cash', 'cast',
    'cave', 'cell', 'chef', 'chip', 'chop', 'city', 'clam', 'clan', 'clap', 'claw', 'clay', 'clip', 'club', 'clue', 'coal', 'coat', 'code', 'coil', 'coin', 'cold',
    'come', 'cook', 'cool', 'cope', 'copy', 'cord', 'core', 'cork', 'corn', 'cost', 'cozy', 'crab', 'crew', 'crop', 'crow', 'cube', 'cure', 'curl', 'cute', 'damp',
    'dare', 'dark', 'dart', 'dash', 'data', 'date', 'dawn', 'dead', 'deaf', 'deal', 'dean', 'dear', 'debt', 'deck', 'deed', 'deem', 'deep', 'deer', 'demo', 'deny',
    'desk', 'dial', 'dice', 'died', 'diet', 'dirt', 'disc', 'dish', 'disk', 'dive', 'dock', 'does', 'doll', 'dome', 'done', 'doom', 'door', 'dose', 'down', 'drag',
    'draw', 'drew', 'drip', 'drop', 'drug', 'drum', 'dual', 'duck', 'dull', 'dumb', 'dump', 'dune', 'dust', 'duty', 'each', 'earn', 'ease', 'east', 'easy', 'echo',
    'edge', 'edit', 'else', 'emit', 'ends', 'epic', 'even', 'ever', 'evil', 'exam', 'exit', 'face', 'fact', 'fade', 'fail', 'fair', 'fake', 'fall', 'fame', 'fang',
    'fare', 'farm', 'fast', 'fate', 'fear', 'feat', 'feed', 'feel', 'feet', 'fell', 'felt', 'fern', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish',
    'fist', 'five', 'flag', 'flap', 'flat', 'flaw', 'flea', 'fled', 'fled', 'flew', 'flip', 'flit', 'flow', 'foam', 'fold', 'folk', 'font', 'food', 'fool', 'foot',
    'ford', 'fork', 'form', 'fort', 'foul', 'four', 'fowl', 'free', 'frog', 'from', 'fuel', 'full', 'fume', 'fund', 'fuse', 'fuss', 'gain', 'gale', 'game', 'gang',
    'gate', 'gave', 'gaze', 'gear', 'gene', 'gift', 'girl', 'give', 'glad', 'glow', 'glue', 'goal', 'goat', 'goes', 'gold', 'golf', 'gone', 'good', 'gown', 'grab',
    'gray', 'grew', 'grid', 'grim', 'grin', 'grip', 'grow', 'gulf', 'guru', 'gust', 'hack', 'hail', 'hair', 'half', 'hall', 'halt', 'hand', 'hang', 'hard', 'hare',
    'harm', 'harp', 'hate', 'haul', 'have', 'hawk', 'haze', 'head', 'heal', 'heap', 'hear', 'heat', 'heel', 'held', 'hell', 'helm', 'help', 'herb', 'herd', 'here',
    'hero', 'hide', 'high', 'hike', 'hill', 'hint', 'hire', 'hold', 'hole', 'home', 'hood', 'hook', 'hope', 'horn', 'horse', 'host', 'hour', 'huge', 'hull', 'hung',
    'hunt', 'hurt', 'hush', 'hymn', 'icon', 'idea', 'idle', 'inch', 'info', 'into', 'iron', 'isle', 'item', 'jack', 'jail', 'jazz', 'jean', 'jeep', 'jerk', 'jest',
    'joke', 'jolt', 'jump', 'june', 'junk', 'jury', 'just', 'keen', 'keep', 'kept', 'kick', 'kill', 'kind', 'king', 'kiss', 'kite', 'knee', 'knew', 'knit', 'knob',
    'knot', 'know', 'lace', 'lack', 'lady', 'laid', 'lake', 'lamb', 'lamp', 'land', 'lane', 'last', 'late', 'lawn', 'lead', 'leaf', 'leak', 'lean', 'leap', 'left',
    'lend', 'lens', 'lent', 'less', 'liar', 'lick', 'lift', 'like', 'limb', 'lime', 'limp', 'line', 'link', 'lion', 'list', 'live', 'load', 'loaf', 'loan', 'lock',
    'loft', 'logo', 'lone', 'long', 'look', 'loop', 'lord', 'lose', 'loss', 'lost', 'lots', 'loud', 'love', 'luck', 'lump', 'lung', 'lure', 'lurk', 'lush', 'made',
    'maid', 'mail', 'main', 'make', 'male', 'mall', 'many', 'mare', 'mark', 'mars', 'mask', 'mass', 'mate', 'math', 'maze', 'meal', 'mean', 'meat', 'meek', 'meet',
    'melt', 'memo', 'menu', 'mere', 'mess', 'mice', 'mild', 'mile', 'milk', 'mill', 'mind', 'mine', 'mint', 'miss', 'mist', 'mode', 'mold', 'monk', 'mood', 'moon',
    'more', 'moss', 'most', 'moth', 'move', 'much', 'mule', 'must', 'mute', 'myth', 'nail', 'name', 'navy', 'near', 'neat', 'neck', 'need', 'nest', 'news', 'next',
    'nice', 'nine', 'node', 'none', 'noon', 'norm', 'nose', 'note', 'noun', 'nude', 'numb', 'obey', 'odds', 'okay', 'omit', 'once', 'only', 'onto', 'open', 'oral',
    'ours', 'oval', 'oven', 'over', 'pace', 'pack', 'page', 'paid', 'pail', 'pain', 'pair', 'pale', 'palm', 'pant', 'park', 'part', 'pass', 'past', 'path', 'peak',
    'pear', 'peck', 'peel', 'peer', 'perk', 'pest', 'pick', 'pier', 'pike', 'pile', 'pill', 'pine', 'pink', 'pipe', 'piss', 'pity', 'plan', 'play', 'plea', 'plow',
    'plug', 'plum', 'plus', 'poem', 'poet', 'poke', 'pole', 'poll', 'polo', 'pond', 'pony', 'pool', 'poor', 'pope', 'pork', 'port', 'pose', 'post', 'pour', 'pray',
    'prep', 'prey', 'prod', 'prop', 'pull', 'pulp', 'pump', 'punk', 'pure', 'push', 'quit', 'quiz', 'race', 'rack', 'rage', 'raid', 'rail', 'rain', 'rake', 'ramp',
    'rang', 'rank', 'rare', 'rash', 'rate', 'rave', 'read', 'real', 'reap', 'rear', 'rely', 'rent', 'rest', 'rice', 'rich', 'ride', 'rift', 'ring', 'riot', 'rise',
    'risk', 'road', 'roam', 'roar', 'robe', 'rock', 'rode', 'role', 'roll', 'roof', 'room', 'root', 'rope', 'rose', 'rude', 'ruin', 'rule', 'rush', 'rust', 'sack',
    'safe', 'sage', 'said', 'sail', 'sake', 'sale', 'salt', 'same', 'sand', 'sane', 'sang', 'sank', 'save', 'scam', 'scan', 'scar', 'seal', 'seam', 'seat', 'sect',
    'seed', 'seek', 'seem', 'seen', 'self', 'sell', 'send', 'sent', 'sept', 'sham', 'shed', 'shin', 'ship', 'shop', 'shot', 'show', 'shut', 'sick', 'side', 'sift',
    'sigh', 'sign', 'silk', 'sink', 'site', 'size', 'skim', 'skin', 'skip', 'slab', 'slam', 'slap', 'slat', 'slay', 'sled', 'slew', 'slid', 'slim', 'slip', 'slit',
    'slot', 'slow', 'slug', 'slum', 'snap', 'snob', 'snow', 'soak', 'soap', 'soar', 'sock', 'soda', 'sofa', 'soft', 'soil', 'sold', 'sole', 'some', 'song', 'soon',
    'sore', 'sort', 'soul', 'soup', 'sour', 'span', 'spar', 'spec', 'sped', 'spin', 'spit', 'spot', 'spun', 'spur', 'stab', 'stag', 'star', 'stay', 'stem', 'step',
    'stew', 'stir', 'stop', 'stow', 'stub', 'stud', 'such', 'suck', 'suit', 'sung', 'sunk', 'sure', 'surf', 'swan', 'swap', 'sway', 'swim', 'tack', 'tail', 'take',
    'tale', 'talk', 'tall', 'tame', 'tang', 'tank', 'tape', 'task', 'team', 'tear', 'teen', 'tell', 'temp', 'tend', 'tent', 'term', 'test', 'text', 'than', 'that',
    'them', 'then', 'they', 'thin', 'this', 'thus', 'tick', 'tide', 'tidy', 'tied', 'tier', 'tile', 'till', 'tilt', 'time', 'tint', 'tiny', 'tire', 'toad', 'toll',
    'tomb', 'tone', 'took', 'tool', 'tops', 'tore', 'torn', 'toss', 'tour', 'town', 'tram', 'trap', 'tray', 'tree', 'trek', 'trim', 'trio', 'trip', 'trot', 'true',
    'tube', 'tuck', 'tune', 'turn', 'twin', 'type', 'ugly', 'undo', 'unit', 'upon', 'urge', 'used', 'user', 'vain', 'vary', 'vast', 'veil', 'vein', 'vent', 'verb',
    'very', 'vest', 'veto', 'vice', 'view', 'vile', 'vine', 'visa', 'void', 'volt', 'vote', 'wade', 'wage', 'wait', 'wake', 'walk', 'wall', 'wand', 'want', 'ward',
    'warm', 'warn', 'warp', 'wary', 'wash', 'wave', 'wavy', 'waxy', 'weak', 'wear', 'weed', 'week', 'weep', 'weld', 'well', 'went', 'were', 'west', 'what', 'when',
    'whip', 'whom', 'wick', 'wide', 'wife', 'wild', 'will', 'wilt', 'wimp', 'wind', 'wine', 'wing', 'wink', 'wipe', 'wire', 'wise', 'wish', 'with', 'woke', 'wolf',
    'womb', 'wood', 'wool', 'word', 'wore', 'work', 'worm', 'worn', 'wrap', 'yard', 'yawn', 'year', 'yell', 'yoga', 'yoke', 'your', 'zeal', 'zero', 'zest', 'zinc', 'zone', 'zoom',
    // 5-letter words
    'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'align', 'alike', 'alive',
    'alley', 'allow', 'alloy', 'alone', 'along', 'alter', 'among', 'anger', 'angle', 'angry', 'anime', 'ankle', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'armor', 'aroma',
    'array', 'arrow', 'asset', 'avoid', 'award', 'aware', 'awful', 'bacon', 'badge', 'badly', 'basic', 'basis', 'batch', 'beach', 'beard', 'beast', 'began', 'begin', 'being', 'belly',
    'below', 'bench', 'berry', 'birth', 'black', 'blade', 'blame', 'blank', 'blast', 'blaze', 'bleed', 'blend', 'bless', 'blind', 'blink', 'block', 'blood', 'blown', 'blues', 'blunt',
    'board', 'boast', 'bonus', 'boost', 'booth', 'boots', 'bound', 'brain', 'brake', 'brand', 'brass', 'brave', 'bread', 'break', 'breed', 'brick', 'bride', 'brief', 'bring', 'broad',
    'broke', 'brown', 'brush', 'buddy', 'build', 'built', 'bunch', 'burst', 'buyer', 'cable', 'camel', 'candy', 'cards', 'cargo', 'carry', 'carve', 'catch', 'cause', 'chain', 'chair',
    'chalk', 'champ', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'cheat', 'check', 'cheek', 'cheer', 'chess', 'chest', 'chief', 'child', 'chill', 'china', 'chips', 'choir', 'chose',
    'chunk', 'claim', 'clash', 'class', 'clean', 'clear', 'clerk', 'click', 'cliff', 'climb', 'cling', 'clock', 'clone', 'close', 'cloth', 'cloud', 'clown', 'coach', 'coast', 'colon',
    'color', 'comet', 'comic', 'coral', 'couch', 'cough', 'could', 'count', 'court', 'cover', 'crack', 'craft', 'cramp', 'crane', 'crash', 'crawl', 'crazy', 'cream', 'creek', 'creep',
    'crest', 'crime', 'crisp', 'cross', 'crowd', 'crown', 'cruel', 'crush', 'crust', 'cubic', 'curve', 'cycle', 'daily', 'dairy', 'dance', 'dated', 'dealt', 'death', 'debut', 'decay',
    'delay', 'delta', 'dense', 'depth', 'devil', 'diary', 'digit', 'dirty', 'disco', 'doing', 'donor', 'doubt', 'dough', 'draft', 'drain', 'drake', 'drama', 'drank', 'drawn', 'dread',
    'dream', 'dress', 'dried', 'drift', 'drill', 'drink', 'drive', 'droid', 'drown', 'drunk', 'dwarf', 'eager', 'eagle', 'early', 'earth', 'eater', 'ebony', 'eight', 'elbow', 'elder',
    'elect', 'elite', 'email', 'ember', 'empty', 'ended', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'equip', 'erase', 'error', 'essay', 'ethos', 'event', 'every', 'exact', 'exams',
    'excel', 'exist', 'extra', 'fable', 'faced', 'facet', 'faint', 'fairy', 'faith', 'false', 'fancy', 'fatal', 'fault', 'feast', 'fence', 'ferry', 'fetch', 'fever', 'fewer', 'fiber',
    'field', 'fiery', 'fifth', 'fifty', 'fight', 'final', 'finer', 'fired', 'first', 'fixed', 'flame', 'flank', 'flash', 'flask', 'flats', 'flawy', 'flesh', 'flick', 'flies', 'fling',
    'float', 'flock', 'flood', 'floor', 'flora', 'flour', 'fluid', 'flush', 'flute', 'focus', 'folly', 'force', 'forge', 'forgo', 'forth', 'forty', 'forum', 'found', 'fount', 'frame',
    'frank', 'fraud', 'freak', 'freed', 'fresh', 'fried', 'fries', 'frill', 'frisk', 'front', 'frost', 'frown', 'froze', 'fruit', 'funny', 'gamma', 'gases', 'gauge', 'genre', 'ghost',
    'giant', 'given', 'giver', 'gland', 'glare', 'glass', 'gleam', 'globe', 'gloom', 'glory', 'gloss', 'glove', 'grace', 'grade', 'grain', 'grand', 'grant', 'grape', 'grasp', 'grass',
    'grave', 'gravy', 'great', 'greed', 'greek', 'green', 'greet', 'grief', 'grill', 'grind', 'groan', 'groom', 'gross', 'group', 'grove', 'growl', 'grown', 'guard', 'guess', 'guest',
    'guide', 'guild', 'guilt', 'guise', 'gulch', 'gummy', 'habit', 'hairy', 'hands', 'handy', 'happy', 'harsh', 'haste', 'hatch', 'haunt', 'haven', 'havoc', 'heard', 'heart', 'heavy',
    'hedge', 'heels', 'heist', 'hello', 'hence', 'herbs', 'hiker', 'hills', 'hints', 'hippo', 'hobby', 'hoist', 'holly', 'honey', 'honor', 'hoped', 'horde', 'horns', 'horse', 'hotel',
    'hound', 'house', 'hover', 'human', 'humid', 'humor', 'hurry', 'ideal', 'image', 'imply', 'inbox', 'incur', 'index', 'indie', 'inner', 'input', 'intel', 'intro', 'ionic', 'irony',
    'issue', 'ivory', 'jeans', 'jelly', 'jewel', 'joint', 'joker', 'jolly', 'joust', 'judge', 'juice', 'juicy', 'jumbo', 'jumps', 'jumpy', 'karma', 'kayak', 'keeps', 'kicks', 'kings',
    'kiosk', 'kites', 'kitty', 'knack', 'knead', 'kneel', 'knife', 'knock', 'label', 'labor', 'lakes', 'lance', 'lands', 'lanes', 'large', 'laser', 'latch', 'later', 'latin', 'laugh',
    'layer', 'leads', 'leaky', 'leaps', 'learn', 'lease', 'leash', 'least', 'leave', 'ledge', 'legal', 'lemon', 'level', 'lever', 'light', 'lilac', 'limbs', 'limit', 'lines', 'links',
    'lions', 'lists', 'liter', 'lived', 'liven', 'liver', 'lives', 'llama', 'loads', 'loans', 'lobby', 'local', 'lodge', 'lofty', 'logic', 'login', 'logos', 'looks', 'loops', 'loose',
    'lorry', 'loser', 'loses', 'lotus', 'lounge', 'lover', 'loves', 'lower', 'loyal', 'lucky', 'lunar', 'lunch', 'lungs', 'lurch', 'lyric', 'macro', 'magic', 'magma', 'mains', 'maize',
    'major', 'maker', 'males', 'mango', 'manor', 'maple', 'march', 'marks', 'marry', 'marsh', 'masks', 'mason', 'match', 'mates', 'mayor', 'meals', 'meats', 'medal', 'media', 'melon',
    'menus', 'merge', 'merit', 'merry', 'messy', 'metal', 'meter', 'metro', 'micro', 'midst', 'might', 'miles', 'mills', 'mimic', 'mince', 'minds', 'miner', 'mines', 'minor', 'minus',
    'mirth', 'misty', 'mixed', 'mixer', 'model', 'modem', 'modes', 'moist', 'molar', 'molds', 'money', 'month', 'moods', 'moose', 'moral', 'motor', 'motto', 'mould', 'mount', 'mourn',
    'mouse', 'mouth', 'moved', 'mover', 'moves', 'movie', 'mower', 'mucus', 'muddy', 'multi', 'mural', 'murky', 'music', 'naive', 'naked', 'names', 'nanny', 'nasty', 'naval', 'needs',
    'nerve', 'never', 'newer', 'newly', 'nexus', 'niche', 'night', 'ninja', 'ninth', 'noble', 'nodes', 'noise', 'noisy', 'nomad', 'norms', 'north', 'notch', 'noted', 'notes', 'novel',
    'nudge', 'nurse', 'occur', 'ocean', 'oddly', 'offer', 'often', 'olive', 'omega', 'onion', 'opens', 'opera', 'optic', 'orbit', 'order', 'organ', 'other', 'otter', 'ought', 'ounce',
    'outer', 'outgo', 'owned', 'owner', 'oxide', 'ozone', 'paced', 'pacer', 'packs', 'pages', 'pains', 'paint', 'pairs', 'palms', 'panda', 'panel', 'panic', 'pansy', 'pants', 'paper',
    'parks', 'parse', 'party', 'pasta', 'paste', 'pasty', 'patch', 'paths', 'patio', 'pause', 'peace', 'peach', 'peaks', 'pearl', 'pedal', 'peers', 'penny', 'perch', 'peril', 'perks',
    'perky', 'pesto', 'petal', 'petty', 'phase', 'phone', 'photo', 'piano', 'picks', 'piece', 'piggy', 'piles', 'pilot', 'pinch', 'pines', 'pinky', 'pitch', 'pithy', 'pivot', 'pixel',
    'pizza', 'place', 'plaid', 'plain', 'plane', 'plank', 'plans', 'plant', 'plate', 'plays', 'plaza', 'plead', 'pleas', 'pleat', 'pledge', 'plier', 'plots', 'pluck', 'plumb', 'plume',
    'plump', 'plums', 'plunk', 'plush', 'poach', 'poems', 'poets', 'point', 'poise', 'poker', 'polar', 'poles', 'polls', 'polyp', 'ponds', 'pools', 'porch', 'pores', 'ports', 'posed',
    'poser', 'poses', 'posts', 'pouch', 'pound', 'power', 'prank', 'prawn', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prism', 'prize', 'probe', 'promo', 'prone', 'proof',
    'props', 'prose', 'proud', 'prove', 'prowl', 'proxy', 'prune', 'pulse', 'pumps', 'punch', 'pupil', 'puppy', 'purge', 'purse', 'queen', 'query', 'quest', 'queue', 'quick', 'quiet',
    'quilt', 'quirk', 'quota', 'quote', 'races', 'radar', 'radio', 'rafts', 'raged', 'raids', 'rails', 'rains', 'rainy', 'raise', 'rally', 'ranch', 'range', 'ranks', 'rapid', 'rarer',
    'rates', 'ratio', 'razor', 'reach', 'react', 'reads', 'ready', 'realm', 'reams', 'rebel', 'refer', 'reign', 'relax', 'relay', 'relic', 'remix', 'renew', 'repay', 'reply', 'rerun',
    'reset', 'resin', 'retro', 'retry', 'rider', 'rides', 'ridge', 'rifle', 'rigid', 'rigor', 'rings', 'rinse', 'riots', 'ripen', 'risen', 'riser', 'rises', 'risks', 'risky', 'rites',
    'ritzy', 'rival', 'river', 'roads', 'roars', 'roast', 'robot', 'rocks', 'rocky', 'rodeo', 'rogue', 'roles', 'rolls', 'roman', 'rooms', 'roots', 'ropes', 'roses', 'rotor', 'rouge',
    'rough', 'round', 'route', 'rover', 'royal', 'ruder', 'rugby', 'ruins', 'ruled', 'ruler', 'rules', 'rumor', 'rupee', 'rural', 'rusty', 'sadly', 'safer', 'saint', 'salad', 'sales',
    'salon', 'salsa', 'salty', 'sandy', 'saner', 'sapid', 'sauna', 'saved', 'saver', 'saves', 'savor', 'scale', 'scald', 'scalp', 'scaly', 'scamp', 'scams', 'scant', 'scare', 'scarf',
    'scary', 'scene', 'scent', 'scold', 'scone', 'scoop', 'scoot', 'scope', 'score', 'scorn', 'scout', 'scowl', 'scram', 'scrap', 'scree', 'screw', 'scrub', 'seams', 'seats', 'seeks',
    'seems', 'seize', 'sells', 'sends', 'sense', 'serum', 'serve', 'setup', 'seven', 'sever', 'shade', 'shady', 'shaft', 'shake', 'shaky', 'shall', 'shame', 'shank', 'shape', 'shard',
    'share', 'shark', 'sharp', 'shave', 'shawl', 'sheep', 'sheer', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shiny', 'ships', 'shire', 'shirk', 'shirt', 'shock', 'shoes', 'shone',
    'shook', 'shoot', 'shops', 'shore', 'short', 'shout', 'shove', 'shown', 'shows', 'shrub', 'shrug', 'shuck', 'sides', 'siege', 'sight', 'sigma', 'signs', 'silky', 'silly', 'since',
    'siren', 'sites', 'sixth', 'sixty', 'sized', 'sizes', 'skate', 'skier', 'skill', 'skimp', 'skins', 'skips', 'skirt', 'skull', 'slabs', 'slack', 'slain', 'slams', 'slang', 'slant',
    'slaps', 'slash', 'slate', 'slave', 'sleek', 'sleep', 'sleet', 'slept', 'slice', 'slick', 'slide', 'slime', 'slimy', 'sling', 'slink', 'slips', 'slope', 'slosh', 'sloth', 'slots',
    'slump', 'slung', 'slunk', 'slurp', 'smack', 'small', 'smart', 'smash', 'smear', 'smell', 'smelt', 'smile', 'smirk', 'smite', 'smith', 'smoke', 'smoky', 'snack', 'snail', 'snake',
    'snaps', 'snare', 'snarl', 'sneak', 'sneer', 'snide', 'sniff', 'snore', 'snort', 'snout', 'snowy', 'snubs', 'snuck', 'snuff', 'soapy', 'soars', 'sober', 'socks', 'soggy', 'soils',
    'solar', 'solid', 'solos', 'solve', 'sonar', 'songs', 'sonic', 'sorry', 'sorts', 'souls', 'sound', 'south', 'space', 'spade', 'spamd', 'spank', 'spans', 'spare', 'spark', 'spasm',
    'spawn', 'speak', 'spear', 'specs', 'speed', 'spell', 'spend', 'spent', 'spice', 'spicy', 'spied', 'spies', 'spike', 'spill', 'spine', 'spiny', 'spire', 'spite', 'splat', 'split',
    'spoil', 'spoke', 'spook', 'spool', 'spoon', 'spore', 'sport', 'spots', 'spout', 'spray', 'spree', 'sprig', 'spunk', 'squad', 'squat', 'squid', 'stack', 'staff', 'stage', 'stain',
    'stair', 'stake', 'stale', 'stalk', 'stall', 'stamp', 'stand', 'stank', 'staph', 'stare', 'stark', 'stars', 'start', 'stash', 'state', 'stave', 'stays', 'steak', 'steal', 'steam',
    'steel', 'steep', 'steer', 'stems', 'steps', 'stern', 'stick', 'stiff', 'still', 'sting', 'stink', 'stint', 'stock', 'stoic', 'stoke', 'stole', 'stomp', 'stone', 'stood', 'stool',
    'stoop', 'stops', 'store', 'stork', 'storm', 'story', 'stout', 'stove', 'strap', 'straw', 'stray', 'strip', 'strut', 'stuck', 'study', 'stuff', 'stump', 'stung', 'stunk', 'style',
    'suave', 'sugar', 'suite', 'suits', 'sunny', 'super', 'surge', 'sushi', 'swamp', 'swaps', 'swarm', 'swear', 'sweat', 'sweep', 'sweet', 'swell', 'swept', 'swift', 'swill', 'swine',
    'swing', 'swipe', 'swirl', 'Swiss', 'sword', 'swore', 'sworn', 'swung', 'synod', 'syrup', 'table', 'taboo', 'tacit', 'taint', 'taken', 'taker', 'takes', 'tales', 'talks', 'tally',
    'tango', 'tanks', 'tapes', 'tapir', 'tardy', 'tasks', 'taste', 'tasty', 'taunt', 'taxes', 'teach', 'teams', 'tears', 'teary', 'tease', 'teddy', 'teens', 'teeth', 'tempo', 'tends',
    'tenor', 'tense', 'tenth', 'tents', 'terms', 'terra', 'tests', 'texts', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thief', 'thigh', 'thing', 'think', 'third',
    'thorn', 'those', 'three', 'threw', 'throw', 'thumb', 'tiger', 'tight', 'tiles', 'tilts', 'timer', 'times', 'timid', 'tipsy', 'tired', 'tires', 'titan', 'title', 'toast', 'today',
    'tonal', 'toned', 'toner', 'tones', 'tonic', 'tools', 'tooth', 'topic', 'torch', 'total', 'totem', 'touch', 'tough', 'tours', 'towel', 'tower', 'towns', 'toxic', 'trace', 'track',
    'tract', 'trade', 'trail', 'train', 'trait', 'tramp', 'trash', 'trawl', 'tread', 'treat', 'trees', 'trend', 'triad', 'trial', 'tribe', 'trick', 'tried', 'tries', 'trike', 'trill',
    'trims', 'trite', 'troll', 'troop', 'troth', 'trout', 'truce', 'truck', 'truly', 'trump', 'trunk', 'trust', 'truth', 'tryst', 'tulip', 'tumor', 'tuned', 'tuner', 'tunes', 'tunic',
    'turbo', 'turfs', 'turns', 'tutor', 'twang', 'tweak', 'tweed', 'tweet', 'twice', 'twigs', 'twine', 'twirl', 'twist', 'tying', 'udder', 'ulcer', 'ultra', 'umbra', 'uncle', 'under',
    'undid', 'undue', 'unfed', 'unfit', 'union', 'unite', 'units', 'unity', 'unlit', 'unmet', 'unpeg', 'unpin', 'unset', 'until', 'upper', 'upset', 'urban', 'urged', 'urine', 'usage',
    'usher', 'using', 'usual', 'utter', 'vague', 'valid', 'valor', 'value', 'valve', 'vapor', 'vault', 'vaunt', 'veers', 'vegan', 'veins', 'venue', 'venus', 'verbs', 'verge', 'verse',
    'video', 'views', 'vigor', 'villa', 'vinyl', 'viola', 'viper', 'viral', 'virus', 'visor', 'visit', 'vista', 'vital', 'vivid', 'vocal', 'vodka', 'vogue', 'voice', 'voila', 'vomit',
    'voter', 'votes', 'vouch', 'vowel', 'wacky', 'wader', 'wades', 'waged', 'wager', 'wages', 'wagon', 'waist', 'waits', 'waive', 'waken', 'wakes', 'walks', 'walls', 'waltz', 'wands',
    'wants', 'wards', 'wares', 'warns', 'warps', 'waste', 'watch', 'water', 'watts', 'waved', 'waver', 'waves', 'waxed', 'waxes', 'wayside', 'weaken', 'weary', 'weave', 'wedge', 'weeks', 'weigh',
    'weird', 'wells', 'welsh', 'wench', 'whale', 'wharf', 'wheat', 'wheel', 'where', 'which', 'while', 'whims', 'whine', 'whips', 'whirl', 'whisk', 'white', 'whole', 'whose', 'wicks',
    'wider', 'widen', 'widow', 'width', 'wield', 'wilds', 'wills', 'winds', 'windy', 'wines', 'wings', 'winks', 'wired', 'wires', 'wiser', 'witch', 'witty', 'wives', 'woken', 'wolfs',
    'woman', 'women', 'woods', 'woody', 'words', 'wordy', 'works', 'world', 'worms', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'woven', 'wrack', 'wraps', 'wrath', 'wreak',
    'wreck', 'wrest', 'wring', 'wrist', 'write', 'wrong', 'wrote', 'yacht', 'yards', 'yarns', 'yawns', 'years', 'yeast', 'yield', 'young', 'yours', 'youth', 'zebra', 'zeros', 'zesty', 'zonal', 'zones',
    // 6+ letter words
    'battle', 'castle', 'dragon', 'knight', 'shield', 'sword', 'attack', 'defend', 'power', 'magic', 'wizard', 'warrior', 'strength', 'victory', 'defeat',
    'merge', 'combine', 'fusion', 'energy', 'charge', 'strike', 'damage', 'health', 'armor', 'weapon', 'ability', 'skill', 'master', 'champion', 'legend',
    'thunder', 'lightning', 'storm', 'flame', 'blaze', 'frost', 'shadow', 'spirit', 'ancient', 'mystic', 'arcane', 'divine', 'chaos', 'order', 'balance',
    'heroes', 'monsters', 'demons', 'angels', 'titans', 'giants', 'elves', 'orcs', 'goblins', 'trolls', 'vampires', 'werewolf', 'phoenix', 'griffin', 'hydra'
]);

// Letter values (Scrabble-inspired)
const letterValues = {
    'a': 1, 'e': 1, 'i': 1, 'o': 1, 'u': 1, 'l': 1, 'n': 1, 's': 1, 't': 1, 'r': 1,
    'd': 2, 'g': 2,
    'b': 3, 'c': 3, 'm': 3, 'p': 3,
    'f': 4, 'h': 4, 'v': 4, 'w': 4, 'y': 4,
    'k': 5,
    'j': 8, 'x': 8,
    'q': 10, 'z': 10
};

// Letter frequencies for generation
const letterWeights = {
    'a': 9, 'b': 2, 'c': 2, 'd': 4, 'e': 12, 'f': 2, 'g': 3, 'h': 2, 'i': 9, 'j': 1,
    'k': 1, 'l': 4, 'm': 2, 'n': 6, 'o': 8, 'p': 2, 'q': 1, 'r': 6, 's': 4, 't': 6,
    'u': 4, 'v': 2, 'w': 2, 'x': 1, 'y': 2, 'z': 1
};

// Enemy types
const enemies = [
    { name: 'WORD GOBLIN', icon: '👹', baseHp: 50, attackPower: 5, attackDelay: 6 },
    { name: 'LETTER TROLL', icon: '🧌', baseHp: 80, attackPower: 8, attackDelay: 5.5 },
    { name: 'VOCAB DEMON', icon: '👿', baseHp: 120, attackPower: 12, attackDelay: 5 },
    { name: 'SYNTAX WRAITH', icon: '👻', baseHp: 150, attackPower: 15, attackDelay: 4.5 },
    { name: 'GRAMMAR DRAGON', icon: '🐉', baseHp: 200, attackPower: 20, attackDelay: 4 },
    { name: 'LEXICON LORD', icon: '🔥', baseHp: 300, attackPower: 25, attackDelay: 3.5 }
];

// Game State
let gameState = {
    playerHp: 100,
    playerMaxHp: 100,
    enemyHp: 50,
    enemyMaxHp: 50,
    currentEnemy: 0,
    enemyLevel: 1,
    score: 0,
    wordsFound: 0,
    bestCombo: 0,
    currentCombo: 0,
    enemiesDefeated: 0,
    selectedLetters: [],
    gridLetters: [],
    shufflesRemaining: 3,
    powerups: { heal: 1, shield: 1, double: 0 },
    shieldActive: false,
    doubleActive: false,
    enemyAttackTimer: null,
    enemyTimeRemaining: 6,
    gameOver: false
};

// DOM Elements
const elements = {
    letterGrid: document.getElementById('letter-grid'),
    currentWord: document.getElementById('current-word'),
    wordPower: document.getElementById('word-power'),
    attackBtn: document.getElementById('attack-btn'),
    clearBtn: document.getElementById('clear-btn'),
    shuffleBtn: document.getElementById('shuffle-btn'),
    playerHp: document.getElementById('player-hp'),
    playerHpText: document.getElementById('player-hp-text'),
    enemyHp: document.getElementById('enemy-hp'),
    enemyHpText: document.getElementById('enemy-hp-text'),
    enemyName: document.getElementById('enemy-name'),
    enemyLevel: document.getElementById('enemy-level'),
    enemyTimer: document.getElementById('enemy-timer'),
    playerSprite: document.getElementById('player-sprite'),
    enemySprite: document.getElementById('enemy-sprite'),
    attackText: document.getElementById('attack-text'),
    battleEffects: document.getElementById('battle-effects'),
    score: document.getElementById('score'),
    wordsFound: document.getElementById('words-found'),
    bestCombo: document.getElementById('best-combo'),
    enemiesDefeated: document.getElementById('enemies-defeated'),
    comboCount: document.getElementById('combo-count'),
    playerPower: document.getElementById('player-power'),
    particles: document.getElementById('particles'),
    modal: document.getElementById('game-over-modal'),
    modalTitle: document.getElementById('modal-title'),
    finalScore: document.getElementById('final-score'),
    finalWords: document.getElementById('final-words'),
    finalEnemies: document.getElementById('final-enemies'),
    finalCombo: document.getElementById('final-combo'),
    highScore: document.getElementById('high-score'),
    playAgainBtn: document.getElementById('play-again-btn'),
    musicToggle: document.getElementById('music-toggle'),
    musicNext: document.getElementById('music-next'),
    songName: document.getElementById('song-name'),
    healCount: document.getElementById('heal-count'),
    shieldCount: document.getElementById('shield-count'),
    doubleCount: document.getElementById('double-count'),
    powerupHeal: document.getElementById('powerup-heal'),
    powerupShield: document.getElementById('powerup-shield'),
    powerupDouble: document.getElementById('powerup-double')
};

// Music System
const musicGen = new PianoMusicGenerator();
let musicPlaying = false;

// Initialize Music Controls
elements.musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
        musicGen.stop();
        elements.musicToggle.textContent = '🎵 Music';
        elements.songName.textContent = '';
        musicPlaying = false;
    } else {
        musicGen.start();
        elements.musicToggle.textContent = '🔇 Mute';
        elements.songName.textContent = `♪ ${musicGen.getCurrentSongName()}`;
        musicPlaying = true;
    }
});

elements.musicNext.addEventListener('click', () => {
    if (musicPlaying) {
        musicGen.nextSong();
        elements.songName.textContent = `♪ ${musicGen.getCurrentSongName()}`;
    }
});

// Sound Effects
function playTone(freq, duration, type = 'sine', volume = 0.2) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playLetterSelect() {
    const freq = 400 + Math.random() * 200;
    playTone(freq, 0.1, 'sine', 0.15);
}

function playMerge() {
    [523, 659, 784].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.15, 'triangle', 0.2), i * 50);
    });
}

function playAttack() {
    // Epic attack sound
    playTone(200, 0.1, 'sawtooth', 0.3);
    setTimeout(() => playTone(400, 0.1, 'square', 0.25), 50);
    setTimeout(() => playTone(600, 0.15, 'sawtooth', 0.2), 100);
    setTimeout(() => playTone(800, 0.2, 'triangle', 0.15), 150);
}

function playEnemyHit() {
    playTone(150, 0.3, 'sawtooth', 0.25);
    setTimeout(() => playTone(100, 0.2, 'square', 0.2), 100);
}

function playPlayerHit() {
    playTone(180, 0.4, 'sawtooth', 0.3);
    setTimeout(() => playTone(120, 0.3, 'square', 0.25), 150);
}

function playCombo() {
    const baseFreq = 400 + gameState.currentCombo * 50;
    [baseFreq, baseFreq * 1.25, baseFreq * 1.5].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.1, 'sine', 0.15), i * 40);
    });
}

function playEnemyDefeat() {
    [392, 494, 587, 784, 988].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.2, 'triangle', 0.2), i * 80);
    });
}

function playGameOver() {
    [440, 392, 349, 293, 261].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.4, 'triangle', 0.25), i * 200);
    });
}

function playVictory() {
    const melody = [523, 587, 659, 784, 880, 988, 1047];
    melody.forEach((f, i) => {
        setTimeout(() => playTone(f, 0.15, 'triangle', 0.2), i * 100);
    });
}

function playPowerup() {
    [800, 1000, 1200].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.15, 'sine', 0.2), i * 60);
    });
}

function playHeal() {
    [523, 659, 784, 1047].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.2, 'sine', 0.15), i * 100);
    });
}

function playShield() {
    playTone(600, 0.3, 'triangle', 0.2);
    setTimeout(() => playTone(800, 0.3, 'triangle', 0.15), 150);
}

function playInvalidWord() {
    playTone(200, 0.3, 'sawtooth', 0.2);
}

// Letter Generation
function generateWeightedLetter() {
    const letters = Object.keys(letterWeights);
    const weights = Object.values(letterWeights);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < letters.length; i++) {
        random -= weights[i];
        if (random <= 0) return letters[i];
    }
    return 'e';
}

function generateGrid() {
    const gridSize = 24;
    const letters = [];

    // Ensure at least 6 vowels
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    for (let i = 0; i < 6; i++) {
        letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }

    // Fill rest with weighted random letters
    while (letters.length < gridSize) {
        letters.push(generateWeightedLetter());
    }

    // Shuffle
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    return letters;
}

function renderGrid() {
    elements.letterGrid.innerHTML = '';
    gameState.gridLetters.forEach((letter, index) => {
        const tile = document.createElement('div');
        tile.className = 'letter-tile';
        tile.textContent = letter;
        tile.dataset.index = index;
        tile.dataset.points = letterValues[letter];

        // Add letter type classes
        if ('aeiou'.includes(letter)) {
            tile.classList.add('vowel');
        } else {
            tile.classList.add('consonant');
        }
        if (letterValues[letter] >= 8) {
            tile.classList.add('rare');
        }

        tile.addEventListener('click', () => selectLetter(index));
        elements.letterGrid.appendChild(tile);
    });
}

function selectLetter(index) {
    if (gameState.gameOver) return;

    const tiles = elements.letterGrid.querySelectorAll('.letter-tile');
    const tile = tiles[index];

    if (tile.classList.contains('used')) return;

    // Toggle selection
    const selectedIndex = gameState.selectedLetters.indexOf(index);
    if (selectedIndex > -1) {
        // Deselect
        gameState.selectedLetters.splice(selectedIndex, 1);
        tile.classList.remove('selected');
    } else {
        // Select
        gameState.selectedLetters.push(index);
        tile.classList.add('selected');
        playLetterSelect();
    }

    updateCurrentWord();
}

function updateCurrentWord() {
    const word = gameState.selectedLetters.map(i => gameState.gridLetters[i]).join('');

    if (word.length === 0) {
        elements.currentWord.innerHTML = '<span class="placeholder-text">Select letters to merge...</span>';
        elements.wordPower.textContent = '';
        elements.wordPower.className = 'word-power';
        elements.attackBtn.disabled = true;
        elements.attackBtn.classList.remove('ready');
        return;
    }

    // Display letters as tiles
    elements.currentWord.innerHTML = '';
    gameState.selectedLetters.forEach(i => {
        const miniTile = document.createElement('span');
        miniTile.className = 'letter-tile';
        miniTile.textContent = gameState.gridLetters[i];
        miniTile.style.width = '35px';
        miniTile.style.height = '35px';
        miniTile.style.fontSize = '1.2rem';
        elements.currentWord.appendChild(miniTile);
    });

    // Check if valid word
    const isValid = validWords.has(word.toLowerCase()) && word.length >= 2;
    const power = calculateWordPower(word);

    if (isValid) {
        elements.wordPower.textContent = `⚔️ ${power} DMG`;
        elements.wordPower.className = 'word-power valid';
        elements.attackBtn.disabled = false;
        elements.attackBtn.classList.add('ready');
        playMerge();
    } else {
        elements.wordPower.textContent = word.length >= 2 ? '❌ Invalid' : '';
        elements.wordPower.className = 'word-power invalid';
        elements.attackBtn.disabled = true;
        elements.attackBtn.classList.remove('ready');
    }
}

function calculateWordPower(word) {
    let basePower = 0;
    for (const letter of word.toLowerCase()) {
        basePower += letterValues[letter] || 1;
    }

    // Length bonus
    const lengthBonus = Math.pow(word.length, 1.5);

    // Combo multiplier
    const comboMultiplier = 1 + (gameState.currentCombo * 0.2);

    // Double damage powerup
    const doubleMultiplier = gameState.doubleActive ? 2 : 1;

    return Math.floor((basePower + lengthBonus) * comboMultiplier * doubleMultiplier);
}

function clearSelection() {
    gameState.selectedLetters = [];
    const tiles = elements.letterGrid.querySelectorAll('.letter-tile');
    tiles.forEach(tile => tile.classList.remove('selected'));
    updateCurrentWord();
}

function shuffleGrid() {
    if (gameState.shufflesRemaining <= 0 || gameState.gameOver) return;

    gameState.shufflesRemaining--;
    elements.shuffleBtn.textContent = `🔀 Shuffle (${gameState.shufflesRemaining})`;
    if (gameState.shufflesRemaining <= 0) {
        elements.shuffleBtn.disabled = true;
    }

    // Animate out
    const tiles = elements.letterGrid.querySelectorAll('.letter-tile');
    tiles.forEach(tile => tile.classList.add('merging'));

    setTimeout(() => {
        clearSelection();
        gameState.gridLetters = generateGrid();
        renderGrid();
    }, 300);

    playTone(300, 0.2, 'triangle');
}

// Battle System
function attack() {
    if (gameState.gameOver || elements.attackBtn.disabled) return;

    const word = gameState.selectedLetters.map(i => gameState.gridLetters[i]).join('');
    if (!validWords.has(word.toLowerCase()) || word.length < 2) return;

    const damage = calculateWordPower(word);

    // Play attack effects
    playAttack();

    // Animate player attack
    elements.playerSprite.classList.add('attacking');
    setTimeout(() => elements.playerSprite.classList.remove('attacking'), 500);

    // Show attack word
    showAttackText(word.toUpperCase(), '#4ade80');

    // Spawn particles
    spawnParticles(elements.enemySprite, '⚔️', 8);
    spawnParticles(elements.enemySprite, '💥', 5);

    // Damage enemy
    setTimeout(() => {
        elements.enemySprite.classList.add('hit');
        setTimeout(() => elements.enemySprite.classList.remove('hit'), 500);
        playEnemyHit();
        showDamageNumber(elements.enemySprite, damage, 'enemy-damage');

        gameState.enemyHp = Math.max(0, gameState.enemyHp - damage);
        updateHpBars();

        // Check enemy death
        if (gameState.enemyHp <= 0) {
            defeatEnemy();
        }
    }, 200);

    // Update stats
    gameState.currentCombo++;
    gameState.score += damage * 10;
    gameState.wordsFound++;
    if (gameState.currentCombo > gameState.bestCombo) {
        gameState.bestCombo = gameState.currentCombo;
    }

    // Combo effects
    if (gameState.currentCombo >= 3) {
        playCombo();
        elements.comboCount.parentElement.classList.add('combo-fire');
        setTimeout(() => elements.comboCount.parentElement.classList.remove('combo-fire'), 300);
    }

    // Disable double damage after use
    if (gameState.doubleActive) {
        gameState.doubleActive = false;
    }

    updateStats();

    // Mark letters as used
    const tiles = elements.letterGrid.querySelectorAll('.letter-tile');
    gameState.selectedLetters.forEach(i => {
        tiles[i].classList.add('merging');
        setTimeout(() => {
            tiles[i].classList.remove('selected', 'merging');
            tiles[i].classList.add('used');
            // Generate new letter
            gameState.gridLetters[i] = generateWeightedLetter();
            tiles[i].textContent = gameState.gridLetters[i];
            tiles[i].dataset.points = letterValues[gameState.gridLetters[i]];
            tiles[i].classList.remove('used');
        }, 300);
    });

    gameState.selectedLetters = [];
    updateCurrentWord();

    // Reset enemy attack timer on successful attack
    resetEnemyTimer();

    // Chance for powerup drop
    if (Math.random() < 0.15 || word.length >= 6) {
        dropPowerup();
    }
}

function defeatEnemy() {
    playEnemyDefeat();
    gameState.enemiesDefeated++;
    gameState.currentEnemy = (gameState.currentEnemy + 1) % enemies.length;
    gameState.enemyLevel++;

    // Victory particles
    spawnParticles(elements.enemySprite, '⭐', 15);
    spawnParticles(elements.enemySprite, '🎉', 10);

    // Add victory animation
    elements.enemySprite.classList.add('victory');

    setTimeout(() => {
        elements.enemySprite.classList.remove('victory');
        spawnNextEnemy();
    }, 1000);

    // Bonus score
    gameState.score += gameState.enemyLevel * 100;

    // Award powerup
    if (gameState.enemyLevel % 3 === 0) {
        const types = ['heal', 'shield', 'double'];
        const type = types[Math.floor(Math.random() * types.length)];
        gameState.powerups[type]++;
        updatePowerups();
        playPowerup();
    }

    updateStats();
}

function spawnNextEnemy() {
    const enemy = enemies[Math.min(gameState.currentEnemy, enemies.length - 1)];
    const levelMultiplier = 1 + (gameState.enemyLevel - 1) * 0.3;

    gameState.enemyMaxHp = Math.floor(enemy.baseHp * levelMultiplier);
    gameState.enemyHp = gameState.enemyMaxHp;

    elements.enemyName.textContent = enemy.name;
    elements.enemySprite.querySelector('.enemy-icon').textContent = enemy.icon;

    updateHpBars();
    resetEnemyTimer();
}

function enemyAttack() {
    if (gameState.gameOver || gameState.enemyHp <= 0) return;

    const enemy = enemies[Math.min(gameState.currentEnemy, enemies.length - 1)];
    const levelMultiplier = 1 + (gameState.enemyLevel - 1) * 0.2;
    let damage = Math.floor(enemy.attackPower * levelMultiplier);

    // Check shield
    if (gameState.shieldActive) {
        gameState.shieldActive = false;
        elements.playerSprite.classList.remove('shield-active');
        playShield();
        showAttackText('BLOCKED!', '#60a5fa');
        spawnParticles(elements.playerSprite, '🛡️', 8);
        resetEnemyTimer();
        return;
    }

    // Reset combo on hit
    gameState.currentCombo = 0;

    // Animate enemy attack
    elements.enemySprite.classList.add('attacking');
    setTimeout(() => elements.enemySprite.classList.remove('attacking'), 500);

    // Show attack
    showAttackText(`-${damage}`, '#ff6b6b');

    setTimeout(() => {
        elements.playerSprite.classList.add('hit');
        setTimeout(() => elements.playerSprite.classList.remove('hit'), 500);
        playPlayerHit();
        showDamageNumber(elements.playerSprite, damage, 'player-damage');

        gameState.playerHp = Math.max(0, gameState.playerHp - damage);
        updateHpBars();
        updateStats();

        // Check player death
        if (gameState.playerHp <= 0) {
            endGame(false);
        }
    }, 300);

    resetEnemyTimer();
}

function resetEnemyTimer() {
    if (gameState.enemyAttackTimer) {
        clearInterval(gameState.enemyAttackTimer);
    }

    const enemy = enemies[Math.min(gameState.currentEnemy, enemies.length - 1)];
    const levelSpeedUp = Math.min(gameState.enemyLevel * 0.1, 2);
    gameState.enemyTimeRemaining = Math.max(enemy.attackDelay - levelSpeedUp, 2);

    elements.enemyTimer.textContent = gameState.enemyTimeRemaining.toFixed(1);

    gameState.enemyAttackTimer = setInterval(() => {
        gameState.enemyTimeRemaining -= 0.1;
        elements.enemyTimer.textContent = gameState.enemyTimeRemaining.toFixed(1);

        // Warning color
        if (gameState.enemyTimeRemaining <= 2) {
            elements.enemyTimer.style.color = '#ff6b6b';
        } else {
            elements.enemyTimer.style.color = '';
        }

        if (gameState.enemyTimeRemaining <= 0) {
            enemyAttack();
        }
    }, 100);
}

// Powerups
function usePowerup(type) {
    if (gameState.gameOver || gameState.powerups[type] <= 0) return;

    gameState.powerups[type]--;

    switch (type) {
        case 'heal':
            const healAmount = 25;
            gameState.playerHp = Math.min(gameState.playerMaxHp, gameState.playerHp + healAmount);
            playHeal();
            spawnParticles(elements.playerSprite, '💚', 10);
            showAttackText(`+${healAmount} HP`, '#4ade80');
            break;

        case 'shield':
            gameState.shieldActive = true;
            elements.playerSprite.classList.add('shield-active');
            playShield();
            showAttackText('SHIELDED!', '#60a5fa');
            break;

        case 'double':
            gameState.doubleActive = true;
            playPowerup();
            showAttackText('2x DAMAGE!', '#fbbf24');
            spawnParticles(elements.currentWord, '⚡', 5);
            break;
    }

    updatePowerups();
    updateHpBars();
}

function dropPowerup() {
    const types = ['heal', 'shield', 'double'];
    const type = types[Math.floor(Math.random() * types.length)];
    gameState.powerups[type]++;
    updatePowerups();
    playPowerup();

    // Visual feedback
    const powerupEl = document.getElementById(`powerup-${type}`);
    powerupEl.style.transform = 'scale(1.3)';
    setTimeout(() => powerupEl.style.transform = '', 300);
}

function updatePowerups() {
    elements.healCount.textContent = gameState.powerups.heal;
    elements.shieldCount.textContent = gameState.powerups.shield;
    elements.doubleCount.textContent = gameState.powerups.double;

    // Disable empty powerups
    elements.powerupHeal.classList.toggle('disabled', gameState.powerups.heal <= 0);
    elements.powerupShield.classList.toggle('disabled', gameState.powerups.shield <= 0);
    elements.powerupDouble.classList.toggle('disabled', gameState.powerups.double <= 0);
}

// UI Updates
function updateHpBars() {
    const playerPercent = (gameState.playerHp / gameState.playerMaxHp) * 100;
    const enemyPercent = (gameState.enemyHp / gameState.enemyMaxHp) * 100;

    elements.playerHp.style.width = playerPercent + '%';
    elements.enemyHp.style.width = enemyPercent + '%';

    elements.playerHpText.textContent = `${gameState.playerHp}/${gameState.playerMaxHp}`;
    elements.enemyHpText.textContent = `${gameState.enemyHp}/${gameState.enemyMaxHp}`;

    // Low health warning
    if (playerPercent <= 25) {
        elements.playerHp.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
    } else {
        elements.playerHp.style.background = '';
    }
}

function updateStats() {
    elements.score.textContent = gameState.score.toLocaleString();
    elements.wordsFound.textContent = gameState.wordsFound;
    elements.bestCombo.textContent = gameState.bestCombo;
    elements.enemiesDefeated.textContent = gameState.enemiesDefeated;
    elements.comboCount.textContent = gameState.currentCombo;
    elements.playerPower.textContent = gameState.currentCombo > 0 ? `+${Math.floor(gameState.currentCombo * 20)}%` : '0';
    elements.enemyLevel.textContent = gameState.enemyLevel;
}

function showAttackText(text, color) {
    elements.attackText.textContent = text;
    elements.attackText.style.color = color;
    elements.attackText.classList.remove('show');
    void elements.attackText.offsetWidth; // Force reflow
    elements.attackText.classList.add('show');
}

function showDamageNumber(element, damage, className) {
    const rect = element.getBoundingClientRect();
    const dmgEl = document.createElement('div');
    dmgEl.className = `damage-number ${className}`;
    dmgEl.textContent = `-${damage}`;
    dmgEl.style.left = rect.left + rect.width / 2 + 'px';
    dmgEl.style.top = rect.top + 'px';
    document.body.appendChild(dmgEl);

    setTimeout(() => dmgEl.remove(), 1000);
}

function spawnParticles(element, emoji, count) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emoji;
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';

        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const distance = 50 + Math.random() * 100;
        particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');

        elements.particles.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// Game Flow
function endGame(victory) {
    gameState.gameOver = true;

    if (gameState.enemyAttackTimer) {
        clearInterval(gameState.enemyAttackTimer);
    }

    if (victory) {
        playVictory();
        elements.modalTitle.textContent = '🏆 Victory!';
    } else {
        playGameOver();
        elements.modalTitle.textContent = '💀 Game Over!';
    }

    // Save high score
    const highScore = parseInt(localStorage.getItem('wordMergeBattleHighScore') || '0');
    if (gameState.score > highScore) {
        localStorage.setItem('wordMergeBattleHighScore', gameState.score.toString());
    }

    elements.finalScore.textContent = gameState.score.toLocaleString();
    elements.finalWords.textContent = gameState.wordsFound;
    elements.finalEnemies.textContent = gameState.enemiesDefeated;
    elements.finalCombo.textContent = gameState.bestCombo;
    elements.highScore.textContent = Math.max(highScore, gameState.score).toLocaleString();

    elements.modal.classList.add('show');
}

function resetGame() {
    gameState = {
        playerHp: 100,
        playerMaxHp: 100,
        enemyHp: 50,
        enemyMaxHp: 50,
        currentEnemy: 0,
        enemyLevel: 1,
        score: 0,
        wordsFound: 0,
        bestCombo: 0,
        currentCombo: 0,
        enemiesDefeated: 0,
        selectedLetters: [],
        gridLetters: [],
        shufflesRemaining: 3,
        powerups: { heal: 1, shield: 1, double: 0 },
        shieldActive: false,
        doubleActive: false,
        enemyAttackTimer: null,
        enemyTimeRemaining: 6,
        gameOver: false
    };

    elements.modal.classList.remove('show');
    elements.shuffleBtn.disabled = false;
    elements.shuffleBtn.textContent = '🔀 Shuffle (3)';
    elements.playerSprite.classList.remove('shield-active');

    gameState.gridLetters = generateGrid();
    renderGrid();
    spawnNextEnemy();
    updateHpBars();
    updateStats();
    updatePowerups();
    updateCurrentWord();
}

// Event Listeners
elements.attackBtn.addEventListener('click', attack);
elements.clearBtn.addEventListener('click', clearSelection);
elements.shuffleBtn.addEventListener('click', shuffleGrid);
elements.playAgainBtn.addEventListener('click', resetGame);
elements.powerupHeal.addEventListener('click', () => usePowerup('heal'));
elements.powerupShield.addEventListener('click', () => usePowerup('shield'));
elements.powerupDouble.addEventListener('click', () => usePowerup('double'));

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !elements.attackBtn.disabled) {
        attack();
    } else if (e.key === 'Escape') {
        clearSelection();
    } else if (e.key === ' ' && !e.repeat) {
        shuffleGrid();
        e.preventDefault();
    }
});

// Initialize game
function init() {
    gameState.gridLetters = generateGrid();
    renderGrid();
    spawnNextEnemy();
    updateHpBars();
    updateStats();
    updatePowerups();

    // Resume audio context on first interaction
    document.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }, { once: true });
}

init();
