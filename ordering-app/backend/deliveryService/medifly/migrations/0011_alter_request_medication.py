# Generated by Django 4.2.4 on 2023-08-20 00:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('medifly', '0010_remove_request_medication_request_medication'),
    ]

    operations = [
        migrations.AlterField(
            model_name='request',
            name='medication',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='medifly.medication'),
        ),
    ]