import urllib
import re

def removeNonAscii(s):
    return "".join(i for i in s if ord(i)<128)

def urlEncode(s):
    s = removeNonAscii(s.replace(" ", "-").lower())
    # s = s.translate(string.maketrans("", "", ), '!@#;:\',./<>?')
    s = re.sub("[\.\t\,\:;\(\)'@!\\\?#/<>\s]", "", s, 0, 0)
    return urllib.quote_plus(s)

def getImgUrl(title):
    return 'https://storage.googleapis.com/wordgames/' + title

def getSWFUrl(title):
    return 'https://storage.googleapis.com/games.addictingwordgames.com/' + title

def shouldShowAddBefore(game):
    return True

def titleDecode(title):
    return title.replace("-", " ").title()
