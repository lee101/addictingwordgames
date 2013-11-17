#!/usr/bin/env python

from Models import *
from google.appengine.api import users
from google.appengine.ext.webapp import template
from ws import ws
import json
import os
import webapp2
import facebook
from webapp2_extras import sessions
import utils
import jinja2
from crawlers.crawlers import *
from cgi import escape
import time
from google.appengine.datastore.datastore_query import Cursor
import awgutils
import random

from google.appengine.api import images

# from sellerinfo import SELLER_ID
# from sellerinfo import SELLER_SECRET

FACEBOOK_APP_ID = "138831849632195"
FACEBOOK_APP_SECRET = "93986c9cdd240540f70efaea56a9e3f2"

config = {}
config['webapp2_extras.sessions'] = dict(secret_key='93986c9cdd240540f70efaea56a9e3f2')

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


class BaseHandler(webapp2.RequestHandler):
    """Provides access to the active Facebook user in self.current_user

    The property is lazy-loaded on first access, using the cookie saved
    by the Facebook JavaScript SDK to determine the user ID of the active
    user. See http://developers.facebook.com/docs/authentication/ for
    more information.
    """
    @property
    def current_user(self):
        #===== Google Auth
        user = users.get_current_user()
        if user:
            dbUser = User.byId(user.user_id())
            if dbUser:
                return dbUser
            else:
                
                dbUser = User()
                dbUser.id = user.user_id()
                dbUser.name = user.nickname()
                dbUser.email = user.email().lower()
                dbUser.put()
                return dbUser

        #===== FACEBOOK Auth
        if self.session.get("user"):
            # User is logged in
            return User.byId(self.session.get("user")["id"])
        else:
            # Either used just logged in or just saw the first page
            # We'll see here
            fbcookie = facebook.get_user_from_cookie(self.request.cookies,
                                                   FACEBOOK_APP_ID,
                                                   FACEBOOK_APP_SECRET)
            if fbcookie:
                # Okay so user logged in.
                # Now, check to see if existing user
                user = User.byId(fbcookie["uid"])
                if not user:
                    # Not an existing user so get user info
                    graph = facebook.GraphAPI(fbcookie["access_token"])
                    profile = graph.get_object("me")
                    user = User(
                        key_name=str(profile["id"]),
                        id=str(profile["id"]),
                        name=profile["name"],
                        profile_url=profile["link"],
                        access_token=fbcookie["access_token"]
                    )
                    user.put()
                elif user.access_token != fbcookie["access_token"]:
                    user.access_token = fbcookie["access_token"]
                    user.put()
                # User is now logged in
                self.session["user"] = dict(
                    name=user.name,
                    profile_url=user.profile_url,
                    id=user.id,
                    access_token=user.access_token
                )
                return user
        #======== use session cookie user
        anonymous_cookie = self.request.cookies.get('wsuser', None)
        if anonymous_cookie is None:
            cookie_value = utils.random_string()
            self.response.set_cookie('wsuser', cookie_value, max_age = 15724800)
            anon_user = User()
            anon_user.cookie_user=1
            anon_user.id = cookie_value
            anon_user.put()
            return anon_user
        else:
            anon_user = User.byId(anonymous_cookie)
            if anon_user:
                return anon_user
            cookie_value = utils.random_string()
            self.response.set_cookie('wsuser', cookie_value, max_age = 15724800)
            anon_user = User()
            anon_user.cookie_user=1
            anon_user.id = cookie_value
            anon_user.put()
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
        except:
            pass
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


    def getRandomGameUrl(self, user):
        '''
        todo implement user played/notplayed
        '''
        titles = Game.getAllTitles()
        choice = random.choice(titles)
        return '/game/'+choice
    
    def render(self, view_name, extraParams = {}):

        # achievements = Acheivement.all().filter("user = ?", self.current_user["id"]).fetch(len(ACHEIVEMENTS))
        # if len(achievements) == 0:
        #     achievements = Acheivement.all().filter("cookie_user = ?", self.current_user["id"]).fetch(len(ACHEIVEMENTS))
        currentUser = self.current_user
        try:
            random_game_url = self.getRandomGameUrl(currentUser)
            template_values = {
                'ws': ws,
                'facebook_app_id': FACEBOOK_APP_ID,
                'current_user': currentUser,
                # 'achievements': achievements,
                # 'UNLOCKED_MEDIUM':UNLOCKED_MEDIUM,
                # 'UNLOCKED_HARD':UNLOCKED_HARD,
                # 'MEDIUM':MEDIUM,
                # 'EASY':EASY,
                # 'HARD':HARD,
                # 'highscores':highscores,
                'glogin_url': users.create_login_url(self.request.uri),
                'glogout_url': users.create_logout_url(self.request.uri),
                'awgutils': awgutils,
                'url': self.request.uri,
                'random_game_url': random_game_url
            }
            template_values.update(extraParams)

            template = JINJA_ENVIRONMENT.get_template(view_name)
            self.response.write(template.render(template_values))
        except Exception, err:
            logging.error(Exception)
            logging.error(err)
            import traceback
            traceback.print_exc()
            self.response.write(err)
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
        userscore.put()
        HighScore.updateHighScoreFor(self.current_user, userscore.score, userscore.difficulty, userscore.timedMode)

        self.response.out.write('success')
class AchievementsHandler(BaseHandler):
    def get(self):
        acheive = Achievement()
        acheive.type = int(self.request.get('achievement'))
        if acheive.type not in ACHEIVEMENTS:
            raise Exception("unknown achievement: " + acheive.type)
        if self.current_user:

            acheive.user = self.current_user.key
        acheive.put()
        #graph = facebook.GraphAPI(self.current_user['access_token'])
        self.response.out.write('success')

class MainHandler(BaseHandler):
    def get(self):
        curs = Cursor(urlsafe=self.request.get('cursor'))
        games, next_curs, more = Game.query().fetch_page(40, start_cursor=curs)

        if more and next_curs:
            next_page_cursor = next_curs.urlsafe()
        else:
            next_page_cursor = None
        extraParams = {'games': games,
                       'next_page_cursor': next_page_cursor}
        self.render('index.html', extraParams)
        
    def post(self):
        self.render('index.html')

class FbHandler(BaseHandler):
    def get(self):
        self.render('facebook.html')

    def post(self):
        self.render('facebook.html')

class ContactHandler(BaseHandler):
    def get(self):
        self.render('contact.html')

    def post(self):
        self.render('contact.html')

class AboutHandler(BaseHandler):
    def get(self):
        self.render('about.html')

    def post(self):
        self.render('about.html')

class PrivacyHandler(BaseHandler):
    def get(self):
        self.render('privacy-policy.html')

    def post(self):
        self.render('privacy-policy.html')

class TermsHandler(BaseHandler):
    def get(self):
        self.render('terms.html')

    def post(self):
        self.render('terms.html')
class SitemapHandler(webapp2.RequestHandler):
    def get(self):
        titles = Game.getAllTitles()
        self.response.headers['Content-Type'] = 'text/xml'
        template = JINJA_ENVIRONMENT.get_template("sitemap.xml")
        self.response.write(template.render({'titles': titles}))

class LoadGamesHandler(BaseHandler):
    def get(self):
        try:
            urltitle = self.request.get('title')
            curs = Cursor(urlsafe=self.request.get('cursor'))
            if urltitle:
                
                games, next_curs, more = Game.randomOrder(urltitle).fetch_page(40, start_cursor=curs)
            else:
                games, next_curs, more = Game.query().fetch_page(40, start_cursor=curs)
                
            if more and next_curs:
                next_page_cursor = next_curs.urlsafe()
            else:
                next_page_cursor = None
            extraParams = {'games': games,
                           'next_page_cursor': next_page_cursor}
        except Exception, err:
            logging.error(Exception)
            logging.error(err)
            import traceback
            traceback.print_exc()
            self.response.write(err)
        self.render('loadgames.html', extraParams)


class GameHandler(BaseHandler):
    def get(self, urltitle):
        game = Game.oneByUrlTitle(urltitle)
        curs = Cursor(urlsafe=self.request.get('cursor'))
        games, next_curs, more = Game.randomOrder(urltitle).fetch_page(40, start_cursor=curs)

        if more and next_curs:
            next_page_cursor = next_curs.urlsafe()
        else:
            next_page_cursor = None
        extraParams = {'game': game,
                       'games': games,
                       'next_page_cursor': next_page_cursor,
                       'urltitle': urltitle}
        self.render('game.html', extraParams)

    def post(self, title):
        self.render('game.html')

class TagHandler(BaseHandler):
    def get(self, tag):
        curs = Cursor(urlsafe=self.request.get('cursor'))
        games, next_curs, more = Game.byTag(tag).fetch_page(40, start_cursor=curs)

        if more and next_curs:
            next_page_cursor = next_curs.urlsafe()
        else:
            next_page_cursor = None
        logging.error("asdf")
        extraParams = {
                       'games': games,
                       'next_page_cursor': next_page_cursor,
                       'tag': tag,
                       'tagtitle': awgutils.titleDecode(tag),
                       }
        self.render('templates/tag.html', extraParams)

class LogoutHandler(BaseHandler):
    def get(self):
        if self.current_user is not None:
            self.session['user'] = None

        self.redirect('/')

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


app = ndb.toplevel(webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/scores', ScoresHandler),
    ('/achievements', AchievementsHandler),
    ('/logout', LogoutHandler),
    ('/privacy-policy', PrivacyHandler),
    ('/terms', TermsHandler),
    ('/facebook', FbHandler),
    ('/about', AboutHandler),
    ('/contact', ContactHandler),
    ('/game/(.*)', GameHandler),
    ('/games/(.*)', TagHandler),
    ('/gomochi', MochiGamesCrawler),
    ('/loadgames', LoadGamesHandler),
    ('/sitemap', SitemapHandler),


], debug=ws.debug, config=config))
