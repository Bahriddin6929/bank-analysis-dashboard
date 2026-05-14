from django.urls import path
from .views import run_migration # <-- SHU QATORNI TEPAGA QO'SHING

urlpatterns = [
    # ... bu yerda sizning oldingi kodingiz bo'ladi ...
    path('api/migrate/', run_migration), # <-- SHU QATORNI QO'SHING
]

from django.urls import path
from . import views

urlpatterns = [
    path('summary', views.get_summary, name='summary'),
    path('top-customers', views.get_top_customers, name='top_customers'),
    path('transactions', views.get_transactions, name='transactions'),
    path('customers', views.get_customers, name='customers'),
    path('add-customer', views.add_customer, name='add_customer'),
    path('add-transaction', views.add_transaction, name='add_transaction'),
]
