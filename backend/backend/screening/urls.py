from django.urls import path
from .views import screen_resume

urlpatterns = [
    path('screen/', screen_resume),
]