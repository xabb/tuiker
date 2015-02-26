from django.conf.urls import patterns, include, url

from django.conf.urls.i18n import i18n_patterns

from django.contrib import admin
from filebrowser.sites import site
from frontend import views


# javascript i18n
js_info_dict = {
    'packages': ('frontend',
#                 'lemon',
                 ),
}



# http://machakux.appspot.com/blog/17010/django_using_i18n_patterns_and_locale_switcher

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'kanban.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include('smuggler.urls')),  # before admin url patterns!


    url(r'^admin/', include(admin.site.urls)),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # django-allauth

    url(r'^accounts/logout/$', 'django.contrib.auth.views.logout',
       {'next_page': '/'}), ## Do not ask for confirmation to logout
    
    url(r'^accounts/', include('allauth.urls')),

    # Custom: i18n. Change language
    (r'^i18n/', include('django.conf.urls.i18n')),


    # javascript i18n
    (r'^jsi18n/$', 'django.views.i18n.javascript_catalog', js_info_dict),

    # LOGIN test
    url(r'^$', views.index, name='index'),

#    url(r'^geolite/', include('geolite.urls', namespace="geolite")),
#    url(r'^colectivo/', include('colectivo.urls', namespace="colectivo")),

    # TODO: improve for considering autocmplete fields
#    url(r'^chaining/', include('smart_selects.urls')),


)
