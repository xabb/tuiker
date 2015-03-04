from django.conf.urls import patterns, url



from django.core.urlresolvers import reverse, reverse_lazy

from django.contrib.auth.decorators import login_required, permission_required
from django.views.generic import TemplateView

from django.views.generic.edit import CreateView, UpdateView, DeleteView


#from .views import AffiliateCreate, AffiliateUpdate, AffiliateDelete, AffiliateList
# from .views import AffiliateList, AffiliateAjaxList, FederationList, SectorList, DueList, UnionList, CompanyList, SubSectorList, EntityList, SepaView, SepaDownload, SepaGenerationList, SepaGenerationAjaxList, ReportView, ReceiptsGeneration, NewsList, SepaReturnCodesList, SubscriptionList, AffiliateUnregisteredList, AffiliateUnregisteredAjaxList #, AffiliateUpdate, AffiliateCreate, AffiliateDelete
# from .models import Affiliate, Federation, Sector, Due, Union, Company, SubSector, Entity, ReceiptGeneration, News, SepaReturnCodes, Subscription
# from .forms import AffiliateForm, FederationForm, SectorForm, DueForm, UnionForm, CompanyForm, SubSectorForm, EntityForm, AffiliateFormAccordion, NewsForm, SepaReturnCodesForm, SubscriptionForm
# from display.generic.views import GenericFormView, GenericUpdateView, GenericCreateView, GenericDeleteView, GenericAjaxList, GenericGridView, GenericAutocompleteAjaxList, GenericUnregisterView

import views 

from django.utils.translation import ugettext_lazy as _



urlpatterns = patterns('',

    url(r'^info/$', views.info, name='twitinfo-base'),

)
