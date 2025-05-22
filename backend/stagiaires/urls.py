from django.urls import path
from .views import CustomTokenObtainPairView, UserDetailAPIView

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('user/', UserDetailAPIView.as_view(), name='user_detail'),
]