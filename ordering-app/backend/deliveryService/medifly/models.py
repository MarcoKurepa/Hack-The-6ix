from django.db import models
from django.contrib.auth.models import User

class Hospital(User):
    hospital_name = models.CharField(max_length=100)

class Customer(User):
    uuid = models.IntegerField

class Request(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    user = models.ForeignKey(Customer, on_delete=models.CASCADE)