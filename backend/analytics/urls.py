from django.urls import path
from . import views
from django.core.management import call_command
from django.http import HttpResponse

def oson_migrate(request):
    try:
        call_command('makemigrations', 'analytics')
        call_command('migrate')
        return HttpResponse("✅ BAZA YARATILDI! Saytga qaytib bemalol saqlashingiz mumkin.")
    except Exception as e:
        return HttpResponse(f"Xato: {e}")

urlpatterns = [
    path('baza-yaratish/', oson_migrate),
    path('summary', views.get_summary, name='summary'),
    path('top-customers', views.get_top_customers, name='top_customers'),
    path('transactions', views.get_transactions, name='transactions'),
    path('customers', views.get_customers, name='customers'),
    path('add-customer', views.add_customer, name='add_customer'),
    path('add-transaction', views.add_transaction, name='add_transaction'),
    
    # YANGI QO'SHILDI: O'chirish uchun manzil
    path('delete-customer/<int:id>', views.delete_customer, name='delete_customer'),
]
