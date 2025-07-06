from django.urls import path, include
from .views import hello_world, user_profile, login
from .views import ItemViewSet, ItemGroupViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenBlacklistView


router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'groups', ItemGroupViewSet)


urlpatterns = [
    path("hello/", hello_world, name="hello_world"),
    path('', include(router.urls)),

    # JWT authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('user-profile/', user_profile, name='user_profile'),
]
