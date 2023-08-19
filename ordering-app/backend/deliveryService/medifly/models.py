import uuid
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import authenticate as user_auth

class Medication(models.Model):
    name = models.CharField(max_length=80)

class Hospital(User):
    hospital_name = models.CharField(max_length=100)
    inventory = models.ManyToManyField(Medication)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)

    @staticmethod
    def authenticate(username, password):
        if user_auth(username=username, password=password) is not None:
            return Hospital.objects.filter(username=username).first()
        return None

class Customer(User):
    uuid = models.UUIDField(primary_key=False, default=uuid.uuid4, editable=False)
    registration_complete = models.BooleanField(default=False)
    emergency_medication = models.ManyToManyField(Medication)

    @staticmethod
    def authenticate(username, password):
        if user_auth(username=username, password=password) is not None:
            return Customer.objects.filter(username=username).first()
        return None

class Request(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    user = models.ForeignKey(Customer, on_delete=models.CASCADE)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    medication = models.CharField(max_length=80)