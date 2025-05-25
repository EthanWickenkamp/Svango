from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView

from rest_framework import status #for sending status codes as a response
from rest_framework.permissions import AllowAny

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import AccessToken

from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer

# Create your views here.
@api_view(["GET"])
@permission_classes([AllowAny])
def hello_world(request):
    return Response({"message": "Hello, API is working! :<"})

# JWT authentication endpoint
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            access = AccessToken.for_user(user)
            return Response({"access": str(access)}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
#returns user profile information
@api_view(['GET'])
def user_profile(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email
    })


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
