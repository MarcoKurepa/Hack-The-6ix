from django.http import Http404
import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import loader

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
                closest = min(nearby, key=lambda x: (float(x.longitude)-long)**2 + (float(x.latitude)-lat)**2)
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
            return JsonResponse({'message': f'success {customer.uuid}', 'success': True})
        else:
            return JsonResponse({'message': 'none found', 'success': False})

def customer_uuid(request):
    if request.user.is_authenticated:
        username = request.user.username
        users = Customer.objects.filter(username=username)
        if users.exists():
            user = users[0]
            return JsonResponse({'uuid': user.uuid})

def hospital_logged_in(request):
    logged_in = request.user.is_authenticated and Hospital.objects.filter(username=request.user.username).exists()
    return JsonResponse({'loggedIn': logged_in})

def customer_logged_in(request):
    if request.user.is_authenticated and Customer.objects.filter(username=request.user.username).exists():
        customer = Customer.objects.get(username=request.user.username)
        if customer.registration_complete:
            return JsonResponse({'loggedIn': True, 'registrationCompleted': True})
        else:
            return JsonResponse({'loggedIn': True, 'registrationCompleted': False})
    else:
        return JsonResponse({'loggedIn': False, 'registrationCompleted': False})

def important_medication(request):
    if request.user.is_authenticated and Customer.objects.filter(username=request.user.username).exists():
        customer = Customer.objects.get(username=request.user.username)
        return JsonResponse({'medicine': list(map(lambda x: x.name, customer.emergency_medication.all()))})

def user_logout(request):
    logout(request)
    return JsonResponse({'loggedOut': True})

def medications(request):
    return JsonResponse({'medications': list(map(lambda x: x.name, Medication.objects.all()))})

def start_video_stream(request):
    if request.user.is_authenticated:
        username = request.user.username
        if Customer.objects.filter(username=username).exists():
            customer = Customer.objects.get(username=username)
            template = loader.get_template("medifly/videostream.html")
            context = {
                'uuid': customer.uuid,
                'to_host': f'http://{request.get_host()}/customer/finish-registration'
            }
            return HttpResponse(template.render(context))

@csrf_exempt
def set_emergency_medication(request):
    if request.method == "POST" and request.user.is_authenticated:
        username = request.user.username
        if Customer.objects.filter(username=username).exists():
            customer = Customer.objects.get(username=username)
            body = json.loads(request.body)
            customer.emergency_medication.clear()
            for i in body['medication']:
                customer.emergency_medication.add(Medication.objects.get(name=i))
            customer.save()
            return JsonResponse({'message': 'success'})

def registration_done(request):
    username = request.user.username
    if Customer.objects.filter(username=username).exists():
        customer = Customer.objects.get(username=username)
        customer.registration_complete = True
        customer.save()
        return JsonResponse({'message': 'success'})