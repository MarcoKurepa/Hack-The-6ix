# Generated by Django 4.2.4 on 2023-08-20 00:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medifly', '0007_customer_emergency_medication'),
    ]

    operations = [
        migrations.AddField(
            model_name='request',
            name='status',
            field=models.TextField(choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected'), ('Completed', 'Completed')], default='Pending', max_length=20),
        ),
    ]
