from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('add-course/', AddcourseAPIView.as_view(), name='add-course'),
    path('categories/', CategoryListAPIView.as_view(), name='categories-list'),
    # token verification
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # profile
    path('me/', MeAPIView.as_view(), name='me'),
    path('me/update', MeUpdateAPIView.as_view(), name='me-update'),
    path('me/mentor/Courses', GetMentorCoursesAPIView.as_view(), name='me-update'),
    # rest password
    path('password/update/', PassUpdateAPIView.as_view(), name='password-update'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

]