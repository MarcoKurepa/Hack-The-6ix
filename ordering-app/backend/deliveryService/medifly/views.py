from django.http import Http404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def submit_request(request):
    if request.method == "POST":
        return JsonResponse({'message': 'Hello'})
    else:
        raise Http404
