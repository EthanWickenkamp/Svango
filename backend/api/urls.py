from django.urls import path, include
from .views import hello_world, login
from .views import ItemViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'items', ItemViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('token/', login, name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
