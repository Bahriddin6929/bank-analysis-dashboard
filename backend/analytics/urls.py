from django.urls import path
from . import views

urlpatterns = [
    path('summary', views.get_summary, name='summary'),
    path('top-customers', views.get_top_customers, name='top_customers'),
    path('transactions', views.get_transactions, name='transactions'),
]
