# Stub for GCP NDB models - use SQLite instead for self-hosted
# This allows main.py to import models without errors even when GCP deps are not installed

EASY = 2
MEDIUM = 3
HARD = 4
DIFFICULTIES = set([EASY, MEDIUM, HARD])

UNLOCKED_MEDIUM = 1
UNLOCKED_HARD = 2
ACHEIVEMENTS = set([UNLOCKED_MEDIUM, UNLOCKED_HARD])

class DummyModel:
    @classmethod
    def save(cls, obj):
        pass

    @classmethod
    def byId(cls, id):
        return None

    @classmethod
    def byEmail(cls, email):
        return None

    @classmethod
    def getAllTitles(cls):
        return []

    @classmethod
    def oneByUrlTitle(cls, urltitle):
        return None

Score = DummyModel
HighScore = DummyModel
Achievement = DummyModel
Game = DummyModel
User = DummyModel

def get_cursor_and_games(cursor):
    return [], None

def get_rand_order_page(cursor, urltitle):
    return [], None

def get_cursor_and_random_games(current_cursor, urltitle):
    return [], None

def get_games_by_tag_cursor(curent_cursor, tag):
    return [], None
