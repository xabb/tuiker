from django.db import models
from django.contrib.auth.models import User


from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from datetime import datetime, date
from django.utils.timezone import utc

from django.core.exceptions import ObjectDoesNotExist 

import reversion

#from smart_selects.db_fields import ChainedForeignKey


# import the logging library
import logging
#from test.test_socket import try_address

# Get an instance of a logger
logger = logging.getLogger(__name__)




# https://groups.google.com/forum/#!topic/django-users/we07Mnxt-6M
INF_TIME = datetime.max.replace(tzinfo=timezone.utc)
def get_inf_time():
    return INF_TIME



# http://stackoverflow.com/questions/13305379/django-more-pythonic-unicode
class BaseModel(models.Model):
    """
        Base class for models
    """

    def to_dict(self, exclude=[]):
        """
            Return dictionary representation of object (for json)
            http://stackoverflow.com/questions/2170228/iterate-over-model-instance-field-names-and-values-in-template
        """
        tree = {}
        for field in self._meta.fields + self._meta.many_to_many:
            if field.name in exclude or \
                '%s.%s' % (type(self).__name__, field.name) in exclude:
                continue

            try :
                value = getattr(self, field.name)
#            except self.DoesNotExist:
            except ObjectDoesNotExist:
                # http://stackoverflow.com/questions/14255125/catching-doesnotexist-exception-in-a-custom-manager-in-django
                value = None
#             except Exception, e:
#                 value = None
                
            if type(field) in [models.ForeignKey, models.OneToOneField]: #, ChainedForeignKey]:
                # Little trap, just recover unicode name
#                tree[field.name] = to_dict(value, exclude=exclude)
                if value != None:
                    tree[field.name] = str(value)
                else:
                    tree[field.name] = value
            elif isinstance(field, models.ManyToManyField):
                vs = []
                for v in value.all():
                    vs.append(v.to_dict(exclude=exclude))
                tree[field.name] = vs
            elif isinstance(field, models.DateTimeField):
                if value != None:
                    tree[field.name] = str(value)
                else:
                    tree[field.name] = value
            elif isinstance(field, models.FileField):
                tree[field.name] = {'url': value.url}
            else:

                fname = field.name        
                # resolve picklists/choices, with get_xyz_display() function
                get_choice = 'get_'+fname+'_display'
                if hasattr( self, get_choice):
                    tree[field.name] = getattr( self, get_choice)()
                else:
                    tree[field.name] = value

        return tree

    class Meta:
        abstract = True





@reversion.register
class Twik(BaseModel):
    """
        Definition of a twik entity
    """
    contents = models.TextField(_('Contents'), help_text=_('Twik contents'))

    user = models.ForeignKey(User, related_name='twiks', blank = True, null = True, default = None, help_text=_('Creator of the twik (current user by default)'))
    # Scalability (yeah, I know, denormalized and so on)
    twik_date = models.DateTimeField(_('Twik date'), blank = True, null = True, default = None, help_text=_('Date for the twik'), )


    def __unicode__(self):
        return u'{contents:s}'.format(**self.__dict__)

    class Meta:
#        db_table = "tmp_federation"
        verbose_name = _('Twik')
        verbose_name_plural = _('Twiks')
        permissions = (
            ("view_twiks", "Can view twiks"),
        )    

