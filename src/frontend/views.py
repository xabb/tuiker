from django.template import RequestContext
from django.shortcuts import render_to_response, redirect

from twitter import *
from allauth.socialaccount.models import SocialApp, SocialToken, SocialAccount


def index(request):
    
    if not request.user.is_authenticated():
        return redirect('/accounts/login/?next=%s' % request.path)
    else:

        context = RequestContext(request)

        return render_to_response("frontend/index.html",
                                  context)





def info(request):
    
    if not request.user.is_authenticated():
        return redirect('/accounts/login/?next=%s' % request.path)
    else:

        # Recover user token for making calls
        sapp = SocialApp.objects.filter(name="dtuiker")[0]

        # Get keys
        CONSUMER_KEY = sapp.client_id
        CONSUMER_SECRET = sapp.secret

        m_user = request.user

        saccount = SocialAccount.objects.get(user=request.user) 

        stokens = SocialToken.objects.get(account=saccount)


        # GEt user access tokens
        twitter = Twitter(auth=OAuth(
                    stokens.token, stokens.token_secret, CONSUMER_KEY, CONSUMER_SECRET))

        my_tl = twitter.statuses.home_timeline(count=10)

        context = RequestContext(request)

        context['tweets'] = my_tl
        
#         xx =  my_tl[0]
#         xu = xx['user']
#         
#         context['screen_name'] = xu['screen_name']
#         context['user_name'] = xu['name']
        
        return render_to_response("frontend/basic_info.html",
                                  context)

