from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer

# Create your views here.
@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, API is working!"})



class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
