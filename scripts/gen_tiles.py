"""Generate branded game tiles (SVG) and 1200x630 OG images (PNG).

uv run --no-project python scripts/gen_tiles.py
"""
import base64
import os
import subprocess
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from game_meta import SELF_HOSTED  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), '..', 'static', 'img')
TILES = os.path.join(ROOT, 'tiles')
OG = os.path.join(ROOT, 'og')
FONT = "Arial, Helvetica, sans-serif"


def tile(x, y, s, ch, fill='#fff', fg='#1b1b2f', rot=0):
    r = s * 0.16
    t = f' transform="rotate({rot} {x + s / 2} {y + s / 2})"' if rot else ''
    return (f'<g{t}><rect x="{x}" y="{y + 3}" width="{s}" height="{s}" rx="{r}" fill="#000" opacity=".25"/>'
            f'<rect x="{x}" y="{y}" width="{s}" height="{s}" rx="{r}" fill="{fill}"/>'
            f'<text x="{x + s / 2}" y="{y + s * 0.72}" font-family="{FONT}" font-weight="900" '
            f'font-size="{s * 0.62}" text-anchor="middle" fill="{fg}">{ch}</text></g>')


def row(word, y, s, gap=6, **kw):
    w = len(word) * s + (len(word) - 1) * gap
    x0 = 128 - w / 2
    return ''.join(tile(x0 + i * (s + gap), y, s, c, **kw) for i, c in enumerate(word))


ICONS = {
    'typing-tower-defense': lambda a: (
        f'<path d="M98 176V104h12v-12h12v12h12v-12h12v12h12v72z" fill="#fff" opacity=".95"/>'
        f'<rect x="120" y="140" width="16" height="36" rx="8" fill="{a}"/>'
        f'<path d="M60 150l24-10-4 10 4 10z" fill="#ffd166"/><path d="M196 150l-24-10 4 10-4 10z" fill="#ffd166"/>'
        + row('TYPE', 38, 34)),
    'typing-game': lambda a: (
        tile(56, 34, 34, 'A', rot=-8) + tile(112, 58, 34, 'W', rot=6) + tile(166, 30, 34, 'G', rot=-4)
        + ''.join(f'<rect x="{40 + i * 30}" y="134" width="26" height="22" rx="4" fill="#fff" opacity=".9"/>' for i in range(6))
        + ''.join(f'<rect x="{55 + i * 30}" y="160" width="26" height="22" rx="4" fill="#fff" opacity=".9"/>' for i in range(5))
        + f'<rect x="86" y="160" width="26" height="22" rx="4" fill="{a}"/>'),
    'wordle': lambda a: ''.join(
        tile(38 + i * 37, 30 + j * 37, 33, ch, fill=f, fg='#fff')
        for j, (w, cols) in enumerate([('WORDS', 'gyxxg'), ('WORLD', 'ggggg'), ('     ', 'eeeee')])
        for i, (ch, c) in enumerate(zip(w, cols))
        for f in [{'g': '#2e9e5b', 'y': '#c9a227', 'x': '#6b7280', 'e': 'rgba(255,255,255,.25)'}[c]]),
    'word-phzzle': lambda a: (
        tile(46, 40, 44, 'Z', rot=-14) + tile(104, 30, 44, 'P', rot=9) + tile(162, 44, 44, 'H', rot=-6)
        + f'<path d="M84 128c20-18 68-18 88 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>'
        f'<path d="M166 116l8 14-16 2z" fill="#fff"/>'),
    'word-jumble': lambda a: (
        tile(40, 34, 40, 'J', rot=12) + tile(88, 52, 40, 'U', rot=-10) + tile(136, 30, 40, 'M', rot=8) + tile(180, 56, 40, 'B', rot=-14)
        + f'<circle cx="128" cy="150" r="30" fill="#fff"/><circle cx="128" cy="150" r="24" fill="{a}"/>'
        f'<path d="M128 150V134M128 150l12 8" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'),
    'word-search': lambda a: (
        ''.join(f'<text x="{52 + i * 30}" y="{56 + j * 30}" font-family="{FONT}" font-weight="700" font-size="22" '
                f'fill="#fff" text-anchor="middle" opacity=".92">{ch}</text>'
                for j, line in enumerate(['QFINDX', 'WORDSK', 'ZAPLEV'])
                for i, ch in enumerate(line))
        + '<rect x="37" y="67" width="150" height="30" rx="15" fill="none" stroke="#ffd166" stroke-width="4"/>'
        '<circle cx="176" cy="148" r="18" fill="none" stroke="#fff" stroke-width="6"/>'
        '<path d="M189 161l16 16" stroke="#fff" stroke-width="8" stroke-linecap="round"/>'),
    'gravity-words': lambda a: (
        tile(62, 24, 34, 'G', rot=-10) + tile(150, 40, 34, 'R', rot=12) + tile(108, 70, 34, 'A')
        + '<path d="M78 66v26M166 82v18" stroke="#fff" stroke-width="3" stroke-dasharray="4 5" opacity=".7"/>'
        + row('WORD', 140, 34, fill='#ffd166')),
    'typing-race': lambda a: (
        '<path d="M58 160a70 70 0 0 1 140 0" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".35"/>'
        '<path d="M58 160a70 70 0 0 1 112-56" fill="none" stroke="#ffd166" stroke-width="12" stroke-linecap="round"/>'
        '<path d="M128 160l42-50" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="128" cy="160" r="10" fill="#fff"/>'
        f'<text x="128" y="138" font-family="{FONT}" font-weight="900" font-size="22" fill="#fff" text-anchor="middle">WPM</text>'
        + ''.join(f'<rect x="{40 + i * 16}" y="30" width="8" height="8" fill="#fff"/><rect x="{48 + i * 16}" y="38" width="8" height="8" fill="#fff"/>' for i in range(11))),
    'word-reactor': lambda a: (
        '<circle cx="128" cy="100" r="18" fill="#ffd166"/>'
        + ''.join(f'<ellipse cx="128" cy="100" rx="70" ry="24" fill="none" stroke="#fff" stroke-width="5" opacity=".9" transform="rotate({r} 128 100)"/>' for r in (0, 60, 120))
        + tile(40, 150, 30, 'R') + tile(186, 150, 30, 'X') + tile(113, 160, 30, 'E')),
    'word-ring': lambda a: (
        '<circle cx="128" cy="104" r="68" fill="none" stroke="#fff" stroke-width="5" opacity=".6"/>'
        + ''.join(tile(128 + 68 * c - 17, 104 + 68 * s - 17, 34, ch)
                  for ch, (c, s) in zip('RINGSO', [(0, -1), (.87, -.5), (.87, .5), (0, 1), (-.87, .5), (-.87, -.5)]))
        + f'<circle cx="128" cy="104" r="22" fill="#ffd166"/>'),
}

EXISTING = {'word-detective', 'speed-speller', 'word-duel', 'word-evolution', 'syllable-shuffle'}


def svg_tile(slug, m):
    c1, c2 = m['colors']
    body = ICONS[slug](c2) if slug in ICONS else ''
    name = m['short']
    fs = 30 if len(name) <= 12 else 24
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient></defs>
<rect width="256" height="256" rx="28" fill="url(#g)"/>
<circle cx="220" cy="30" r="70" fill="#fff" opacity=".07"/><circle cx="20" cy="240" r="60" fill="#000" opacity=".08"/>
{body}
<rect x="0" y="198" width="256" height="58" fill="#000" opacity=".28"/>
<text x="128" y="{236 if fs == 30 else 234}" font-family="{FONT}" font-weight="900" font-size="{fs}" fill="#fff" text-anchor="middle">{name}</text>
</svg>
'''


def og_svg(title, tagline, tile_href, c1, c2):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 630" width="1200" height="630">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<circle cx="1120" cy="60" r="260" fill="#fff" opacity=".06"/>
<image x="70" y="105" width="420" height="420" xlink:href="{tile_href}"/>
<text x="550" y="250" font-family="{FONT}" font-weight="900" font-size="{68 if len(title) <= 17 else 54}" fill="#fff">{title}</text>
{''.join(f'<text x="550" y="{318 + i * 40}" font-family="{FONT}" font-size="31" fill="#fff" opacity=".92">{ln}</text>' for i, ln in enumerate(wrap(tagline, 34)))}
<rect x="550" y="480" width="300" height="72" rx="36" fill="#ffd166"/>
<text x="700" y="527" font-family="{FONT}" font-weight="900" font-size="32" fill="#1b1b2f" text-anchor="middle">PLAY FREE</text>
<text x="1130" y="600" font-family="{FONT}" font-weight="700" font-size="26" fill="#fff" opacity=".85" text-anchor="end">addictingwordgames.com</text>
</svg>
'''


def wrap(s, n):
    out, cur = [], ''
    for w in s.split():
        if len(cur) + len(w) + 1 > n and cur:
            out.append(cur)
            cur = w
        else:
            cur = (cur + ' ' + w).strip()
    out.append(cur)
    return out[:4]


def datauri(path):
    return 'data:image/svg+xml;base64,' + base64.b64encode(open(path, 'rb').read()).decode()


def render(svg, png, w, h):
    tmp = png + '.svg'
    with open(tmp, 'w') as f:
        f.write(svg)
    subprocess.run(['rsvg-convert', '-w', str(w), '-h', str(h), tmp, '-o', png], check=True)
    os.remove(tmp)


def main():
    os.makedirs(TILES, exist_ok=True)
    os.makedirs(OG, exist_ok=True)
    for slug, m in SELF_HOSTED.items():
        if slug in EXISTING:
            src = os.path.abspath(os.path.join(ROOT, f'{slug}-logo256.svg'))
        else:
            src = os.path.abspath(os.path.join(TILES, f'{slug}.svg'))
            with open(src, 'w') as f:
                f.write(svg_tile(slug, m))
        c1, c2 = m['colors']
        render(og_svg(m['title'], m['tagline'], datauri(src), c1, c2), os.path.join(OG, f'{slug}.png'), 1200, 630)
    home = os.path.abspath(os.path.join(TILES, 'wordle.svg'))
    render(og_svg('Addicting Word Games', 'Free word puzzles, typing games and Wordle-style challenges. No download.',
                  datauri(home), '#1d3a8a', '#6d28d9'), os.path.join(OG, 'home.png'), 1200, 630)


if __name__ == '__main__':
    main()
