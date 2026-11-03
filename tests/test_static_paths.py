import webapp2

import seo_pages


def test_safe_static_path_allows_static_file():
    assert seo_pages.safe_static_path('ads.txt').endswith('/static/ads.txt')


def test_safe_static_path_rejects_traversal():
    for p in ['../main.py', '../../etc/passwd', '/etc/passwd', 'css/../../main.py', 'a\\..\\main.py', 'ads.txt\0', '', '.env']:
        assert seo_pages.safe_static_path(p) is None


def test_static_handler_rejects_traversal():
    app = webapp2.WSGIApplication([('/s/(.*)', seo_pages.SafeStaticHandler)])
    assert app.get_response('/s/ads.txt').status_int == 200
    for p in ['../main.py', '/etc/passwd', '%2e%2e/main.py']:
        req = webapp2.Request.blank('/')
        req.path_info = '/s/' + p
        assert req.get_response(app).status_int == 404
