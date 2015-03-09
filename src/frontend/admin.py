from django.contrib import admin
import reversion

from .models import Twik



from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User


# # Define an inline admin descriptor for Employee model
# # which acts a bit like a singleton
# class TuikerUserInline(admin.StackedInline):
#     model = ColectivoUser
#     can_delete = False
#     verbose_name_plural = 'tuikeruser'
# 
# # Define a new User admin
# class UserAdmin(UserAdmin):
#     inlines = (ColectivoUserInline, )
# 
# # Re-register UserAdmin
# admin.site.unregister(User)
# admin.site.register(User, UserAdmin)


class TwikAdmin(admin.ModelAdmin):
    pass


admin.site.register(Twik, TwikAdmin)

