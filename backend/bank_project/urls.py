from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.urls),
    path('api/', include('analytics.urls')),
]
