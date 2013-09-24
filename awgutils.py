import urllib
import re

def removeNonAscii(s): 
    return "".join(i for i in s if ord(i)<128)

def urlEncode(s):
    s = removeNonAscii(s.replace(" ", "-").lower())
    # s = s.translate(string.maketrans("", "", ), '!@#;:\',./<>?')
    s = re.sub("[\.\t\,\:;\(\)'@!\\\?#/<>]", "", s, 0, 0)
    return urllib.quote_plus(s)

def getImgUrl(title):
    return 'http://commondatastorage.googleapis.com/wordgames%2F'+title
def getSWFUrl(title):
    return 'http://games.addictingwordgames.com/'+title
def shouldShowAddBefore(game):
    if hash(game.title) % 7 == 0:
        return True
    return False
