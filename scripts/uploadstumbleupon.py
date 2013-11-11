from splinter import Browser
import sys
import random
import string
import time

class UploadSU(object):
	urls = [
	    "http://www.addictingwordgames.com",
	    "http://www.addictingwordgames.com/games/1-word-10-tries",
	]
	tags = [
		"word games",
		"bejewelled",
		"sudoku",
		"chess",
		"puzzles",
		"word puzzles",
		"games",
		"fun",
		"free games",
		"word puzzles",
		"puzzle games",
		"addicting games",
		"addicting word games",
		"word search",
		"word finder",
		"online games",
		"free games",
		"language games",
		"learn english",
		"english games",
		"online puzzles",
		"wordament",
		"scrabble",
		"video games",
		"casual games",
		"xbox games",
		"ps4 games",
		"games games",
		"miniclip",
		"spil games",
		"fruit ninja",
		"brain training games",
		"puzzle games",
		"fun word games",
		"fun puzzle games",
		"fun free puzzles",
		"fun free games",
		"fun free word games",
		"funny games",
	]
	def getTags(self):
		'''
		returns a random combination of tags
		'''
		numInSample = random.randint(4, len(self.tags) - 2)
		sample = random.sample(self.tags, numInSample)
		return string.join(sample, ", ")
	def main(self):
		browser = Browser()

		username = sys.argv[1]
		password = sys.argv[2]

		browser.visit('https://www.stumbleupon.com/login')
		browser.fill('user', username)
		browser.fill('pass', password)
		browser.find_by_id('login').click()
		# if browser.is_text_present("Sign in to StumbleUpon"):
		# 	browser.fill('user', username)
		# 	browser.fill('pass', password)
		# 	browser.find_by_id('login').click()
		# import time
		time.sleep(1)

		for url in self.urls:

			browser.visit('https://www.stumbleupon.com/submit')
			browser.fill('url', url)
			browser.find_by_id('safe').click()
			# browser.select("tags", "Online Games")
			browser.find_by_xpath('//select[@name="tags"]/option[@name="Online Games"]').first.click()
			browser.fill('user-tags', self.getTags())
			browser.find_by_css('button[type="submit"]').first.click()

		# if browser.is_text_present('splinter.cobrateam.info'):
		#     print "Yes, the official website was found!"
		# else:
		#     print "No, it wasn't found... We need to improve our SEO techniques"
		time.sleep(7)
		browser.quit()

# print UploadSU().getTags()
UploadSU().main()
