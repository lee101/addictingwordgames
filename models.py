from google.cloud import ndb
from google.cloud.ndb import Cursor

client = ndb.Client()


class BaseModel(ndb.Model):
    def default(self, o):
        return o.to_dict()

    @classmethod
    def save(cls, obj):
        with client.context():
            return obj.put()


EASY = 2
MEDIUM = 3
HARD = 4
DIFFICULTIES = set([EASY, MEDIUM, HARD])

UNLOCKED_MEDIUM = 1
UNLOCKED_HARD = 2
ACHEIVEMENTS = set([UNLOCKED_MEDIUM, UNLOCKED_HARD])


class User(BaseModel):
    id = ndb.StringProperty(required=True)

    cookie_user = ndb.IntegerProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)

    name = ndb.StringProperty()
    email = ndb.StringProperty()

    profile_url = ndb.StringProperty()
    access_token = ndb.StringProperty()
    has_purchased = ndb.IntegerProperty(default=0)

    #     game_urltitles_played = ndb.IntegerProperty()
    @classmethod
    def byId(cls, id):
        with client.context():
            return cls.query(cls.id == id).get()

    @classmethod
    def byEmail(cls, email):
        with client.context():
            return cls.query(cls.email == email).get()


class Score(BaseModel):
    time = ndb.DateTimeProperty(auto_now_add=True)
    name = ndb.TextProperty()
    user = ndb.KeyProperty(kind=User)
    score = ndb.IntegerProperty(default=0)
    difficulty = ndb.IntegerProperty(default=2)
    timedMode = ndb.IntegerProperty(default=0)


class HighScore(BaseModel):
    '''
    users high scores, only one per difficulty
    '''
    user = ndb.KeyProperty(kind=User)
    score = ndb.IntegerProperty(default=0)
    difficulty = ndb.IntegerProperty(default=2)
    timedMode = ndb.IntegerProperty(default=0)

    @classmethod
    def getHighScores(cls, user):
        with client.context():
            return cls.query(cls.user == user.key).order(cls.difficulty, cls.score).fetch_async(10)

    @classmethod
    def updateHighScoreFor(cls, user, score, difficulty, timedMode):
        '''
                updates users highscore returns true if it is there high score false otherwise
                '''
        with client.context():

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

        # title = ndb.StringProperty(required=True)


class Achievement(BaseModel):
    '''
    provides a many to many relationship between achievments and users
    '''
    time = ndb.DateTimeProperty(auto_now_add=True)
    type = ndb.IntegerProperty()
    user = ndb.KeyProperty(kind=User)

    @classmethod
    def getUserAchievements(cls, user: User):
        '''
        user a User object
        '''
        with client.context():
            achievements = cls.query(cls.user == user.key).fetch_async(10)  # .all()?
            # if len(achievements) == 0:
            #     achievements = Acheivement.all().filter("cookie_user = ?", self.current_user["id"]).fetch(len(ACHEIVEMENTS))
            return achievements


all_titles = []


class Game(BaseModel):
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
        with client.context():
            game = cls.query(cls.title == title).get()  # .all()?
        return game

    @classmethod
    def oneByUrlTitle(cls, urltitle):
        with client.context():
            game = cls.query(cls.urltitle == urltitle).get()  # .all()?
        return game

    @classmethod
    def randomOrder(cls, title):
        # with client.context(): dont need as get is called later?
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
        with client.context():
            global all_titles

            if len(all_titles) <= 0:
                all_titles = [x.urltitle for x in cls.query().fetch(5000, projection=[cls.urltitle])]
            return all_titles

    @classmethod
    def byTag(cls, tag):
        with client.context():
            return cls.query(cls.tags == tag)


class Photo(BaseModel):
    title = ndb.StringProperty()
    full_size_image = ndb.BlobProperty()

    # width = ndb.IntegerProperty()
    # height = ndb.IntegerProperty()
    @classmethod
    def byTitle(cls, title):
        with client.context():
            return cls.query(cls.title == title).get()


def get_cursor_and_games(cursor):
    with client.context():
        curs = Cursor(urlsafe=cursor)
        games, next_curs, more = Game.query().fetch_page(40, start_cursor=curs)
        if more and next_curs:
            next_page_cursor = next_curs.urlsafe()
        else:
            next_page_cursor = None
        return games, next_page_cursor


def get_rand_order_page(cursor, urltitle):
    with client.context():
        curs = Cursor(urlsafe=cursor)
        if urltitle:

            games, next_curs, more = Game.randomOrder(urltitle).fetch_page(
                40, start_cursor=curs)
        else:
            games, next_curs, more = Game.query().fetch_page(40,
                                                             start_cursor=curs)
        if more and next_curs:
            next_page_cursor = next_curs.urlsafe()
        else:
            next_page_cursor = None
        return games, next_page_cursor


def get_cursor_and_random_games(current_cursor, urltitle):
    with client.context():
        curs = Cursor(urlsafe=current_cursor)
        games, next_curs, more = Game.randomOrder(urltitle).fetch_page(40,
                                                                       start_cursor=curs)
        if more and next_curs:
            next_page_cursor = next_curs.urlsafe()
        else:
            next_page_cursor = None
        return games, next_page_cursor
