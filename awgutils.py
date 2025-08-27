import urllib.request, urllib.parse, urllib.error
import re

def removeNonAscii(s):
    return "".join(i for i in s if ord(i)<128)

def urlEncode(s):
    s = removeNonAscii(s.replace(" ", "-").lower())
    # s = s.translate(string.maketrans("", "", ), '!@#;:\',./<>?')
    s = re.sub("[\.\t\,\:;\(\)'@!\\\?#/<>\s]", "", s, 0, 0)
    return urllib.parse.quote_plus(s)

def getImgUrl(title):
    return 'https://addictingwordgamesstatic.addictingwordgames.com/' + title

def getSWFUrl(title):
    return 'https://addictingwordgamesstatic.addictingwordgames.com/games/' + title

def shouldShowAddBefore(game):
    return True

def titleDecode(title):
    return title.replace("-", " ").title()
