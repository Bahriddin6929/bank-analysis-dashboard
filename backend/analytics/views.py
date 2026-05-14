from django.http import JsonResponse
from .models import Customer, Transaction
import pandas as pd
import numpy as np

def get_summary(request):
    transactions = Transaction.objects.all()
    if transactions.exists():
        total_kirim = sum(t.amount for t in transactions if t.transaction_type == 'Kirim')
        total_chiqim = sum(t.amount for t in transactions if t.transaction_type == 'Chiqim')
        total = transactions.count()
    else:
        # Baza bo'sh bo'lsa, namuna ma'lumotlar
        np.random.seed(42)
        amounts = np.round(np.random.uniform(10.5, 500.0, size=200), 2)
        types = np.random.choice(['Kirim', 'Chiqim'], size=200)
        total_kirim = float(sum(a for a, t in zip(amounts, types) if t == 'Kirim'))
        total_chiqim = float(sum(a for a, t in zip(amounts, types) if t == 'Chiqim'))
        total = 200
    return JsonResponse({
        "total_kirim": float(total_kirim),
        "total_chiqim": float(total_chiqim),
        "total_transactions": total
    })

def get_top_customers(request):
    transactions = Transaction.objects.filter(transaction_type='Chiqim')
    if transactions.exists():
        from django.db.models import Sum
        top = Transaction.objects.filter(transaction_type='Chiqim')\
            .values('customer__customer_id')\
            .annotate(total=Sum('amount'))\
            .order_by('-total')[:5]
        result = [{'CustomerID': t['customer__customer_id'], 'Amount': float(t['total'])} for t in top]
    else:
        np.random.seed(42)
        cids = np.random.randint(100, 120, size=200)
        amounts = np.round(np.random.uniform(10.5, 500.0, size=200), 2)
        types = np.random.choice(['Kirim', 'Chiqim'], size=200)
        df = pd.DataFrame({'CustomerID': cids, 'Amount': amounts, 'TransactionType': types})
        chiqimlar = df[df['TransactionType'] == 'Chiqim']
        top = chiqimlar.groupby('CustomerID')['Amount'].sum().reset_index()
        top = top.sort_values(by='Amount', ascending=False).head(5)
        result = top.to_dict(orient='records')
    return JsonResponse(result, safe=False)

def get_transactions(request):
    transactions = Transaction.objects.all()
    if transactions.exists():
        recent = Transaction.objects.order_by('-transaction_date')[:10]
        result = [{
            'TransactionID': t.transaction_id,
            'CustomerID': t.customer.customer_id,
            'TransactionDate': t.transaction_date.strftime('%Y-%m-%d %H:%M:%S'),
            'Amount': float(t.amount),
            'TransactionType': t.transaction_type
        } for t in recent]
    else:
        np.random.seed(42)
        cids = np.random.randint(100, 120, size=200)
        amounts = np.round(np.random.uniform(10.5, 500.0, size=200), 2)
        types = np.random.choice(['Kirim', 'Chiqim'], size=200)
        dates = pd.date_range(start='2023-01-01', periods=200, freq='h')
        df = pd.DataFrame({'TransactionID': range(1001, 1201), 'CustomerID': cids,
                          'TransactionDate': dates, 'Amount': amounts, 'TransactionType': types})
        df['TransactionDate'] = df['TransactionDate'].dt.strftime('%Y-%m-%d %H:%M:%S')
        result = df.sort_values('TransactionDate', ascending=False).head(10).to_dict(orient='records')
    return JsonResponse(result, safe=False)
