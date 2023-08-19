# Generated by Django 4.2.4 on 2023-08-19 05:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medifly', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='request',
            name='latitude',
            field=models.DecimalField(decimal_places=6, default=0, max_digits=9),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='request',
            name='longitude',
            field=models.DecimalField(decimal_places=6, default=0, max_digits=9),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='request',
            name='medication',
            field=models.CharField(default='Bandages', max_length=80),
            preserve_default=False,
        ),
    ]