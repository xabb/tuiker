#!/usr/bin/env python
# Run this with
# PYTHONPATH=. DJANGO_SETTINGS_MODULE=testsite.settings testsite/tornado_main.py
# Serves by default at
# http://localhost:8080/hello-tornado and
# http://localhost:8080/hello-django

import os
import sys

from django.conf import settings

import signal
import logging

from tornado.options import options, define, parse_command_line
# import django.core.handlers.wsgi

from django.core.wsgi import get_wsgi_application


import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.wsgi

# define('port', type=int, default=443)
define('host', default='localhost')
define('port', type=int, default=9090)
#define('port', type=int, default=443)


is_closing = False

def signal_handler(signum, frame):
    global is_closing
    logging.info('exiting...')
    is_closing = True

def try_exit(): 
    global is_closing
    if is_closing:
        # clean up here
        tornado.ioloop.IOLoop.instance().stop()
        logging.info('exit success')




def main():


    app_dir = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(os.path.dirname(app_dir))

    # Define static paths
    static_path = os.path.join(app_dir, 'static')

    # define certificate path
#    cert_file = os.path.join(app_dir, '..', '..', 'ssl_certs', 'server.crt')
#    key_file = os.path.join(app_dir, '..', '..', 'ssl_certs', 'server.key')

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tuiker.settings")    

    application = get_wsgi_application()    
    
    wsgi_app = tornado.wsgi.WSGIContainer(application)


    app_settings = {
        "static_path": static_path,
        "debug": settings.DEBUG,
#          "cookie_secret": "61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
#          "login_url": "/login",
#          "xsrf_cookies": True,
    }
    
    tornado_app = tornado.web.Application(
    [
        # Static stuff management
        # Delete on production and change to web server
        
         (r'/(favicon\.ico)', tornado.web.StaticFileHandler, {'path': app_settings['static_path']}),
         (r'/(robots\.txt)', tornado.web.StaticFileHandler, {'path': app_settings['static_path']}),
         (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': static_path}),        
            
        ('.*', tornado.web.FallbackHandler, dict(fallback=wsgi_app)),
        
      ], **app_settings)


    server = tornado.httpserver.HTTPServer(tornado_app)

#     server = tornado.httpserver.HTTPServer(tornado_app, ssl_options={
#         "certfile": cert_file,
#         "keyfile": key_file, })

    # For allowing CTRL + C stopping
    tornado.options.parse_command_line()
    signal.signal(signal.SIGINT, signal_handler)

#    server.listen(options.port, options.host)
    server.listen(options.port)

    tornado.ioloop.PeriodicCallback(try_exit, 100).start() 
    tornado.ioloop.IOLoop.instance().start()
    

if __name__ == '__main__':
    main()