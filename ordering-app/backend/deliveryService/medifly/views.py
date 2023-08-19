from django.http import Http404
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Hospital, Request, Customer, Medication
from django.contrib.auth import login, logout


@csrf_exempt
def submit_request(request):
    if request.method == "POST":
        body = json.loads(request.body)
        if request.user.is_authenticated:
            username = request.user.username
            if Customer.objects.filter(username=username).exists():
                customer = Customer.objects.get(username=username)
                if Request.objects.filter(user=customer).exists():
                    return JsonResponse({'message': 'previous request open'})
                long, lat, medication = body['long'], body['lat'], body['medication']
                nearby = Hospital.objects.filter(inventory__name__iexact=medication)
                closest = min(nearby, key=lambda x: (x.longitude-long)**2 + (x.latitude-lat)**2)
                request = Request(hospital=closest, user=customer, longitude=long, latitude=lat, medication=medication)
                request.save()
                return JsonResponse({'message': 'success'})

@csrf_exempt
def hospital_register(request):
    if request.method == "POST":
        body = json.loads(request.body)
        hospital = Hospital.objects.create_user(username=body['username'], password=body['password'],
                                                hospital_name=body['name'], longitude=body['longitude'], latitude=body['latitude'])
        for medication_name in body['medication']:
            medicine = Medication.objects.filter(name__iexact=medication_name)
            if medicine.exists():
                hospital.inventory.add(medicine[0])
        hospital.save()
        if hospital.pk is not None:
            login(request, hospital)
            return JsonResponse({'message': 'success'})


@csrf_exempt
def hospital_login(request):
    if request.method == "POST":
        body = json.loads(request.body)
        user = Hospital.authenticate(username=body['username'], password=body['password'])
        if user is not None:
            login(request, user)
            return JsonResponse({'message': f'success {user.hospital_name}', 'success': True})
        else:
            return JsonResponse({'message': 'none found', 'success': False})


@csrf_exempt
def hospital_data(request):
    if request.user.is_authenticated:
        username = request.user.username
        if Hospital.objects.filter(username=username).exists():
            hospital = Hospital.objects.get(username=username)
            requests = hospital.request_set.all()
            request_data = [{'username': q.user.username, 'longitude': q.longitude, 'latitude': q.latitude,
                             'medication': q.medication} for q in requests]
            hospital_info = {'name': hospital.hospital_name, 'requests': request_data}
            return JsonResponse(hospital_info)

@csrf_exempt
def customer_register(request):
    if request.method == "POST":
        body = json.loads(request.body)
        customer = Customer.objects.create_user(username=body['username'], password=body['password'])
        customer.save()
        if customer.pk is not None:
            login(request, customer)
            return JsonResponse({'message': 'success', 'uuid': customer.uuid})


@csrf_exempt
def customer_login(request):
    if request.method == "POST":
        body = json.loads(request.body)
        customer = Customer.authenticate(username=body['username'], password=body['password'])
        if customer is not None:
            login(request, customer)
            return JsonResponse({'message': f'success {customer.uuid}'})
        else:
            return JsonResponse({'message': 'none found'})

def hospital_logged_in(request):
    logged_in = request.user.is_authenticated and Hospital.objects.filter(username=request.user.username).exists()
    return JsonResponse({'loggedIn': logged_in})

def customer_logged_in(request):
    logged_in = request.user.is_authenticated and Customer.objects.filter(username=request.user.username).exists()
    return JsonResponse({'loggedIn': logged_in})

def user_logout(request):
    logout(request)
    return JsonResponse({'loggedOut': True})