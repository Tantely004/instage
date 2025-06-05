from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('user/', UserDetailAPIView.as_view(), name='user_detail'),
    path('dashboard/intern/', DashboardInternAPIView.as_view(), name='dashboard-intern'),
    path('dashboard/supervisor/', DashboardInstructorAPIView.as_view(), name='dashboard-instructor'),
    path('dashboard/admin/', DashboardAdminAPIView.as_view(), name='dashboard-admin'),
    path('profile/intern/', ProfileInternAPIView.as_view(), name='profile-intern'),
    path('toolbar/', ToolbarDetailAPIView.as_view(), name='toolbar-detail'),
    path('generationtheme/', GenerationThemeAPIView.as_view(), name='generation-theme'),
]