// Word Duel Game
// Two-player competitive word game - don't be the one to complete a word!

// Comprehensive word list for validation (3+ letter words)
const validWords = new Set([
    // 3-letter words
    'ace', 'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and', 'ant', 'any', 'ape', 'arc', 'are', 'ark', 'arm', 'art', 'ash', 'ask', 'ate',
    'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed', 'bee', 'beg', 'bet', 'bid', 'big', 'bin', 'bit', 'bow', 'box', 'boy', 'bud', 'bug', 'bus', 'but', 'buy',
    'cab', 'can', 'cap', 'car', 'cat', 'cob', 'cod', 'cog', 'cop', 'cot', 'cow', 'cry', 'cub', 'cud', 'cup', 'cur', 'cut',
    'dad', 'dam', 'day', 'den', 'dew', 'did', 'die', 'dig', 'dim', 'dip', 'dog', 'dot', 'dry', 'dub', 'dud', 'due', 'dug', 'dye',
    'ear', 'eat', 'eel', 'egg', 'ego', 'elf', 'elk', 'elm', 'emu', 'end', 'era', 'eve', 'ewe', 'eye',
    'fad', 'fan', 'far', 'fat', 'fax', 'fed', 'fee', 'few', 'fig', 'fin', 'fir', 'fit', 'fix', 'fly', 'fob', 'foe', 'fog', 'for', 'fox', 'fry', 'fun', 'fur',
    'gag', 'gap', 'gas', 'gel', 'gem', 'get', 'gin', 'gnu', 'gob', 'god', 'got', 'gum', 'gun', 'gut', 'guy', 'gym',
    'had', 'hag', 'ham', 'has', 'hat', 'hay', 'hem', 'hen', 'her', 'hew', 'hid', 'him', 'hip', 'his', 'hit', 'hob', 'hod', 'hog', 'hop', 'hot', 'how', 'hub', 'hue', 'hug', 'hum', 'hut',
    'ice', 'icy', 'ill', 'imp', 'ink', 'inn', 'ion', 'ire', 'irk', 'its', 'ivy',
    'jab', 'jag', 'jam', 'jar', 'jaw', 'jay', 'jet', 'jig', 'job', 'jog', 'jot', 'joy', 'jug', 'jut',
    'keg', 'ken', 'key', 'kid', 'kin', 'kit',
    'lab', 'lac', 'lad', 'lag', 'lap', 'law', 'lay', 'lea', 'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lot', 'low', 'lug',
    'mad', 'man', 'map', 'mar', 'mat', 'maw', 'may', 'men', 'met', 'mid', 'mix', 'mob', 'mod', 'mom', 'mop', 'mow', 'mud', 'mug', 'mum',
    'nab', 'nag', 'nap', 'nay', 'net', 'new', 'nil', 'nip', 'nit', 'nob', 'nod', 'nor', 'not', 'now', 'nub', 'nun', 'nut',
    'oak', 'oar', 'oat', 'odd', 'ode', 'off', 'oft', 'ohm', 'oil', 'old', 'one', 'opt', 'orb', 'ore', 'our', 'out', 'owe', 'owl', 'own',
    'pad', 'pal', 'pan', 'pap', 'par', 'pat', 'paw', 'pay', 'pea', 'peg', 'pen', 'pep', 'per', 'pet', 'pew', 'pie', 'pig', 'pin', 'pit', 'ply', 'pod', 'pop', 'pot', 'pow', 'pro', 'pry', 'pub', 'pug', 'pun', 'pup', 'pus', 'put',
    'rad', 'rag', 'ram', 'ran', 'rap', 'rat', 'raw', 'ray', 'red', 'ref', 'rep', 'rib', 'rid', 'rig', 'rim', 'rip', 'rob', 'rod', 'roe', 'rot', 'row', 'rub', 'rue', 'rug', 'rum', 'run', 'rut', 'rye',
    'sac', 'sad', 'sag', 'sap', 'sat', 'saw', 'say', 'sea', 'set', 'sew', 'she', 'shy', 'sin', 'sip', 'sir', 'sis', 'sit', 'six', 'ski', 'sky', 'sly', 'sob', 'sod', 'son', 'sop', 'sot', 'sow', 'soy', 'spa', 'spy', 'sty', 'sub', 'sue', 'sum', 'sun', 'sup',
    'tab', 'tad', 'tag', 'tan', 'tap', 'tar', 'tat', 'tax', 'tea', 'ten', 'the', 'thy', 'tic', 'tie', 'tin', 'tip', 'tit', 'toe', 'tog', 'tom', 'ton', 'too', 'top', 'tot', 'tow', 'toy', 'try', 'tub', 'tug', 'tun', 'two',
    'ugh', 'ump', 'ups', 'urn', 'use',
    'van', 'vat', 'vet', 'via', 'vie', 'vim', 'vow',
    'wad', 'wag', 'war', 'was', 'wax', 'way', 'web', 'wed', 'wee', 'wet', 'who', 'why', 'wig', 'win', 'wit', 'woe', 'wok', 'won', 'woo', 'wow',
    'yak', 'yam', 'yap', 'yaw', 'yea', 'yen', 'yes', 'yet', 'yew', 'yip', 'you', 'yow',
    'zap', 'zed', 'zee', 'zen', 'zip', 'zit', 'zoo',

    // 4-letter words
    'able', 'ache', 'acid', 'aged', 'aide', 'aims', 'also', 'anti', 'apex', 'arch', 'area', 'army', 'arts', 'atom', 'aunt', 'auto', 'away', 'axis',
    'baby', 'back', 'bade', 'bail', 'bait', 'bake', 'bald', 'ball', 'band', 'bank', 'bare', 'bark', 'barn', 'base', 'bath', 'bead', 'beak', 'beam', 'bean', 'bear', 'beat', 'beef', 'been', 'beer', 'bell', 'belt', 'bend', 'bent', 'best', 'bias', 'bike', 'bill', 'bind', 'bird', 'bite', 'blow', 'blue', 'blur', 'boat', 'body', 'boil', 'bold', 'bolt', 'bomb', 'bond', 'bone', 'book', 'boom', 'boot', 'bore', 'born', 'boss', 'both', 'bowl', 'bred', 'brew', 'brow', 'buck', 'bulk', 'bull', 'bump', 'burn', 'bury', 'bush', 'busy', 'buys',
    'cafe', 'cage', 'cake', 'calf', 'call', 'calm', 'came', 'camp', 'cane', 'cape', 'card', 'care', 'carl', 'cart', 'case', 'cash', 'cast', 'cave', 'cell', 'chat', 'chef', 'chew', 'chip', 'city', 'clad', 'clam', 'clan', 'clap', 'claw', 'clay', 'clip', 'club', 'clue', 'coal', 'coat', 'code', 'coil', 'coin', 'cold', 'colt', 'comb', 'come', 'cone', 'cook', 'cool', 'cope', 'copy', 'cord', 'core', 'cork', 'corn', 'cost', 'cozy', 'crab', 'crew', 'crib', 'crop', 'crow', 'cube', 'cult', 'curb', 'cure', 'curl', 'cute',
    'damp', 'dare', 'dark', 'dart', 'dash', 'data', 'date', 'dawn', 'days', 'dead', 'deal', 'dean', 'dear', 'debt', 'deck', 'deed', 'deem', 'deep', 'deer', 'demo', 'deny', 'desk', 'dial', 'dice', 'died', 'diet', 'dime', 'dine', 'dire', 'dirt', 'disc', 'dish', 'disk', 'dive', 'dock', 'does', 'doll', 'dome', 'done', 'doom', 'door', 'dose', 'down', 'drag', 'dram', 'draw', 'drew', 'drip', 'drop', 'drum', 'dual', 'duck', 'dude', 'duel', 'dues', 'duke', 'dull', 'dumb', 'dump', 'dune', 'dunk', 'dusk', 'dust', 'duty',
    'each', 'earl', 'earn', 'ears', 'ease', 'east', 'easy', 'eats', 'echo', 'edge', 'edit', 'else', 'emit', 'ends', 'envy', 'epic', 'even', 'ever', 'evil', 'exam', 'exec', 'exit', 'expo', 'eyed', 'eyes',
    'face', 'fact', 'fade', 'fail', 'fair', 'fake', 'fall', 'fame', 'fare', 'farm', 'fast', 'fate', 'feat', 'feed', 'feel', 'fees', 'feet', 'fell', 'felt', 'fend', 'fern', 'fest', 'feud', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'fist', 'fits', 'five', 'flag', 'flak', 'flap', 'flat', 'flaw', 'flea', 'fled', 'flee', 'flew', 'flip', 'flit', 'flow', 'foam', 'foes', 'fold', 'folk', 'fond', 'font', 'food', 'fool', 'foot', 'ford', 'fore', 'fork', 'form', 'fort', 'foul', 'four', 'fowl', 'fray', 'free', 'fret', 'frog', 'from', 'fuel', 'full', 'fume', 'fund', 'funk', 'furl', 'fury', 'fuse', 'fuss',
    'gain', 'gait', 'gala', 'gale', 'game', 'gang', 'gaps', 'garb', 'gate', 'gave', 'gaze', 'gear', 'geek', 'gene', 'germ', 'gets', 'gift', 'gilt', 'girl', 'gist', 'give', 'glad', 'glee', 'glen', 'glib', 'glob', 'glom', 'glop', 'glow', 'glue', 'glum', 'glut', 'gnaw', 'goal', 'goat', 'goes', 'gold', 'golf', 'gone', 'good', 'goof', 'gore', 'gory', 'gosh', 'gown', 'grab', 'grad', 'gram', 'gray', 'grew', 'grey', 'grid', 'grim', 'grin', 'grip', 'grit', 'grow', 'grub', 'gulf', 'gulp', 'gums', 'guns', 'gunk', 'gust', 'guts', 'guys',
    'hack', 'hail', 'hair', 'hale', 'half', 'hall', 'halt', 'hand', 'hang', 'hank', 'hard', 'hare', 'harm', 'harp', 'hate', 'haul', 'have', 'hawk', 'haze', 'hazy', 'head', 'heal', 'heap', 'hear', 'heat', 'heck', 'heed', 'heel', 'heir', 'held', 'hell', 'helm', 'help', 'hemp', 'herd', 'here', 'hero', 'hide', 'high', 'hike', 'hill', 'hint', 'hire', 'hits', 'hive', 'hoard', 'hold', 'hole', 'holy', 'home', 'hone', 'hood', 'hook', 'hoop', 'hope', 'horn', 'hose', 'host', 'hour', 'howl', 'hubs', 'hues', 'huge', 'hull', 'hump', 'hung', 'hunk', 'hunt', 'hurl', 'hurt', 'hush', 'husk', 'hymn', 'hype',
    'iced', 'icon', 'idea', 'idle', 'idol', 'inch', 'info', 'into', 'ions', 'iris', 'iron', 'isle', 'itch', 'item',
    'jabs', 'jack', 'jade', 'jail', 'jams', 'jane', 'jars', 'java', 'jaws', 'jazz', 'jean', 'jeer', 'jelly', 'jerk', 'jest', 'jets', 'jobs', 'john', 'join', 'joke', 'jolt', 'joys', 'judo', 'jugs', 'jump', 'june', 'junk', 'jury', 'just', 'juts',
    'kale', 'keen', 'keep', 'kegs', 'kelp', 'kept', 'keys', 'kick', 'kids', 'kill', 'kilt', 'kind', 'king', 'kink', 'kiss', 'kite', 'kits', 'knee', 'knew', 'knit', 'knob', 'knot', 'know',
    'labs', 'lace', 'lack', 'lacy', 'lads', 'lady', 'lags', 'laid', 'lair', 'lake', 'lamb', 'lame', 'lamp', 'land', 'lane', 'laps', 'lard', 'lark', 'lash', 'lass', 'last', 'late', 'laud', 'lava', 'lawn', 'laws', 'lays', 'lazy', 'lead', 'leaf', 'leak', 'lean', 'leap', 'left', 'lend', 'lens', 'lent', 'less', 'lest', 'levy', 'liar', 'lice', 'lick', 'lids', 'lied', 'lien', 'lies', 'lieu', 'life', 'lift', 'like', 'lily', 'limb', 'lime', 'limp', 'line', 'link', 'lion', 'lips', 'lisp', 'list', 'live', 'load', 'loaf', 'loam', 'loan', 'lobe', 'lock', 'loft', 'logo', 'logs', 'lone', 'long', 'look', 'loom', 'loop', 'loot', 'lord', 'lore', 'lose', 'loss', 'lost', 'lots', 'loud', 'love', 'lows', 'luck', 'lull', 'lump', 'lure', 'lurk', 'lush', 'lust',
    'mace', 'made', 'maid', 'mail', 'main', 'make', 'male', 'mall', 'malt', 'mama', 'many', 'maps', 'mare', 'mark', 'mars', 'mash', 'mask', 'mass', 'mast', 'mate', 'math', 'maze', 'mead', 'meal', 'mean', 'meat', 'meek', 'meet', 'meld', 'melt', 'memo', 'mend', 'menu', 'mere', 'mesa', 'mesh', 'mess', 'mica', 'mice', 'mild', 'mile', 'milk', 'mill', 'mime', 'mind', 'mine', 'mini', 'mint', 'miss', 'mist', 'mite', 'mitt', 'moan', 'moat', 'mock', 'mode', 'mold', 'mole', 'molt', 'monk', 'mood', 'moon', 'moor', 'moot', 'mope', 'more', 'morn', 'moss', 'most', 'moth', 'move', 'much', 'muck', 'muds', 'muff', 'mugs', 'mule', 'mull', 'murk', 'muse', 'mush', 'musk', 'must', 'mute', 'mutt', 'myth',
    'nabs', 'nail', 'name', 'nape', 'naps', 'navy', 'near', 'neat', 'neck', 'need', 'neon', 'nerd', 'nest', 'nets', 'news', 'newt', 'next', 'nice', 'nick', 'nine', 'node', 'nods', 'none', 'noon', 'nope', 'norm', 'nose', 'nosy', 'note', 'noun', 'nova', 'nubs', 'nude', 'null', 'numb', 'nuts',
    'oafs', 'oaks', 'oars', 'oath', 'oats', 'obey', 'odds', 'odes', 'odor', 'offs', 'ogre', 'oils', 'oily', 'okay', 'omen', 'omit', 'once', 'ones', 'only', 'onto', 'oops', 'ooze', 'opal', 'open', 'opts', 'opus', 'oral', 'orbs', 'orca', 'ores', 'ours', 'oust', 'outs', 'oval', 'oven', 'over', 'owed', 'owes', 'owls', 'owns',
    'pace', 'pack', 'pact', 'pads', 'page', 'paid', 'pail', 'pain', 'pair', 'pale', 'palm', 'pals', 'pane', 'pang', 'pans', 'papa', 'paps', 'pare', 'park', 'part', 'pass', 'past', 'path', 'pats', 'pave', 'pawn', 'paws', 'pays', 'peak', 'peal', 'pear', 'peas', 'peat', 'peck', 'peek', 'peel', 'peep', 'peer', 'pegs', 'pelt', 'pens', 'peon', 'peps', 'perk', 'perm', 'pert', 'peso', 'pest', 'pets', 'pews', 'pick', 'pier', 'pies', 'pigs', 'pike', 'pile', 'pill', 'pine', 'pink', 'pins', 'pint', 'pipe', 'pips', 'pita', 'pith', 'pits', 'pity', 'plan', 'play', 'plea', 'pled', 'plod', 'plop', 'plot', 'plow', 'ploy', 'plug', 'plum', 'plus', 'pock', 'pods', 'poem', 'poet', 'poke', 'pole', 'poll', 'polo', 'pomp', 'pond', 'pony', 'pool', 'poop', 'poor', 'pope', 'pops', 'pore', 'pork', 'port', 'pose', 'posh', 'post', 'posy', 'pots', 'pour', 'pout', 'pray', 'prep', 'prey', 'prim', 'prod', 'prom', 'prop', 'pros', 'prow', 'pubs', 'puck', 'pugs', 'pull', 'pulp', 'pump', 'puns', 'punk', 'puns', 'puny', 'pups', 'pure', 'purr', 'push', 'puts', 'putt',
    'quad', 'quay', 'quit', 'quiz',
    'race', 'rack', 'raft', 'rage', 'rags', 'raid', 'rail', 'rain', 'rake', 'ramp', 'rams', 'rang', 'rank', 'rant', 'rape', 'raps', 'rapt', 'rare', 'rash', 'rasp', 'rate', 'rats', 'rave', 'rays', 'raze', 'read', 'real', 'ream', 'reap', 'rear', 'redo', 'reed', 'reef', 'reek', 'reel', 'refs', 'rein', 'rely', 'rend', 'rent', 'repo', 'reps', 'rest', 'ribs', 'rice', 'rich', 'ride', 'rids', 'riff', 'rift', 'rigs', 'rile', 'rill', 'rims', 'rind', 'ring', 'rink', 'riot', 'ripe', 'rips', 'rise', 'risk', 'rite', 'road', 'roam', 'roar', 'robe', 'robs', 'rock', 'rode', 'rods', 'roes', 'role', 'roll', 'romp', 'roof', 'rook', 'room', 'root', 'rope', 'ropy', 'rose', 'rosy', 'rote', 'rots', 'rout', 'rove', 'rows', 'rube', 'rubs', 'ruby', 'ruck', 'rude', 'rued', 'rues', 'ruff', 'rugs', 'ruin', 'rule', 'rump', 'rums', 'rune', 'rung', 'runs', 'runt', 'ruse', 'rush', 'rust', 'ruts',
    'sack', 'safe', 'saga', 'sage', 'sags', 'said', 'sail', 'sake', 'sale', 'salt', 'same', 'sand', 'sane', 'sang', 'sank', 'saps', 'sash', 'save', 'saws', 'says', 'scab', 'scam', 'scan', 'scar', 'seal', 'seam', 'sear', 'seas', 'seat', 'sect', 'seed', 'seek', 'seem', 'seen', 'seep', 'seer', 'sees', 'self', 'sell', 'semi', 'send', 'sent', 'sept', 'sera', 'sets', 'sewn', 'sews', 'shad', 'shah', 'sham', 'shaw', 'shed', 'shim', 'shin', 'ship', 'shmo', 'shod', 'shoe', 'shoo', 'shop', 'shot', 'show', 'shun', 'shut', 'sick', 'side', 'sigh', 'sign', 'silk', 'sill', 'silo', 'silt', 'sine', 'sing', 'sink', 'sins', 'sips', 'sire', 'site', 'sits', 'size', 'skat', 'skew', 'skid', 'skim', 'skin', 'skip', 'skit', 'slab', 'slag', 'slam', 'slap', 'slat', 'slaw', 'slay', 'sled', 'slew', 'slid', 'slim', 'slit', 'slob', 'slop', 'slot', 'slow', 'slum', 'slur', 'smog', 'snag', 'snap', 'snip', 'snit', 'snob', 'snot', 'snow', 'snub', 'snug', 'soak', 'soap', 'soar', 'sobs', 'sock', 'soda', 'sods', 'sofa', 'soft', 'soil', 'sold', 'sole', 'solo', 'some', 'song', 'sons', 'soon', 'soot', 'sops', 'sore', 'sort', 'soul', 'soup', 'sour', 'sown', 'sows', 'soya', 'span', 'spar', 'spas', 'spat', 'spec', 'sped', 'spew', 'spin', 'spit', 'spot', 'spry', 'spud', 'spun', 'spur', 'stab', 'stag', 'star', 'stay', 'stem', 'step', 'stew', 'stir', 'stop', 'stow', 'stub', 'stud', 'stun', 'subs', 'such', 'suck', 'suds', 'sued', 'sues', 'suit', 'sulk', 'sumo', 'sums', 'sung', 'sunk', 'suns', 'supe', 'sure', 'surf', 'sway', 'swim', 'swum', 'sync',
    'tack', 'taco', 'tact', 'tads', 'tags', 'tail', 'take', 'tale', 'talk', 'tall', 'tame', 'tamp', 'tans', 'tape', 'taps', 'tare', 'tarn', 'tarp', 'tars', 'tart', 'task', 'taxi', 'team', 'tear', 'teas', 'teat', 'tech', 'teds', 'teed', 'teem', 'teen', 'tees', 'tell', 'temp', 'tend', 'tens', 'tent', 'term', 'tern', 'test', 'text', 'than', 'that', 'thaw', 'thee', 'them', 'then', 'they', 'thin', 'this', 'thou', 'thud', 'thug', 'thus', 'tick', 'tide', 'tidy', 'tied', 'tier', 'ties', 'tile', 'till', 'tilt', 'time', 'tine', 'tins', 'tint', 'tiny', 'tips', 'tire', 'toad', 'toed', 'toes', 'tofu', 'toga', 'togs', 'toil', 'told', 'toll', 'tomb', 'tome', 'tone', 'tong', 'tons', 'took', 'tool', 'toot', 'tops', 'tore', 'torn', 'tort', 'toss', 'tote', 'tots', 'tour', 'tout', 'town', 'tows', 'toys', 'tram', 'trap', 'tray', 'tree', 'trek', 'trim', 'trio', 'trip', 'trod', 'trot', 'true', 'tsar', 'tuba', 'tube', 'tubs', 'tuck', 'tuft', 'tugs', 'tuna', 'tune', 'turf', 'turn', 'tush', 'tusk', 'tutu', 'twig', 'twin', 'twit', 'twos', 'type',
    'uber', 'ugly', 'undo', 'unit', 'unto', 'upon', 'urge', 'urns', 'used', 'user', 'uses',
    'vain', 'vale', 'vamp', 'vane', 'vans', 'vary', 'vase', 'vast', 'vats', 'veal', 'veer', 'veil', 'vein', 'vend', 'vent', 'verb', 'very', 'vest', 'veto', 'vets', 'vial', 'vice', 'vied', 'vies', 'view', 'vile', 'vine', 'visa', 'vise', 'viva', 'void', 'volt', 'vote', 'vows',
    'wade', 'wads', 'waft', 'wage', 'wags', 'waif', 'wail', 'wait', 'wake', 'walk', 'wall', 'wand', 'wane', 'want', 'ward', 'ware', 'warm', 'warn', 'warp', 'wars', 'wart', 'wary', 'wash', 'wasp', 'wave', 'wavy', 'waxy', 'ways', 'weak', 'wean', 'wear', 'weds', 'weed', 'week', 'weep', 'weld', 'well', 'welt', 'went', 'wept', 'were', 'west', 'wets', 'wham', 'what', 'when', 'whet', 'whey', 'whim', 'whip', 'whir', 'whit', 'whiz', 'whom', 'wick', 'wide', 'wife', 'wigs', 'wild', 'will', 'wilt', 'wimp', 'wind', 'wine', 'wing', 'wink', 'wins', 'wipe', 'wire', 'wiry', 'wise', 'wish', 'wisp', 'with', 'wits', 'wive', 'woes', 'woke', 'woks', 'wolf', 'womb', 'wont', 'wood', 'woof', 'wool', 'woos', 'word', 'wore', 'work', 'worm', 'worn', 'wort', 'wove', 'wows', 'wrap', 'wren',
    'yack', 'yaks', 'yams', 'yang', 'yank', 'yaps', 'yard', 'yarn', 'yawl', 'yawn', 'yawp', 'yaws', 'yeah', 'year', 'yeas', 'yell', 'yelp', 'yens', 'yeps', 'yerk', 'yews', 'yids', 'yike', 'yipe', 'yips', 'yoke', 'yolk', 'yore', 'your', 'yowl', 'yows', 'yuan', 'yuck', 'yuks', 'yule', 'yups',
    'zaps', 'zeal', 'zebu', 'zeds', 'zees', 'zero', 'zest', 'zeta', 'zinc', 'zing', 'zips', 'zits', 'zone', 'zonk', 'zoom', 'zoos',

    // 5+ letter common words
    'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'align', 'alike', 'alive', 'alley', 'allow', 'alloy', 'alone', 'along', 'alpha', 'alter', 'amaze', 'amber', 'amend', 'amino', 'among', 'ample', 'angel', 'anger', 'angle', 'angry', 'ankle', 'annex', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'armor', 'aroma', 'array', 'arrow', 'arson', 'asset', 'atlas', 'audio', 'audit', 'avoid', 'award', 'aware', 'awful',
    'bacon', 'badge', 'badly', 'baker', 'balls', 'bands', 'banks', 'baron', 'bases', 'basic', 'basin', 'basis', 'batch', 'beach', 'beast', 'began', 'begin', 'being', 'belly', 'below', 'bench', 'berry', 'birth', 'black', 'blade', 'blame', 'blank', 'blast', 'blaze', 'bleed', 'blend', 'bless', 'blind', 'blink', 'bliss', 'block', 'blood', 'bloom', 'blown', 'blues', 'blunt', 'board', 'boast', 'bonus', 'boost', 'booth', 'bound', 'boxer', 'brain', 'brake', 'brand', 'brass', 'brave', 'bread', 'break', 'breed', 'brick', 'bride', 'brief', 'bring', 'broad', 'broke', 'brook', 'broom', 'brown', 'brush', 'build', 'built', 'bunch', 'burst', 'buyer',
    'cabin', 'cable', 'camel', 'camps', 'canal', 'candy', 'cards', 'cargo', 'carol', 'carry', 'carve', 'catch', 'cause', 'cease', 'cells', 'chain', 'chair', 'chalk', 'champ', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'check', 'cheek', 'cheer', 'chess', 'chest', 'chick', 'chief', 'child', 'chill', 'china', 'choir', 'chord', 'chose', 'chunk', 'cisco', 'civic', 'civil', 'claim', 'clash', 'class', 'clean', 'clear', 'clerk', 'click', 'cliff', 'climb', 'cling', 'clock', 'clone', 'close', 'cloth', 'cloud', 'clown', 'clubs', 'coach', 'coast', 'cobra', 'cocoa', 'codes', 'colon', 'color', 'comet', 'comic', 'comma', 'coral', 'corps', 'couch', 'cough', 'could', 'count', 'coupe', 'court', 'cover', 'crack', 'craft', 'crane', 'crash', 'crawl', 'crazy', 'cream', 'creek', 'creep', 'crime', 'crisp', 'cross', 'crowd', 'crown', 'crude', 'cruel', 'crush', 'cubic', 'curve', 'cycle',
    'daily', 'dairy', 'dance', 'datum', 'dealt', 'death', 'debit', 'debut', 'decay', 'decor', 'delay', 'delta', 'dense', 'depot', 'depth', 'derby', 'deter', 'devil', 'diary', 'dirty', 'disco', 'ditch', 'diver', 'dizzy', 'dodge', 'doing', 'donor', 'donut', 'doubt', 'dough', 'dozen', 'draft', 'drain', 'drake', 'drama', 'drank', 'drawn', 'dread', 'dream', 'dress', 'dried', 'drift', 'drill', 'drink', 'drive', 'droit', 'drown', 'drugs', 'drunk', 'dryer', 'dwell', 'dying',
    'eager', 'eagle', 'early', 'earth', 'eaten', 'eater', 'edged', 'edges', 'eerie', 'eight', 'elbow', 'elder', 'elect', 'elite', 'email', 'embed', 'ember', 'empty', 'ended', 'enemy', 'enjoy', 'enter', 'entry', 'envoy', 'equal', 'equip', 'erase', 'erect', 'error', 'essay', 'ethic', 'evade', 'event', 'every', 'exact', 'exams', 'excel', 'exert', 'exile', 'exist', 'extra',
    'fable', 'faced', 'facet', 'facts', 'faint', 'fairy', 'faith', 'false', 'fancy', 'fatal', 'fatty', 'fault', 'fauna', 'favor', 'feast', 'fence', 'ferry', 'fetal', 'fetch', 'fever', 'fewer', 'fiber', 'fibre', 'field', 'fiery', 'fifth', 'fifty', 'fight', 'filed', 'filth', 'final', 'finds', 'fired', 'fires', 'firms', 'first', 'fixed', 'fixes', 'flags', 'flame', 'flash', 'flask', 'fleet', 'flesh', 'float', 'flock', 'flood', 'floor', 'flora', 'flour', 'flown', 'fluid', 'flung', 'flush', 'flute', 'focal', 'focus', 'foggy', 'folks', 'force', 'forge', 'forms', 'forth', 'forty', 'forum', 'fossil', 'found', 'frame', 'frank', 'fraud', 'freak', 'freed', 'fresh', 'friar', 'fried', 'fries', 'frill', 'frisk', 'front', 'frost', 'fruit', 'fully', 'funds', 'fungi', 'funny', 'furry', 'fuzzy',
    'games', 'gamma', 'gauge', 'genre', 'ghost', 'giant', 'given', 'gives', 'gland', 'glare', 'glass', 'gleam', 'globe', 'gloom', 'glory', 'gloss', 'glove', 'goals', 'goats', 'godly', 'going', 'goods', 'goose', 'gorge', 'grace', 'grade', 'grain', 'grand', 'grant', 'grape', 'graph', 'grasp', 'grass', 'grave', 'gravy', 'graze', 'great', 'greed', 'greek', 'green', 'greet', 'grief', 'grill', 'grind', 'groan', 'groom', 'gross', 'group', 'grove', 'grown', 'grows', 'guard', 'guess', 'guest', 'guide', 'guild', 'guilt', 'guise', 'guitar', 'gummy',
    'habit', 'hairy', 'hands', 'handy', 'happy', 'hardy', 'harsh', 'haste', 'hasty', 'hatch', 'haunt', 'haven', 'havoc', 'heads', 'heard', 'heart', 'heath', 'heavy', 'hedge', 'heels', 'hefty', 'heist', 'hello', 'helps', 'hence', 'herbs', 'heron', 'hired', 'hobby', 'holds', 'holes', 'holly', 'homes', 'honey', 'honor', 'hooks', 'hoped', 'hopes', 'horde', 'horns', 'horse', 'hosts', 'hotel', 'hound', 'hours', 'house', 'hover', 'human', 'humid', 'humor', 'humps', 'hurry', 'hurts', 'hydro', 'hyena', 'hyper',
    'icing', 'ideal', 'ideas', 'idiot', 'image', 'imply', 'inbox', 'incur', 'index', 'indie', 'infer', 'inner', 'input', 'intel', 'inter', 'intro', 'ionic', 'irish', 'irony', 'issue', 'items', 'ivory',
    'jacks', 'jaded', 'japan', 'jazzy', 'jeans', 'jelly', 'jenny', 'jerks', 'jerky', 'jesus', 'jetty', 'jewel', 'jiffy', 'jimmy', 'joint', 'joker', 'jolly', 'joust', 'judge', 'juice', 'juicy', 'jumbo', 'jumps', 'jumpy', 'junky', 'juror',
    'kayak', 'kebab', 'keeps', 'ketch', 'kicks', 'kills', 'kinds', 'kings', 'kiosk', 'kitty', 'knack', 'knead', 'kneel', 'knees', 'knife', 'knock', 'knots', 'known', 'knows',
    'label', 'labor', 'lacks', 'lager', 'lakes', 'lambs', 'lamps', 'lands', 'lanes', 'lapel', 'large', 'laser', 'lasts', 'later', 'latex', 'latin', 'laugh', 'layer', 'leads', 'leafy', 'leaks', 'leapt', 'learn', 'lease', 'least', 'leave', 'ledge', 'legal', 'lemon', 'lemur', 'lends', 'level', 'lever', 'lewis', 'liars', 'light', 'liked', 'likes', 'limbs', 'limit', 'lined', 'linen', 'liner', 'lines', 'links', 'lions', 'lists', 'liter', 'litre', 'lived', 'liver', 'lives', 'loads', 'loans', 'lobby', 'local', 'locks', 'locus', 'lodge', 'lofty', 'logic', 'logos', 'lonely', 'longs', 'looks', 'loops', 'loose', 'lords', 'loses', 'loss', 'lotus', 'lousy', 'loved', 'lover', 'loves', 'lower', 'lowly', 'loyal', 'lucid', 'lucky', 'lunch', 'lungs', 'lured', 'lyric',
    'macho', 'macro', 'magic', 'major', 'maker', 'makes', 'males', 'malls', 'manga', 'mania', 'manor', 'maple', 'march', 'marks', 'marry', 'marsh', 'masks', 'mason', 'match', 'mates', 'mauve', 'maxim', 'maybe', 'mayor', 'meals', 'means', 'meant', 'medal', 'media', 'melee', 'melon', 'mercy', 'merge', 'merit', 'merry', 'messy', 'metal', 'meter', 'metro', 'micro', 'midst', 'might', 'miles', 'mills', 'mimic', 'minds', 'mined', 'miner', 'mines', 'minor', 'minus', 'mirth', 'misty', 'mixed', 'mixer', 'model', 'modem', 'modes', 'moist', 'moldy', 'money', 'monks', 'month', 'moods', 'moody', 'moons', 'moose', 'moral', 'morph', 'mossy', 'motel', 'motor', 'motto', 'mould', 'mound', 'mount', 'mourn', 'mouse', 'mouth', 'moved', 'mover', 'moves', 'movie', 'mucky', 'muddy', 'mules', 'multi', 'mummy', 'munch', 'mural', 'murky', 'mushy', 'music', 'musky', 'musty', 'myths',
    'nails', 'naive', 'naked', 'named', 'names', 'nasal', 'nasty', 'naval', 'needs', 'nerve', 'nervy', 'nests', 'never', 'newer', 'newly', 'nexus', 'nicer', 'niche', 'night', 'ninja', 'ninth', 'noble', 'nodes', 'noise', 'noisy', 'nomad', 'norms', 'north', 'notch', 'noted', 'notes', 'novel', 'nudge', 'nurse', 'nutty', 'nylon',
    'oasis', 'occur', 'ocean', 'octet', 'oddly', 'offer', 'often', 'older', 'olive', 'omega', 'onset', 'opens', 'opera', 'optic', 'orbit', 'order', 'organ', 'other', 'ought', 'ounce', 'outer', 'outgo', 'owned', 'owner', 'oxide', 'ozone',
    'packs', 'pacts', 'padre', 'pagan', 'pages', 'pains', 'paint', 'pairs', 'palms', 'panel', 'panic', 'pants', 'paper', 'parks', 'parts', 'party', 'pasta', 'paste', 'patch', 'paths', 'patio', 'patty', 'pause', 'peace', 'peach', 'peaks', 'pearl', 'pedal', 'penal', 'pence', 'penny', 'perch', 'peril', 'perks', 'perky', 'pests', 'petty', 'phase', 'phone', 'photo', 'piano', 'picks', 'piece', 'piety', 'piles', 'pills', 'pilot', 'pinch', 'pines', 'pints', 'pious', 'pipes', 'pitch', 'pithy', 'pivot', 'pixel', 'pizza', 'place', 'plaid', 'plain', 'plane', 'plank', 'plans', 'plant', 'plate', 'plays', 'plaza', 'plead', 'pleas', 'pleat', 'pledge', 'plods', 'plots', 'pluck', 'plugs', 'plumb', 'plume', 'plump', 'plums', 'plunge', 'plunk', 'plush', 'poach', 'poems', 'poets', 'point', 'poise', 'poker', 'polar', 'poles', 'polls', 'pools', 'porch', 'pores', 'ports', 'posed', 'poses', 'posts', 'pouch', 'pound', 'pours', 'power', 'prank', 'prawn', 'press', 'price', 'pride', 'prima', 'prime', 'print', 'prior', 'prism', 'privy', 'prize', 'probe', 'promo', 'prone', 'prong', 'proof', 'props', 'prose', 'proud', 'prove', 'prowl', 'proxy', 'prude', 'prune', 'psalm', 'pubic', 'pulls', 'pulse', 'pumps', 'punch', 'pupil', 'puppy', 'purge', 'purse', 'pushy', 'putty',
    'quack', 'quail', 'qualm', 'quart', 'quasi', 'queen', 'query', 'quest', 'queue', 'quick', 'quiet', 'quilt', 'quirk', 'quite', 'quota', 'quote',
    'racer', 'races', 'radar', 'radio', 'rails', 'rains', 'rainy', 'raise', 'rally', 'ranch', 'range', 'ranks', 'rapid', 'rarer', 'rated', 'rates', 'ratio', 'razor', 'reach', 'react', 'reads', 'ready', 'realm', 'reams', 'rebel', 'recap', 'recon', 'recur', 'refer', 'reign', 'relax', 'relay', 'relic', 'remit', 'remix', 'renal', 'renew', 'rents', 'repay', 'reply', 'repos', 'rerun', 'reset', 'resin', 'retro', 'reuse', 'revue', 'rhino', 'rhyme', 'rider', 'rides', 'ridge', 'rifle', 'rifts', 'rigid', 'rigor', 'rings', 'rinse', 'riots', 'risen', 'riser', 'rises', 'risks', 'risky', 'rites', 'ritzy', 'rival', 'river', 'rivet', 'roads', 'roams', 'roars', 'roast', 'robes', 'robin', 'robot', 'rocks', 'rocky', 'rodeo', 'rogue', 'roles', 'rolls', 'roman', 'romps', 'roofs', 'rooms', 'roomy', 'roots', 'ropes', 'roses', 'rotor', 'rouge', 'rough', 'round', 'route', 'rover', 'royal', 'rugby', 'ruins', 'ruled', 'ruler', 'rules', 'rumor', 'rupee', 'rural', 'rusty',
    'sadly', 'safer', 'sails', 'saint', 'salad', 'sales', 'sally', 'salon', 'salsa', 'salty', 'salve', 'sands', 'sandy', 'saner', 'sauce', 'saucy', 'sauna', 'saved', 'saver', 'saves', 'savvy', 'scale', 'scalp', 'scaly', 'scamp', 'scams', 'scant', 'scare', 'scarf', 'scary', 'scene', 'scent', 'scoop', 'scope', 'score', 'scorn', 'scout', 'scram', 'scrap', 'screw', 'scrub', 'seals', 'seams', 'seats', 'seeds', 'seedy', 'seeks', 'seems', 'seize', 'sells', 'sends', 'sense', 'sepia', 'serum', 'serve', 'setup', 'seven', 'sever', 'shade', 'shady', 'shaft', 'shake', 'shaky', 'shall', 'shame', 'shape', 'shard', 'share', 'shark', 'sharp', 'shave', 'shawl', 'shear', 'sheds', 'sheen', 'sheep', 'sheer', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shiny', 'ships', 'shire', 'shirk', 'shirt', 'shock', 'shoes', 'shone', 'shook', 'shoot', 'shops', 'shore', 'short', 'shout', 'shove', 'shown', 'shows', 'showy', 'shred', 'shrub', 'shrug', 'shuck', 'shunt', 'shush', 'sided', 'sides', 'siege', 'sight', 'sigma', 'signs', 'silky', 'silly', 'since', 'sinew', 'singe', 'sinks', 'siren', 'sissy', 'sites', 'sixth', 'sixty', 'sized', 'sizes', 'skate', 'skein', 'skies', 'skill', 'skimp', 'skims', 'skins', 'skips', 'skirt', 'skull', 'skunk', 'slack', 'slain', 'slang', 'slant', 'slash', 'slate', 'slave', 'sleek', 'sleep', 'sleet', 'slept', 'slice', 'slick', 'slide', 'slime', 'slimy', 'sling', 'slink', 'slips', 'slits', 'slobs', 'slope', 'slosh', 'slots', 'sloth', 'slows', 'slump', 'slums', 'slunk', 'slurp', 'slush', 'slyly', 'smack', 'small', 'smart', 'smash', 'smear', 'smell', 'smelt', 'smile', 'smirk', 'smith', 'smoke', 'smoky', 'snack', 'snags', 'snail', 'snake', 'snaps', 'snare', 'snarl', 'sneak', 'sneer', 'sniff', 'snobs', 'snoop', 'snore', 'snort', 'snout', 'snowy', 'snubs', 'snuck', 'snuff', 'soapy', 'soars', 'sober', 'socks', 'sofas', 'softy', 'soggy', 'soils', 'solar', 'solid', 'solve', 'sonar', 'songs', 'sonic', 'sonny', 'soothe', 'sorry', 'sorts', 'souls', 'sound', 'soups', 'soupy', 'south', 'space', 'spade', 'spain', 'spank', 'spare', 'spark', 'spasm', 'spawn', 'speak', 'spear', 'specs', 'speed', 'spell', 'spend', 'spent', 'spice', 'spicy', 'spied', 'spies', 'spike', 'spiky', 'spill', 'spine', 'spiny', 'spiral', 'spite', 'splat', 'split', 'spoil', 'spoke', 'spoof', 'spook', 'spool', 'spoon', 'spore', 'sport', 'spots', 'spout', 'spray', 'spree', 'sprig', 'spry', 'spuds', 'spunk', 'spurn', 'spurt', 'squad', 'squat', 'squid', 'stack', 'staff', 'stage', 'stain', 'stair', 'stake', 'stale', 'stalk', 'stall', 'stamp', 'stand', 'stank', 'staple', 'stare', 'stark', 'stars', 'start', 'stash', 'state', 'stave', 'stays', 'steak', 'steal', 'steam', 'steel', 'steep', 'steer', 'stems', 'stench', 'steps', 'stern', 'stick', 'stiff', 'still', 'stilt', 'sting', 'stink', 'stint', 'stock', 'stoic', 'stoke', 'stole', 'stomp', 'stone', 'stood', 'stool', 'stoop', 'stops', 'store', 'stork', 'storm', 'story', 'stout', 'stove', 'strap', 'straw', 'stray', 'streak', 'stream', 'street', 'stress', 'stride', 'strike', 'string', 'strip', 'strive', 'strobe', 'stroke', 'stroll', 'strong', 'strove', 'struck', 'strung', 'strut', 'stuck', 'study', 'stuff', 'stump', 'stung', 'stunk', 'stunt', 'style', 'suave', 'sucks', 'sugar', 'suite', 'suits', 'sulky', 'sunny', 'super', 'surge', 'surly', 'sushi', 'swamp', 'swank', 'swans', 'swaps', 'swarm', 'swath', 'swear', 'sweat', 'sweep', 'sweet', 'swell', 'swept', 'swift', 'swine', 'swing', 'swipe', 'swirl', 'swiss', 'swoop', 'sword', 'swore', 'sworn', 'swung', 'syrup',
    'table', 'taboo', 'tacit', 'tacks', 'tacky', 'tacos', 'tails', 'taken', 'taker', 'takes', 'tales', 'talks', 'tally', 'talon', 'tamed', 'tamer', 'tangy', 'tanks', 'taper', 'tapes', 'tardy', 'tasks', 'taste', 'tasty', 'tatty', 'taunt', 'taxes', 'teach', 'teams', 'tears', 'teary', 'tease', 'teddy', 'teens', 'teeth', 'tempo', 'tends', 'tenor', 'tense', 'tenth', 'tents', 'tepid', 'terms', 'terra', 'terry', 'tests', 'texts', 'thank', 'thaws', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thief', 'thigh', 'thing', 'think', 'third', 'thong', 'thorn', 'those', 'three', 'threw', 'throb', 'throw', 'thrum', 'thuds', 'thugs', 'thumb', 'thump', 'tidal', 'tides', 'tiger', 'tight', 'tiled', 'tiles', 'tilts', 'timed', 'timer', 'times', 'timid', 'tinge', 'tinny', 'tipsy', 'tired', 'tires', 'titan', 'title', 'toast', 'today', 'token', 'tolls', 'tombs', 'tonal', 'toned', 'toner', 'tones', 'tongs', 'tonic', 'tools', 'tooth', 'topic', 'torch', 'torso', 'total', 'totem', 'touch', 'tough', 'tours', 'towel', 'tower', 'towns', 'toxic', 'trace', 'track', 'tract', 'trade', 'trail', 'train', 'trait', 'tramp', 'trans', 'traps', 'trash', 'trawl', 'trays', 'treat', 'trees', 'trend', 'trial', 'tribe', 'trick', 'tried', 'tries', 'trike', 'trims', 'trips', 'trite', 'troll', 'troop', 'trope', 'trots', 'trout', 'trove', 'truce', 'truck', 'truly', 'trump', 'trunk', 'truss', 'trust', 'truth', 'tubes', 'tulip', 'tumor', 'tuned', 'tuner', 'tunes', 'tunic', 'turbo', 'turns', 'tutor', 'tweak', 'tweed', 'tweet', 'twice', 'twigs', 'twill', 'twins', 'twirl', 'twist', 'tying', 'typed', 'types',
    'udder', 'ulcer', 'ultra', 'umbra', 'uncle', 'uncut', 'under', 'undue', 'unfed', 'unfit', 'unify', 'union', 'unite', 'units', 'unity', 'unlit', 'until', 'unwed', 'unzip', 'upper', 'upset', 'urban', 'urged', 'urine', 'usage', 'usher', 'using', 'usual', 'utter',
    'vague', 'valid', 'valor', 'value', 'valve', 'vapid', 'vapor', 'vault', 'vaunt', 'veers', 'veils', 'veins', 'venom', 'venue', 'verbs', 'verge', 'verse', 'video', 'views', 'vigil', 'vigor', 'viper', 'viral', 'virus', 'visor', 'visit', 'vista', 'vital', 'vivid', 'vocal', 'vodka', 'vogue', 'voice', 'vomit', 'voted', 'voter', 'votes', 'vouch', 'vowel', 'vying',
    'wacky', 'waded', 'wafer', 'waged', 'wager', 'wages', 'wagon', 'waist', 'waits', 'waken', 'wakes', 'walks', 'walls', 'waltz', 'wands', 'wants', 'wards', 'wares', 'warns', 'warps', 'warts', 'warty', 'waste', 'watch', 'water', 'waved', 'waver', 'waves', 'waxed', 'waxes', 'weald', 'weals', 'weans', 'wears', 'weary', 'weave', 'wedge', 'weeds', 'weedy', 'weeks', 'weigh', 'weird', 'wells', 'welsh', 'welts', 'wench', 'wetly', 'whale', 'wharf', 'wheat', 'wheel', 'where', 'which', 'whiff', 'while', 'whims', 'whine', 'whiny', 'whips', 'whirl', 'whisk', 'white', 'whole', 'whoop', 'whose', 'widen', 'wider', 'widow', 'width', 'wield', 'wight', 'wilds', 'wiles', 'wills', 'wimpy', 'wince', 'winch', 'winds', 'windy', 'wines', 'wings', 'winks', 'wiped', 'wiper', 'wipes', 'wired', 'wires', 'wiser', 'witch', 'witty', 'wives', 'woken', 'woman', 'women', 'woods', 'woody', 'wools', 'wooly', 'words', 'wordy', 'works', 'world', 'worms', 'wormy', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'woven', 'wrack', 'wraps', 'wrath', 'wreak', 'wreck', 'wrest', 'wring', 'wrist', 'write', 'wrong', 'wrote', 'wrung',
    'xerox',
    'yacht', 'yanks', 'yards', 'yarns', 'yawns', 'yearn', 'years', 'yeast', 'yells', 'yelps', 'yield', 'yodel', 'young', 'yours', 'youth', 'yucky', 'yummy',
    'zappy', 'zesty', 'zippy', 'zombi', 'zonal', 'zones', 'zooms'
]);

// Words that can be formed from any starting letters (for AI and validation)
const wordPrefixes = new Map();

// Build prefix map for quick lookup
function buildPrefixMap() {
    validWords.forEach(word => {
        for (let i = 1; i <= word.length; i++) {
            const prefix = word.substring(0, i);
            if (!wordPrefixes.has(prefix)) {
                wordPrefixes.set(prefix, []);
            }
            wordPrefixes.get(prefix).push(word);
        }
    });
}

// Check if a prefix can lead to a valid word
function canLeadToWord(prefix) {
    return wordPrefixes.has(prefix.toLowerCase());
}

// Check if the current letters form a complete word (3+ letters)
function isCompleteWord(letters) {
    return letters.length >= 3 && validWords.has(letters.toLowerCase());
}

// Get possible words from a prefix
function getPossibleWords(prefix) {
    return wordPrefixes.get(prefix.toLowerCase()) || [];
}

// Game state
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let currentLetters = '';
let roundNumber = 1;
let gameMode = 'local'; // 'local' or 'ai'
let aiDifficulty = 'medium';
let gameActive = true;
let winScore = 5;

// Audio context
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone(freq, duration, type = 'sine') {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = type;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Audio not available
    }
}

function playLetterSound() {
    playTone(440 + Math.random() * 200, 0.1, 'sine');
}

function playWinSound() {
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.2), i * 80);
    });
}

function playLoseSound() {
    [300, 250, 200].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.3, 'sawtooth'), i * 150);
    });
}

function playChallengeSound() {
    playTone(600, 0.15, 'square');
    setTimeout(() => playTone(800, 0.15, 'square'), 100);
}

// Load/save progress
function loadProgress() {
    if (typeof localStorage !== 'undefined') {
        player1Score = Number(localStorage.getItem('wordDuelP1Score')) || 0;
        player2Score = Number(localStorage.getItem('wordDuelP2Score')) || 0;
        roundNumber = Number(localStorage.getItem('wordDuelRound')) || 1;
        gameMode = localStorage.getItem('wordDuelMode') || 'local';
        aiDifficulty = localStorage.getItem('wordDuelAIDifficulty') || 'medium';

        const savedTheme = localStorage.getItem('wordDuelTheme');
        if (savedTheme === 'light') {
            document.body.classList.add('light');
            document.getElementById('theme-toggle').textContent = 'Dark Mode';
        }

        document.getElementById('game-mode').value = gameMode;
        document.getElementById('ai-difficulty').value = aiDifficulty;
    }
    updateDisplay();
}

function saveProgress() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordDuelP1Score', String(player1Score));
        localStorage.setItem('wordDuelP2Score', String(player2Score));
        localStorage.setItem('wordDuelRound', String(roundNumber));
        localStorage.setItem('wordDuelMode', gameMode);
        localStorage.setItem('wordDuelAIDifficulty', aiDifficulty);
    }
}

// Update UI display
function updateDisplay() {
    document.getElementById('player1-score').textContent = player1Score;
    document.getElementById('player2-score').textContent = player2Score;
    document.getElementById('round-number').textContent = roundNumber;
    document.getElementById('letter-count').textContent = currentLetters.length;

    // Update turn indicator
    const turnText = currentPlayer === 1 ? "Player 1's Turn" :
                     (gameMode === 'ai' ? "Computer's Turn" : "Player 2's Turn");
    document.getElementById('current-turn').textContent = turnText;

    // Highlight active player
    document.getElementById('player1-card').classList.toggle('active', currentPlayer === 1);
    document.getElementById('player2-card').classList.toggle('active', currentPlayer === 2);

    // Update word display
    const wordDisplay = document.getElementById('word-display');
    if (currentLetters.length === 0) {
        wordDisplay.innerHTML = '<span class="placeholder-text">Add the first letter!</span>';
    } else {
        wordDisplay.innerHTML = currentLetters.split('').map((letter, i) =>
            `<span class="letter" style="animation-delay: ${i * 0.05}s">${letter.toUpperCase()}</span>`
        ).join('');
    }

    // Enable/disable challenge button (need at least 2 letters to challenge)
    document.getElementById('challenge-btn').disabled = currentLetters.length < 2;

    // Update player 2 name based on mode
    document.getElementById('player2-name').textContent = gameMode === 'ai' ? 'CPU' : 'Blue';
}

// Add a letter to the current word
function addLetter(letter) {
    if (!gameActive) return;

    letter = letter.toLowerCase();
    if (!/^[a-z]$/.test(letter)) {
        showMessage('Please enter a valid letter (A-Z)', 'error');
        return;
    }

    const newLetters = currentLetters + letter;

    // Check if this forms a complete word (player loses)
    if (isCompleteWord(newLetters)) {
        currentLetters = newLetters;
        updateDisplay();
        playLoseSound();

        const loser = currentPlayer;
        const winner = currentPlayer === 1 ? 2 : 1;

        if (winner === 1) player1Score++;
        else player2Score++;

        const wordDisplay = document.getElementById('word-display');
        wordDisplay.classList.add('word-complete');

        showMessage(`"${newLetters.toUpperCase()}" is a word! Player ${loser} loses the round!`, 'error');
        saveProgress();

        setTimeout(() => {
            wordDisplay.classList.remove('word-complete');
            checkGameOver();
        }, 2000);
        return;
    }

    // Check if this can lead to a word
    if (!canLeadToWord(newLetters)) {
        showMessage(`"${newLetters.toUpperCase()}" cannot lead to any word. Try a different letter.`, 'error');
        return;
    }

    // Valid move
    currentLetters = newLetters;
    playLetterSound();
    updateDisplay();
    clearMessage();

    // Switch players
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateDisplay();

    // AI turn
    if (gameMode === 'ai' && currentPlayer === 2 && gameActive) {
        document.getElementById('letter-input').disabled = true;
        document.getElementById('submit-btn').disabled = true;

        setTimeout(() => {
            makeAIMove();
            document.getElementById('letter-input').disabled = false;
            document.getElementById('submit-btn').disabled = false;
            document.getElementById('letter-input').focus();
        }, 1000 + Math.random() * 1000);
    }
}

// AI move logic
function makeAIMove() {
    if (!gameActive) return;

    const possibleWords = getPossibleWords(currentLetters);
    if (possibleWords.length === 0) {
        // Shouldn't happen, but handle gracefully
        challengeOpponent();
        return;
    }

    // Find all valid next letters
    const validNextLetters = new Set();
    const safeLetters = []; // Letters that don't complete a word
    const dangerousLetters = []; // Letters that complete a word

    for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(97 + i);
        const testWord = currentLetters + letter;

        if (canLeadToWord(testWord)) {
            validNextLetters.add(letter);

            if (isCompleteWord(testWord)) {
                dangerousLetters.push(letter);
            } else {
                safeLetters.push(letter);
            }
        }
    }

    let chosenLetter;

    if (aiDifficulty === 'easy') {
        // Easy: Random valid letter (might complete word)
        const allValid = [...safeLetters, ...dangerousLetters];
        chosenLetter = allValid[Math.floor(Math.random() * allValid.length)];
    } else if (aiDifficulty === 'medium') {
        // Medium: Prefer safe letters, but sometimes make mistakes
        if (safeLetters.length > 0 && Math.random() > 0.2) {
            chosenLetter = safeLetters[Math.floor(Math.random() * safeLetters.length)];
        } else if (dangerousLetters.length > 0) {
            chosenLetter = dangerousLetters[Math.floor(Math.random() * dangerousLetters.length)];
        } else {
            // No valid moves, challenge
            challengeOpponent();
            return;
        }
    } else {
        // Hard: Strategic - try to set up opponent for failure
        if (safeLetters.length > 0) {
            // Find letters that will force opponent into completing a word
            const strategicLetters = safeLetters.filter(letter => {
                const nextPrefix = currentLetters + letter;
                const nextPossible = getPossibleWords(nextPrefix);

                // Check if all paths from here lead to 3-letter words soon
                return nextPossible.some(word => word.length <= currentLetters.length + 3);
            });

            if (strategicLetters.length > 0) {
                chosenLetter = strategicLetters[Math.floor(Math.random() * strategicLetters.length)];
            } else {
                chosenLetter = safeLetters[Math.floor(Math.random() * safeLetters.length)];
            }
        } else if (dangerousLetters.length > 0) {
            // No safe moves, pick shortest word to minimize loss
            chosenLetter = dangerousLetters[Math.floor(Math.random() * dangerousLetters.length)];
        } else {
            // Challenge if no valid moves
            if (Math.random() > 0.3) {
                challengeOpponent();
                return;
            }
        }
    }

    if (chosenLetter) {
        addLetter(chosenLetter);
    }
}

// Challenge the opponent
function challengeOpponent() {
    if (!gameActive || currentLetters.length < 2) return;

    playChallengeSound();

    const challenger = currentPlayer;
    const challenged = currentPlayer === 1 ? 2 : 1;

    // Check if current letters can lead to a word
    const possibleWords = getPossibleWords(currentLetters);

    if (possibleWords.length === 0) {
        // Challenge successful - letters don't lead to any word
        if (challenger === 1) player1Score++;
        else player2Score++;

        playWinSound();
        showMessage(`Challenge successful! "${currentLetters.toUpperCase()}" leads to no valid word. Player ${challenged} loses!`, 'success');
    } else {
        // Challenge failed - there are valid words
        const exampleWord = possibleWords[0];
        if (challenged === 1) player1Score++;
        else player2Score++;

        playLoseSound();
        showMessage(`Challenge failed! "${currentLetters.toUpperCase()}" can lead to "${exampleWord.toUpperCase()}". Player ${challenger} loses!`, 'error');
    }

    saveProgress();
    setTimeout(() => checkGameOver(), 2000);
}

// Check if game is over
function checkGameOver() {
    if (player1Score >= winScore) {
        gameActive = false;
        showMessage('Player 1 WINS THE GAME!', 'success');
        document.getElementById('new-round-btn').style.display = 'inline-block';
        document.getElementById('new-round-btn').textContent = 'New Game';
        return;
    }

    if (player2Score >= winScore) {
        gameActive = false;
        const winner = gameMode === 'ai' ? 'Computer' : 'Player 2';
        showMessage(`${winner} WINS THE GAME!`, gameMode === 'ai' ? 'error' : 'success');
        document.getElementById('new-round-btn').style.display = 'inline-block';
        document.getElementById('new-round-btn').textContent = 'New Game';
        return;
    }

    // Start new round
    newRound();
}

// Start a new round
function newRound() {
    roundNumber++;
    currentLetters = '';
    currentPlayer = roundNumber % 2 === 1 ? 1 : 2; // Alternate who starts
    gameActive = true;

    document.getElementById('new-round-btn').style.display = 'none';
    updateDisplay();
    clearMessage();
    saveProgress();

    // If AI starts this round
    if (gameMode === 'ai' && currentPlayer === 2) {
        setTimeout(() => makeAIMove(), 1000);
    } else {
        document.getElementById('letter-input').focus();
    }
}

// Start a completely new game
function newGame() {
    player1Score = 0;
    player2Score = 0;
    roundNumber = 1;
    currentLetters = '';
    currentPlayer = 1;
    gameActive = true;

    document.getElementById('new-round-btn').style.display = 'none';
    updateDisplay();
    clearMessage();
    saveProgress();
    document.getElementById('letter-input').focus();
}

// Show message
function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = 'message ' + type;
}

function clearMessage() {
    const msg = document.getElementById('message');
    msg.textContent = '';
    msg.className = 'message';
}

// Toggle theme
function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    document.getElementById('theme-toggle').textContent = isLight ? 'Dark Mode' : 'Light Mode';

    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordDuelTheme', isLight ? 'light' : 'dark');
    }
}

// Initialize game
if (typeof window !== 'undefined') {
    // Build prefix map
    buildPrefixMap();

    // Load saved progress
    loadProgress();

    // Event listeners
    document.getElementById('submit-btn').addEventListener('click', () => {
        const input = document.getElementById('letter-input');
        addLetter(input.value);
        input.value = '';
        input.focus();
    });

    document.getElementById('letter-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = document.getElementById('letter-input');
            addLetter(input.value);
            input.value = '';
        }
    });

    document.getElementById('challenge-btn').addEventListener('click', challengeOpponent);
    document.getElementById('new-round-btn').addEventListener('click', newRound);
    document.getElementById('new-game-btn').addEventListener('click', newGame);

    document.getElementById('game-mode').addEventListener('change', (e) => {
        gameMode = e.target.value;
        saveProgress();
        newGame();
    });

    document.getElementById('ai-difficulty').addEventListener('change', (e) => {
        aiDifficulty = e.target.value;
        saveProgress();
    });

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Music controls
    const musicGen = new PianoMusicGenerator();
    let musicPlaying = false;

    document.getElementById('music-toggle').addEventListener('click', function() {
        if (musicPlaying) {
            musicGen.stop();
            this.textContent = 'Play Music';
            musicPlaying = false;
        } else {
            musicGen.start();
            this.textContent = 'Mute Music';
            document.getElementById('song-name').textContent = `Now playing: ${musicGen.getCurrentSongName()}`;
            musicPlaying = true;
        }
    });

    document.getElementById('music-next').addEventListener('click', function() {
        if (musicPlaying) {
            musicGen.nextSong();
            document.getElementById('song-name').textContent = `Now playing: ${musicGen.getCurrentSongName()}`;
        }
    });

    // Focus input
    document.getElementById('letter-input').focus();
}

// Export for testing
if (typeof module !== 'undefined') {
    module.exports = {
        isCompleteWord,
        canLeadToWord,
        getPossibleWords,
        validWords
    };
}
