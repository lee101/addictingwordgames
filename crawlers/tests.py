import unittest
from google.appengine.ext import testbed
from google.appengine.ext import ndb
from crawlers import *


class CrawlerTests(unittest.TestCase):
    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()
        self.testbed.init_taskqueue_stub()
        self.taskqueue_stub = self.testbed.get_stub(testbed.TASKQUEUE_SERVICE_NAME)

    def tearDown(self):
        self.testbed.deactivate()

    def testWordGamesCrawler(self):
        word_games_crawler = WordGamesCrawler()
        word_games_crawler.seen_pages_limit = 20
        word_games_crawler.go()
        # Get the task out of the queue
        tasks = self.taskqueue_stub.get_filtered_tasks()
        # Run the task
        task = tasks[0]
        deferred.run(task.payload)
        
        