from django.template import RequestContext
from django.shortcuts import render_to_response, redirect


def index(request):
    
    if not request.user.is_authenticated():
        return redirect('/accounts/login/?next=%s' % request.path)
    else:

        context = RequestContext(request)

        return render_to_response("frontend/index.html",
                                  context)
