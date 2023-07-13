#!/usr/bin/env python
import json
from random import choice

import jinja2
import stripe
# from google.appengine.datastore.datastore_query import Cursor

from webapp2_extras import sessions

import awgutils
# from sellerinfo import SELLER_ID
# from sellerinfo import SELLER_SECRET
import sellerinfo
import utils
import webapp2
import os
# from crawlers.crawlers import *
from loguru import logger
import ws
from gameon_utils import GameOnUtils
from models import DIFFICULTIES, Score, HighScore, Achievement, ACHEIVEMENTS, Game, get_cursor_and_games, User, \
    get_rand_order_page, get_cursor_and_random_games, get_games_by_tag_cursor
from ws import ws

FACEBOOK_APP_ID = "138831849632195"
FACEBOOK_APP_SECRET = "93986c9cdd240540f70efaea56a9e3f2"

config = {}
config['webapp2_extras.sessions'] = dict(
    secret_key='93986c9cdd240540f70efaea56a9e3f2')

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))
    # extensions=['jinja2.ext.autoescape'])

GCLOUD_STATIC_BUCKET_URL = ""

if GameOnUtils.debug:
    GCLOUD_STATIC_BUCKET_URL = "/static"
    stripe_keys = {
        'secret_key': sellerinfo.STRIPE_TEST_SECRET,
        'publishable_key': sellerinfo.STRIPE_TEST_KEY
    }
else:
    GCLOUD_STATIC_BUCKET_URL = "https://static.addictingwordgames.com/static"

    stripe_keys = {
        'secret_key': sellerinfo.STRIPE_LIVE_SECRET,
        'publishable_key': sellerinfo.STRIPE_LIVE_KEY
    }

stripe.api_key = stripe_keys['secret_key']


class BaseHandler(webapp2.RequestHandler):
    """Provides access to the active Facebook user in self.current_user

    The property is lazy-loaded on first access, using the cookie saved
    by the Facebook JavaScript SDK to determine the user ID of the active
    user. See http://developers.facebook.com/docs/authentication/ for
    more information.
    """

    @property
    def current_user(self):
        # ===== Google Auth
        # user = users.get_current_user()
        # if user:
        #     dbUser = User.byId(user.user_id())
        #     if dbUser:
        #         return dbUser
        #     else:
        #
        #         dbUser = User()
        #         dbUser.id = user.user_id()
        #         dbUser.name = user.nickname()
        #         dbUser.email = user.email().lower()
        #         User.save(dbUser)
        #         return dbUser

        # ===== FACEBOOK Auth
        # if self.session.cursor("user"):
        #     # User is logged in
        #     return User.byId(self.session.cursor("user")["id"])
        # else:
        #     # Either used just logged in or just saw the first page
        #     # We'll see here
        #     fbcookie = facebook.get_user_from_cookie(self.request.cookies,
        #                                              FACEBOOK_APP_ID,
        #                                              FACEBOOK_APP_SECRET)
        #     if fbcookie:
        #         # Okay so user logged in.
        #         # Now, check to see if existing user
        #         user = User.byId(fbcookie["uid"])
        #         if not user:
        #             # Not an existing user so get user info
        #             graph = facebook.GraphAPI(fbcookie["access_token"])
        #             profile = graph.get_object("me")
        #             user = User(
        #                 key_name=str(profile["id"]),
        #                 id=str(profile["id"]),
        #                 name=profile["name"],
        #                 profile_url=profile["link"],
        #                 access_token=fbcookie["access_token"]
        #             )
        #             User.save(user)
        #         elif user.access_token != fbcookie["access_token"]:
        #             user.access_token = fbcookie["access_token"]
        #             User.save(user)
        #         # User is now logged in
        #         self.session["user"] = dict(
        #             name=user.name,
        #             profile_url=user.profile_url,
        #             id=user.id,
        #             access_token=user.access_token
        #         )
        #         return user
        # ======== use session cookie user
        anonymous_cookie = self.request.cookies.curent_cursor('wsuser', None)
        if anonymous_cookie is None:
            cookie_value = utils.random_string()
            self.response.set_cookie('wsuser', cookie_value, max_age=15724800)
            anon_user = User()
            anon_user.cookie_user = 1
            anon_user.id = cookie_value
            User.save(anon_user)
            return anon_user
        else:
            anon_user = User.byId(anonymous_cookie)
            if anon_user:
                return anon_user
            cookie_value = utils.random_string()
            self.response.set_cookie('wsuser', cookie_value, max_age=15724800)
            anon_user = User()
            anon_user.cookie_user = 1
            anon_user.id = cookie_value
            User.save(anon_user)
            return anon_user

    def dispatch(self):
        """
        This snippet of code is taken from the webapp2 framework documentation.
        See more at
        http://webapp-improved.appspot.com/api/webapp2_extras/sessions.html

        """
        self.session_store = sessions.get_store(request=self.request)
        try:
            webapp2.RequestHandler.dispatch(self)
        finally:
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        """
        This snippet of code is taken from the webapp2 framework documentation.
        See more at
        http://webapp-improved.appspot.com/api/webapp2_extras/sessions.html

        """
        return self.session_store.get_session()

    def getRandomGameUrl(self):
        '''
        todo implement user played/notplayed
        '''
        titles = Game.getAllTitles()
        if len(titles) == 0:
            return '/'
        randchoice = choice(titles)
        return '/game/' + randchoice

    def render(self, view_name, extraParams={}):

        # achievements = Acheivement.all().filter("user = ?", self.current_user["id"]).fetch(len(ACHEIVEMENTS))
        # if len(achievements) == 0:
        #     achievements = Acheivement.all().filter("cookie_user = ?", self.current_user["id"]).fetch(len(ACHEIVEMENTS))
        # currentUser = self.current_user
        try:
            random_game_url = self.getRandomGameUrl()
            template_values = {
                'ws': ws,
                'facebook_app_id': FACEBOOK_APP_ID,
                # 'current_user': currentUser,
                # 'achievements': achievements,
                # 'UNLOCKED_MEDIUM':UNLOCKED_MEDIUM,
                # 'UNLOCKED_HARD':UNLOCKED_HARD,
                # 'MEDIUM':MEDIUM,
                # 'EASY':EASY,
                # 'HARD':HARD,
                # 'highscores':highscores,
                # 'glogin_url': users.create_login_url(self.request.uri),
                # 'glogout_url': users.create_logout_url(self.request.uri),
                'awgutils': awgutils,
                'url': self.request.uri,
                'static_url': GCLOUD_STATIC_BUCKET_URL,
                'random_game_url': random_game_url
            }
            template_values.update(extraParams)

            template = JINJA_ENVIRONMENT.get_template(view_name)
            self.response.write(template.render(template_values))
        except Exception as err:
            logger.error(Exception)
            logger.error(err)
            import traceback

            traceback.print_exc()
            self.response.write(err)
            raise err


#             self.response.write(traceback.print_exc())
#             raise err


class ScoresHandler(BaseHandler):
    def get(self):
        userscore = Score()
        userscore.score = int(self.request.get('score'))
        userscore.difficulty = int(self.request.get('difficulty'))
        userscore.timedMode = int(self.request.get('timedMode'))

        if userscore.difficulty not in DIFFICULTIES:
            raise Exception("unknown difficulty: " + userscore.difficulty)

        if self.current_user:
            userscore.user = self.current_user.key
        Score.save(userscore)
        HighScore.updateHighScoreFor(self.current_user, userscore.score,
                                     userscore.difficulty, userscore.timedMode)

        self.response.out.write('success')


class AchievementsHandler(BaseHandler):
    def get(self):
        acheive = Achievement()
        acheive.type = int(self.request.get('achievement'))
        if acheive.type not in ACHEIVEMENTS:
            raise Exception("unknown achievement: " + acheive.type)
        if self.current_user:
            acheive.user = self.current_user.key
        Achievement.save(acheive)
        # graph = facebook.GraphAPI(self.current_user['access_token'])
        self.response.out.write('success')


class MainHandler(BaseHandler):
    def get(self):
        cursor = self.request.get('cursor')
        games, next_page_cursor = get_cursor_and_games(cursor)
        extraParams = {'games': games,
                       'next_page_cursor': str(next_page_cursor.decode("utf-8"))}
        self.render('/templates/index.jinja2', extraParams)


class FbHandler(BaseHandler):
    def get(self):
        self.render('/templates/facebook.html')


class ContactHandler(BaseHandler):
    def get(self):
        self.render('/templates/contact.jinja2')


class AboutHandler(BaseHandler):
    def get(self):
        self.render('/templates/about.jinja2')


class PrivacyHandler(BaseHandler):
    def get(self):
        self.render('/templates/privacy-policy.jinja2')


class TermsHandler(BaseHandler):
    def get(self):
        self.render('/templates/terms.jinja2')


class SitemapHandler(webapp2.RequestHandler):
    def get(self):
        titles = Game.getAllTitles()
        self.response.headers['Content-Type'] = 'text/xml'
        template = JINJA_ENVIRONMENT.get_template("/templates/sitemap.xml")
        self.response.write(template.render({'titles': titles}))


class LoadGamesHandler(BaseHandler):
    def get(self):
        try:
            urltitle = self.request.get('title')
            cursor = self.request.get('cursor')
            games, next_page_cursor = get_rand_order_page(cursor, urltitle)
            extraParams = {'games': games,
                           'next_page_cursor': str(next_page_cursor.decode("utf-8"))}
        except Exception as err:
            logger.error(Exception)
            logger.error(err)
            import traceback

            traceback.print_exc()
            self.response.write(err)
        self.render('/templates/loadgames.jinja2', extraParams)


class GameHandler(BaseHandler):
    def get(self, urltitle):
        game = Game.oneByUrlTitle(urltitle)
        current_cursor = self.request.get('cursor')
        games, next_page_cursor = get_cursor_and_random_games(current_cursor, urltitle)
        extraParams = {'game': game,
                       'games': games,
                       'next_page_cursor': str(next_page_cursor.decode("utf-8")),
                       'urltitle': urltitle}
        self.render('/templates/game.jinja2', extraParams)


games = {
    'wordsmashing': {
        'title': 'Word Smashing',
        'image_url': '/static/img/word-smashing-logo.png',
        'url': 'https://wordsmashing.com'
    },
    'multiplication-master': {
        'title': 'Multiplication Master',
        'image_url': '/static/img/multiplication-master-promo-256.png',
        'url': 'https://www.multiplicationmaster.com'
    },
    'reword-game': {
        'title': 'ReWord Game',
        'image_url': '/static/img/reword-game-logo256.png',
        'url': 'https://rewordgame.com'
    },
    'big-multiplayer-chess': {
        'title': 'Big Multiplayer Chess',
        'image_url': '/static/img/big-multiplayer-chess-logo256.png',
        'url': 'https://bigmultiplayerchess.com'
    },
    '20-questions-with-ai': {
        'title': '20 Questions with AI',
        'image_url': '/static/img/text-generator-brain-logo.png',
        'url': 'https://textgenerator.app.nz/questions-game'
    },
    'reading-time': {
        'title': 'Reading Time',
        'image_url': '/static/img/reading-time-icon256.png',
        'url': 'https://readingtime.app.nz'
    },
    'joy-drop': {
        'title': 'Joy Drop',
        'image_url': '/static/img/joydrop-sun-logo256.png',
        'url': 'https://joydrop.app.nz'
    },
    'netwrck': {
        'title': 'Netwrck',
        'image_url': '/static/img/netwrck-logo-colord256.png',
        'url': 'https://netwrck.com'
    },
}


class PlayGameHandler(BaseHandler):
    def get(self, urltitle):
        game = games[urltitle]
        extraParams = {'game': game,
                       'urltitle': urltitle}
        self.render('/templates/play-game.jinja2', extraParams)


class TagHandler(BaseHandler):
    def get(self, tag):
        curent_cursor = self.request.get('cursor')
        games, next_page_cursor = get_games_by_tag_cursor(curent_cursor, tag)
        extraParams = {
            'games': games,
            'next_page_cursor': next_page_cursor,
            'tag': tag,
            'tagtitle': awgutils.titleDecode(tag),
        }
        self.render('/templates/tag.jinja2', extraParams)


class LoginHandler(BaseHandler):
    def get(self):
        self.render('/templates/login.jinja2', {})


class SignUpHandler(BaseHandler):
    def get(self):
        self.render('/templates/signup.jinja2', {})


class BuyHandler(BaseHandler):
    def get(self):
        self.render('/templates/buy.jinja2', {
            'stripe_publishable_key': stripe_keys['publishable_key']
        })


class LogoutHandler(BaseHandler):
    def get(self):
        if self.current_user is not None:
            self.session['user'] = None

        self.redirect('/')


class GetUserHandler(BaseHandler):
    def get(self):
        email = self.request.get('email')
        user = User.byEmail(email)

        if not user:
            user = User()

            cookie_value = utils.random_string()
            self.response.set_cookie('wsuser', cookie_value, max_age=15724800)
            user.id = cookie_value
            user.email = email
            User.save(user)
        # user = self.current_user

        self.response.headers['Content-Type'] = 'application/json'

        self.response.write(
            json.dumps(user.to_dict(), cls=GameOnUtils.MyEncoder))


class CreateUserHandler(BaseHandler):

    def post(self):
        email = self.request.get('email')
        emailVerified = self.request.get('emailVerified')
        uid = self.request.get('uid')
        photoURL = self.request.get('photoURL')
        token = self.request.get('token')
        user = self.current_user
        if not user:
            user = User()
        # get or create
        user.id = uid
        user.email = email
        user.token = token
        user.emailVerified = emailVerified
        User.save(user)

        self.session["user"] = dict(
            name=user.name,
            profile_url=user.profile_url,
            id=user.id,
            access_token=user.access_token
        )

        # send_signup_email(email, referral_url_key)
        self.response.headers['Content-Type'] = 'application/json'

        self.response.write(json.dumps({'success': True}))


class ChargeForBuyHandler(BaseHandler):

    def post(self):
        token = self.request.get('token[id]')  # Using Flask
        email = self.request.get('token[email]')  # Using Flask
        user = User.byEmail(email)
        try:
            # Use Stripe's library to make requests...
            charge = stripe.Charge.create(
                amount=199,
                currency='usd',
                description='Addicting Word Games.com',
                source=token,
                # idempotency_key=user.id
            )
        except stripe.error.CardError as e:
            logger.error(e)
            print(e)
            # Since it's a decline, stripe.error.CardError will be caught
            body = e.json_body
            err = body.cursor('error', {})

            print("Status is: %s" % e.http_status)
            print("Type is: %s" % err.cursor('type'))
            print("Code is: %s" % err.cursor('code'))
            # param is '' in this case
            print("Param is: %s" % err.cursor('param'))
            print("Message is: %s" % err.cursor('message'))
        except stripe.error.RateLimitError as e:
            logger.error(e)
            print(e)
            # Too many   requests made to the API too quickly
            pass
        except stripe.error.InvalidRequestError as e:
            logger.error(e)
            print(e)
            # Invalid parameters were supplied to Stripe's API
            pass
        except stripe.error.AuthenticationError as e:
            logger.error(e)
            print(e)
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            pass
        except stripe.error.APIConnectionError as e:
            logger.error(e)
            print(e)
            # Network communication with Stripe failed
            pass
        except stripe.error.StripeError as e:
            logger.error(e)
            print(e)
            # Display a very generic error to the user, and maybe send
            # yourself an email
            pass
        except Exception as e:
            # Something else happened, completely unrelated to Stripe
            logger.error(e)
            print(e)
            self.response.write(json.dumps({'success': False}))
            return
        # TODO save inside else to be strict
        # else:
        user.has_purchased = True
        User.save(user)

        # send_signup_email(email, referral_url_key)
        self.response.headers['Content-Type'] = 'application/json'

        self.response.write(json.dumps({'success': True}))


# class Thumbnailer(webapp2.RequestHandler):
#     def get(self, title):
#         if self.request.get("id"):
#             photo = Photo.get_by_id(int(self.request.get("id")))
#
#             if photo:
#                 img = images.Image(photo.full_size_image)
#                 img.resize(width=80, height=100)
#                 #img.im_feeling_lucky()
#                 thumbnail = img.execute_transforms(output_encoding=images.JPEG)
#
#                 self.response.headers['Content-Type'] = 'image/jpeg'
#                 self.response.out.write(thumbnail)
#                 return
#
#         # Either "id" wasn't provided, or there was no image with that ID
#         # in the datastore.
#         self.error(404)

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/scores', ScoresHandler),
    ('/achievements', AchievementsHandler),
    ('/login', LoginHandler),
    ('/sign-up', SignUpHandler),
    ('/buy', BuyHandler),
    ('/logout', LogoutHandler),
    ('/privacy-policy', PrivacyHandler),
    ('/terms', TermsHandler),
    ('/facebook', FbHandler),
    ('/about', AboutHandler),
    ('/contact', ContactHandler),
    ('/game/(.*)', GameHandler),
    ('/play-game/(.*)', PlayGameHandler),
    ('/games/(.*)', TagHandler),
    ('/api/create-user', CreateUserHandler),
    ('/api/get-user', GetUserHandler),
    ('/api/buy', ChargeForBuyHandler),
    # ('/gomochi', MochiGamesCrawler),
    ('/loadgames', LoadGamesHandler),
    ('/sitemap', SitemapHandler),

], debug=ws.debug, config=config)
