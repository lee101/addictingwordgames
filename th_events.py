import json
import re
import threading
import time
import urllib.request

from loguru import logger

TH_WRITE_KEY = 'thw_RHqqRAsE1-ZrCi7_xif1ZFfYPBF-8XQb'
TH_SNIPPET = ('<script>window.th=window.th||function(){(th.q=th.q||[]).push(arguments)};'
              "window.__thConfig={siteId:'" + TH_WRITE_KEY + "'};"
              "window.thFI=function(p){if(thFI.d)return;thFI.d=1;th('track','first_interaction',p||{})};"
              "['pointerdown','keydown'].forEach(function(e){addEventListener(e,function(){thFI()},true)});</script>"
              '<script async src="https://twohelixes.com/static/th.js"></script>')


def add_th(body):
    if '__thConfig' in body:
        return body
    return re.sub(r'(<head\b[^>]*>)', lambda x: x.group(1) + TH_SNIPPET, body, count=1, flags=re.I)


def _post(payload):
    try:
        req = urllib.request.Request('https://twohelixes.com/v1/collect', data=json.dumps(payload).encode(),
                                     headers={'Content-Type': 'application/json', 'User-Agent': 'addictingwordgames-server'})
        urllib.request.urlopen(req, timeout=5).close()
    except Exception as e:
        logger.warning(f'twohelixes track failed: {e}')


def track(event, user_id, props=None, event_id=None):
    ev = {'event': event, 'client_id': user_id, 'user_id': user_id, 'ts': int(time.time() * 1000), 'props': props or {}}
    if event_id:
        ev['event_id'] = event_id
    threading.Thread(target=_post, args=({'site_id': TH_WRITE_KEY, 'events': [ev]},), daemon=True).start()
