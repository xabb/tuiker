# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import frontend.models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Twik',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('contents', models.TextField(help_text='Twik contents', verbose_name='Contents')),
                ('twik_date', models.DateTimeField(default=frontend.models.get_inf_time, help_text='Date for the twik', verbose_name='Twik date')),
                ('user', models.ForeignKey(related_name=b'twiks', default=None, blank=True, to=settings.AUTH_USER_MODEL, help_text='Creator of the twik (current user by default)', null=True)),
            ],
            options={
                'verbose_name': 'Twik',
                'verbose_name_plural': 'Twiks',
                'permissions': (('view_twiks', 'Can view twiks'),),
            },
            bases=(models.Model,),
        ),
    ]
