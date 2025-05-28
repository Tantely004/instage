from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('user/', UserDetailAPIView.as_view(), name='user_detail'),
    path('dashboard/intern/', DashboardInternAPIView.as_view(), name='dashboard'),
    path('dashboard/supervisor/', DashboardInstructorAPIView.as_view(), name='dashboard'),
]