import html
import json
import mimetypes
import os
import re

import webapp2

from game_meta import SITE, SELF_HOSTED, BY_PATH, SIBLINGS
from th_events import add_th
import blog_pages

STATIC_ROOT = os.path.realpath(os.path.join(os.path.dirname(__file__), 'static'))


def safe_static_path(path):
    if not path or '\0' in path or '\\' in path:
        return None
    full = os.path.realpath(os.path.join(STATIC_ROOT, path))
    if not full.startswith(STATIC_ROOT + os.sep) or '/.' in full or not os.path.isfile(full):
        return None
    return full


class SafeStaticHandler(webapp2.RequestHandler):
    def get(self, path):
        full = safe_static_path(path)
        if full is None:
            self.error(404)
            return
        ctype, _ = mimetypes.guess_type(full)
        self.response.headers['Content-Type'] = ctype or 'application/octet-stream'
        self.response.headers['Cache-Control'] = 'public, max-age=86400'
        with open(full, 'rb') as f:
            self.response.body = f.read()


def esc(s):
    return html.escape(s, quote=True)


def head_tags(m):
    url = SITE + m['path']
    title = f"{m['title']} - Play Free Online | Addicting Word Games"
    img = SITE + m['og']
    ld = {
        '@context': 'https://schema.org', '@type': 'VideoGame', 'name': m['title'], 'url': url,
        'description': m['tagline'], 'image': img, 'genre': 'Word game', 'playMode': 'SinglePlayer',
        'applicationCategory': 'Game', 'operatingSystem': 'Any (web browser)',
        'gamePlatform': 'Web browser', 'isAccessibleForFree': True,
        'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'USD'},
        'publisher': {'@type': 'Organization', 'name': 'Addicting Word Games', 'url': SITE},
    }
    return (
        f'<link rel="canonical" href="{url}">'
        f'<meta property="og:type" content="website"><meta property="og:site_name" content="Addicting Word Games">'
        f'<meta property="og:url" content="{url}"><meta property="og:title" content="{esc(title)}">'
        f'<meta property="og:description" content="{esc(m["tagline"])}">'
        f'<meta property="og:image" content="{img}"><meta property="og:image:width" content="1200">'
        f'<meta property="og:image:height" content="630">'
        f'<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}">'
        f'<meta name="twitter:description" content="{esc(m["tagline"])}"><meta name="twitter:image" content="{img}">'
        f'<script type="application/ld+json">{json.dumps(ld)}</script>'
    ), title


BAR_CSS = (
    '<style>.awg-bar{clear:both;box-sizing:border-box;max-width:960px;margin:32px auto 16px;padding:18px 16px;'
    'font:15px/1.4 Arial,Helvetica,sans-serif;color:#1f2937;background:#fff;border-radius:14px;'
    'box-shadow:0 2px 10px rgba(0,0,0,.12);text-align:center;position:relative;z-index:1}'
    '.awg-bar h2{font-size:18px;margin:0 0 10px;color:#111827}'
    '.awg-share{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px}'
    '.awg-share a,.awg-share button{display:inline-flex;align-items:center;min-height:40px;padding:0 16px;border-radius:20px;'
    'border:0;cursor:pointer;font:600 14px Arial,sans-serif;color:#fff;text-decoration:none;background:#1f2937}'
    '.awg-share .fb{background:#1b4db3}.awg-share .x{background:#000}.awg-share .rd{background:#b93a05}.awg-share .wa{background:#146c43}'
    '.awg-promo{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}'
    '.awg-promo a{display:block;padding:10px;border-radius:10px;background:#f3f4f6;color:#1e3a8a;text-decoration:none;font-weight:700}'
    '.awg-promo a span{display:block;font-weight:400;font-size:13px;color:#374151}'
    '.awg-more{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:0 0 16px}'
    '.awg-more a{color:#1e3a8a;font-weight:700}</style>'
)


def share_bar(m):
    url = SITE + m['path']
    t = f"Play {m['title']} free on Addicting Word Games"
    q = lambda s: re.sub(r'[^A-Za-z0-9_.~-]', lambda c: '%%%02X' % ord(c.group()), s)
    more = [g for g in SELF_HOSTED.values() if g['slug'] != m['slug']][:6]
    return (
        BAR_CSS + '<section class="awg-bar" aria-label="Share and more games">'
        f'<h2>Enjoying {esc(m["title"])}? Share it</h2><div class="awg-share" data-share>'
        f'<button type="button" onclick="(function(b){{var d={{title:{esc(json.dumps(t))},url:{esc(json.dumps(url))}}};'
        f'if(navigator.share){{navigator.share(d).catch(function(){{}})}}else if(navigator.clipboard){{navigator.clipboard.writeText(d.url);b.textContent=\'Link copied\'}}}})(this)">Share</button>'
        f'<button type="button" onclick="navigator.clipboard&&navigator.clipboard.writeText({esc(json.dumps(url))});this.textContent=\'Copied!\'">Copy link</button>'
        f'<a class="fb" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u={q(url)}">Facebook</a>'
        f'<a class="x" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url={q(url)}&amp;text={q(t)}">X</a>'
        f'<a class="rd" target="_blank" rel="noopener" href="https://www.reddit.com/submit?url={q(url)}&amp;title={q(t)}">Reddit</a>'
        f'<a class="wa" target="_blank" rel="noopener" href="https://wa.me/?text={q(t + " " + url)}">WhatsApp</a></div>'
        '<h2>More word games</h2><div class="awg-more">'
        + ''.join(f'<a href="{g["path"]}">{esc(g["title"])}</a>' for g in more)
        + '<a href="/">All games</a></div><h2>From our other sites</h2><div class="awg-promo">'
        + ''.join(f'<a href="{u}" target="_blank" rel="noopener">{esc(n)}<span>{esc(d)}</span></a>' for n, u, d in SIBLINGS)
        + '</div></section>'
        '<script>(function(){var b=document.currentScript.previousElementSibling,d=getComputedStyle(document.body).display;'
        'if(/flex|grid/.test(d)){document.documentElement.appendChild(b);}})();</script>'
    )


def enhance(body, m):
    tags, title = head_tags(m)
    if not re.search(r'<html[^>]*\blang=', body, re.I):
        body = re.sub(r'<html\b', '<html lang="en"', body, count=1, flags=re.I)
    body = re.sub(r'<title>.*?</title>', f'<title>{esc(title)}</title>', body, count=1, flags=re.S | re.I)
    if not re.search(r'<meta[^>]+name="description"', body, re.I):
        tags = f'<meta name="description" content="{esc(m["tagline"])}">' + tags
    body = re.sub(r'(</head>)', tags + r'\1', body, count=1, flags=re.I)
    d = f'/static/{m["slug"]}/'
    body = body.replace('href="style.css"', f'href="{d}style.css"').replace('src="script.js"', f'src="{d}script.js"')
    return re.sub(r'(</body>)', lambda x: share_bar(m) + x.group(1), body, count=1, flags=re.I)


def wrap(app):
    def middleware(environ, start_response):
        if environ.get('REQUEST_METHOD') != 'GET':
            return app(environ, start_response)
        pth = environ.get('PATH_INFO', '')
        blog = blog_pages.lookup(pth)
        if blog is not None:
            raw = blog.encode('utf-8')
            start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8'), ('Content-Length', str(len(raw))), ('Cache-Control', 'public, max-age=300')])
            return [raw]
        m = BY_PATH.get(pth.rstrip('/') or '/')
        captured = {}

        def sr(status, headers, exc_info=None):
            captured['s'], captured['h'] = status, headers
            return lambda b: None

        chunks = app(environ, sr)
        status, headers = captured['s'], captured['h']
        ctype = next((v for k, v in headers if k.lower() == 'content-type'), '')
        if pth == '/sitemap.xml' and status.startswith('200'):
            sx = b''.join(chunks).decode('utf-8').replace('</urlset>', blog_pages.sitemap_extra() + '</urlset>').encode('utf-8')
            headers = [(k, v) for k, v in headers if k.lower() != 'content-length'] + [('Content-Length', str(len(sx)))]
            start_response(status, headers)
            return [sx]
        if 'html' not in ctype or not status.startswith(('200', '404')):
            start_response(status, headers)
            return chunks
        try:
            raw = b''.join(chunks)
        finally:
            if hasattr(chunks, 'close'):
                chunks.close()
        try:
            body = raw.decode('utf-8')
        except UnicodeDecodeError:
            start_response(status, headers)
            return [raw]
        if m and status.startswith('200'):
            body = enhance(body, m)
        if status.startswith('200'):
            body = blog_pages.inject_links(body)
        raw = add_th(body).encode('utf-8')
        headers = [(k, v) for k, v in headers if k.lower() != 'content-length']
        headers.append(('Content-Length', str(len(raw))))
        start_response(status, headers)
        return [raw]
    return middleware
