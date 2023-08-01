from urllib.parse import urlencode, quote_plus

from awg.itch.descriptions import descriptions
from awg.itch.images import all_images
from awg.itch.links import links
from awg.itch.titles import titles

descriptions = descriptions
images = all_images
links = links
titles = titles

all_games = {}

for i, desc in enumerate(descriptions):
    current_title = titles[i]
    url_title = current_title.replace(" ", "-").lower()
    url_title = url_title.replace(":", "-")
    url_title = quote_plus(url_title)
    game = {
        "title": current_title,
        "description": desc,
        "image": 'https://static.addictingwordgames.com/static/saved/' + images[i].split("/")[-1],
        "url": links[i],
    }
    if 'fit' in url_title or 'wrong' in url_title or 'bondage' in url_title:
        continue
    all_games[url_title] = game
