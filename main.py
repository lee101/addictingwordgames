#!/usr/bin/env python
import json
from copy import deepcopy
from random import choice

import jinja2
import stripe
# from google.appengine.datastore.datastore_query import Cursor

from webapp2_extras import sessions

import awgutils
import flash_library
# from sellerinfo import SELLER_ID
# from sellerinfo import SELLER_SECRET
import sellerinfo
import utils
import flash_services
from sqlite_models import SQLiteDB
import webapp2
import os
# from crawlers.crawlers import *
import urllib.parse
# from crawlers.crawlers import *
from loguru import logger
import ws
from awg.itch.all_games import all_games
from gameon_utils import GameOnUtils
# Try to import GCP models, fall back to stubs for self-hosted
try:
    from models import DIFFICULTIES, Score, HighScore, Achievement, ACHEIVEMENTS, Game, get_cursor_and_games, User, \
        get_rand_order_page, get_cursor_and_random_games, get_games_by_tag_cursor
except (ImportError, TypeError):
    logger.warning("GCP models not available, using stubs (self-hosted mode)")
    from models_stub import DIFFICULTIES, Score, HighScore, Achievement, ACHEIVEMENTS, Game, get_cursor_and_games, User, \
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

# Force debug mode for local development - set to False for production
LOCAL_DEBUG = os.environ.get('LOCAL_DEBUG', 'true').lower() == 'true'

# Use R2 bucket for static assets in production, local for CSS/JS in dev
if LOCAL_DEBUG or GameOnUtils.debug:
    # For development, use local for CSS/JS but R2 for images
    GCLOUD_STATIC_BUCKET_URL = "/static"
    stripe_keys = {
        'secret_key': sellerinfo.STRIPE_TEST_SECRET,
        'publishable_key': sellerinfo.STRIPE_TEST_KEY
    }
else:
    GCLOUD_STATIC_BUCKET_URL = "https://addictingwordgamesstatic.addictingwordgames.com/static"
    stripe_keys = {
        'secret_key': sellerinfo.STRIPE_LIVE_SECRET,
        'publishable_key': sellerinfo.STRIPE_LIVE_KEY
    }

stripe.api_key = stripe_keys['secret_key']

# Global SQLite database instance for user uploaded games
DB = SQLiteDB()


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

    def require_login(self) -> bool:
        """Redirects to the login page if no authenticated session is present.

        Returns True when the user is logged in, False otherwise.
        """
        if not self.session.get("user"):
            target = urllib.parse.quote(self.request.path_qs)
            self.redirect(f"/login?next={target}")
            return False
        return True

    def getRandomGameUrl(self):
        '''
        todo implement user played/notplayed
        '''
        if LOCAL_DEBUG or GameOnUtils.debug:
            titles = [game.get('urltitle') for game in flat_games if game.get('urltitle')]
            if not titles:
                return '/'
            return '/play-game/' + choice(titles)
        try:
            titles = Game.getAllTitles()
        except Exception as err:
            logger.warning(f"Unable to load random game titles: {err}")
            return '/'
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


class ApiHandler(BaseHandler):
    def render_json(self, payload, status=200):
        self.response.status = status
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(payload, cls=GameOnUtils.MyEncoder))

    def render_error(self, status, message, extra=None):
        error_payload = {'error': {'code': status, 'message': message}}
        if extra:
            error_payload['error'].update(extra)
        self.render_json(error_payload, status=status)


class FlashSearchHandler(ApiHandler):
    def get(self):
        query = self.request.get('q', '').strip()
        if not query:
            self.render_error(400, "Missing required parameter 'q'.")
            return

        try:
            page_size = self._parse_page_size(self.request.get('page_size'))
        except ValueError as err:
            self.render_error(400, str(err))
            return

        tags = self._parse_tags()
        page_token = self.request.get('page_token') or None

        try:
            results = flash_services.flash_search_service.search(
                query=query,
                page_size=page_size,
                page_token=page_token,
                tags=tags or None,
            )
        except flash_services.InvalidPageTokenError as err:
            self.render_error(400, str(err))
            return
        except flash_services.InvalidSearchRequest as err:
            self.render_error(400, str(err))
            return

        results['page_size'] = page_size
        self.render_json(results)

    def _parse_page_size(self, raw_value):
        if raw_value in (None, ''):
            return flash_services.FlashSearchService.DEFAULT_PAGE_SIZE
        try:
            size = int(raw_value)
        except (TypeError, ValueError):
            raise ValueError(
                f"page_size must be an integer between 1 and {flash_services.FlashSearchService.MAX_PAGE_SIZE}."
            )
        if size < 1 or size > flash_services.FlashSearchService.MAX_PAGE_SIZE:
            raise ValueError(
                f"page_size must be between 1 and {flash_services.FlashSearchService.MAX_PAGE_SIZE}."
            )
        return size

    def _parse_tags(self):
        tags = [tag for tag in self.request.get_all('tag') if tag]
        if tags:
            return tags
        csv_tags = self.request.get('tags', '')
        if not csv_tags:
            return []
        return [item.strip() for item in csv_tags.split(',') if item.strip()]


class FlashMetadataHandler(ApiHandler):
    def get(self, game_id):
        if not game_id:
            self.render_error(400, "Flash game id is required.")
            return

        game = flash_services.flash_repository.get(game_id)
        if (
            not game
            or not game.is_active
            or not flash_services.is_flash_storage_path(game.storage_path)
        ):
            self.render_error(404, f"Flash game '{game_id}' was not found.")
            return

        payload = game.to_metadata_dict()
        payload['stream_endpoint'] = f"/api/flash/{game_id}/stream"
        self.render_json(payload)


class FlashApiStreamHandler(ApiHandler):
    AUTH_HEADER = 'X-Flash-Token'

    def get(self, game_id):
        if not game_id:
            self.render_error(400, "Flash game id is required.")
            return

        if not self._is_authorized():
            return

        rate_key = self._rate_limit_key()
        allowed, retry_after = flash_services.stream_rate_limiter.check(rate_key)
        if not allowed:
            self.response.headers['Retry-After'] = str(max(retry_after, 0))
            self.render_error(429, "Stream rate limit exceeded.", extra={'retry_after': retry_after})
            return

        try:
            payload = flash_services.flash_stream_service.get_stream_payload(game_id)
        except flash_services.FlashGameNotFoundError as err:
            self.render_error(404, str(err))
            return

        self.render_json(payload)

    def _is_authorized(self):
        expected_token = os.environ.get('FLASH_STREAM_AUTH_TOKEN', 'development-token')
        if not expected_token:
            return True
        provided = self.request.headers.get(self.AUTH_HEADER) or self.request.get('token')
        if provided != expected_token:
            self.render_error(401, "Missing or invalid stream authorization token.")
            return False
        return True

    def _rate_limit_key(self):
        forwarded = self.request.headers.get('X-Forwarded-For')
        if forwarded:
            return forwarded.split(',')[0].strip()
        return self.request.remote_addr or 'unknown'


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
        # games, next_page_cursor = get_cursor_and_games(cursor)
        # pop all original games: we don't want to show them again
        flat_games_new = [game for game in flat_games if game['urltitle'] not in original_games]
        extraParams = {'games': flat_games_new,
                       # 'next_page_cursor': str(next_page_cursor.decode("utf-8"))
                       }
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


class InfiniteWordleHandler(BaseHandler):
    def get(self):
        self.render('/templates/infinite_wordle.jinja2')


class TypingGameHandler(BaseHandler):
    def get(self):
        self.render('/templates/typing-game.jinja2')


class TypingTowerDefenseHandler(BaseHandler):
    def get(self):
        self.render('/templates/typing-tower-defense.jinja2')


class WordPhzzleHandler(BaseHandler):
    def get(self):
        self.render('/static/word-phzzle/index.html')


class WordJumbleHandler(BaseHandler):
    def get(self):
        self.render('/static/word-jumble/index.html')


class CrossWordHandler(BaseHandler):
    def get(self):
        self.render('/templates/cross-word.jinja2')


class WordSearchHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template("/static/word-search/index.html")
        self.response.write(template.render())


class GravityWordsHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template("/static/gravity-words/index.html")
        self.response.write(template.render())


class TypingRaceHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template("/static/typing-race/index.html")
        self.response.write(template.render())


class WordReactorHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template("/static/word-reactor/index.html")
        self.response.write(template.render())


class WordDetectiveHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template("/static/word-detective/index.html")
        self.response.write(template.render())


class SpeedSpellerHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template("/static/speed-speller/index.html")
        self.response.write(template.render())


class WordDuelHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template("/static/word-duel/index.html")
        self.response.write(template.render())


class WordEvolutionHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template("/static/word-evolution/index.html")
        self.response.write(template.render())


class SyllableShuffleHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template("/static/syllable-shuffle/index.html")
        self.response.write(template.render())


class SitemapHandler(webapp2.RequestHandler):
    def get(self):
        titles = list(games.keys())
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
        # games, next_page_cursor = get_cursor_and_random_games(current_cursor, urltitle)
        extraParams = {'game': game,
                       'games': flat_games,
                       # 'next_page_cursor': str(next_page_cursor.decode("utf-8")),
                       'urltitle': urltitle}
        self.render('/templates/game.jinja2', extraParams)


games = {
    'wordsmashing': {
        'title': 'Word Smashing',
        'image': 'https://static.addictingwordgames.com/static/img/word-smashing-logo.png',
        'image_url': 'https://static.addictingwordgames.com/static/img/word-smashing-logo.png',
        'url': 'wordsmashing.com'
    },
    'multiplication-master': {
        'title': 'Multiplication Master',
        'image': 'https://static.addictingwordgames.com/static/img/multiplication-master-promo-256.png',
        'image_url': 'https://static.addictingwordgames.com/static/img/multiplication-master-promo-256.png',
        'url': 'www.multiplicationmaster.com'
    },
    'reword-game': {
        'title': 'ReWord Game',
        'image': 'https://static.addictingwordgames.com/static/img/reword-game-logo256.png',
        'image_url': 'https://static.addictingwordgames.com/static/img/reword-game-logo256.png',
        'url': 'rewordgame.com'
    },
    'big-multiplayer-chess': {
        'title': 'Big Multiplayer Chess',
        'image': 'https://static.addictingwordgames.com/static/img/big-multiplayer-chess-logo256.png',
        'image_url': 'https://static.addictingwordgames.com/static/img/big-multiplayer-chess-logo256.png',
        'url': 'bigmultiplayerchess.com'
    },
    # '20-questions-with-ai': {
    #     'title': '20 Questions with AI',
    #     'image_url': '/static/img/text-generator-brain-logo.png',
    #     'url': 'textgenerator.app.nz/questions-game'
    # },
    'reading-time': {
        'title': 'Reading Time',
        'image': 'https://static.addictingwordgames.com/static/img/reading-time-icon256.png',
        'image_url': 'https://static.addictingwordgames.com/static/img/reading-time-icon256.png',
        'url': 'readingtime.app.nz'
    },
    'joy-drop': {
        'title': 'Joy Drop',
        'image': 'https://static.addictingwordgames.com/static/img/joydrop-sun-logo256.png',
        'image_url': 'https://static.addictingwordgames.com/static/img/joydrop-sun-logo256.png',
        'url': 'joydrop.app.nz'
    },
    'netwrck': {
        'title': 'Netwrck',
        'image': 'https://static.addictingwordgames.com/static/img/netwrck-logo-colord256.png',
        'image_url': 'https://static.addictingwordgames.com/static/img/netwrck-logo-colord256.png',
        'url': 'netwrck.com'
    },
}
original_games = deepcopy(games)
games.update(all_games)
flat_games = []
for game in games:
    flat_games.append(games[game] | {'urltitle': game})
class PlayGameHandler(BaseHandler):
    def get(self, urltitle):
        game = games.get(urltitle)

        extraParams = {'game': game,
                       'urltitle': urltitle}
        self.render('/templates/play-game.jinja2', extraParams)


class TagHandler(BaseHandler):
    def get(self, tag):
        curent_cursor = self.request.get('cursor')
        # games, next_page_cursor = get_games_by_tag_cursor(curent_cursor, tag)
        extraParams = {
            'games': flat_games,
            # 'next_page_cursor': next_page_cursor,
            'tag': tag,
            'tagtitle': awgutils.titleDecode(tag),
        }
        self.render('/templates/tag.jinja2', extraParams)


def _dedupe_preserve_order(values):
    seen = set()
    ordered = []
    for value in values:
        if value is None:
            continue
        cleaned = str(value).strip()
        if not cleaned:
            continue
        key = cleaned.lower()
        if key in seen:
            continue
        seen.add(key)
        ordered.append(cleaned)
    return ordered


def _format_flash_result(game_dict):
    formatted = dict(game_dict)
    formatted['play_url'] = f"/flash-library/play/{formatted['id']}"
    formatted['stream_url'] = f"/flash/stream/{formatted['id']}"
    return formatted


class FlashLibraryPageHandler(BaseHandler):
    def get(self):
        query = self.request.get('q', '').strip()
        tags_param = self.request.get('tags', '').strip()
        raw_tags = []
        if tags_param:
            raw_tags.extend(tags_param.split(','))
        else:
            raw_tags.extend(self.request.get_all('tag'))
        tags = _dedupe_preserve_order(raw_tags)
        source = self.request.get('source', '').strip()
        try:
            page = int(self.request.get('page', '1') or 1)
        except ValueError:
            page = 1

        search_result = flash_library.search_games(query=query, tags=tags, source=source, page=page)
        formatted_results = [_format_flash_result(game) for game in search_result['results']]

        available_tags = flash_library.list_tags()
        available_sources = flash_library.list_sources()

        initial_state = {
            'filters': {
                'query': query,
                'tags': tags,
                'source': source,
                'page': search_result['page'],
                'pageSize': search_result['page_size'],
            },
            'results': formatted_results,
            'pagination': {
                'page': search_result['page'],
                'pages': search_result['pages'],
                'total': search_result['total'],
                'page_size': search_result['page_size'],
            },
            'availableTags': available_tags,
            'availableSources': available_sources,
        }

        template_params = {
            'available_tags': available_tags,
            'available_sources': available_sources,
            'initial_filters': {
                'query': query,
                'tags': tags,
                'source': source,
            },
            'initial_results': formatted_results,
            'initial_pagination': {
                'page': search_result['page'],
                'pages': search_result['pages'],
                'total': search_result['total'],
            },
            'initial_state': json.dumps(initial_state),
        }
        self.render('/templates/flash/library.jinja2', template_params)


class FlashLibrarySearchHandler(BaseHandler):
    def get(self):
        query = self.request.get('q', '').strip()
        tags_param = self.request.get('tags', '').strip()
        tags = _dedupe_preserve_order(tags_param.split(',')) if tags_param else []
        source = self.request.get('source', '').strip()
        try:
            page = int(self.request.get('page', '1') or 1)
        except ValueError:
            page = 1

        search_result = flash_library.search_games(query=query, tags=tags, source=source, page=page)
        formatted_results = [_format_flash_result(game) for game in search_result['results']]
        payload = {
            'results': formatted_results,
            'filters': {
                'query': query,
                'tags': tags,
                'source': source,
                'page': search_result['page'],
                'pageSize': search_result['page_size'],
            },
            'pagination': {
                'page': search_result['page'],
                'pages': search_result['pages'],
                'total': search_result['total'],
                'page_size': search_result['page_size'],
            },
            'availableTags': flash_library.list_tags(),
            'availableSources': flash_library.list_sources(),
        }
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(payload))


class FlashPlayerPageHandler(BaseHandler):
    def get(self, game_id):
        playback_context = flash_library.build_playback_context(game_id)
        if not playback_context:
            self.abort(404)
        game = playback_context['game']
        player_state = {
            'streamUrl': playback_context['stream_url'],
            'aspectRatio': playback_context['aspect_ratio'],
            'actionscripts': playback_context['actionscripts'],
            'width': game.get('width'),
            'height': game.get('height'),
        }
        template_params = {
            'game': game,
            'stream_url': playback_context['stream_url'],
            'actionscripts': playback_context['actionscripts'],
            'player_state': json.dumps(player_state),
        }
        self.render('/templates/flash/player.jinja2', template_params)


class FlashLibraryStreamHandler(webapp2.RequestHandler):
    def get(self, game_id):
        game = flash_library.get_game(game_id)
        if not game:
            self.abort(404)
        stream_path = game.get('stream_path')
        if not stream_path:
            self.abort(404)
        stream_path = str(stream_path)
        if stream_path.startswith('http://') or stream_path.startswith('https://'):
            self.redirect(stream_path)
            return
        if not flash_services.is_flash_storage_path(stream_path):
            self.abort(404)
        filename = os.path.basename(stream_path)
        static_path = os.path.join(os.path.dirname(__file__), 'static', 'flash', filename)
        if not os.path.exists(static_path):
            self.abort(404)
        self.response.headers['Content-Type'] = 'application/x-shockwave-flash'
        self.response.headers['Cache-Control'] = 'public, max-age=3600'
        with open(static_path, 'rb') as stream_handle:
            self.response.body = stream_handle.read()


class UploadUserGameHandler(BaseHandler):
    def get(self):
        if not self.require_login():
            return
        self.render('/templates/user_games/upload-user-game.jinja2', {})

    def post(self):
        if not self.require_login():
            return
        title = self.request.get('title')
        url = self.request.get('url')
        frame = self.request.get('frame')
        width = int(self.request.get('width', 800))
        height = int(self.request.get('height', 600))
        # Simple honeypot check: bots filling the hidden field are ignored
        if self.request.get('hp'):
            self.abort(400)
        DB.insert_user_game(self.current_user.id, title, url, frame, width, height)
        self.redirect('/my-games')


class MyGamesHandler(BaseHandler):
    def get(self):
        if not self.require_login():
            return
        rows = DB.list_user_games(self.current_user.id)
        games_list = [
            {
                'id': r[0],
                'user_id': r[1],
                'title': r[2],
                'url': r[3],
                'frame': r[4],
                'width': r[5],
                'height': r[6],
                'created_at': r[7],
            }
            for r in rows
        ]
        self.render('/templates/user_games/my-games.jinja2', {'games': games_list})


class UserGamesHandler(BaseHandler):
    def get(self):
        rows = DB.list_user_games()
        games_list = [
            {
                'id': r[0],
                'user_id': r[1],
                'title': r[2],
                'url': r[3],
                'frame': r[4],
                'width': r[5],
                'height': r[6],
                'created_at': r[7],
            }
            for r in rows
        ]
        self.render('/templates/user_games/all-games.jinja2', {'games': games_list})


class PlayUploadedGameHandler(BaseHandler):
    def get(self, game_id):
        row = DB.fetch_user_game(int(game_id))
        if not row:
            self.abort(404)
        game = {
            'id': row[0],
            'user_id': row[1],
            'title': row[2],
            'url': row[3],
            'frame': row[4],
            'width': row[5],
            'height': row[6],
            'created_at': row[7],
        }
        self.render('/templates/user_games/play-user-game.jinja2', {'game': game})


class EditUserGameHandler(BaseHandler):
    def get(self, game_id):
        if not self.require_login():
            return
        row = DB.fetch_user_game(int(game_id))
        if not row or row[1] != self.current_user.id:
            self.abort(404)
        game = {
            'id': row[0],
            'user_id': row[1],
            'title': row[2],
            'url': row[3],
            'frame': row[4],
            'width': row[5],
            'height': row[6],
            'created_at': row[7],
        }
        self.render('/templates/user_games/edit-user-game.jinja2', {'game': game})

    def post(self, game_id):
        if not self.require_login():
            return
        frame = self.request.get('frame')
        width = int(self.request.get('width', 800))
        height = int(self.request.get('height', 600))
        title = self.request.get('title')
        url = self.request.get('url')
        DB.update_user_game(int(game_id), frame, width, height, title, url)
        self.redirect('/my-games')


class DeleteUserGameHandler(BaseHandler):
    def get(self, game_id):
        if not self.require_login():
            return
        row = DB.fetch_user_game(int(game_id))
        if row and row[1] == self.current_user.id:
            DB.delete_user_game(int(game_id))
        self.redirect('/my-games')


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

# Static file handler for local development
class StaticFileHandler(webapp2.RequestHandler):
    def get(self, path):
        import mimetypes
        static_path = os.path.join(os.path.dirname(__file__), 'static', path)
        logger.info(f"Serving static file: {static_path}")
        if os.path.exists(static_path) and os.path.isfile(static_path):
            content_type, _ = mimetypes.guess_type(static_path)
            if content_type:
                self.response.headers['Content-Type'] = content_type
            else:
                # Default content type for unknown files
                self.response.headers['Content-Type'] = 'application/octet-stream'
            
            # Read and serve the file in binary mode
            with open(static_path, 'rb') as f:
                file_data = f.read()
                # For binary data, we need to write directly to the response body
                # Set the response body directly instead of using write()
                self.response.body = file_data
        else:
            logger.warning(f"Static file not found: {static_path}")
            self.error(404)

routes = [
    ('/', MainHandler),
    ('/flash-library', FlashLibraryPageHandler),
    ('/flash-library/play/(.*)', FlashPlayerPageHandler),
    ('/api/flash-library', FlashLibrarySearchHandler),
    ('/flash/stream/(.*)', FlashLibraryStreamHandler),
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
    ('/wordle', InfiniteWordleHandler),
    ('/typing-game', TypingGameHandler),
    ('/typing-tower-defense', TypingTowerDefenseHandler),
    ('/word-phzzle', WordPhzzleHandler),
    ('/word-jumble', WordJumbleHandler),
    ('/cross-word', CrossWordHandler),
    ('/word-search', WordSearchHandler),
    ('/gravity-words', GravityWordsHandler),
    ('/typing-race', TypingRaceHandler),
    ('/word-reactor', WordReactorHandler),
    ('/word-detective', WordDetectiveHandler),
    ('/speed-speller', SpeedSpellerHandler),
    ('/word-duel', WordDuelHandler),
    ('/word-evolution', WordEvolutionHandler),
    ('/syllable-shuffle', SyllableShuffleHandler),
    ('/game/(.*)', GameHandler),
    ('/play-game/(.*)', PlayGameHandler),
    ('/games/(.*)', TagHandler),
    ('/upload-user-game', UploadUserGameHandler),
    ('/my-games', MyGamesHandler),
    ('/user-games', UserGamesHandler),
    ('/play-user-game/(\d+)', PlayUploadedGameHandler),
    ('/edit-user-game/(\d+)', EditUserGameHandler),
    ('/delete-user-game/(\d+)', DeleteUserGameHandler),
    (r'/api/flash/search', FlashSearchHandler),
    (r'/api/flash/([^/]+)/stream', FlashApiStreamHandler),
    (r'/api/flash/([^/]+)', FlashMetadataHandler),
    ('/api/create-user', CreateUserHandler),
    ('/api/get-user', GetUserHandler),
    ('/api/buy', ChargeForBuyHandler),
    # ('/gomochi', MochiGamesCrawler),
    ('/loadgames', LoadGamesHandler),
    ('/sitemap.xml', SitemapHandler),
]

# Add static file handler for local development
if LOCAL_DEBUG or GameOnUtils.debug:
    logger.info("Debug mode enabled - adding static file handler")
    routes.insert(0, ('/static/(.*)', StaticFileHandler))
else:
    logger.info("Production mode - static files served from CDN")

app = webapp2.WSGIApplication(routes, debug=ws.debug, config=config)
