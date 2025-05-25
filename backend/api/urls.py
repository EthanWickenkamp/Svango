from django.urls import path, include
from .views import hello_world, user_profile, login
from .views import ItemViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'items', ItemViewSet)


urlpatterns = [
    path("hello/", hello_world, name="hello_world"),
    path('', include(router.urls)),

    # JWT authentication endpoints
    path('token/', login, name='access_token'),
    path('user-profile/', user_profile, name='user_profile'),
]
