import webapp2
from google.appengine.api import urlfetch

from google.appengine.api import images
from google.appengine.ext import deferred
from google.appengine.runtime import DeadlineExceededError

import urllib2

import json
import logging

from Models import *
import awgutils
from bs4 import BeautifulSoup

from ws import ws

import cloudstorage as gcs


# Retry can help overcome transient urlfetch or GCS issues, such as timeouts.
my_default_retry_params = gcs.RetryParams(initial_delay=0.2,
                                          max_delay=5.0,
                                          backoff_factor=2,
                                          max_retry_period=15)
# All requests to GCS using the GCS client within current GAE request and
# current thread will use this retry params as default. If a default is not
# set via this mechanism, the library's built-in default will be used.
# Any GCS client function can also be given a more specific retry params
# that overrides the default.
# Note: the built-in default is good enough for most cases. We override
# retry_params here only for demo purposes.
gcs.set_default_retry_params(my_default_retry_params)

IMG_BUCKET = '/wordgames/'
WORD_GAMES_SWF_BUCKET = '/games.addictingwordgames.com/'


class Crawler(webapp2.RequestHandler):

    def create_callback(self, callback, rpc):
        def f():
            try:
                callback(rpc.get_result())
            except Exception, err:
                logging.error(Exception)
                logging.error(err)
                
        return f

    def getUrl(self, url, callback):
        try:
            rpc = urlfetch.create_rpc()
            rpc.callback = self.create_callback(callback, rpc)
            urlfetch.make_fetch_call(rpc, url)
        except Exception, err:
            logging.error(Exception)
            logging.error(err)

    def process(self, soup, url):
        '''
        called for each page
        '''
        raise NotImplementedError("Implement this method")

    seen = set()
    seen_pages_limit = 500
    def bfs(self, current_url):
        '''
        calls process for each page in the site
        '''

        try:
            result = urlfetch.fetch(current_url)

            while result.status_code == 200:
                soup = BeautifulSoup(result.content)

                if self.isItem(soup, current_url):
                    self.process(soup, current_url)

                self.seen.add(current_url)
                #find new links
                for link in soup.find_all('a'):
                    new_url = link.get('href')
                    #todo improve performance with custom url exclusions
                    if new_url not in self.seen and len(self.seen) < self.seen_pages_limit:
                        deferred.defer(self.bfs, new_url)

        except Exception, err:
            print Exception, err

    def go(self):
        deferred.defer(self.bfs, self.site_url)

    def getDescription(self, soup):
        try:
            description = soup.find('meta', attrs={'property' : "og:description"}).get('content')
        except Exception, err:
            pass   
        if not description:
            description = soup.find('meta', attrs={'name' : "description"}).get('content')
        return description

    def getImage(self, soup):
        try:
            image_url = soup.find('meta', attrs={'property' : "og:image"}).get('content')
        except Exception, err:
            pass   
        if not image_url:
            image_url = soup.find('img').get('src')

        # if image_url:
        #     #TODO save image
        # return image
    

    def getTitle(self, soup):
        return soup.title.name


class MochiGamesCrawler(Crawler):
    '''
    does everything manually doesnt do much using crawler
    '''
    def get(self):
        # deferred.defer(self.go)
        self.go()

    def go(self):
        url = "http://feedmonger.mochimedia.com/feeds/query/?q=search%3Aword&partner_id=1e74098ab3d64da0&limit=1000"
        #self.getUrl(url, self.callback)
        self.callback(urlfetch.fetch(url))

    def callback(self, result):
        ndb.delete_multi(Game.query().fetch(999999, keys_only=True))
        
        data = json.loads(result.content)
        games = data['games']
        for game in games:
            g = Game()
            g.title = game['name'][:500]
            g.urltitle = awgutils.urlEncode(g.title)
            g.description = game['description']
            g.tags = map(awgutils.urlEncode, game['tags'])
            g.instructions = game['instructions']
            g.width = int(game['width'])
            g.height = int(game['height'])
            ##get image from url
            g.put()
            if not ws.debug:
                deferred.defer(uploadGameThumbTask, game['thumbnail_url'], g.urltitle)
                deferred.defer(uploadGameSWFTask, game['swf_url'], g.urltitle)
         

def getContentType(image):
    if image.format == images.JPEG:
        return 'image/jpeg'
    elif image.format == images.PNG:
        return 'image/png'
    elif image.format == images.BMP:
        return 'image/bmp'
    elif image.format == images.GIF:
        return 'image/gif'

def saveImage(url, title):
    '''
    saves image in cloud storage
    '''
    response = urlfetch.fetch(url)
    if response.status_code == 200:
        image = images.Image(response.content)
        write_retry_params = gcs.RetryParams(backoff_factor=1.1)
        gcs_file = gcs.open(title,
                            'w',
                            content_type=getContentType(image),
                            options={'x-goog-acl': 'public-read'},
                            retry_params=write_retry_params)
        gcs_file.write(response.content)
        gcs_file.close()
        return image.width, image.height
    return (0, 0)

def saveUrl(url, title):
    '''
    saves object at url in cloud storage
    '''
    response = urlfetch.fetch(url)
    if response.status_code == 200:
        write_retry_params = gcs.RetryParams(backoff_factor=1.1)
        if not response.headers['content-type']:
            logging.error('no content-type header returned')
            logging.error(response.headers)
        gcs_file = gcs.open(title,
                            'w',
                            content_type=response.headers['content-type'],
                            options={'x-goog-acl': 'public-read'},
                            retry_params=write_retry_params)
        gcs_file.write(response.content)
        gcs_file.close()

def uploadGameThumbTask(url, title):
    g = Game.oneByUrlTitle(title)
    g.imgwidth, g.imgheight = saveImage(url, IMG_BUCKET + title)
    g.put()

def uploadGameSWFTask(url, title):
    saveUrl(url, WORD_GAMES_SWF_BUCKET + title)
   


