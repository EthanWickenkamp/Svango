from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer

# Create your views here.
@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, API is working!"})


#not sure if this is used in frontend yet but returns user profile information
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "id": user.id
    })


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
