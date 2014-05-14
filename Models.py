from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import ndb
from google.appengine.api import users

import os
import datetime
import logging
import random


EASY = 2
MEDIUM = 3
HARD = 4
DIFFICULTIES = set([EASY, MEDIUM, HARD])

UNLOCKED_MEDIUM = 1
UNLOCKED_HARD = 2
ACHEIVEMENTS = set([UNLOCKED_MEDIUM, UNLOCKED_HARD])


class User(ndb.Model):
    id = ndb.StringProperty(required=True)

    cookie_user = ndb.IntegerProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

    name = ndb.StringProperty()
    profile_url = ndb.StringProperty()
    access_token = ndb.StringProperty()
    #     game_urltitles_played = ndb.IntegerProperty()
    @classmethod
    def byId(cls, id):
        return cls.query(cls.id == id).get()


class Score(ndb.Model):
    time = ndb.DateTimeProperty(auto_now_add=True)
    name = ndb.TextProperty()
    user = ndb.KeyProperty(kind=User)
    score = ndb.IntegerProperty(default=0)
    difficulty = ndb.IntegerProperty(default=2)
    timedMode = ndb.IntegerProperty(default=0)


class HighScore(ndb.Model):
    '''
    users high scores, only one per difficulty
    '''
    user = ndb.KeyProperty(kind=User)
    score = ndb.IntegerProperty(default=0)
    difficulty = ndb.IntegerProperty(default=2)
    timedMode = ndb.IntegerProperty(default=0)

    @classmethod
    def getHighScores(cls, user):
        return cls.query(cls.user == user.key).order(cls.difficulty, cls.score).fetch_async(10)

    @classmethod
    def updateHighScoreFor(cls, user, score, difficulty, timedMode):
        '''
        updates users highscore returns true if it is there high score false otherwise
        '''
        hs = cls.query(cls.user == user.key,
                       cls.difficulty == difficulty,
                       cls.timedMode == timedMode).order(-cls.score).fetch(1)
        if len(hs) > 0 and hs[0].score < score:
            hs = HighScore()
            hs.user = user.key
            hs.score = score
            hs.difficulty = difficulty
            hs.timedMode = timedMode
            hs.put()
            return True
        if len(hs) == 0:
            hs = HighScore()
            hs.user = user.key
            hs.score = score
            hs.difficulty = difficulty
            hs.timedMode = timedMode
            hs.put()
            return True
        return False


        #title = ndb.StringProperty(required=True)


class Achievement(ndb.Model):
    '''
    provides a many to many relationship between achievments and users
    '''
    time = ndb.DateTimeProperty(auto_now_add=True)
    type = ndb.IntegerProperty()
    user = ndb.KeyProperty(kind=User)

    @classmethod
    def getUserAchievements(cls, user):
        '''
        user a User object
        '''
        achievements = cls.query(cls.user == user.key).fetch_async(10)  #.all()?
        # if len(achievements) == 0:
        #     achievements = Acheivement.all().filter("cookie_user = ?", self.current_user["id"]).fetch(len(ACHEIVEMENTS))
        return achievements


all_titles = []


class Game(ndb.Model):
    title = ndb.StringProperty()
    urltitle = ndb.StringProperty()
    description = ndb.TextProperty()
    instructions = ndb.TextProperty()
    url = ndb.TextProperty()
    width = ndb.IntegerProperty()
    height = ndb.IntegerProperty()
    imgwidth = ndb.IntegerProperty()
    imgheight = ndb.IntegerProperty()
    tags = ndb.StringProperty(repeated=True)

    @classmethod
    def oneByTitle(cls, title):
        game = cls.query(cls.title == title).get()  #.all()?
        return game

    @classmethod
    def oneByUrlTitle(cls, urltitle):
        game = cls.query(cls.urltitle == urltitle).get()  #.all()?
        return game

    @classmethod
    def randomOrder(cls, title):
        ordering = hash(title) % 6
        if ordering == 0:
            return cls.query().order(cls.urltitle)
        if ordering == 1:
            return cls.query().order(-cls.urltitle)
        if ordering == 2:
            return cls.query().order(cls.width)
        if ordering == 3:
            return cls.query().order(-cls.width)
        if ordering == 4:
            return cls.query().order(cls.height)
        if ordering == 5:
            return cls.query().order(-cls.height)
        return cls.query()

    @classmethod
    def getAllTitles(cls):
        global all_titles

        if len(all_titles) <= 0:
            all_titles = map(lambda x: x.urltitle, cls.query().fetch(5000, projection=[cls.urltitle]))
        return all_titles

    @classmethod
    def byTag(cls, tag):
        return cls.query(cls.tags == tag)


class Photo(ndb.Model):
    title = ndb.StringProperty()
    full_size_image = ndb.BlobProperty()
    # width = ndb.IntegerProperty()
    # height = ndb.IntegerProperty()
    @classmethod
    def byTitle(cls, title):
        return cls.query(cls.title == title).get()
