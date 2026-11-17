from django.urls import path
from .views import screen_resume, get_history, clear_history

urlpatterns = [
    path('screen/', screen_resume, name='screen_resume'),
    path('history/', get_history, name='get_history'),
    path('history/clear/', clear_history, name='clear_history'),
]
