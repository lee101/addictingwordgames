// Word Evolution - Transform words one letter at a time

// Valid English words organized by length
const wordLists = {
    // 3-letter words (easy)
    3: new Set([
        'ace', 'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and',
        'ant', 'any', 'ape', 'arc', 'are', 'ark', 'arm', 'art', 'ash', 'ask',
        'ate', 'awe', 'axe', 'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed',
        'bee', 'beg', 'bet', 'bid', 'big', 'bin', 'bit', 'bog', 'bow', 'box',
        'boy', 'bud', 'bug', 'bun', 'bus', 'but', 'buy', 'cab', 'cam', 'can',
        'cap', 'car', 'cat', 'cob', 'cod', 'cog', 'cop', 'cot', 'cow', 'cry',
        'cub', 'cud', 'cup', 'cur', 'cut', 'dab', 'dad', 'dam', 'day', 'den',
        'dew', 'did', 'die', 'dig', 'dim', 'dip', 'doe', 'dog', 'don', 'dot',
        'dry', 'dub', 'dud', 'due', 'dug', 'dun', 'dye', 'ear', 'eat', 'eel',
        'egg', 'ego', 'elf', 'elk', 'elm', 'emu', 'end', 'era', 'eve', 'ewe',
        'eye', 'fab', 'fad', 'fan', 'far', 'fat', 'fax', 'fed', 'fee', 'fen',
        'few', 'fig', 'fin', 'fir', 'fit', 'fix', 'flu', 'fly', 'fob', 'foe',
        'fog', 'fop', 'for', 'fox', 'fry', 'fun', 'fur', 'gag', 'gal', 'gap',
        'gas', 'gay', 'gel', 'gem', 'get', 'gig', 'gin', 'gnu', 'gob', 'god',
        'got', 'gum', 'gun', 'gut', 'guy', 'gym', 'had', 'hag', 'ham', 'has',
        'hat', 'hay', 'hem', 'hen', 'her', 'hew', 'hex', 'hid', 'him', 'hip',
        'his', 'hit', 'hob', 'hod', 'hog', 'hop', 'hot', 'how', 'hub', 'hue',
        'hug', 'hum', 'hut', 'ice', 'icy', 'ill', 'imp', 'ink', 'inn', 'ion',
        'ire', 'irk', 'its', 'ivy', 'jab', 'jag', 'jam', 'jar', 'jaw', 'jay',
        'jet', 'jig', 'job', 'jog', 'jot', 'joy', 'jug', 'jut', 'keg', 'ken',
        'key', 'kid', 'kin', 'kit', 'lab', 'lac', 'lad', 'lag', 'lap', 'law',
        'lax', 'lay', 'lea', 'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit',
        'log', 'lop', 'lot', 'low', 'lug', 'mad', 'man', 'map', 'mar', 'mat',
        'maw', 'may', 'men', 'met', 'mid', 'mix', 'mob', 'mod', 'mom', 'mop',
        'mow', 'mud', 'mug', 'mum', 'nab', 'nag', 'nap', 'nay', 'net', 'new',
        'nib', 'nil', 'nip', 'nit', 'nob', 'nod', 'nor', 'not', 'now', 'nub',
        'nun', 'nut', 'oak', 'oar', 'oat', 'odd', 'ode', 'off', 'oft', 'ohm',
        'oil', 'old', 'one', 'opt', 'orb', 'ore', 'our', 'out', 'owe', 'owl',
        'own', 'pad', 'pal', 'pan', 'pap', 'par', 'pat', 'paw', 'pay', 'pea',
        'peg', 'pen', 'pep', 'per', 'pet', 'pew', 'pie', 'pig', 'pin', 'pit',
        'ply', 'pod', 'pop', 'pot', 'pow', 'pox', 'pro', 'pry', 'pub', 'pug',
        'pun', 'pup', 'pus', 'put', 'rad', 'rag', 'ram', 'ran', 'rap', 'rat',
        'raw', 'ray', 'red', 'ref', 'rep', 'rev', 'rib', 'rid', 'rig', 'rim',
        'rip', 'rob', 'rod', 'roe', 'rot', 'row', 'rub', 'rue', 'rug', 'rum',
        'run', 'rut', 'rye', 'sac', 'sad', 'sag', 'sap', 'sat', 'saw', 'say',
        'sea', 'set', 'sew', 'she', 'shy', 'sin', 'sip', 'sir', 'sis', 'sit',
        'six', 'ski', 'sky', 'sly', 'sob', 'sod', 'son', 'sop', 'sot', 'sow',
        'soy', 'spa', 'spy', 'sty', 'sub', 'sue', 'sum', 'sun', 'sup', 'tab',
        'tad', 'tag', 'tan', 'tap', 'tar', 'tat', 'tax', 'tea', 'ten', 'the',
        'thy', 'tic', 'tie', 'tin', 'tip', 'tit', 'toe', 'tog', 'tom', 'ton',
        'too', 'top', 'tot', 'tow', 'toy', 'try', 'tub', 'tug', 'tun', 'tut',
        'two', 'urn', 'use', 'van', 'vat', 'vet', 'vie', 'vim', 'vow', 'wad',
        'wag', 'war', 'was', 'wax', 'way', 'web', 'wed', 'wee', 'wet', 'who',
        'why', 'wig', 'win', 'wit', 'woe', 'wok', 'won', 'woo', 'wow', 'yak',
        'yam', 'yap', 'yaw', 'yea', 'yen', 'yes', 'yet', 'yew', 'you', 'zap',
        'zed', 'zen', 'zig', 'zip', 'zit', 'zoo'
    ]),
    // 4-letter words (medium)
    4: new Set([
        'able', 'ache', 'acid', 'aged', 'aide', 'ally', 'also', 'amid', 'area',
        'army', 'aunt', 'auto', 'away', 'baby', 'back', 'bade', 'bail', 'bait',
        'bake', 'bald', 'bale', 'ball', 'band', 'bane', 'bang', 'bank', 'bare',
        'bark', 'barn', 'base', 'bash', 'bask', 'bass', 'bath', 'bead', 'beak',
        'beam', 'bean', 'bear', 'beat', 'beck', 'been', 'beer', 'bell', 'belt',
        'bend', 'bent', 'berg', 'best', 'beta', 'bias', 'bike', 'bile', 'bill',
        'bind', 'bird', 'bite', 'blade', 'blow', 'blue', 'blur', 'boar', 'boat',
        'body', 'boil', 'bold', 'bolt', 'bomb', 'bond', 'bone', 'book', 'boom',
        'boon', 'boot', 'bore', 'born', 'boss', 'both', 'bout', 'bowl', 'brag',
        'bred', 'brew', 'brim', 'bulk', 'bull', 'bump', 'burn', 'bury', 'bush',
        'bust', 'busy', 'cafe', 'cage', 'cake', 'calf', 'call', 'calm', 'came',
        'camp', 'cane', 'cape', 'card', 'care', 'carp', 'cart', 'case', 'cash',
        'cask', 'cast', 'cave', 'cell', 'chap', 'chat', 'chef', 'chin', 'chip',
        'chop', 'cite', 'city', 'clad', 'clam', 'clan', 'clap', 'claw', 'clay',
        'clip', 'clod', 'clog', 'club', 'clue', 'coal', 'coat', 'cock', 'code',
        'coil', 'coin', 'cold', 'colt', 'comb', 'come', 'cone', 'cook', 'cool',
        'cope', 'copy', 'cord', 'core', 'cork', 'corn', 'cost', 'cosy', 'coup',
        'cove', 'cowl', 'crab', 'cram', 'crew', 'crib', 'crop', 'crow', 'cube',
        'cult', 'curb', 'cure', 'curl', 'cute', 'damp', 'dane', 'dare', 'dark',
        'darn', 'dart', 'dash', 'data', 'date', 'dawn', 'days', 'dead', 'deaf',
        'deal', 'dean', 'dear', 'debt', 'deck', 'deed', 'deem', 'deep', 'deer',
        'demo', 'dent', 'deny', 'desk', 'dial', 'dice', 'died', 'diet', 'dime',
        'dine', 'dire', 'dirt', 'disc', 'dish', 'disk', 'dive', 'dock', 'does',
        'dole', 'doll', 'dome', 'done', 'doom', 'door', 'dose', 'dote', 'dour',
        'dove', 'down', 'doze', 'drab', 'drag', 'dram', 'draw', 'drew', 'drip',
        'drop', 'drug', 'drum', 'dual', 'duck', 'duel', 'duet', 'duke', 'dull',
        'duly', 'dumb', 'dump', 'dune', 'dung', 'dunk', 'dupe', 'dusk', 'dust',
        'duty', 'dyed', 'each', 'earl', 'earn', 'ease', 'east', 'easy', 'eats',
        'echo', 'edge', 'edit', 'else', 'emit', 'envy', 'epic', 'euro', 'even',
        'ever', 'evil', 'exam', 'exit', 'expo', 'eyed', 'face', 'fact', 'fade',
        'fail', 'fair', 'fake', 'fall', 'fame', 'fare', 'farm', 'fast', 'fate',
        'fawn', 'fear', 'feat', 'feed', 'feel', 'feet', 'fell', 'felt', 'fend',
        'fern', 'fest', 'fiat', 'file', 'fill', 'film', 'find', 'fine', 'fire',
        'firm', 'fish', 'fist', 'five', 'flag', 'flak', 'flap', 'flat', 'flaw',
        'flea', 'fled', 'flee', 'flew', 'flip', 'flit', 'flog', 'flop', 'flow',
        'flux', 'foam', 'foes', 'foil', 'fold', 'folk', 'fond', 'font', 'food',
        'fool', 'foot', 'ford', 'fore', 'fork', 'form', 'fort', 'foul', 'four',
        'fowl', 'fray', 'free', 'fret', 'frog', 'from', 'fuel', 'full', 'fume',
        'fund', 'funk', 'furl', 'fury', 'fuse', 'fuss', 'gain', 'gait', 'gale',
        'gall', 'game', 'gang', 'gape', 'garb', 'gash', 'gasp', 'gate', 'gave',
        'gawk', 'gaze', 'gear', 'germ', 'gift', 'gild', 'gilt', 'girl', 'give',
        'glad', 'glam', 'glee', 'glen', 'glib', 'glim', 'glob', 'glom', 'glop',
        'glow', 'glue', 'glum', 'glut', 'goad', 'goal', 'goat', 'goes', 'gold',
        'golf', 'gone', 'gong', 'good', 'gore', 'gory', 'gosh', 'gown', 'grab',
        'gram', 'gray', 'grew', 'grey', 'grid', 'grim', 'grin', 'grip', 'grit',
        'grow', 'grub', 'gulf', 'gulp', 'guru', 'gush', 'gust', 'guts', 'hack',
        'hail', 'hair', 'hale', 'half', 'hall', 'halo', 'halt', 'hand', 'hang',
        'hank', 'hard', 'hare', 'harm', 'harp', 'hash', 'hasp', 'hate', 'haul',
        'have', 'hawk', 'haze', 'hazy', 'head', 'heal', 'heap', 'hear', 'heat',
        'heck', 'heed', 'heel', 'heft', 'heir', 'held', 'hell', 'helm', 'help',
        'hemp', 'hens', 'herb', 'herd', 'here', 'hero', 'hewn', 'hide', 'high',
        'hike', 'hill', 'hilt', 'hind', 'hint', 'hire', 'hiss', 'hive', 'hoax',
        'hock', 'hold', 'hole', 'holy', 'home', 'hone', 'honk', 'hood', 'hoof',
        'hook', 'hoop', 'hope', 'horn', 'hose', 'host', 'hour', 'howl', 'hubs',
        'hued', 'hues', 'huff', 'huge', 'hulk', 'hull', 'hump', 'hung', 'hunk',
        'hunt', 'hurl', 'hurt', 'hush', 'husk', 'icon', 'idea', 'idle', 'idly',
        'idol', 'inch', 'info', 'into', 'iron', 'isle', 'itch', 'item', 'jack',
        'jade', 'jail', 'jamb', 'jane', 'jars', 'java', 'jaws', 'jazz', 'jean',
        'jeer', 'jerk', 'jest', 'jets', 'jibe', 'jobs', 'jock', 'jogs', 'john',
        'join', 'joke', 'jolt', 'jots', 'jowl', 'joys', 'judo', 'jugs', 'jump',
        'june', 'junk', 'jury', 'just', 'juts', 'kale', 'keen', 'keep', 'kelp',
        'kept', 'kick', 'kill', 'kilo', 'kilt', 'kind', 'king', 'kink', 'kiss',
        'kite', 'knee', 'knew', 'knit', 'knob', 'knot', 'know', 'lace', 'lack',
        'lacy', 'laid', 'lair', 'lake', 'lamb', 'lame', 'lamp', 'land', 'lane',
        'lard', 'lark', 'lash', 'lass', 'last', 'late', 'laud', 'lawn', 'laws',
        'lazy', 'lead', 'leaf', 'leak', 'lean', 'leap', 'leas', 'left', 'lend',
        'lens', 'lent', 'less', 'lest', 'levy', 'liar', 'lice', 'lick', 'lids',
        'lien', 'lies', 'lieu', 'life', 'lift', 'like', 'limb', 'lime', 'limp',
        'line', 'link', 'lint', 'lion', 'lips', 'lisp', 'list', 'live', 'load',
        'loaf', 'loam', 'loan', 'lobe', 'lobs', 'lock', 'lode', 'loft', 'loin',
        'lone', 'long', 'look', 'loom', 'loon', 'loop', 'loot', 'lord', 'lore',
        'lose', 'loss', 'lost', 'lots', 'loud', 'lout', 'love', 'lows', 'luck',
        'lull', 'lump', 'lung', 'lure', 'lurk', 'lush', 'lust', 'mace', 'made',
        'maid', 'mail', 'maim', 'main', 'make', 'male', 'mall', 'malt', 'mane',
        'many', 'maps', 'mare', 'mark', 'mars', 'mash', 'mask', 'mass', 'mast',
        'mate', 'math', 'maze', 'mead', 'meal', 'mean', 'meat', 'meek', 'meet',
        'meld', 'melt', 'memo', 'mend', 'menu', 'mere', 'mesh', 'mess', 'mice',
        'mild', 'mile', 'milk', 'mill', 'mime', 'mind', 'mine', 'mint', 'minx',
        'mire', 'miss', 'mist', 'mite', 'mitt', 'moan', 'moat', 'mock', 'mode',
        'mold', 'mole', 'molt', 'monk', 'mood', 'moon', 'moor', 'mope', 'more',
        'morn', 'moss', 'most', 'moth', 'move', 'much', 'muck', 'muff', 'mugs',
        'mule', 'mull', 'mums', 'mung', 'murk', 'muse', 'mush', 'musk', 'must',
        'mute', 'mutt', 'myth', 'nabs', 'nail', 'name', 'nape', 'naps', 'narc',
        'navy', 'near', 'neat', 'neck', 'need', 'neon', 'nerd', 'nest', 'nets',
        'news', 'newt', 'next', 'nibs', 'nice', 'nick', 'nigh', 'nine', 'nips',
        'nits', 'node', 'nods', 'noel', 'none', 'nook', 'noon', 'nope', 'norm',
        'nose', 'nosy', 'note', 'noun', 'nubs', 'null', 'numb', 'nuns', 'nuts',
        'oafs', 'oaks', 'oars', 'oath', 'oats', 'obey', 'odds', 'odes', 'odor',
        'offs', 'ogle', 'ogre', 'oils', 'oily', 'okay', 'okra', 'omen', 'omit',
        'once', 'ones', 'only', 'onto', 'onus', 'ooze', 'opal', 'open', 'opts',
        'opus', 'oral', 'orbs', 'orca', 'ores', 'ours', 'oust', 'outs', 'oven',
        'over', 'owed', 'owes', 'owls', 'owns', 'oxen', 'pace', 'pack', 'pact',
        'pads', 'page', 'paid', 'pail', 'pain', 'pair', 'pale', 'palm', 'pals',
        'pane', 'pang', 'pans', 'pant', 'papa', 'pare', 'park', 'part', 'pass',
        'past', 'pate', 'path', 'pats', 'pave', 'pawn', 'paws', 'pays', 'peak',
        'peal', 'pear', 'peas', 'peat', 'peck', 'peek', 'peel', 'peep', 'peer',
        'pegs', 'pelt', 'pend', 'pens', 'peon', 'peps', 'perk', 'perm', 'pert',
        'peso', 'pest', 'pets', 'pews', 'pick', 'pier', 'pies', 'pigs', 'pike',
        'pile', 'pill', 'pine', 'ping', 'pink', 'pins', 'pint', 'pipe', 'pips',
        'pita', 'pith', 'pits', 'pity', 'plan', 'play', 'plea', 'pled', 'plod',
        'plop', 'plot', 'plow', 'ploy', 'plug', 'plum', 'plus', 'pock', 'pods',
        'poem', 'poet', 'poke', 'pole', 'poll', 'polo', 'pomp', 'pond', 'pone',
        'pony', 'pool', 'poop', 'poor', 'pope', 'pops', 'pore', 'pork', 'port',
        'pose', 'posh', 'post', 'posy', 'pots', 'pour', 'pout', 'pram', 'prat',
        'pray', 'prep', 'prey', 'prim', 'prod', 'prom', 'prop', 'pros', 'prow',
        'prys', 'pubs', 'puck', 'puds', 'puff', 'pugs', 'puke', 'pull', 'pulp',
        'pump', 'puns', 'punk', 'puns', 'pupa', 'pups', 'pure', 'purl', 'push',
        'puts', 'putt', 'quay', 'quid', 'quip', 'quit', 'quiz', 'race', 'rack',
        'racy', 'raft', 'rage', 'rags', 'raid', 'rail', 'rain', 'rake', 'ramp',
        'rams', 'rang', 'rank', 'rant', 'raps', 'rapt', 'rare', 'rash', 'rasp',
        'rate', 'rats', 'rave', 'rays', 'raze', 'read', 'real', 'ream', 'reap',
        'rear', 'redo', 'reed', 'reef', 'reek', 'reel', 'refs', 'rein', 'rely',
        'rend', 'rent', 'repo', 'reps', 'rest', 'revs', 'ribs', 'rice', 'rich',
        'ride', 'rids', 'rife', 'rift', 'rigs', 'rile', 'rill', 'rime', 'rims',
        'rind', 'ring', 'rink', 'riot', 'ripe', 'rips', 'rise', 'risk', 'rite',
        'road', 'roam', 'roar', 'robe', 'robs', 'rock', 'rode', 'rods', 'role',
        'roll', 'romp', 'roof', 'rook', 'room', 'root', 'rope', 'ropy', 'rose',
        'rosy', 'rote', 'rots', 'rout', 'rove', 'rows', 'rube', 'rubs', 'ruby',
        'ruck', 'rude', 'rued', 'rues', 'ruff', 'rugs', 'ruin', 'rule', 'rump',
        'rums', 'rune', 'rung', 'runs', 'runt', 'ruse', 'rush', 'rust', 'ruts',
        'sack', 'safe', 'saga', 'sage', 'sags', 'said', 'sail', 'sake', 'sale',
        'salt', 'same', 'sand', 'sane', 'sang', 'sank', 'saps', 'sash', 'sass',
        'save', 'sawn', 'saws', 'says', 'scab', 'scam', 'scan', 'scar', 'seal',
        'seam', 'sear', 'seas', 'seat', 'sect', 'seed', 'seek', 'seem', 'seen',
        'seep', 'seer', 'sees', 'self', 'sell', 'semi', 'send', 'sent', 'sept',
        'sera', 'serb', 'serf', 'sets', 'sewn', 'shed', 'shim', 'shin', 'ship',
        'shod', 'shoe', 'shoo', 'shop', 'shot', 'show', 'shun', 'shut', 'sick',
        'side', 'sift', 'sigh', 'sign', 'silk', 'sill', 'silo', 'silt', 'sine',
        'sing', 'sink', 'sins', 'sips', 'sire', 'sirs', 'site', 'sits', 'size',
        'skid', 'skim', 'skin', 'skip', 'slab', 'slag', 'slam', 'slap', 'slat',
        'slaw', 'slay', 'sled', 'slew', 'slid', 'slim', 'slip', 'slit', 'slob',
        'slop', 'slot', 'slow', 'slue', 'slug', 'slum', 'slur', 'smog', 'snap',
        'snag', 'snip', 'snit', 'snob', 'snow', 'snub', 'snug', 'soak', 'soap',
        'soar', 'sobs', 'sock', 'soda', 'sods', 'sofa', 'soft', 'soil', 'sold',
        'sole', 'solo', 'some', 'song', 'sons', 'soon', 'soot', 'sops', 'sore',
        'sort', 'soul', 'soup', 'sour', 'span', 'spar', 'spas', 'spat', 'spec',
        'sped', 'spin', 'spit', 'spot', 'spry', 'spud', 'spun', 'spur', 'stab',
        'stag', 'star', 'stay', 'stem', 'step', 'stew', 'stir', 'stop', 'stow',
        'stub', 'stud', 'stun', 'subs', 'such', 'suck', 'suds', 'sued', 'sues',
        'suit', 'sulk', 'sump', 'sums', 'sung', 'sunk', 'suns', 'sure', 'surf',
        'swab', 'swam', 'swan', 'swap', 'swat', 'sway', 'swim', 'swum', 'tabs',
        'tack', 'taco', 'tact', 'tags', 'tail', 'take', 'tale', 'talk', 'tall',
        'tame', 'tamp', 'tans', 'tape', 'taps', 'tarn', 'tarp', 'tars', 'tart',
        'task', 'taxi', 'teak', 'teal', 'team', 'tear', 'teas', 'teat', 'tech',
        'teds', 'teed', 'teem', 'teen', 'tees', 'tell', 'temp', 'tend', 'tens',
        'tent', 'term', 'tern', 'test', 'text', 'than', 'that', 'thaw', 'them',
        'then', 'they', 'thin', 'this', 'thud', 'thug', 'thus', 'tick', 'tide',
        'tidy', 'tied', 'tier', 'ties', 'tiff', 'tile', 'till', 'tilt', 'time',
        'tine', 'tins', 'tint', 'tiny', 'tips', 'tire', 'toad', 'tock', 'tods',
        'toed', 'toes', 'toff', 'tofu', 'toga', 'togs', 'toil', 'told', 'toll',
        'tomb', 'tome', 'tone', 'tong', 'tons', 'tony', 'took', 'tool', 'toot',
        'tops', 'tore', 'torn', 'tort', 'toss', 'tote', 'tots', 'tour', 'tout',
        'town', 'tows', 'toys', 'tram', 'trap', 'tray', 'tree', 'trek', 'trim',
        'trio', 'trip', 'trod', 'trot', 'true', 'tube', 'tubs', 'tuck', 'tuft',
        'tugs', 'tuna', 'tune', 'turf', 'turn', 'tusk', 'tutu', 'twig', 'twin',
        'twit', 'type', 'typo', 'ugly', 'undo', 'unit', 'unto', 'upon', 'urea',
        'urge', 'urns', 'used', 'user', 'uses', 'vain', 'vale', 'vamp', 'vane',
        'vans', 'vary', 'vase', 'vast', 'vats', 'veal', 'veer', 'veil', 'vein',
        'vend', 'vent', 'verb', 'very', 'vest', 'veto', 'vets', 'vial', 'vibe',
        'vice', 'vied', 'vies', 'view', 'vile', 'vine', 'visa', 'vise', 'void',
        'volt', 'vote', 'vows', 'wade', 'wads', 'waft', 'wage', 'wags', 'waif',
        'wail', 'wait', 'wake', 'walk', 'wall', 'wand', 'wane', 'wans', 'want',
        'ward', 'ware', 'warm', 'warn', 'warp', 'wars', 'wart', 'wary', 'wash',
        'wasp', 'watt', 'wave', 'wavy', 'waxy', 'ways', 'weak', 'wean', 'wear',
        'weds', 'weed', 'week', 'weep', 'weld', 'well', 'welt', 'went', 'wept',
        'were', 'west', 'wets', 'wham', 'what', 'when', 'whet', 'whey', 'whim',
        'whip', 'whir', 'whit', 'whiz', 'whom', 'wick', 'wide', 'wife', 'wigs',
        'wild', 'wile', 'will', 'wilt', 'wimp', 'wind', 'wine', 'wing', 'wink',
        'wins', 'wipe', 'wire', 'wiry', 'wise', 'wish', 'wisp', 'with', 'wits',
        'wive', 'woes', 'woke', 'woks', 'wolf', 'womb', 'wont', 'wood', 'woof',
        'wool', 'woos', 'word', 'wore', 'work', 'worm', 'worn', 'wort', 'wove',
        'wows', 'wrap', 'wren', 'writ', 'yack', 'yaks', 'yams', 'yank', 'yaps',
        'yard', 'yarn', 'yawn', 'yawp', 'yaws', 'year', 'yeas', 'yell', 'yelp',
        'yens', 'yeps', 'yerk', 'yews', 'yids', 'yips', 'yoke', 'yolk', 'yore',
        'your', 'yowl', 'yows', 'yuan', 'yuck', 'yuks', 'yule', 'yurt', 'zany',
        'zaps', 'zeal', 'zebu', 'zeds', 'zees', 'zero', 'zest', 'zigs', 'zinc',
        'zine', 'zing', 'zips', 'zits', 'zone', 'zoom', 'zoos'
    ]),
    // 5-letter words (hard)
    5: new Set([
        'abate', 'abbey', 'abbot', 'abhor', 'abide', 'abled', 'abode', 'abort',
        'about', 'above', 'abuse', 'abyss', 'acorn', 'acted', 'actor', 'acute',
        'adapt', 'added', 'adder', 'adept', 'admit', 'adobe', 'adopt', 'adore',
        'adult', 'after', 'again', 'agent', 'agile', 'aging', 'agony', 'agree',
        'ahead', 'aided', 'aisle', 'alarm', 'album', 'alert', 'alien', 'align',
        'alike', 'alive', 'allay', 'alley', 'allot', 'allow', 'alloy', 'alone',
        'along', 'aloof', 'alpha', 'altar', 'alter', 'amaze', 'amber', 'amble',
        'amend', 'ample', 'angel', 'anger', 'angle', 'angry', 'angst', 'anime',
        'ankle', 'annex', 'annoy', 'antic', 'anvil', 'aorta', 'apart', 'apple',
        'apply', 'apron', 'aptly', 'arena', 'argue', 'arise', 'armor', 'aroma',
        'arose', 'array', 'arrow', 'arson', 'artsy', 'ascot', 'ashen', 'ashes',
        'aside', 'asset', 'atlas', 'attic', 'audio', 'audit', 'avoid', 'await',
        'awake', 'award', 'aware', 'awful', 'awoke', 'axial', 'bacon', 'badge',
        'badly', 'bagel', 'baggy', 'baker', 'baler', 'balls', 'banal', 'banjo',
        'barge', 'baron', 'basin', 'basic', 'basil', 'basis', 'batch', 'bathe',
        'baton', 'beach', 'beard', 'beast', 'began', 'begin', 'being', 'belly',
        'below', 'bench', 'berry', 'bevel', 'bible', 'bike', 'binge', 'birth',
        'black', 'blade', 'blame', 'bland', 'blank', 'blare', 'blast', 'blaze',
        'bleak', 'bleed', 'blend', 'bless', 'blind', 'blink', 'bliss', 'blitz',
        'bloat', 'block', 'bloke', 'blond', 'blood', 'bloom', 'blown', 'blues',
        'bluff', 'blunt', 'blurb', 'blurt', 'blush', 'board', 'boast', 'boded',
        'bogus', 'boils', 'bolts', 'bombs', 'bonds', 'bones', 'bonus', 'books',
        'boost', 'booth', 'booty', 'booze', 'boozy', 'borer', 'borne', 'bosom',
        'bossy', 'botch', 'bough', 'bound', 'bowel', 'boxer', 'brace', 'brain',
        'brake', 'brand', 'brash', 'brass', 'brave', 'brawl', 'brawn', 'bread',
        'break', 'breed', 'briar', 'bribe', 'brick', 'bride', 'brief', 'brine',
        'bring', 'brink', 'brisk', 'broad', 'broil', 'broke', 'brood', 'brook',
        'broom', 'broth', 'brown', 'brush', 'brute', 'buddy', 'budge', 'buggy',
        'build', 'built', 'bulge', 'bulky', 'bully', 'bunch', 'bunny', 'burnt',
        'burst', 'bushy', 'butch', 'buyer', 'bylaw', 'cabal', 'cabin', 'cable',
        'cache', 'cadet', 'cadre', 'caged', 'cagey', 'cairn', 'camel', 'cameo',
        'canal', 'candy', 'canny', 'canoe', 'canon', 'caper', 'caput', 'carat',
        'cargo', 'carol', 'carry', 'carve', 'catch', 'cater', 'cause', 'cease',
        'cedar', 'chain', 'chair', 'chalk', 'champ', 'chant', 'chaos', 'chard',
        'charm', 'chart', 'chase', 'cheap', 'cheat', 'check', 'cheek', 'cheer',
        'chess', 'chest', 'chick', 'chide', 'chief', 'child', 'chili', 'chill',
        'chimp', 'china', 'chirp', 'choke', 'chord', 'chore', 'chose', 'chunk',
        'churn', 'cider', 'cigar', 'cinch', 'circa', 'civic', 'civil', 'claim',
        'clamp', 'clang', 'clank', 'clash', 'clasp', 'class', 'clean', 'clear',
        'cleat', 'clerk', 'click', 'cliff', 'climb', 'cling', 'cloak', 'clock',
        'clone', 'close', 'cloth', 'cloud', 'clout', 'clown', 'cluck', 'clued',
        'clump', 'clung', 'coach', 'coast', 'cobra', 'cocoa', 'colon', 'color',
        'comet', 'comic', 'comma', 'conch', 'coral', 'couch', 'cough', 'could',
        'count', 'coupe', 'court', 'coven', 'cover', 'covet', 'crack', 'craft',
        'cramp', 'crane', 'crank', 'crash', 'crass', 'crate', 'crave', 'crawl',
        'craze', 'crazy', 'creak', 'cream', 'creed', 'creek', 'creep', 'creme',
        'crepe', 'crest', 'crick', 'cried', 'crime', 'crimp', 'crisp', 'croak',
        'crock', 'crone', 'crook', 'cross', 'group', 'crowd', 'crown', 'crude',
        'cruel', 'crush', 'crust', 'crypt', 'cubic', 'cumin', 'cupid', 'curly',
        'curry', 'curse', 'curve', 'curvy', 'cycle', 'cynic', 'daddy', 'daily',
        'dairy', 'daisy', 'dance', 'dandy', 'datum', 'dealt', 'death', 'debit',
        'debug', 'debut', 'decal', 'decay', 'decor', 'decoy', 'decry', 'deity',
        'delay', 'delta', 'delve', 'demon', 'demur', 'denim', 'dense', 'depot',
        'depth', 'derby', 'deter', 'devil', 'diary', 'dicey', 'digit', 'diner',
        'dingy', 'dirty', 'disco', 'ditch', 'ditto', 'ditty', 'diver', 'dizzy',
        'dodge', 'doing', 'dolly', 'donor', 'donut', 'doubt', 'dough', 'dowdy',
        'dowel', 'draft', 'drain', 'drake', 'drama', 'drank', 'drape', 'drawl',
        'drawn', 'dread', 'dream', 'dress', 'dried', 'drift', 'drill', 'drink',
        'drive', 'droit', 'droll', 'drone', 'drool', 'droop', 'dross', 'drove',
        'drown', 'drugs', 'druid', 'drunk', 'dryer', 'dryly', 'ducks', 'dully',
        'dummy', 'dumpy', 'dunce', 'dunes', 'dusty', 'dutch', 'dwarf', 'dwell',
        'dwelt', 'dying', 'eager', 'eagle', 'early', 'earth', 'easel', 'eaten',
        'eater', 'eaves', 'ebony', 'edged', 'edges', 'edict', 'eight', 'eject',
        'elbow', 'elder', 'elect', 'elite', 'elope', 'elude', 'email', 'embed',
        'ember', 'emcee', 'empty', 'enact', 'ended', 'endow', 'enemy', 'enjoy',
        'ennui', 'enema', 'ensue', 'enter', 'entry', 'envoy', 'epoch', 'epoxy',
        'equal', 'equip', 'erase', 'erect', 'erode', 'error', 'erupt', 'essay',
        'ether', 'ethic', 'ethos', 'evade', 'event', 'every', 'exact', 'exalt',
        'excel', 'exert', 'exile', 'exist', 'expat', 'extra', 'exude', 'exult',
        'fable', 'facet', 'faint', 'fairy', 'faith', 'false', 'fancy', 'farce',
        'fatal', 'fatty', 'fault', 'fauna', 'favor', 'feast', 'feign', 'fella',
        'felon', 'femur', 'fence', 'feral', 'ferry', 'fetal', 'fetch', 'fetid',
        'fetus', 'feud', 'fever', 'fiber', 'field', 'fiend', 'fiery', 'fifth',
        'fifty', 'fight', 'filch', 'filet', 'filmy', 'filth', 'final', 'finch',
        'finer', 'first', 'fishy', 'fixer', 'fizzy', 'fjord', 'flack', 'flail',
        'flair', 'flake', 'flaky', 'flame', 'flank', 'flare', 'flash', 'flask',
        'flaxy', 'flay', 'fleas', 'fleck', 'fleet', 'flesh', 'flick', 'flier',
        'fling', 'flint', 'flirt', 'float', 'flock', 'flood', 'floor', 'flora',
        'floss', 'flour', 'flout', 'flown', 'fluid', 'fluke', 'flung', 'flunk',
        'flush', 'flute', 'foamy', 'focal', 'focus', 'foggy', 'foils', 'folds',
        'folio', 'folks', 'folly', 'foray', 'force', 'forge', 'forgo', 'forte',
        'forth', 'forty', 'forum', 'fossil', 'found', 'foyer', 'frail', 'frame',
        'frank', 'fraud', 'freak', 'freed', 'fresh', 'friar', 'fried', 'frill',
        'frisk', 'fritz', 'frizz', 'frock', 'frond', 'front', 'frost', 'froth',
        'frown', 'froze', 'fruit', 'fudge', 'fugue', 'fully', 'fumed', 'funky',
        'funny', 'furry', 'fused', 'fussy', 'fusty', 'fuzzy', 'gaffe', 'gaily',
        'gains', 'gamer', 'gamma', 'gamut', 'gases', 'gauge', 'gaunt', 'gauze',
        'gauzy', 'gavel', 'gawky', 'gazer', 'gecko', 'geeky', 'geese', 'genie',
        'genre', 'ghost', 'giant', 'giddy', 'gills', 'given', 'giver', 'gizmo',
        'gland', 'glare', 'glass', 'glaze', 'gleam', 'glean', 'glide', 'glint',
        'gloat', 'globe', 'gloom', 'glory', 'gloss', 'glove', 'glyph', 'gnarly',
        'gnash', 'gnome', 'godly', 'going', 'golem', 'golly', 'goody', 'gooey',
        'goofy', 'goose', 'gorge', 'gouge', 'gourd', 'grace', 'grade', 'graft',
        'grail', 'grain', 'grand', 'grant', 'grape', 'graph', 'grasp', 'grass',
        'grate', 'grave', 'gravy', 'graze', 'great', 'greed', 'greek', 'green',
        'greet', 'grief', 'grill', 'grime', 'grimy', 'grind', 'gripe', 'grips',
        'grist', 'grits', 'groan', 'groat', 'groin', 'groom', 'grope', 'gross',
        'group', 'grout', 'grove', 'growl', 'grown', 'gruel', 'gruff', 'grump',
        'grunt', 'guava', 'guess', 'guest', 'guide', 'guild', 'guilt', 'guise',
        'gulch', 'gully', 'gumbo', 'gummy', 'guppy', 'gusto', 'gusty', 'gypsy',
        'habit', 'haiku', 'hairs', 'hairy', 'halve', 'handy', 'happy', 'hardy',
        'haste', 'hasty', 'hatch', 'hated', 'hater', 'haunt', 'haven', 'havoc',
        'hazel', 'heads', 'heady', 'heard', 'heart', 'heath', 'heave', 'heavy',
        'hedge', 'hefty', 'heist', 'helix', 'hello', 'hence', 'heron', 'hertz',
        'hilly', 'hinge', 'hippo', 'hippy', 'hitch', 'hoard', 'hobby', 'hoist',
        'holly', 'homer', 'honey', 'honor', 'hooey', 'hooks', 'hoped', 'horde',
        'horny', 'horse', 'hotel', 'hound', 'house', 'hovel', 'hover', 'howdy',
        'human', 'humid', 'humor', 'humps', 'humus', 'hunch', 'hunky', 'hurry',
        'husky', 'hyena', 'hymen', 'hymns', 'hyper', 'icier', 'icily', 'icing',
        'ideal', 'idiom', 'idiot', 'idler', 'igloo', 'image', 'imago', 'imbue',
        'impel', 'imply', 'inane', 'inbox', 'incur', 'index', 'indie', 'inept',
        'inert', 'infer', 'infra', 'ingot', 'inner', 'input', 'inter', 'intro',
        'ionic', 'irate', 'irked', 'irony', 'isle', 'issue', 'itchy', 'ivory',
        'jazzy', 'jeans', 'jelly', 'jenny', 'jerks', 'jerky', 'jesus', 'jewel',
        'jiffy', 'jiggy', 'jimmy', 'jinks', 'jinni', 'jibed', 'jibes', 'jived',
        'jiver', 'jives', 'joint', 'joked', 'joker', 'jokes', 'jolly', 'jolts',
        'joust', 'joyed', 'judge', 'juice', 'juicy', 'jumbo', 'jumps', 'jumpy',
        'junta', 'juror', 'karma', 'kayak', 'kebab', 'keeps', 'khaki', 'kicks',
        'kinky', 'kiosk', 'kitty', 'knack', 'knave', 'knead', 'kneed', 'kneel',
        'knees', 'knelt', 'knife', 'knock', 'knoll', 'knots', 'known', 'kudos',
        'label', 'labor', 'laced', 'ladle', 'lager', 'lance', 'lanky', 'lapel',
        'lapse', 'large', 'larva', 'laser', 'lasso', 'latch', 'later', 'latex',
        'lathe', 'latin', 'laugh', 'layer', 'leach', 'leads', 'leafy', 'leaky',
        'leant', 'leapt', 'learn', 'leary', 'lease', 'leash', 'least', 'leave',
        'ledge', 'legal', 'lemon', 'lemur', 'lends', 'level', 'lever', 'libel',
        'liege', 'light', 'liked', 'liken', 'limbo', 'limbs', 'limit', 'lined',
        'linen', 'liner', 'lines', 'lingo', 'links', 'lions', 'lipid', 'lists',
        'liter', 'lithe', 'liver', 'livid', 'llama', 'loads', 'loamy', 'loans',
        'lobby', 'local', 'locus', 'lodge', 'lofty', 'logic', 'login', 'loins',
        'loner', 'looks', 'loony', 'loops', 'loopy', 'loose', 'lordy', 'loser',
        'lotto', 'lotus', 'louse', 'lousy', 'lover', 'lower', 'lowly', 'loyal',
        'lucid', 'lucky', 'lumen', 'lumps', 'lumpy', 'lunar', 'lunch', 'lunge',
        'lungs', 'lupus', 'lurch', 'lurid', 'lusty', 'lying', 'lymph', 'lyric',
        'macaw', 'macho', 'macro', 'madam', 'magic', 'magma', 'maize', 'major',
        'maker', 'males', 'mambo', 'mamma', 'mammy', 'manga', 'mange', 'mango',
        'mangy', 'mania', 'manic', 'manly', 'manor', 'maple', 'march', 'mares',
        'marry', 'marsh', 'masks', 'masse', 'match', 'mated', 'mates', 'matte',
        'maxim', 'maybe', 'mayor', 'mealy', 'means', 'meant', 'meaty', 'medal',
        'media', 'medic', 'melee', 'melon', 'mercy', 'merge', 'merit', 'merry',
        'messy', 'metal', 'meter', 'metro', 'micro', 'midst', 'might', 'milky',
        'mimic', 'mince', 'minds', 'mined', 'miner', 'mines', 'minor', 'minty',
        'minus', 'mirth', 'miser', 'missy', 'misty', 'miter', 'mixed', 'mixer',
        'mixes', 'mocha', 'modal', 'model', 'modem', 'modes', 'moist', 'molar',
        'moldy', 'money', 'month', 'moody', 'moose', 'moral', 'morph', 'morse',
        'mossy', 'motel', 'motif', 'motor', 'motto', 'mould', 'moult', 'mound',
        'mount', 'mourn', 'mouse', 'mousy', 'mouth', 'moved', 'mover', 'moves',
        'movie', 'mower', 'mucky', 'mucus', 'muddy', 'muffs', 'mulch', 'mummy',
        'munch', 'mural', 'murky', 'mushy', 'music', 'musky', 'musty', 'myrrh',
        'nadir', 'naive', 'naked', 'named', 'nanny', 'nasal', 'nasty', 'natal',
        'naval', 'navel', 'needy', 'nerdy', 'nerve', 'nervy', 'never', 'newer',
        'newly', 'nicer', 'niche', 'niece', 'nifty', 'night', 'nimby', 'ninja',
        'ninny', 'ninth', 'nitty', 'noble', 'nobly', 'noise', 'noisy', 'nomad',
        'nooky', 'north', 'notch', 'noted', 'notes', 'nouns', 'novel', 'nudge',
        'nurse', 'nutty', 'nylon', 'nymph', 'oaken', 'occur', 'ocean', 'octet',
        'odder', 'oddly', 'offal', 'offer', 'often', 'ogled', 'ogles', 'oiled',
        'oiler', 'oinks', 'olden', 'older', 'olive', 'ombre', 'omega', 'onion',
        'onset', 'oomph', 'opera', 'optic', 'orbit', 'order', 'organ', 'other',
        'otter', 'ought', 'ounce', 'outdo', 'outer', 'ovary', 'overt', 'owing',
        'owner', 'oxide', 'ozone', 'paced', 'pacer', 'packs', 'paddy', 'pagan',
        'paged', 'pager', 'pages', 'paint', 'pairs', 'paler', 'palsy', 'pammy',
        'panel', 'panic', 'pansy', 'pants', 'papal', 'paper', 'parch', 'parka',
        'parks', 'parry', 'parse', 'party', 'pasta', 'paste', 'pasty', 'patch',
        'patio', 'patsy', 'patty', 'pause', 'paved', 'paver', 'paves', 'pawed',
        'peace', 'peach', 'peaks', 'pearl', 'pecan', 'pedal', 'penny', 'perch',
        'peril', 'perks', 'perky', 'perms', 'pesky', 'pesto', 'petal', 'petty',
        'phase', 'phone', 'phony', 'photo', 'piano', 'picky', 'piece', 'piety',
        'piggy', 'pilot', 'pinch', 'pined', 'pines', 'pinky', 'pinto', 'pious',
        'piped', 'piper', 'pipes', 'pique', 'pitch', 'pithy', 'piton', 'pivot',
        'pixel', 'pixie', 'pizza', 'place', 'plaid', 'plain', 'plait', 'plane',
        'plank', 'plans', 'plant', 'plate', 'plaza', 'plead', 'pleas', 'pleat',
        'plied', 'plier', 'plies', 'plods', 'plonk', 'plops', 'plots', 'plows',
        'ploys', 'pluck', 'plugs', 'plumb', 'plume', 'plump', 'plums', 'plumy',
        'plunk', 'plush', 'poach', 'pocks', 'podgy', 'poems', 'poesy', 'poets',
        'point', 'poise', 'poked', 'poker', 'pokes', 'polar', 'poled', 'poles',
        'polka', 'polls', 'polyp', 'pomp', 'ponds', 'ponys', 'pooch', 'pools',
        'porch', 'pored', 'pores', 'porky', 'posed', 'poser', 'poses', 'posit',
        'posse', 'posts', 'pouch', 'pound', 'pouts', 'power', 'prank', 'prawn',
        'prays', 'press', 'prevy', 'price', 'prick', 'pricy', 'pride', 'pried',
        'pries', 'prima', 'prime', 'primp', 'print', 'prior', 'prism', 'privy',
        'prize', 'probe', 'prods', 'prole', 'promo', 'proms', 'prone', 'prong',
        'proof', 'props', 'prose', 'prosy', 'proud', 'prove', 'prowl', 'prude',
        'prune', 'psalm', 'pubic', 'pucks', 'pudgy', 'puffs', 'puffy', 'pulls',
        'pulps', 'pulpy', 'pulse', 'pumps', 'punch', 'punks', 'punky', 'punny',
        'pupil', 'puppy', 'puree', 'purer', 'purge', 'purrs', 'purse', 'pushy',
        'putty', 'pygmy', 'quack', 'quaff', 'quail', 'quake', 'qualm', 'quark',
        'quart', 'quasi', 'queen', 'queer', 'quell', 'query', 'quest', 'queue',
        'quick', 'quids', 'quiet', 'quill', 'quilt', 'quips', 'quirk', 'quite',
        'quota', 'quote', 'rabid', 'racer', 'races', 'radar', 'radio', 'radii',
        'raged', 'rages', 'raids', 'rails', 'rains', 'rainy', 'raise', 'rajah',
        'raked', 'raker', 'rakes', 'rally', 'ramps', 'ranch', 'randy', 'range',
        'rangy', 'ranks', 'rapid', 'rarer', 'raspy', 'rated', 'rater', 'rates',
        'ratio', 'ratty', 'raved', 'ravel', 'raven', 'raver', 'raves', 'rayon',
        'razed', 'razor', 'reach', 'react', 'reads', 'ready', 'realm', 'reams',
        'reaps', 'rears', 'rebel', 'rebut', 'recap', 'recur', 'recut', 'redid',
        'reeds', 'reedy', 'reefs', 'reeks', 'reeky', 'reels', 'refer', 'refit',
        'regal', 'reign', 'reins', 'relax', 'relay', 'relic', 'remit', 'remix',
        'renal', 'rends', 'renew', 'rents', 'repay', 'repel', 'reply', 'rerun',
        'reset', 'resin', 'rests', 'retch', 'retry', 'reuse', 'revel', 'revue',
        'rhino', 'rhyme', 'rider', 'rides', 'ridge', 'rifle', 'rifts', 'right',
        'rigid', 'rigor', 'riled', 'riles', 'rills', 'rinds', 'rings', 'rinse',
        'riots', 'ripen', 'riper', 'risen', 'riser', 'rises', 'risks', 'risky',
        'rites', 'ritzy', 'rival', 'river', 'rivet', 'roads', 'roams', 'roars',
        'roast', 'robed', 'robes', 'robin', 'robot', 'rocks', 'rocky', 'rodeo',
        'roger', 'rogue', 'roles', 'rolls', 'roman', 'romps', 'roofs', 'rooks',
        'rooky', 'rooms', 'roomy', 'roost', 'roots', 'roped', 'ropes', 'roses',
        'rosin', 'rotor', 'rouge', 'rough', 'round', 'rouse', 'route', 'rover',
        'rowed', 'rower', 'royal', 'rucks', 'ruddy', 'ruder', 'ruffle', 'rugby',
        'ruins', 'ruled', 'ruler', 'rules', 'rumba', 'rumor', 'rumps', 'runes',
        'rungs', 'runny', 'runts', 'rupee', 'rural', 'rusty', 'saber', 'sable',
        'sadly', 'safer', 'safes', 'saint', 'sakes', 'salad', 'sales', 'sally',
        'salon', 'salsa', 'salty', 'salve', 'salvo', 'samba', 'sandy', 'saner',
        'sappy', 'sassy', 'satan', 'sated', 'satin', 'satyr', 'sauce', 'saucy',
        'sauna', 'saute', 'saved', 'saver', 'saves', 'savvy', 'sawed', 'saxes',
        'scald', 'scale', 'scalp', 'scaly', 'scamp', 'scams', 'scant', 'scare',
        'scarf', 'scary', 'scene', 'scent', 'schmo', 'scoff', 'scold', 'scone',
        'scoop', 'scoot', 'scope', 'scops', 'score', 'scorn', 'scout', 'scowl',
        'scram', 'scrap', 'scree', 'screw', 'scrub', 'scrum', 'seals', 'seams',
        'seamy', 'sears', 'seats', 'sedan', 'seeds', 'seedy', 'seeks', 'seems',
        'seeps', 'seepy', 'seize', 'semis', 'sends', 'sense', 'sepia', 'serum',
        'serve', 'servo', 'setup', 'seven', 'sever', 'sewed', 'sewer', 'shade',
        'shady', 'shaft', 'shake', 'shaky', 'shale', 'shall', 'shame', 'shank',
        'shape', 'shard', 'share', 'shark', 'sharp', 'shave', 'shawl', 'shays',
        'sheaf', 'shear', 'sheds', 'sheen', 'sheep', 'sheer', 'sheet', 'shelf',
        'shell', 'shift', 'shims', 'shine', 'shins', 'shiny', 'ships', 'shire',
        'shirk', 'shirt', 'shock', 'shoed', 'shoes', 'shone', 'shook', 'shoot',
        'shops', 'shore', 'shorn', 'short', 'shout', 'shove', 'shown', 'shows',
        'showy', 'shred', 'shrew', 'shrub', 'shrug', 'shuck', 'shuns', 'shunt',
        'shush', 'shuts', 'sided', 'sides', 'siege', 'sieve', 'sight', 'sigma',
        'signs', 'silks', 'silky', 'sills', 'silly', 'silts', 'silty', 'since',
        'sinew', 'singe', 'sings', 'sinks', 'sinus', 'siren', 'sissy', 'sites',
        'sixth', 'sixty', 'sized', 'sizer', 'sizes', 'skate', 'skeet', 'skein',
        'skids', 'skied', 'skier', 'skies', 'skiff', 'skill', 'skimp', 'skims',
        'skins', 'skint', 'skips', 'skirt', 'skits', 'skull', 'skunk', 'slabs',
        'slack', 'slain', 'slake', 'slams', 'slang', 'slant', 'slaps', 'slash',
        'slate', 'slats', 'slave', 'slays', 'sleds', 'sleek', 'sleep', 'sleet',
        'slept', 'slice', 'slick', 'slide', 'slime', 'slimy', 'sling', 'slink',
        'slips', 'slits', 'slobs', 'slogs', 'slope', 'slops', 'slosh', 'sloth',
        'slots', 'slows', 'slubs', 'slugs', 'slump', 'slums', 'slung', 'slunk',
        'slurp', 'slurs', 'slush', 'slyly', 'smack', 'small', 'smart', 'smash',
        'smear', 'smell', 'smelt', 'smile', 'smirk', 'smite', 'smith', 'smock',
        'smoke', 'smoky', 'snack', 'snags', 'snail', 'snake', 'snaky', 'snaps',
        'snare', 'snarl', 'sneak', 'sneer', 'snide', 'sniff', 'snips', 'snits',
        'snobs', 'snoop', 'snore', 'snort', 'snout', 'snowy', 'snubs', 'snuck',
        'snuff', 'snugs', 'soapy', 'soars', 'sober', 'socks', 'sofas', 'softy',
        'soggy', 'soils', 'solar', 'soled', 'soles', 'solid', 'solos', 'solve',
        'sonar', 'songs', 'sonic', 'sonny', 'sooth', 'sooty', 'soppy', 'sorry',
        'sorts', 'so-so', 'souls', 'sound', 'soups', 'soupy', 'sours', 'south',
        'sowed', 'sower', 'space', 'spade', 'spake', 'spams', 'spans', 'spare',
        'spark', 'spars', 'spasm', 'spawn', 'speak', 'spear', 'specs', 'speed',
        'spell', 'spend', 'spent', 'spice', 'spicy', 'spied', 'spiel', 'spies',
        'spike', 'spiky', 'spill', 'spine', 'spins', 'spiny', 'spire', 'spite',
        'spits', 'splat', 'split', 'spoil', 'spoke', 'spoof', 'spook', 'spool',
        'spoon', 'spore', 'sport', 'spots', 'spout', 'spray', 'spree', 'sprig',
        'spry', 'spuds', 'spume', 'spunk', 'spurn', 'spurt', 'squad', 'squat',
        'squaw', 'squib', 'squid', 'stack', 'staff', 'stage', 'stags', 'stain',
        'stair', 'stake', 'stale', 'stalk', 'stall', 'stamp', 'stand', 'stank',
        'staph', 'stare', 'stark', 'stars', 'start', 'stash', 'state', 'stave',
        'stays', 'stead', 'steak', 'steal', 'steam', 'steed', 'steel', 'steep',
        'steer', 'stems', 'steno', 'steps', 'stern', 'stews', 'stick', 'stiff',
        'still', 'stilt', 'sting', 'stink', 'stint', 'stock', 'stoic', 'stoke',
        'stole', 'stomp', 'stone', 'stony', 'stood', 'stool', 'stoop', 'stops',
        'store', 'stork', 'storm', 'story', 'stout', 'stove', 'stows', 'strap',
        'straw', 'stray', 'strep', 'strew', 'strip', 'strut', 'stuck', 'studs',
        'study', 'stuff', 'stump', 'stung', 'stunk', 'stuns', 'stunt', 'style',
        'suave', 'sucks', 'sudsy', 'suede', 'sugar', 'suite', 'suits', 'sulky',
        'sully', 'sumac', 'sunny', 'super', 'surge', 'surly', 'sushi', 'swabs',
        'swamp', 'swank', 'swans', 'swaps', 'swarm', 'swath', 'swats', 'sways',
        'swear', 'sweat', 'sweep', 'sweet', 'swell', 'swept', 'swift', 'swigs',
        'swill', 'swims', 'swine', 'swing', 'swipe', 'swirl', 'swish', 'swiss',
        'swoon', 'swoop', 'sword', 'swore', 'sworn', 'swung', 'sylph', 'synod',
        'syrup', 'tabby', 'table', 'taboo', 'tacit', 'tacky', 'taffy', 'tails',
        'taint', 'taken', 'taker', 'takes', 'tales', 'talks', 'tally', 'talon',
        'tamed', 'tamer', 'tames', 'tangs', 'tangy', 'tanks', 'taper', 'tapes',
        'tardy', 'tarps', 'tarry', 'tarts', 'tasks', 'taste', 'tasty', 'tatty',
        'taunt', 'tawny', 'taxed', 'taxes', 'teach', 'teaks', 'teams', 'tears',
        'teary', 'tease', 'teats', 'techs', 'teddy', 'teems', 'teens', 'teeth',
        'tempo', 'tempt', 'tends', 'tenet', 'tenor', 'tense', 'tenth', 'tents',
        'tepee', 'tepid', 'terms', 'terns', 'terra', 'terry', 'terse', 'tests',
        'testy', 'texts', 'thank', 'thaws', 'theft', 'their', 'theme', 'thens',
        'there', 'these', 'thick', 'thief', 'thigh', 'thine', 'thing', 'think',
        'thins', 'third', 'thong', 'thorn', 'those', 'three', 'threw', 'throb',
        'throw', 'thrum', 'thuds', 'thugs', 'thumb', 'thump', 'tidal', 'tided',
        'tides', 'tiers', 'tiger', 'tight', 'tikes', 'tiled', 'tiler', 'tiles',
        'tilts', 'timed', 'timer', 'times', 'timid', 'tinny', 'tints', 'tipsy',
        'tired', 'tires', 'titan', 'title', 'toast', 'today', 'toddy', 'token',
        'tonal', 'toned', 'toner', 'tones', 'tongs', 'tonic', 'toons', 'tooth',
        'topic', 'topsy', 'torch', 'toric', 'torso', 'torts', 'total', 'totem',
        'touch', 'tough', 'tours', 'towed', 'towel', 'tower', 'towns', 'toxic',
        'toxin', 'trace', 'track', 'tract', 'trade', 'trail', 'train', 'trait',
        'tramp', 'trams', 'trash', 'trawl', 'trays', 'tread', 'treat', 'trees',
        'treks', 'trend', 'tress', 'triad', 'trial', 'tribe', 'trick', 'tried',
        'trier', 'tries', 'trill', 'trims', 'trios', 'trips', 'trite', 'troll',
        'tromp', 'troop', 'trope', 'trots', 'trout', 'trove', 'trowl', 'truce',
        'truck', 'trued', 'truer', 'trues', 'truly', 'trump', 'trunk', 'truss',
        'trust', 'truth', 'tryst', 'tubby', 'tubed', 'tuber', 'tubes', 'tucks',
        'tufts', 'tulip', 'tumid', 'tummy', 'tumor', 'tunas', 'tuned', 'tuner',
        'tunes', 'tunic', 'turfs', 'turfy', 'turns', 'turps', 'tutor', 'tutus',
        'twain', 'twang', 'tweak', 'tweed', 'tweet', 'twice', 'twigs', 'twill',
        'twine', 'twirl', 'twist', 'tying', 'tykes', 'typed', 'types', 'udder',
        'ulcer', 'ultra', 'umber', 'umbra', 'umped', 'unarm', 'uncle', 'uncut',
        'under', 'undid', 'undue', 'unfed', 'unfit', 'unify', 'union', 'unite',
        'units', 'unity', 'unlit', 'unmet', 'unpin', 'unrig', 'unsay', 'unset',
        'untie', 'until', 'unwed', 'unzip', 'upper', 'upset', 'urban', 'urged',
        'urger', 'urges', 'urine', 'usage', 'usher', 'using', 'usual', 'usurp',
        'utter', 'vacua', 'vague', 'valet', 'valid', 'valor', 'value', 'valve',
        'vamps', 'vanes', 'vapid', 'vapor', 'vault', 'vaunt', 'veers', 'vegan',
        'veils', 'veins', 'veiny', 'veldt', 'venom', 'venue', 'verbs', 'verge',
        'verse', 'verso', 'verve', 'vibes', 'vicar', 'video', 'views', 'vigor',
        'villa', 'vinca', 'vines', 'vinyl', 'viola', 'viper', 'viral', 'virus',
        'visor', 'vista', 'vital', 'vivid', 'vixen', 'vocal', 'vodka', 'vogue',
        'voice', 'voids', 'volts', 'vomit', 'voted', 'voter', 'votes', 'vouch',
        'vowed', 'vowel', 'vying', 'wacky', 'waded', 'wader', 'wades', 'wafer',
        'waged', 'wager', 'wages', 'wagon', 'waifs', 'wails', 'waist', 'waits',
        'waive', 'waked', 'waken', 'waker', 'wakes', 'walks', 'walla', 'walls',
        'waltz', 'wands', 'waned', 'wanes', 'wants', 'wards', 'wares', 'warms',
        'warns', 'warps', 'warts', 'warty', 'washy', 'wasps', 'waste', 'watch',
        'water', 'watts', 'waved', 'waver', 'waves', 'wavey', 'waxed', 'waxen',
        'waxes', 'weald', 'weals', 'weans', 'wears', 'weary', 'weave', 'webby',
        'wedge', 'weeds', 'weedy', 'weeks', 'weeny', 'weeps', 'weepy', 'weigh',
        'weird', 'weirs', 'welds', 'wells', 'welsh', 'welts', 'wench', 'wends',
        'whack', 'whale', 'whams', 'wharf', 'wheat', 'wheel', 'whelp', 'where',
        'which', 'whiff', 'while', 'whims', 'whine', 'whiny', 'whips', 'whirl',
        'whirr', 'whisk', 'white', 'whole', 'whomp', 'whoop', 'whose', 'wicks',
        'widen', 'wider', 'widow', 'width', 'wield', 'wifes', 'wifey', 'wight',
        'wilds', 'wiled', 'wiles', 'wills', 'willy', 'wilts', 'wimps', 'wimpy',
        'wince', 'winch', 'winds', 'windy', 'wined', 'wines', 'wings', 'winks',
        'wiped', 'wiper', 'wipes', 'wired', 'wirer', 'wires', 'wised', 'wiser',
        'wisps', 'wispy', 'witch', 'withe', 'witty', 'wives', 'wizen', 'woken',
        'wolfs', 'woman', 'women', 'wonks', 'wonky', 'wonts', 'woods', 'woody',
        'wooed', 'wooer', 'woofs', 'wools', 'wooly', 'woozy', 'words', 'wordy',
        'works', 'world', 'worms', 'wormy', 'worry', 'worse', 'worst', 'worth',
        'would', 'wound', 'woven', 'wowed', 'wrack', 'wraps', 'wrath', 'wreak',
        'wreck', 'wrest', 'wrier', 'wring', 'wrist', 'write', 'writs', 'wrong',
        'wrote', 'wrung', 'wryly', 'yacht', 'yahoo', 'yanks', 'yards', 'yarns',
        'yawns', 'yeahs', 'yearn', 'years', 'yeast', 'yells', 'yelps', 'yield',
        'yikes', 'yodel', 'yokel', 'yokes', 'yolks', 'young', 'yours', 'youth',
        'yowls', 'yucks', 'yucky', 'yummy', 'zebra', 'zeros', 'zesty', 'zilch',
        'zincs', 'zings', 'zingy', 'zippy', 'zonal', 'zoned', 'zones', 'zooms'
    ])
};

// Pre-computed word pairs that have known solutions
const wordPairs = {
    easy: [
        { start: 'cat', target: 'dog', optimal: 3 },
        { start: 'hot', target: 'ice', optimal: 4 },
        { start: 'wet', target: 'dry', optimal: 5 },
        { start: 'day', target: 'sun', optimal: 4 },
        { start: 'man', target: 'boy', optimal: 4 },
        { start: 'top', target: 'low', optimal: 4 },
        { start: 'pig', target: 'sty', optimal: 4 },
        { start: 'hat', target: 'cap', optimal: 3 },
        { start: 'run', target: 'jog', optimal: 4 },
        { start: 'bed', target: 'cot', optimal: 3 },
        { start: 'big', target: 'wee', optimal: 5 },
        { start: 'sad', target: 'joy', optimal: 5 },
        { start: 'old', target: 'new', optimal: 4 },
        { start: 'sea', target: 'bay', optimal: 3 },
        { start: 'pen', target: 'ink', optimal: 4 }
    ],
    medium: [
        { start: 'cold', target: 'warm', optimal: 4 },
        { start: 'head', target: 'tail', optimal: 5 },
        { start: 'hate', target: 'love', optimal: 4 },
        { start: 'lose', target: 'find', optimal: 5 },
        { start: 'poor', target: 'rich', optimal: 5 },
        { start: 'hide', target: 'seek', optimal: 4 },
        { start: 'hard', target: 'easy', optimal: 6 },
        { start: 'fast', target: 'slow', optimal: 5 },
        { start: 'work', target: 'play', optimal: 6 },
        { start: 'fire', target: 'water', optimal: 6 },
        { start: 'good', target: 'evil', optimal: 5 },
        { start: 'dawn', target: 'dusk', optimal: 2 },
        { start: 'male', target: 'girl', optimal: 5 },
        { start: 'fish', target: 'bird', optimal: 5 },
        { start: 'wine', target: 'beer', optimal: 4 }
    ],
    hard: [
        { start: 'black', target: 'white', optimal: 6 },
        { start: 'stone', target: 'money', optimal: 5 },
        { start: 'wheat', target: 'bread', optimal: 5 },
        { start: 'sleep', target: 'dream', optimal: 4 },
        { start: 'brain', target: 'heart', optimal: 6 },
        { start: 'smile', target: 'frown', optimal: 5 },
        { start: 'angel', target: 'devil', optimal: 6 },
        { start: 'peace', target: 'chaos', optimal: 6 },
        { start: 'night', target: 'light', optimal: 2 },
        { start: 'earth', target: 'water', optimal: 5 },
        { start: 'sword', target: 'peace', optimal: 6 },
        { start: 'tiger', target: 'mouse', optimal: 7 },
        { start: 'river', target: 'ocean', optimal: 6 },
        { start: 'flour', target: 'bread', optimal: 5 },
        { start: 'house', target: 'mouse', optimal: 2 }
    ]
};

// Game state
let currentPair = null;
let currentWord = '';
let ladderSteps = [];
let score = 0;
let highScore = 0;
let difficulty = 'medium';
let hintsUsed = 0;
let puzzlesSolved = 0;
let usedPairs = [];

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

function playCorrectSound() {
    [523.25, 659.25, 783.99].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.15), i * 60);
    });
}

function playWrongSound() {
    playTone(200, 0.25, 'sawtooth');
}

function playVictorySound() {
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.3), i * 100);
    });
}

// Check if two words differ by exactly one letter
function differsbyOneLetter(word1, word2) {
    if (word1.length !== word2.length) return false;
    let differences = 0;
    for (let i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) differences++;
        if (differences > 1) return false;
    }
    return differences === 1;
}

// Check if a word is valid
function isValidWord(word) {
    const wordLength = currentPair ? currentPair.start.length : 4;
    const wordSet = wordLists[wordLength];
    return wordSet && wordSet.has(word.toLowerCase());
}

// Find which letter changed between two words
function findChangedIndex(word1, word2) {
    for (let i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) return i;
    }
    return -1;
}

// Render word as letter boxes
function renderWord(word, containerId, changedIndex = -1) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    for (let i = 0; i < word.length; i++) {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box' + (i === changedIndex ? ' changed' : '');
        letterBox.textContent = word[i].toUpperCase();
        container.appendChild(letterBox);
    }
}

// Render the ladder steps
function renderLadderSteps() {
    const container = document.getElementById('ladder-steps');
    container.innerHTML = '';

    let previousWord = currentPair.start;

    ladderSteps.forEach((word, index) => {
        const changedIndex = findChangedIndex(previousWord, word);

        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-word';

        for (let i = 0; i < word.length; i++) {
            const letterBox = document.createElement('div');
            letterBox.className = 'letter-box' + (i === changedIndex ? ' changed' : '');
            letterBox.textContent = word[i].toUpperCase();
            stepDiv.appendChild(letterBox);
        }

        container.appendChild(stepDiv);
        previousWord = word;
    });

    document.getElementById('steps').textContent = ladderSteps.length;
    document.getElementById('undo-btn').disabled = ladderSteps.length === 0;
}

// Load progress from localStorage
function loadProgress() {
    if (typeof localStorage !== 'undefined') {
        highScore = Number(localStorage.getItem('wordEvolutionHighScore')) || 0;
        const savedDifficulty = localStorage.getItem('wordEvolutionDifficulty');
        if (savedDifficulty) {
            difficulty = savedDifficulty;
            document.getElementById('difficulty').value = difficulty;
        }
        puzzlesSolved = Number(localStorage.getItem('wordEvolutionSolved')) || 0;
        const savedTheme = localStorage.getItem('wordEvolutionTheme');
        if (savedTheme === 'light') {
            document.body.classList.add('light');
            document.getElementById('theme-toggle').textContent = 'Dark Mode';
        }
    }
    updateStats();
}

// Save progress to localStorage
function saveProgress() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordEvolutionHighScore', String(highScore));
        localStorage.setItem('wordEvolutionDifficulty', difficulty);
        localStorage.setItem('wordEvolutionSolved', String(puzzlesSolved));
    }
}

// Update stats display
function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('high-score').textContent = highScore;
}

// Show message
function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = 'message ' + type;
}

// Clear message
function clearMessage() {
    const msg = document.getElementById('message');
    msg.textContent = '';
    msg.className = 'message';
}

// Get a random word pair
function getRandomPair() {
    const pairs = wordPairs[difficulty];
    const availablePairs = pairs.filter(p =>
        !usedPairs.some(u => u.start === p.start && u.target === p.target)
    );

    if (availablePairs.length === 0) {
        usedPairs = [];
        return pairs[Math.floor(Math.random() * pairs.length)];
    }

    return availablePairs[Math.floor(Math.random() * availablePairs.length)];
}

// Start a new puzzle
function newPuzzle() {
    currentPair = getRandomPair();
    usedPairs.push(currentPair);

    if (usedPairs.length > 10) {
        usedPairs.shift();
    }

    currentWord = currentPair.start;
    ladderSteps = [];
    hintsUsed = 0;

    renderWord(currentPair.start, 'start-word');
    renderWord(currentPair.target, 'target-word');
    renderLadderSteps();

    document.getElementById('optimal').textContent = currentPair.optimal || '?';
    document.getElementById('word-input').value = '';
    document.getElementById('word-input').focus();

    clearMessage();
    showMessage(`Transform "${currentPair.start.toUpperCase()}" into "${currentPair.target.toUpperCase()}"`, 'info');
}

// Calculate score for completing a puzzle
function calculateScore(steps, optimal, hintsUsed) {
    const baseScore = { easy: 100, medium: 200, hard: 300 }[difficulty];

    // Bonus for optimal or near-optimal solution
    let stepBonus = 0;
    if (steps <= optimal) {
        stepBonus = 100; // Perfect solution bonus
    } else if (steps <= optimal + 2) {
        stepBonus = 50; // Near optimal bonus
    }

    // Penalty for hints
    const hintPenalty = hintsUsed * 15;

    // Efficiency multiplier
    const efficiency = Math.max(0.5, optimal / steps);

    return Math.max(10, Math.round((baseScore + stepBonus) * efficiency - hintPenalty));
}

// Submit a word
function submitWord() {
    const input = document.getElementById('word-input');
    const word = input.value.trim().toLowerCase();
    input.value = '';

    if (!word) return;

    // Validate word length
    if (word.length !== currentPair.start.length) {
        playWrongSound();
        showMessage(`Word must be ${currentPair.start.length} letters long`, 'error');
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 300);
        return;
    }

    // Check if word differs by exactly one letter from current word
    if (!differsbyOneLetter(currentWord, word)) {
        playWrongSound();
        showMessage('Change exactly one letter at a time!', 'error');
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 300);
        return;
    }

    // Check if word is valid
    if (!isValidWord(word)) {
        playWrongSound();
        showMessage(`"${word.toUpperCase()}" is not a valid word`, 'error');
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 300);
        return;
    }

    // Check if we've already used this word
    if (word === currentPair.start || ladderSteps.includes(word)) {
        playWrongSound();
        showMessage('You\'ve already used this word!', 'error');
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 300);
        return;
    }

    // Valid word - add to ladder
    ladderSteps.push(word);
    currentWord = word;
    renderLadderSteps();
    playCorrectSound();

    // Check if we've reached the target
    if (word === currentPair.target) {
        const points = calculateScore(ladderSteps.length, currentPair.optimal, hintsUsed);
        score += points;
        puzzlesSolved++;

        if (score > highScore) {
            highScore = score;
        }

        saveProgress();
        updateStats();
        playVictorySound();

        const stepsText = ladderSteps.length === 1 ? 'step' : 'steps';
        const optimalText = ladderSteps.length <= currentPair.optimal ? ' Perfect!' : '';
        showMessage(`Victory! Completed in ${ladderSteps.length} ${stepsText}! +${points} points${optimalText}`, 'victory');

        // Start new puzzle after delay
        setTimeout(() => {
            newPuzzle();
        }, 3000);
    } else {
        clearMessage();
    }

    input.focus();
}

// Undo last step
function undoStep() {
    if (ladderSteps.length > 0) {
        ladderSteps.pop();
        currentWord = ladderSteps.length > 0 ? ladderSteps[ladderSteps.length - 1] : currentPair.start;
        renderLadderSteps();
        clearMessage();
        document.getElementById('word-input').focus();
    }
}

// BFS to find shortest path between two words
function findPath(start, target, wordSet) {
    if (start === target) return [start];

    const queue = [[start]];
    const visited = new Set([start]);

    while (queue.length > 0) {
        const path = queue.shift();
        const word = path[path.length - 1];

        // Try changing each letter
        for (let i = 0; i < word.length; i++) {
            for (let c = 97; c <= 122; c++) {
                const newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);

                if (newWord === target) {
                    return [...path, newWord];
                }

                if (wordSet.has(newWord) && !visited.has(newWord)) {
                    visited.add(newWord);
                    queue.push([...path, newWord]);
                }
            }
        }
    }

    return null;
}

// Give a hint
function giveHint() {
    const wordLength = currentPair.start.length;
    const wordSet = wordLists[wordLength];

    // Find path from current word to target
    const path = findPath(currentWord, currentPair.target, wordSet);

    if (path && path.length > 1) {
        const nextWord = path[1];
        hintsUsed++;

        // Deduct points
        score = Math.max(0, score - 15);
        updateStats();

        showMessage(`Hint: Try "${nextWord.toUpperCase()}"`, 'info');
        document.getElementById('word-input').value = nextWord;
        document.getElementById('word-input').focus();
    } else {
        showMessage('No hint available - you might be stuck!', 'error');
    }
}

// Toggle theme
function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    document.getElementById('theme-toggle').textContent = isLight ? 'Dark Mode' : 'Light Mode';

    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wordEvolutionTheme', isLight ? 'light' : 'dark');
    }
}

// Initialize game
if (typeof window !== 'undefined') {
    loadProgress();
    newPuzzle();

    // Event listeners
    document.getElementById('submit-btn').addEventListener('click', submitWord);
    document.getElementById('word-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitWord();
    });

    document.getElementById('hint-btn').addEventListener('click', giveHint);
    document.getElementById('undo-btn').addEventListener('click', undoStep);
    document.getElementById('new-puzzle-btn').addEventListener('click', newPuzzle);

    document.getElementById('difficulty').addEventListener('change', (e) => {
        difficulty = e.target.value;
        saveProgress();
        newPuzzle();
    });

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Music controls
    if (typeof PianoMusicGenerator !== 'undefined') {
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
    }
}

// Export for testing
if (typeof module !== 'undefined') {
    module.exports = {
        isValidWord,
        differsbyOneLetter,
        findPath,
        wordLists,
        wordPairs
    };
}
