from django.urls import path
from .views import LoginAPIView, UserDetailAPIView

urlpatterns = [
    path('api/login', LoginAPIView.as_view(), name='api-login'),
    path('api/user', UserDetailAPIView.as_view(), name='api-user'),
]
