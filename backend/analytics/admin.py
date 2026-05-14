from django.contrib import admin
from .models import Customer, Transaction

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['customer_id', 'full_name']
    search_fields = ['customer_id', 'full_name']

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'customer', 'transaction_date', 'amount', 'transaction_type']
    list_filter = ['transaction_type', 'transaction_date']
    search_fields = ['customer__customer_id']
    ordering = ['-transaction_date']
