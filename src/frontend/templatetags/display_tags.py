from __future__ import unicode_literals
from future.builtins import str

from django import template
from django.conf import settings


from django.core.exceptions import ImproperlyConfigured
from django.template import Context, TemplateSyntaxError, Variable
from django.template.loader import get_template
from django.utils.translation import ugettext_lazy as _



register = template.Library()

@register.filter
def signup_open(request):
    """
        Returns if signup is opened
    """
    return settings.ACCOUNT_OPEN_FOR_SIGNUP

