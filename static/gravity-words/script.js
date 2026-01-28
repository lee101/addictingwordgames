// Gravity Words - A physics-based word game
// Catch falling letters to form words!

// Valid words dictionary (common 3-6 letter words)
const VALID_WORDS = new Set([
    // 3 letter words
    'ace', 'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and', 'ant', 'any', 'ape', 'arc', 'are', 'ark', 'arm', 'art', 'ash', 'ask', 'ate',
    'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed', 'bee', 'bet', 'big', 'bit', 'bow', 'box', 'boy', 'bud', 'bug', 'bun', 'bus', 'but', 'buy',
    'cab', 'can', 'cap', 'car', 'cat', 'cob', 'cod', 'cog', 'cop', 'cot', 'cow', 'cry', 'cub', 'cud', 'cup', 'cur', 'cut',
    'dad', 'dam', 'day', 'den', 'dew', 'did', 'die', 'dig', 'dim', 'dip', 'dog', 'dot', 'dry', 'dub', 'dud', 'due', 'dug', 'dye',
    'ear', 'eat', 'eel', 'egg', 'ego', 'elf', 'elk', 'elm', 'emu', 'end', 'era', 'eve', 'ewe', 'eye',
    'fab', 'fad', 'fan', 'far', 'fat', 'fax', 'fed', 'fee', 'few', 'fig', 'fin', 'fir', 'fit', 'fix', 'flu', 'fly', 'fob', 'foe', 'fog', 'for', 'fox', 'fry', 'fun', 'fur',
    'gag', 'gap', 'gas', 'gel', 'gem', 'get', 'gig', 'gin', 'gnu', 'gob', 'god', 'got', 'gum', 'gun', 'gut', 'guy', 'gym',
    'had', 'hag', 'ham', 'has', 'hat', 'hay', 'hem', 'hen', 'her', 'hew', 'hex', 'hid', 'him', 'hip', 'his', 'hit', 'hob', 'hod', 'hog', 'hop', 'hot', 'how', 'hub', 'hue', 'hug', 'hum', 'hut',
    'ice', 'icy', 'ill', 'imp', 'ink', 'inn', 'ion', 'ire', 'irk', 'its', 'ivy',
    'jab', 'jag', 'jam', 'jar', 'jaw', 'jay', 'jet', 'jig', 'job', 'jog', 'jot', 'joy', 'jug', 'jut',
    'keg', 'ken', 'key', 'kid', 'kin', 'kit',
    'lab', 'lac', 'lad', 'lag', 'lap', 'law', 'lax', 'lay', 'lea', 'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lop', 'lot', 'low', 'lug',
    'mad', 'man', 'map', 'mar', 'mat', 'maw', 'may', 'men', 'met', 'mid', 'mix', 'mob', 'mod', 'mom', 'mop', 'mow', 'mud', 'mug', 'mum',
    'nab', 'nag', 'nap', 'nay', 'net', 'new', 'nib', 'nil', 'nip', 'nit', 'nob', 'nod', 'nor', 'not', 'now', 'nub', 'nun', 'nut',
    'oak', 'oar', 'oat', 'odd', 'ode', 'off', 'oft', 'ohm', 'oil', 'old', 'one', 'opt', 'orb', 'ore', 'our', 'out', 'owe', 'owl', 'own',
    'pad', 'pal', 'pan', 'pap', 'par', 'pat', 'paw', 'pay', 'pea', 'peg', 'pen', 'pep', 'per', 'pet', 'pew', 'pie', 'pig', 'pin', 'pit', 'ply', 'pod', 'pop', 'pot', 'pow', 'pro', 'pry', 'pub', 'pug', 'pun', 'pup', 'pus', 'put',
    'rag', 'ram', 'ran', 'rap', 'rat', 'raw', 'ray', 'red', 'ref', 'rep', 'rib', 'rid', 'rig', 'rim', 'rip', 'rob', 'rod', 'roe', 'rot', 'row', 'rub', 'rug', 'rum', 'run', 'rut', 'rye',
    'sac', 'sad', 'sag', 'sap', 'sat', 'saw', 'say', 'sea', 'set', 'sew', 'she', 'shy', 'sin', 'sip', 'sir', 'sis', 'sit', 'six', 'ski', 'sky', 'sly', 'sob', 'sod', 'son', 'sop', 'sot', 'sow', 'soy', 'spa', 'spy', 'sty', 'sub', 'sue', 'sum', 'sun', 'sup',
    'tab', 'tad', 'tag', 'tan', 'tap', 'tar', 'tat', 'tax', 'tea', 'ten', 'the', 'thy', 'tic', 'tie', 'tin', 'tip', 'tit', 'toe', 'tog', 'tom', 'ton', 'too', 'top', 'tot', 'tow', 'toy', 'try', 'tub', 'tug', 'tun', 'two',
    'ugh', 'ump', 'urn', 'use',
    'van', 'vat', 'vet', 'vex', 'via', 'vie', 'vim', 'vow',
    'wad', 'wag', 'war', 'was', 'wax', 'way', 'web', 'wed', 'wee', 'wet', 'who', 'why', 'wig', 'win', 'wit', 'woe', 'wok', 'won', 'woo', 'wow',
    'yak', 'yam', 'yap', 'yaw', 'yea', 'yen', 'yep', 'yes', 'yet', 'yew', 'yip', 'you', 'yow',
    'zap', 'zed', 'zen', 'zig', 'zip', 'zit', 'zoo',
    // 4 letter words
    'able', 'ache', 'acid', 'aged', 'aide', 'ally', 'also', 'area', 'army', 'auto', 'away',
    'baby', 'back', 'bake', 'ball', 'band', 'bank', 'bare', 'barn', 'base', 'bath', 'bead', 'beam', 'bean', 'bear', 'beat', 'beef', 'been', 'beer', 'bell', 'belt', 'bend', 'bent', 'best', 'bike', 'bill', 'bind', 'bird', 'bite', 'blow', 'blue', 'boat', 'body', 'boil', 'bold', 'bolt', 'bomb', 'bond', 'bone', 'book', 'boom', 'boot', 'born', 'boss', 'both', 'bowl', 'bred', 'brew', 'bulk', 'bull', 'bump', 'burn', 'bury', 'bush', 'busy', 'buzz',
    'cafe', 'cage', 'cake', 'call', 'calm', 'came', 'camp', 'cane', 'cape', 'card', 'care', 'cart', 'case', 'cash', 'cast', 'cave', 'cell', 'chat', 'chef', 'chip', 'chop', 'cite', 'city', 'clam', 'clap', 'claw', 'clay', 'clip', 'club', 'clue', 'coal', 'coat', 'code', 'coil', 'coin', 'cold', 'come', 'cook', 'cool', 'cope', 'copy', 'cord', 'core', 'corn', 'cost', 'cozy', 'crab', 'crew', 'crib', 'crop', 'crow', 'cube', 'curl', 'cute',
    'dame', 'damp', 'dare', 'dark', 'dash', 'data', 'date', 'dawn', 'dead', 'deaf', 'deal', 'dean', 'dear', 'debt', 'deck', 'deed', 'deem', 'deep', 'deer', 'deny', 'desk', 'dial', 'dice', 'diet', 'dirt', 'dish', 'disk', 'dive', 'dock', 'does', 'doll', 'dome', 'done', 'doom', 'door', 'dose', 'dove', 'down', 'drag', 'draw', 'drew', 'drip', 'drop', 'drug', 'drum', 'dual', 'duck', 'dude', 'duel', 'dues', 'dull', 'dumb', 'dump', 'dune', 'dunk', 'dusk', 'dust', 'duty',
    'each', 'ease', 'east', 'easy', 'echo', 'edge', 'edit', 'else', 'emit', 'ends', 'epic', 'euro', 'even', 'ever', 'evil', 'exam', 'exit', 'expo', 'eyes',
    'face', 'fact', 'fade', 'fail', 'fair', 'fake', 'fall', 'fame', 'fang', 'farm', 'fast', 'fate', 'fawn', 'fear', 'feat', 'feed', 'feel', 'feet', 'fell', 'felt', 'fern', 'fest', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'fist', 'five', 'flag', 'flap', 'flat', 'flaw', 'flea', 'fled', 'flee', 'flew', 'flip', 'flit', 'flow', 'foam', 'foil', 'fold', 'folk', 'fond', 'font', 'food', 'fool', 'foot', 'ford', 'fore', 'fork', 'form', 'fort', 'foul', 'four', 'fowl', 'free', 'frog', 'from', 'fuel', 'full', 'fume', 'fund', 'funk', 'fuse', 'fuss', 'fuzz',
    'gain', 'gale', 'game', 'gang', 'gape', 'garb', 'gate', 'gave', 'gaze', 'gear', 'gene', 'germ', 'gift', 'gild', 'gill', 'girl', 'give', 'glad', 'glow', 'glue', 'glum', 'goat', 'goes', 'gold', 'golf', 'gone', 'good', 'gown', 'grab', 'grad', 'gram', 'gray', 'grew', 'grid', 'grim', 'grin', 'grip', 'grit', 'grow', 'gulf', 'gust', 'guys',
    'hack', 'hail', 'hair', 'half', 'hall', 'halt', 'hand', 'hang', 'hank', 'hard', 'hare', 'harm', 'harp', 'hash', 'haul', 'have', 'hawk', 'haze', 'hazy', 'head', 'heal', 'heap', 'hear', 'heat', 'heel', 'held', 'hell', 'helm', 'help', 'hemp', 'herd', 'here', 'hero', 'hide', 'high', 'hike', 'hill', 'hint', 'hire', 'hold', 'hole', 'holy', 'home', 'hood', 'hook', 'hope', 'horn', 'hose', 'host', 'hour', 'howl', 'huff', 'huge', 'hull', 'hump', 'hung', 'hunt', 'hurl', 'hurt', 'hush', 'husk',
    'icky', 'idea', 'idle', 'idol', 'inch', 'info', 'into', 'iron', 'item',
    'jack', 'jade', 'jail', 'jaws', 'jazz', 'jean', 'jerk', 'jest', 'jive', 'jobs', 'join', 'joke', 'jolt', 'jowl', 'joys', 'jump', 'june', 'junk', 'jury', 'just',
    'keen', 'keep', 'kelp', 'kept', 'keys', 'kick', 'kids', 'kill', 'kind', 'king', 'kink', 'kiss', 'kite', 'knee', 'knew', 'knit', 'knob', 'knot', 'know',
    'lace', 'lack', 'lady', 'laid', 'lake', 'lamb', 'lame', 'lamp', 'land', 'lane', 'lard', 'lark', 'last', 'late', 'lava', 'lawn', 'laws', 'lead', 'leaf', 'leak', 'lean', 'leap', 'left', 'lend', 'lens', 'lent', 'less', 'liar', 'lice', 'lick', 'life', 'lift', 'like', 'limb', 'lime', 'limp', 'line', 'link', 'lion', 'lips', 'list', 'live', 'load', 'loaf', 'loan', 'lock', 'loft', 'logo', 'lone', 'long', 'look', 'loom', 'loop', 'loot', 'lord', 'lore', 'lose', 'loss', 'lost', 'lots', 'loud', 'love', 'luck', 'lull', 'lump', 'lung', 'lure', 'lurk', 'lush', 'lust',
    'made', 'maid', 'mail', 'main', 'make', 'male', 'mall', 'malt', 'mama', 'many', 'mare', 'mark', 'mart', 'mash', 'mask', 'mass', 'mast', 'mate', 'math', 'maze', 'meal', 'mean', 'meat', 'meek', 'meet', 'meld', 'melt', 'memo', 'menu', 'mere', 'mesh', 'mess', 'mild', 'mile', 'milk', 'mill', 'mime', 'mind', 'mine', 'mint', 'miss', 'mist', 'moan', 'moat', 'mock', 'mode', 'mold', 'mole', 'monk', 'mood', 'moon', 'more', 'morn', 'moss', 'most', 'moth', 'move', 'much', 'muck', 'mule', 'mull', 'murk', 'muse', 'mush', 'must', 'mute',
    'nail', 'name', 'nape', 'navy', 'near', 'neat', 'neck', 'need', 'neon', 'nerd', 'nest', 'nets', 'news', 'next', 'nice', 'nick', 'nine', 'node', 'none', 'nook', 'noon', 'norm', 'nose', 'note', 'noun',
    'odds', 'oils', 'okay', 'omen', 'once', 'ones', 'only', 'onto', 'oops', 'open', 'opts', 'oral', 'ours', 'oust', 'oven', 'over', 'owed', 'owes', 'owns',
    'pace', 'pack', 'pact', 'page', 'paid', 'pail', 'pain', 'pair', 'pale', 'palm', 'pane', 'pant', 'park', 'part', 'pass', 'past', 'path', 'pave', 'peak', 'pear', 'peas', 'peck', 'peek', 'peel', 'peer', 'perk', 'perm', 'pest', 'pick', 'pier', 'pike', 'pile', 'pill', 'pine', 'pink', 'pint', 'pipe', 'pita', 'pity', 'plan', 'play', 'plea', 'plod', 'plop', 'plot', 'plow', 'ploy', 'plug', 'plum', 'plus', 'pock', 'poem', 'poet', 'poke', 'pole', 'poll', 'polo', 'pomp', 'pond', 'pony', 'pool', 'poop', 'poor', 'pork', 'port', 'pose', 'post', 'pour', 'pout', 'pray', 'prep', 'prey', 'prim', 'prod', 'prop', 'pros', 'prow', 'puff', 'pull', 'pulp', 'pump', 'punk', 'pure', 'push', 'putt',
    'quad', 'quit', 'quiz',
    'race', 'rack', 'raft', 'rage', 'raid', 'rail', 'rain', 'rake', 'ramp', 'rang', 'rank', 'rant', 'rare', 'rash', 'rasp', 'rate', 'rave', 'rays', 'raze', 'razz', 'read', 'real', 'ream', 'reap', 'rear', 'redo', 'reed', 'reef', 'reek', 'reel', 'rely', 'rend', 'rent', 'rest', 'rice', 'rich', 'rick', 'ride', 'rift', 'rile', 'rill', 'rind', 'ring', 'riot', 'ripe', 'rise', 'risk', 'rite', 'road', 'roam', 'roar', 'robe', 'rock', 'rode', 'role', 'roll', 'romp', 'roof', 'room', 'root', 'rope', 'rose', 'rosy', 'rout', 'rove', 'rows', 'rude', 'ruin', 'rule', 'rump', 'rung', 'runs', 'runt', 'rush', 'rust',
    'sack', 'safe', 'sage', 'said', 'sail', 'sake', 'sale', 'salt', 'same', 'sand', 'sane', 'sang', 'sank', 'sash', 'save', 'says', 'scab', 'scam', 'scan', 'scar', 'seal', 'seam', 'sear', 'seas', 'seat', 'sect', 'seed', 'seek', 'seem', 'seen', 'self', 'sell', 'send', 'sent', 'sept', 'sets', 'shed', 'shin', 'ship', 'shod', 'shoe', 'shoo', 'shop', 'shot', 'show', 'shun', 'shut', 'sick', 'side', 'sift', 'sigh', 'sign', 'silk', 'sill', 'silo', 'sine', 'sing', 'sink', 'site', 'sits', 'size', 'skim', 'skin', 'skip', 'slab', 'slag', 'slam', 'slap', 'slat', 'slaw', 'slay', 'sled', 'slew', 'slid', 'slim', 'slip', 'slit', 'slob', 'slop', 'slot', 'slow', 'slug', 'slum', 'slur', 'smog', 'snap', 'snare', 'snob', 'snow', 'snub', 'snug', 'soak', 'soap', 'soar', 'sock', 'soda', 'sofa', 'soft', 'soil', 'sold', 'sole', 'some', 'song', 'soon', 'soot', 'sore', 'sort', 'soul', 'soup', 'sour', 'span', 'spar', 'spat', 'spec', 'sped', 'spin', 'spit', 'spot', 'spun', 'spur', 'stab', 'stag', 'star', 'stay', 'stem', 'step', 'stew', 'stir', 'stop', 'stub', 'stud', 'stun', 'such', 'suck', 'suit', 'sulk', 'sung', 'sunk', 'sure', 'surf', 'swan', 'swap', 'sway', 'swim', 'swob', 'swum',
    'tack', 'taco', 'tact', 'tail', 'take', 'tale', 'talk', 'tall', 'tame', 'tank', 'tape', 'taps', 'tart', 'task', 'taxi', 'team', 'tear', 'tech', 'teem', 'teen', 'tell', 'tend', 'tent', 'term', 'test', 'text', 'than', 'that', 'thaw', 'thee', 'them', 'then', 'they', 'thin', 'this', 'thou', 'thud', 'thus', 'tick', 'tide', 'tidy', 'tied', 'tier', 'ties', 'tile', 'till', 'tilt', 'time', 'tint', 'tiny', 'tips', 'tire', 'toad', 'toes', 'tofu', 'toga', 'togs', 'toil', 'told', 'toll', 'tomb', 'tome', 'tone', 'tons', 'took', 'tool', 'tops', 'tore', 'torn', 'tort', 'toss', 'tour', 'town', 'toys', 'trap', 'tray', 'tree', 'trek', 'trim', 'trio', 'trip', 'trod', 'trot', 'true', 'tube', 'tuck', 'tuft', 'tugs', 'tulip', 'tuna', 'tune', 'turf', 'turn', 'tusk', 'tutu', 'twig', 'twin', 'twit', 'type',
    'ugly', 'undo', 'unit', 'unto', 'upon', 'urge', 'used', 'user', 'uses',
    'vain', 'vale', 'vamp', 'vane', 'vary', 'vase', 'vast', 'veal', 'veer', 'veil', 'vein', 'vent', 'verb', 'very', 'vest', 'veto', 'vibe', 'vice', 'vied', 'vies', 'view', 'vile', 'vine', 'visa', 'vise', 'void', 'volt', 'vote', 'vows',
    'wade', 'waft', 'wage', 'wail', 'wait', 'wake', 'walk', 'wall', 'wand', 'want', 'ward', 'warm', 'warn', 'warp', 'wart', 'wary', 'wash', 'wasp', 'wave', 'wavy', 'waxy', 'ways', 'weak', 'wean', 'wear', 'weed', 'week', 'weep', 'weld', 'well', 'welt', 'went', 'wept', 'were', 'west', 'what', 'wheat', 'when', 'whew', 'whey', 'whim', 'whip', 'whir', 'whom', 'wick', 'wide', 'wife', 'wild', 'will', 'wilt', 'wimp', 'wind', 'wine', 'wing', 'wink', 'wipe', 'wire', 'wise', 'wish', 'wisp', 'with', 'woke', 'wolf', 'womb', 'wont', 'wood', 'woof', 'wool', 'word', 'wore', 'work', 'worm', 'worn', 'wove', 'wrap', 'wren',
    'yaks', 'yank', 'yard', 'yarn', 'yawn', 'yeah', 'year', 'yell', 'yelp', 'yoga', 'yoke', 'yolk', 'your', 'yowl', 'yuck',
    'zany', 'zaps', 'zeal', 'zero', 'zest', 'zinc', 'zips', 'zone', 'zoom',
    // 5+ letter words
    'about', 'above', 'abuse', 'actor', 'adapt', 'admit', 'adopt', 'adult', 'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'align', 'alike', 'alive', 'alley', 'allow', 'alloy', 'alone', 'along', 'alpha', 'alter', 'amaze', 'ample', 'angel', 'anger', 'angle', 'angry', 'ankle', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'armor', 'aroma', 'array', 'arrow', 'aside', 'asset', 'atlas', 'audio', 'audit', 'avoid', 'award', 'aware', 'awful',
    'badge', 'bagel', 'basic', 'basin', 'basis', 'batch', 'beach', 'beard', 'beast', 'begin', 'being', 'belly', 'below', 'bench', 'berry', 'birth', 'black', 'blade', 'blame', 'blank', 'blast', 'blaze', 'bleed', 'blend', 'bless', 'blind', 'blink', 'block', 'blond', 'blood', 'bloom', 'blown', 'blues', 'blunt', 'blush', 'board', 'boast', 'bonus', 'boost', 'booth', 'bound', 'boxer', 'brain', 'brake', 'brand', 'brave', 'bread', 'break', 'breed', 'brick', 'bride', 'brief', 'bring', 'broad', 'broke', 'brook', 'broom', 'brown', 'brush', 'buddy', 'build', 'built', 'bunch', 'burst', 'buyer',
    'cabin', 'cable', 'camel', 'canal', 'candy', 'carry', 'catch', 'cause', 'chain', 'chair', 'chalk', 'champ', 'charm', 'chart', 'chase', 'cheap', 'check', 'cheek', 'cheer', 'chess', 'chest', 'chick', 'chief', 'child', 'chill', 'china', 'chord', 'chunk', 'civic', 'civil', 'claim', 'clash', 'class', 'clean', 'clear', 'clerk', 'click', 'cliff', 'climb', 'cling', 'clock', 'clone', 'close', 'cloth', 'cloud', 'clown', 'coach', 'coast', 'colon', 'color', 'comet', 'coral', 'couch', 'cough', 'could', 'count', 'court', 'cover', 'crack', 'craft', 'crane', 'crash', 'crawl', 'crazy', 'cream', 'creek', 'creep', 'crime', 'crisp', 'cross', 'crowd', 'crown', 'cruel', 'crush', 'curve', 'cycle',
    'daily', 'dairy', 'dance', 'death', 'debut', 'delay', 'demon', 'denim', 'dense', 'depot', 'depth', 'deter', 'diary', 'dirty', 'disco', 'ditch', 'dodge', 'doing', 'donor', 'doubt', 'dough', 'dozen', 'draft', 'drain', 'drama', 'drank', 'drawn', 'dream', 'dress', 'dried', 'drift', 'drill', 'drink', 'drive', 'drown', 'drunk', 'dusty', 'dwell',
    'eager', 'eagle', 'early', 'earth', 'eight', 'elbow', 'elder', 'elect', 'elite', 'email', 'ember', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'equip', 'erase', 'error', 'essay', 'event', 'every', 'exact', 'exert', 'exist', 'extra',
    'fable', 'facet', 'faith', 'falls', 'false', 'fancy', 'fault', 'favor', 'feast', 'fence', 'ferry', 'fever', 'fiber', 'field', 'fiery', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flame', 'flash', 'flask', 'flesh', 'flick', 'fling', 'flint', 'float', 'flock', 'flood', 'floor', 'flora', 'flour', 'fluid', 'flush', 'flute', 'focal', 'focus', 'force', 'forge', 'forth', 'forum', 'fossil', 'found', 'frame', 'frank', 'fraud', 'freak', 'fresh', 'fried', 'front', 'frost', 'fruit', 'fully', 'fungi', 'funny', 'fuzzy',
    'gamer', 'ghost', 'giant', 'given', 'gland', 'glare', 'glass', 'gleam', 'glide', 'globe', 'gloom', 'glory', 'gloss', 'glove', 'glyph', 'goose', 'grace', 'grade', 'grain', 'grand', 'grant', 'grape', 'graph', 'grasp', 'grass', 'grave', 'great', 'greed', 'green', 'greet', 'grief', 'grill', 'grind', 'groan', 'groom', 'gross', 'group', 'grove', 'growl', 'grown', 'guard', 'guess', 'guest', 'guide', 'guild', 'guilt', 'guise', 'gulch',
    'habit', 'handy', 'happy', 'harsh', 'haste', 'hasty', 'hatch', 'haven', 'heart', 'heavy', 'hello', 'hence', 'heron', 'hobby', 'honey', 'honor', 'horse', 'hotel', 'hound', 'house', 'hover', 'human', 'humid', 'humor', 'hurry', 'hyper',
    'ideal', 'image', 'imply', 'index', 'inner', 'input', 'irony', 'issue', 'ivory',
    'jelly', 'jewel', 'joint', 'joker', 'jolly', 'judge', 'juice', 'juicy', 'jumbo', 'jumpy', 'junta', 'juror',
    'karma', 'kayak', 'kebab', 'kiosk', 'kitty', 'knack', 'knead', 'kneel', 'knife', 'knock', 'known',
    'label', 'labor', 'lance', 'large', 'laser', 'latch', 'later', 'laugh', 'layer', 'learn', 'lease', 'least', 'leave', 'ledge', 'legal', 'lemon', 'level', 'lever', 'libel', 'light', 'limit', 'linen', 'liner', 'lipid', 'liter', 'liver', 'llama', 'local', 'lofty', 'logic', 'login', 'lonely', 'loose', 'lorry', 'loser', 'lotus', 'loved', 'lover', 'lower', 'loyal', 'lucid', 'lucky', 'lunar', 'lunch', 'lyric',
    'macho', 'macro', 'magic', 'major', 'maker', 'manga', 'mango', 'manor', 'maple', 'march', 'marsh', 'match', 'maybe', 'mayor', 'medal', 'media', 'melee', 'melon', 'mercy', 'merge', 'merit', 'merry', 'messy', 'metal', 'meter', 'micro', 'midst', 'might', 'mimic', 'mince', 'minor', 'minus', 'mirth', 'misty', 'mixed', 'mixer', 'model', 'modem', 'moist', 'moldy', 'money', 'month', 'moose', 'moral', 'motel', 'motor', 'motto', 'mould', 'mound', 'mount', 'mourn', 'mouse', 'mouth', 'movie', 'muddy', 'mural', 'murky', 'music', 'musty', 'muted',
    'naive', 'naked', 'nasty', 'naval', 'needs', 'nerve', 'never', 'newer', 'newly', 'nicer', 'niche', 'night', 'ninth', 'noble', 'noise', 'noisy', 'north', 'notch', 'noted', 'novel', 'nurse', 'nylon',
    'oasis', 'occur', 'ocean', 'oddly', 'offer', 'often', 'olive', 'omega', 'onion', 'onset', 'opera', 'optic', 'orbit', 'order', 'organ', 'other', 'ought', 'ounce', 'outer', 'outgo', 'owned', 'owner', 'oxide', 'ozone',
    'paint', 'panel', 'panic', 'paper', 'party', 'pasta', 'paste', 'pasty', 'patch', 'pause', 'peace', 'peach', 'pearl', 'pedal', 'penny', 'perch', 'peril', 'perky', 'petal', 'petty', 'phase', 'phone', 'photo', 'piano', 'piece', 'piety', 'pilot', 'pinch', 'pitch', 'pixel', 'pizza', 'place', 'plaid', 'plain', 'plane', 'plank', 'plant', 'plate', 'plaza', 'plead', 'pleat', 'plier', 'pluck', 'plumb', 'plump', 'plush', 'point', 'poise', 'poker', 'polar', 'polio', 'polka', 'polls', 'polyp', 'pooch', 'poppy', 'porch', 'poser', 'posed', 'potty', 'pouch', 'pound', 'power', 'prank', 'prawn', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prism', 'prize', 'probe', 'promo', 'prone', 'proof', 'prose', 'proud', 'prove', 'proxy', 'prude', 'prune', 'psalm', 'pulpy', 'pulse', 'punch', 'pupil', 'puppy', 'purge', 'purse', 'pushy', 'putty',
    'quack', 'qualm', 'quart', 'queen', 'query', 'quest', 'queue', 'quick', 'quiet', 'quill', 'quilt', 'quirk', 'quota', 'quote',
    'rabbi', 'racer', 'radar', 'radii', 'radio', 'rainy', 'raise', 'rally', 'ranch', 'range', 'rapid', 'rarer', 'ratio', 'razor', 'reach', 'react', 'ready', 'realm', 'rebel', 'recap', 'refer', 'reign', 'relax', 'relay', 'relic', 'remix', 'reply', 'repro', 'reset', 'resin', 'retro', 'retry', 'rider', 'ridge', 'rifle', 'right', 'rigid', 'rigor', 'rinse', 'ripen', 'risen', 'riser', 'risky', 'ritzy', 'rival', 'river', 'roach', 'roast', 'robin', 'robot', 'rocky', 'rodeo', 'rogue', 'roman', 'roomy', 'roost', 'rouge', 'rough', 'round', 'rouse', 'route', 'rover', 'royal', 'rugby', 'ruler', 'rumor', 'rupee', 'rural', 'rusty',
    'sadly', 'safer', 'saint', 'salad', 'sales', 'salon', 'salsa', 'salty', 'sandy', 'saner', 'satay', 'satin', 'sauce', 'sauna', 'saute', 'saved', 'saver', 'savor', 'savvy', 'scale', 'scalp', 'scaly', 'scamp', 'scant', 'scare', 'scarf', 'scary', 'scene', 'scent', 'scope', 'score', 'scorn', 'scout', 'scowl', 'scrap', 'screw', 'scrub', 'seize', 'semen', 'sense', 'sepia', 'serve', 'setup', 'seven', 'sever', 'shade', 'shady', 'shaft', 'shake', 'shaky', 'shame', 'shank', 'shape', 'shard', 'share', 'shark', 'sharp', 'shave', 'shawl', 'shear', 'sheen', 'sheep', 'sheer', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shiny', 'shire', 'shirk', 'shirt', 'shock', 'shore', 'short', 'shout', 'shove', 'shown', 'showy', 'shrub', 'shrug', 'shuck', 'shunt', 'sided', 'siege', 'sight', 'sigma', 'silky', 'silly', 'since', 'sinew', 'siren', 'sissy', 'sixth', 'sixty', 'sized', 'skate', 'skier', 'skill', 'skimp', 'skirt', 'skull', 'skunk', 'slack', 'slain', 'slang', 'slant', 'slash', 'slate', 'sleek', 'sleep', 'sleet', 'slice', 'slide', 'slime', 'slimy', 'sling', 'slink', 'slope', 'slosh', 'sloth', 'slump', 'slurp', 'slush', 'slyly', 'smack', 'small', 'smart', 'smash', 'smear', 'smell', 'smelt', 'smile', 'smirk', 'smite', 'smith', 'smoke', 'smoky', 'snack', 'snail', 'snake', 'snaky', 'snare', 'snarl', 'sneak', 'sneer', 'snide', 'sniff', 'snipe', 'snoop', 'snore', 'snort', 'snout', 'snowy', 'snuck', 'soapy', 'sober', 'solar', 'solid', 'solve', 'sonar', 'sonic', 'sorry', 'sound', 'south', 'space', 'spade', 'spare', 'spark', 'spawn', 'speak', 'spear', 'speck', 'speed', 'spell', 'spend', 'spent', 'spice', 'spicy', 'spiel', 'spike', 'spiky', 'spill', 'spine', 'spiny', 'spire', 'spite', 'splat', 'split', 'spoil', 'spoke', 'spoof', 'spook', 'spoon', 'sport', 'spout', 'spray', 'spree', 'sprig', 'spunk', 'spurn', 'spurt', 'squad', 'squat', 'squaw', 'squib', 'squid', 'stack', 'staff', 'stage', 'stain', 'stair', 'stake', 'stale', 'stalk', 'stall', 'stamp', 'stand', 'stank', 'staph', 'stare', 'stark', 'start', 'stash', 'state', 'stave', 'steak', 'steal', 'steam', 'steel', 'steep', 'steer', 'stern', 'stick', 'stiff', 'still', 'stilt', 'sting', 'stink', 'stint', 'stock', 'stoic', 'stomp', 'stone', 'stony', 'stood', 'stool', 'stoop', 'store', 'stork', 'storm', 'story', 'stout', 'stove', 'strap', 'straw', 'stray', 'strip', 'strut', 'stuck', 'study', 'stuff', 'stump', 'stung', 'stunk', 'stunt', 'style', 'sugar', 'suite', 'sulky', 'sunny', 'super', 'surge', 'sushi', 'swamp', 'swarm', 'swath', 'swear', 'sweat', 'sweep', 'sweet', 'swell', 'swept', 'swift', 'swill', 'swine', 'swing', 'swipe', 'swirl', 'swish', 'swoon', 'swoop', 'sword', 'swore', 'sworn', 'swung',
    'table', 'taboo', 'tacit', 'tacky', 'taffy', 'taint', 'taken', 'taker', 'tally', 'talon', 'tango', 'tangy', 'taper', 'tardy', 'taste', 'tasty', 'tatty', 'taunt', 'tawny', 'teach', 'tease', 'teddy', 'teeth', 'tempo', 'tenor', 'tense', 'tenth', 'tepee', 'tepid', 'terra', 'terse', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thief', 'thigh', 'thing', 'think', 'third', 'thorn', 'those', 'three', 'threw', 'thrift', 'throb', 'throw', 'thumb', 'thump', 'tiara', 'tidal', 'tiger', 'tight', 'tilde', 'timer', 'timid', 'tipsy', 'titan', 'title', 'toast', 'today', 'token', 'tonal', 'toner', 'tongs', 'tonic', 'tooth', 'topaz', 'topic', 'torch', 'torso', 'total', 'totem', 'touch', 'tough', 'towel', 'tower', 'toxic', 'trace', 'track', 'tract', 'trade', 'trail', 'train', 'trait', 'tramp', 'trash', 'trawl', 'tread', 'treat', 'trend', 'trial', 'tribe', 'trick', 'tried', 'tripe', 'trite', 'troll', 'troop', 'trout', 'truce', 'truck', 'truly', 'trump', 'trunk', 'truss', 'trust', 'truth', 'tryst', 'tulip', 'tumor', 'tunic', 'tuple', 'turbo', 'tutor', 'twang', 'tweak', 'tweed', 'tweet', 'twice', 'twine', 'twirl', 'twist', 'tying', 'tyrant',
    'udder', 'ultra', 'umbra', 'uncle', 'under', 'unfed', 'unfit', 'unify', 'union', 'unite', 'unity', 'unmet', 'unset', 'untie', 'until', 'upper', 'upset', 'urban', 'usher', 'using', 'usual', 'utter',
    'vague', 'valid', 'valor', 'value', 'valve', 'vapid', 'vapor', 'vault', 'vaunt', 'vegan', 'venue', 'verge', 'verse', 'vibes', 'video', 'vigil', 'vigor', 'vinyl', 'viola', 'viper', 'viral', 'virus', 'visor', 'vista', 'vital', 'vivid', 'vixen', 'vocal', 'vodka', 'vogue', 'voice', 'voila', 'vomit', 'voter', 'vouch', 'vowel',
    'wacky', 'wafer', 'wager', 'wagon', 'waist', 'waltz', 'waste', 'watch', 'water', 'weary', 'weave', 'wedge', 'weedy', 'weigh', 'weird', 'whale', 'wharf', 'wheat', 'wheel', 'where', 'which', 'whiff', 'while', 'whine', 'whiny', 'whirl', 'whisk', 'white', 'whole', 'whose', 'widen', 'wider', 'widow', 'width', 'wield', 'wince', 'windy', 'wiper', 'witch', 'witty', 'woken', 'woman', 'women', 'woody', 'wooly', 'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'woven', 'wrack', 'wrath', 'wreak', 'wreck', 'wrest', 'wring', 'wrist', 'write', 'wrong', 'wrote', 'wrung',
    'xerox', 'yacht', 'yearn', 'yeast', 'yield', 'young', 'youth', 'zebra', 'zesty', 'zilch', 'zippy', 'zonal', 'zones'
]);

// Game state
let canvas, ctx;
let gameRunning = false;
let gamePaused = false;
let animationId = null;
let score = 0;
let highScore = 0;
let combo = 0;
let maxCombo = 0;
let wordsFormed = 0;
let lives = 3;
let collectedLetters = [];
let fallingLetters = [];
let particles = [];
let powerups = [];
let difficulty = 'medium';

// Audio context
let audioCtx = null;

// Difficulty settings
const DIFFICULTY_SETTINGS = {
    easy: { spawnRate: 2000, gravity: 0.8, maxLetters: 8 },
    medium: { spawnRate: 1500, gravity: 1.2, maxLetters: 12 },
    hard: { spawnRate: 1000, gravity: 1.8, maxLetters: 16 }
};

// Letter frequencies (weighted for common letters)
const LETTER_WEIGHTS = {
    'a': 8, 'b': 2, 'c': 3, 'd': 4, 'e': 12, 'f': 2, 'g': 3, 'h': 2, 'i': 9,
    'j': 1, 'k': 1, 'l': 4, 'm': 3, 'n': 7, 'o': 8, 'p': 3, 'q': 1, 'r': 6,
    's': 6, 't': 9, 'u': 4, 'v': 2, 'w': 2, 'x': 1, 'y': 2, 'z': 1
};

// Create weighted letter pool
const letterPool = [];
Object.entries(LETTER_WEIGHTS).forEach(([letter, weight]) => {
    for (let i = 0; i < weight; i++) {
        letterPool.push(letter);
    }
});

// Letter class with physics
class FallingLetter {
    constructor(x, letter) {
        this.x = x;
        this.y = -30;
        this.letter = letter;
        this.vy = 0;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.size = 36;
        this.rotation = (Math.random() - 0.5) * 0.2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.alpha = 1;
        this.hue = Math.random() * 60 + 180; // Blue-purple range
        this.glowPhase = Math.random() * Math.PI * 2;
        this.trail = [];
        this.antiGravity = false;
        this.antiGravityTime = 0;
    }

    update(gravity) {
        // Store position for trail
        this.trail.push({ x: this.x, y: this.y, alpha: 0.8 });
        if (this.trail.length > 8) this.trail.shift();

        // Update trail alpha
        this.trail.forEach((t, i) => {
            t.alpha = (i / this.trail.length) * 0.5;
        });

        // Physics
        if (this.antiGravity) {
            this.vy -= gravity * 0.5;
            this.antiGravityTime--;
            if (this.antiGravityTime <= 0) this.antiGravity = false;
        } else {
            this.vy += gravity * 0.1;
        }

        this.y += this.vy;
        this.x += this.vx;
        this.rotation += this.rotationSpeed;
        this.glowPhase += 0.1;

        // Bounce off walls
        if (this.x < 20 || this.x > canvas.width - 20) {
            this.vx *= -0.8;
            this.x = Math.max(20, Math.min(canvas.width - 20, this.x));
        }
    }

    draw() {
        // Draw trail
        this.trail.forEach((t) => {
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.size * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${t.alpha * 0.3})`;
            ctx.fill();
        });

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Glow effect
        const glowSize = 8 + Math.sin(this.glowPhase) * 3;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size + glowSize);
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, ${this.alpha})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 60%, 40%, ${this.alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 40%, 20%, 0)`);

        ctx.beginPath();
        ctx.arc(0, 0, this.size + glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Letter background
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, ${this.alpha * 0.9})`;
        ctx.fill();
        ctx.strokeStyle = `hsla(${this.hue + 30}, 80%, 70%, ${this.alpha})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Letter
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.font = `bold ${this.size * 0.8}px 'Segoe UI', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
        ctx.shadowBlur = 10;
        ctx.fillText(this.letter.toUpperCase(), 0, 2);
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    isOffScreen() {
        return this.y > canvas.height + 50;
    }
}

// Particle class for explosions
class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() - 0.5) * 12 - 3;
        this.size = Math.random() * 6 + 3;
        this.hue = hue;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.02;
        this.gravity = 0.15;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.98;
        this.alpha -= this.decay;
        this.size *= 0.97;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.alpha})`;
        ctx.fill();
    }

    isDead() {
        return this.alpha <= 0;
    }
}

// Powerup class
class Powerup {
    constructor(x) {
        this.x = x;
        this.y = -30;
        this.vy = 1;
        this.size = 25;
        this.type = Math.random() < 0.5 ? 'antigravity' : 'extralife';
        this.rotation = 0;
        this.alpha = 1;
    }

    update() {
        this.y += this.vy;
        this.rotation += 0.05;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 1.5);
        if (this.type === 'antigravity') {
            gradient.addColorStop(0, 'rgba(0, 255, 200, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 255, 200, 0)');
        } else {
            gradient.addColorStop(0, 'rgba(255, 100, 100, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 100, 100, 0)');
        }

        ctx.beginPath();
        ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Icon
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'antigravity' ? '#00ffc8' : '#ff6b6b';
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = `bold ${this.size}px 'Segoe UI'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.type === 'antigravity' ? '⬆' : '❤', 0, 0);

        ctx.restore();
    }

    isOffScreen() {
        return this.y > canvas.height + 50;
    }
}

// Audio functions
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(freq, duration, type = 'sine', volume = 0.2) {
    if (!audioCtx) return;
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

function playLetterCatch(comboLevel) {
    const baseFreq = 440 + comboLevel * 30;
    playTone(baseFreq, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(baseFreq * 1.25, 0.1, 'sine', 0.12), 30);
}

function playWordSuccess(wordLength) {
    const baseFreq = 392;
    const notes = [1, 1.25, 1.5, 1.875, 2];
    notes.slice(0, Math.min(wordLength, 5)).forEach((mult, i) => {
        setTimeout(() => playTone(baseFreq * mult, 0.15, 'triangle', 0.15), i * 80);
    });
}

function playWordFail() {
    playTone(200, 0.3, 'sawtooth', 0.1);
}

function playLetterMiss() {
    playTone(150, 0.2, 'square', 0.08);
}

function playPowerup(type) {
    if (type === 'antigravity') {
        [600, 800, 1000, 1200].forEach((f, i) => {
            setTimeout(() => playTone(f, 0.1, 'sine', 0.1), i * 50);
        });
    } else {
        [523, 659, 784].forEach((f, i) => {
            setTimeout(() => playTone(f, 0.15, 'triangle', 0.12), i * 100);
        });
    }
}

function playGameOver() {
    [440, 392, 349, 293].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.4, 'triangle', 0.15), i * 200);
    });
}

// Spawn functions
let lastSpawnTime = 0;
let lastPowerupTime = 0;

function spawnLetter() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    if (fallingLetters.length < settings.maxLetters) {
        const x = Math.random() * (canvas.width - 60) + 30;
        const letter = letterPool[Math.floor(Math.random() * letterPool.length)];
        fallingLetters.push(new FallingLetter(x, letter));
    }
}

function spawnPowerup() {
    if (Math.random() < 0.3) {
        const x = Math.random() * (canvas.width - 60) + 30;
        powerups.push(new Powerup(x));
    }
}

// Explosion effect
function createExplosion(x, y, hue, count = 20) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, hue));
    }
}

// Screen flash effect
function flashScreen(color) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${color};
        pointer-events: none;
        z-index: 9999;
        animation: flash 0.3s ease-out forwards;
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 300);
}

// Game functions
function catchLetter(key) {
    const letter = key.toLowerCase();
    for (let i = 0; i < fallingLetters.length; i++) {
        if (fallingLetters[i].letter === letter) {
            const fl = fallingLetters[i];

            // Create explosion at letter position
            createExplosion(fl.x, fl.y, fl.hue, 25);

            // Add to collected letters
            collectedLetters.push(letter);
            updateCollectedDisplay();

            // Score and combo
            combo++;
            if (combo > maxCombo) maxCombo = combo;
            score += 10 * combo;
            updateStats();

            // Sound
            playLetterCatch(combo);

            // Remove letter
            fallingLetters.splice(i, 1);
            return true;
        }
    }
    return false;
}

function submitWord() {
    const word = collectedLetters.join('');
    if (word.length < 3) {
        showMessage('Words must be at least 3 letters!', 'error');
        playWordFail();
        return;
    }

    if (VALID_WORDS.has(word)) {
        // Valid word!
        const wordScore = word.length * 50 * (1 + combo * 0.1);
        score += Math.floor(wordScore);
        wordsFormed++;

        // Add word to display
        addWordTag(word);

        showMessage(`"${word.toUpperCase()}" = +${Math.floor(wordScore)} points!`, 'success');
        playWordSuccess(word.length);
        flashScreen('rgba(76, 175, 80, 0.3)');

        // Clear collected letters
        collectedLetters = [];
        updateCollectedDisplay();
        updateStats();
    } else {
        showMessage(`"${word.toUpperCase()}" is not a valid word!`, 'error');
        playWordFail();
        combo = 0;
        updateStats();
    }
}

function clearLetters() {
    collectedLetters = [];
    updateCollectedDisplay();
    combo = 0;
    updateStats();
}

function loseLife() {
    lives--;
    updateLives();
    playLetterMiss();
    combo = 0;
    updateStats();

    if (lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    playGameOver();

    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('gravityWordsHighScore', highScore);
    }

    // Show modal
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-words').textContent = wordsFormed;
    document.getElementById('best-combo').textContent = maxCombo;
    document.getElementById('game-over-modal').classList.remove('hidden');

    document.getElementById('start-btn').disabled = false;
    document.getElementById('pause-btn').disabled = true;
}

// Update functions
function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('combo').textContent = combo;
    document.getElementById('words-formed').textContent = wordsFormed;
    document.getElementById('high-score').textContent = highScore;
}

function updateLives() {
    const heartsStr = '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives));
    document.getElementById('lives').textContent = heartsStr;
}

function updateCollectedDisplay() {
    document.getElementById('collected-letters').textContent = collectedLetters.join('').toUpperCase();
    document.getElementById('current-word').textContent = collectedLetters.join('').toUpperCase();
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = `message-${type}`;
    setTimeout(() => {
        msg.textContent = '';
        msg.className = '';
    }, 2000);
}

function addWordTag(word) {
    const container = document.getElementById('valid-words');
    const tag = document.createElement('span');
    tag.className = 'word-tag';
    tag.textContent = word.toUpperCase();
    container.appendChild(tag);

    // Keep only last 10 words
    while (container.children.length > 10) {
        container.removeChild(container.firstChild);
    }
}

// Main game loop
function gameLoop(timestamp) {
    if (!gameRunning || gamePaused) {
        if (gameRunning) animationId = requestAnimationFrame(gameLoop);
        return;
    }

    const settings = DIFFICULTY_SETTINGS[difficulty];

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#0c1445');
    bgGrad.addColorStop(0.5, '#1a237e');
    bgGrad.addColorStop(1, '#283593');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 50; i++) {
        const x = (i * 73) % canvas.width;
        const y = (i * 47 + timestamp * 0.01) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, Math.sin(timestamp * 0.001 + i) * 1 + 1, 0, Math.PI * 2);
        ctx.fill();
    }

    // Spawn letters
    if (timestamp - lastSpawnTime > settings.spawnRate) {
        spawnLetter();
        lastSpawnTime = timestamp;
    }

    // Spawn powerups occasionally
    if (timestamp - lastPowerupTime > 10000) {
        spawnPowerup();
        lastPowerupTime = timestamp;
    }

    // Update and draw falling letters
    for (let i = fallingLetters.length - 1; i >= 0; i--) {
        const fl = fallingLetters[i];
        fl.update(settings.gravity);
        fl.draw();

        if (fl.isOffScreen()) {
            fallingLetters.splice(i, 1);
            loseLife();
        }
    }

    // Update and draw powerups
    for (let i = powerups.length - 1; i >= 0; i--) {
        const pu = powerups[i];
        pu.update();
        pu.draw();

        if (pu.isOffScreen()) {
            powerups.splice(i, 1);
        }
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        if (p.isDead()) {
            particles.splice(i, 1);
        }
    }

    // Draw ground line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 5);
    ctx.lineTo(canvas.width, canvas.height - 5);
    ctx.stroke();
    ctx.setLineDash([]);

    animationId = requestAnimationFrame(gameLoop);
}

// Initialize game
function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    // Load high score
    highScore = parseInt(localStorage.getItem('gravityWordsHighScore')) || 0;
    updateStats();

    // Event listeners
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('pause-btn').addEventListener('click', togglePause);
    document.getElementById('submit-word').addEventListener('click', submitWord);
    document.getElementById('clear-letters').addEventListener('click', clearLetters);
    document.getElementById('play-again').addEventListener('click', () => {
        document.getElementById('game-over-modal').classList.add('hidden');
        startGame();
    });
    document.getElementById('difficulty').addEventListener('change', (e) => {
        difficulty = e.target.value;
    });

    // Keyboard input
    document.addEventListener('keydown', (e) => {
        if (!gameRunning || gamePaused) return;

        initAudio();

        const key = e.key.toLowerCase();

        // Letter input
        if (/^[a-z]$/.test(key)) {
            // Check powerups first
            for (let i = powerups.length - 1; i >= 0; i--) {
                const pu = powerups[i];
                // Collect powerup if we press any letter near it
                const nearLetter = fallingLetters.find(fl =>
                    Math.abs(fl.x - pu.x) < 50 && Math.abs(fl.y - pu.y) < 50
                );

                if (nearLetter && nearLetter.letter === key) {
                    // Activate powerup
                    if (pu.type === 'antigravity') {
                        fallingLetters.forEach(fl => {
                            fl.antiGravity = true;
                            fl.antiGravityTime = 180;
                        });
                        showMessage('Anti-Gravity Activated!', 'info');
                    } else {
                        lives = Math.min(lives + 1, 5);
                        updateLives();
                        showMessage('+1 Life!', 'success');
                    }
                    playPowerup(pu.type);
                    createExplosion(pu.x, pu.y, pu.type === 'antigravity' ? 160 : 0, 30);
                    powerups.splice(i, 1);
                }
            }

            catchLetter(key);
        }

        // Submit word with Enter
        if (e.key === 'Enter') {
            submitWord();
        }

        // Clear with Backspace
        if (e.key === 'Backspace') {
            if (collectedLetters.length > 0) {
                collectedLetters.pop();
                updateCollectedDisplay();
            }
        }

        // Escape to clear all
        if (e.key === 'Escape') {
            clearLetters();
        }
    });

    // Initialize music
    const musicGen = new PianoMusicGenerator();
    let musicPlaying = false;

    document.getElementById('music-toggle').addEventListener('click', function() {
        initAudio();
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

function startGame() {
    initAudio();

    // Reset state
    score = 0;
    combo = 0;
    maxCombo = 0;
    wordsFormed = 0;
    lives = 3;
    collectedLetters = [];
    fallingLetters = [];
    particles = [];
    powerups = [];
    lastSpawnTime = 0;
    lastPowerupTime = 0;

    // Clear word tags
    document.getElementById('valid-words').innerHTML = '';

    // Update UI
    updateStats();
    updateLives();
    updateCollectedDisplay();
    document.getElementById('message').textContent = '';

    // Enable/disable buttons
    document.getElementById('start-btn').disabled = true;
    document.getElementById('pause-btn').disabled = false;
    document.getElementById('pause-btn').textContent = 'Pause';

    gameRunning = true;
    gamePaused = false;

    animationId = requestAnimationFrame(gameLoop);
}

function togglePause() {
    gamePaused = !gamePaused;
    document.getElementById('pause-btn').textContent = gamePaused ? 'Resume' : 'Pause';

    if (!gamePaused) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Start when DOM is ready
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', init);
}
