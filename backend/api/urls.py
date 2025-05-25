from django.urls import path, include
from .views import hello_world, user_profile
from .views import ItemViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'items', ItemViewSet)


urlpatterns = [
    path("hello/", hello_world, name="hello_world"),
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/profile/', user_profile, name='user_profile'),
]
