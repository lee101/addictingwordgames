import json
import re
from html import escape as esc

from blog_posts import POSTS, BY_SLUG
from game_meta import SITE, SIBLINGS

CSS = (
    '<style>body{margin:0;background:#f3f4f6;color:#1f2937;font:17px/1.65 Arial,Helvetica,sans-serif}'
    '.bl{max-width:760px;margin:0 auto;padding:16px}.bl a{color:#1e3a8a}'
    '.bl nav{display:flex;flex-wrap:wrap;gap:14px;padding:8px 0 16px;font-weight:700}'
    '.bl h1{font-size:30px;line-height:1.25;margin:8px 0 6px;color:#111827}.bl h2{font-size:22px;margin:28px 0 8px;color:#111827}'
    '.bl .d{color:#4b5563;font-size:14px}.bl article,.bl .card{background:#fff;border-radius:14px;padding:20px 22px;box-shadow:0 2px 10px rgba(0,0,0,.1);margin-bottom:16px}'
    '.bl .cta{display:inline-block;margin:6px 10px 6px 0;padding:12px 20px;border-radius:24px;background:#1e3a8a;color:#fff;text-decoration:none;font-weight:700}'
    '.bl .cta:hover{background:#1e40af}.bl .cta.s{background:#065f46}.bl footer{padding:16px 0;font-size:14px;color:#374151}'
    '.bl footer a{margin-right:12px}</style>'
)
NAV = (
    '<nav aria-label="Main"><a href="/">Addicting Word Games</a><a href="/wordle">Wordle</a>'
    '<a href="/typing-game">Typing</a><a href="/cross-word">Crossword</a><a href="/blog">Blog</a></nav>'
)
FOOT = (
    '<footer><a href="/">Home</a><a href="/blog">Blog</a><a href="/about">About</a><a href="/contact">Contact</a>'
    '<a href="/privacy-policy">Privacy</a><a href="/terms">Terms</a><br>More: '
    + ' '.join(f'<a href="{u}" target="_blank" rel="noopener">{esc(n)}</a>' for n, u, d in SIBLINGS[:3]) + '</footer>'
)


def page(title, desc, path, ld, inner, og='/static/img/og/wordle.png'):
    url = SITE + path
    img = SITE + og
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<title>{esc(title)}</title><meta name="description" content="{esc(desc)}">'
        f'<link rel="canonical" href="{url}"><meta property="og:type" content="article">'
        f'<meta property="og:site_name" content="Addicting Word Games"><meta property="og:url" content="{url}">'
        f'<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">'
        f'<meta property="og:image" content="{img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
        f'<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}">'
        f'<meta name="twitter:description" content="{esc(desc)}"><meta name="twitter:image" content="{img}">'
        f'<link rel="icon" href="/favicon.ico"><script type="application/ld+json">{json.dumps(ld)}</script>{CSS}</head>'
        f'<body><div class="bl">{NAV}{inner}{FOOT}</div></body></html>'
    )


def render_body(items):
    out = []
    for k, v in items:
        if k == 'ul':
            out.append('<ul>' + ''.join(f'<li>{esc(i)}</li>' for i in v) + '</ul>')
        else:
            out.append(f'<{k}>{esc(v)}</{k}>')
    return ''.join(out)


def index():
    cards = ''.join(
        f'<div class="card"><h2 style="margin-top:0"><a href="/blog/{p["slug"]}">{esc(p["title"])}</a></h2>'
        f'<div class="d">{p["date"]}</div><p>{esc(p["description"])}</p><a href="/blog/{p["slug"]}">Read more</a></div>'
        for p in POSTS)
    ld = {'@context': 'https://schema.org', '@type': 'Blog', 'name': 'Addicting Word Games Blog', 'url': SITE + '/blog',
          'blogPost': [{'@type': 'BlogPosting', 'headline': p['title'], 'url': f'{SITE}/blog/{p["slug"]}'} for p in POSTS]}
    inner = '<h1>Addicting Word Games Blog</h1><p>Tips for word puzzles, vocabulary and typing practice.</p>' + cards
    return page('Word Game Blog: Puzzle, Vocabulary and Typing Tips', 'Practical tips for Wordle, crosswords, vocabulary building and typing practice from Addicting Word Games.', '/blog', ld, inner)


def post(p):
    url = f'{SITE}/blog/{p["slug"]}'
    ld = {'@context': 'https://schema.org', '@type': 'Article', 'headline': p['title'], 'description': p['description'],
          'datePublished': p['date'], 'dateModified': p['date'], 'mainEntityOfPage': url, 'url': url,
          'image': SITE + '/static/img/og/wordle.png', 'inLanguage': 'en',
          'author': {'@type': 'Organization', 'name': 'Addicting Word Games', 'url': SITE},
          'publisher': {'@type': 'Organization', 'name': 'Addicting Word Games', 'url': SITE}}
    ctas = (f'<a class="cta" href="{p["cta"][0]}">{esc(p["cta"][1])}</a><a class="cta s" href="{p["cta2"][0]}">{esc(p["cta2"][1])}</a>')
    others = ''.join(f'<li><a href="/blog/{o["slug"]}">{esc(o["title"])}</a></li>' for o in POSTS if o is not p)
    inner = (f'<article><h1>{esc(p["title"])}</h1><div class="d">Published {p["date"]}</div>{render_body(p["body"])}'
             f'<h2>Play now</h2><p>{ctas}</p></article><div class="card"><strong>More reading</strong><ul>{others}</ul></div>')
    return page(p['title'] + ' | Addicting Word Games', p['description'], f'/blog/{p["slug"]}', ld, inner)


def lookup(path):
    path = path.rstrip('/') or '/'
    if path == '/blog':
        return index()
    if path.startswith('/blog/') and path[6:] in BY_SLUG:
        return post(BY_SLUG[path[6:]])
    return None


def sitemap_extra():
    u = ['/blog'] + [f'/blog/{p["slug"]}' for p in POSTS]
    return ''.join(f'<url><loc>{SITE}{x}</loc><lastmod>2026-10-22</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>' for x in u)


def inject_links(body):
    body = re.sub(r'(<a href="/flash-library"\s+class="site-nav__link">)', r'<a href="/blog" class="site-nav__link">Blog</a>\1', body, count=1)
    return re.sub(r'(<div id="footer">\s*<p>)', r'\1<a href="/blog" title="Word game tips and guides">Blog</a> ', body, count=1)
