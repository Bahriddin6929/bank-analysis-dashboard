from django.db import models

class Customer(models.Model):
    customer_id = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"C-{self.customer_id}"
    
    class Meta:
        verbose_name = "Mijoz"
        verbose_name_plural = "Mijozlar"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('Kirim', 'Kirim'),
        ('Chiqim', 'Chiqim'),
    ]
    transaction_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='transactions')
    transaction_date = models.DateTimeField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)

    def __str__(self):
        return f"#{self.transaction_id} - {self.customer} - {self.amount}"
    
    class Meta:
        verbose_name = "Tranzaksiya"
        verbose_name_plural = "Tranzaksiyalar"
