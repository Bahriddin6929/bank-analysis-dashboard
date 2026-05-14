from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.core.management import call_command
from django.http import HttpResponse

def oson_migrate(request):
    try:
        call_command('makemigrations')
        call_command('migrate')
        return HttpResponse("✅ BAZA YARATILDI! Saytga qaytib bemalol saqlashingiz mumkin.")
    except Exception as e:
        return HttpResponse(f"Xato: {e}")

urlpatterns = [
    # Baza yaratish uchun maxsus manzil:
    path('baza-yaratish/', oson_migrate),
    
    # Sizning rasmdagi eski manzillaringiz:
    path('admin/', admin.site.urls),
    path('api/', include('analytics.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
]
