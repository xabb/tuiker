# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='twik',
            name='twik_date',
            field=models.DateTimeField(default=None, help_text='Date for the twik', null=True, verbose_name='Twik date', blank=True),
        ),
    ]
