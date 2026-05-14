from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Customer, Transaction
import json
import pandas as pd
import numpy as np

# PAROLNI TEKSHIRADIGAN MAXSUS FUNKSIYA
def check_pin(request):
    pin = request.headers.get('X-Admin-Pin')
    return pin == '7777'

def get_mock_df():
    np.random.seed(42)
    data = {
        'TransactionID': range(1001, 1201),
        'CustomerID': np.random.randint(100, 120, size=200),
        'TransactionDate': pd.date_range(start='2023-01-01', periods=200, freq='h'),
        'Amount': np.round(np.random.uniform(10.5, 500.0, size=200), 2),
        'TransactionType': np.random.choice(['Kirim', 'Chiqim'], size=200)
    }
    df = pd.DataFrame(data)
    df['TransactionDate'] = df['TransactionDate'].dt.strftime('%Y-%m-%d %H:%M:%S')
    return df

def get_summary(request):
    if Transaction.objects.exists():
        total_kirim = sum(float(t.amount) for t in Transaction.objects.filter(transaction_type='Kirim'))
        total_chiqim = sum(float(t.amount) for t in Transaction.objects.filter(transaction_type='Chiqim'))
        total = Transaction.objects.count()
    else:
        df = get_mock_df()
        total_kirim = float(df[df['TransactionType'] == 'Kirim']['Amount'].sum())
        total_chiqim = float(df[df['TransactionType'] == 'Chiqim']['Amount'].sum())
        total = len(df)
    return JsonResponse({"total_kirim": total_kirim, "total_chiqim": total_chiqim, "total_transactions": total})

def get_top_customers(request):
    if Transaction.objects.exists():
        from django.db.models import Sum
        top = Transaction.objects.filter(transaction_type='Chiqim') \
            .values('customer__customer_id') \
            .annotate(total=Sum('amount')) \
            .order_by('-total')[:5]
        result = [{'CustomerID': t['customer__customer_id'], 'Amount': float(t['total'])} for t in top]
    else:
        df = get_mock_df()
        chiqimlar = df[df['TransactionType'] == 'Chiqim']
        top = chiqimlar.groupby('CustomerID')['Amount'].sum().reset_index()
        top = top.sort_values(by='Amount', ascending=False).head(5)
        result = top.to_dict(orient='records')
    return JsonResponse(result, safe=False)

def get_transactions(request):
    if Transaction.objects.exists():
        recent = Transaction.objects.order_by('-transaction_date')[:50]
        result = [{
            'TransactionID': t.transaction_id,
            'CustomerID': t.customer.customer_id,
            'TransactionDate': t.transaction_date.strftime('%Y-%m-%d %H:%M:%S'),
            'Amount': float(t.amount),
            'TransactionType': t.transaction_type
        } for t in recent]
    else:
        df = get_mock_df()
        result = df.sort_values('TransactionDate', ascending=False).head(20).to_dict(orient='records')
    return JsonResponse(result, safe=False)

def get_customers(request):
    customers = Customer.objects.all().order_by('customer_id')
    result = [{'id': c.id, 'customer_id': c.customer_id, 'full_name': c.full_name} for c in customers]
    return JsonResponse(result, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def add_customer(request):
    if not check_pin(request):
        return JsonResponse({'error': 'Xato! O\'zgartirish kiritish huquqingiz yo\'q (PIN noto\'g\'ri).'}, status=403)
    try:
        data = json.loads(request.body)
        customer_id = data.get('customer_id', '').strip()
        full_name = data.get('full_name', '').strip()
        if not customer_id:
            return JsonResponse({'error': 'Mijoz ID kiritilishi shart'}, status=400)
        if Customer.objects.filter(customer_id=customer_id).exists():
            return JsonResponse({'error': 'Bu ID dagi mijoz allaqachon mavjud'}, status=400)
        customer = Customer.objects.create(customer_id=customer_id, full_name=full_name)
        return JsonResponse({'id': customer.id, 'customer_id': customer.customer_id, 'full_name': customer.full_name}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def add_transaction(request):
    if not check_pin(request):
        return JsonResponse({'error': 'Xato! O\'zgartirish kiritish huquqingiz yo\'q (PIN noto\'g\'ri).'}, status=403)
    try:
        data = json.loads(request.body)
        customer_id = data.get('customer_id')
        amount = data.get('amount')
        transaction_type = data.get('transaction_type', 'Kirim')
        transaction_date = data.get('transaction_date')
        if not all([customer_id, amount, transaction_date]):
            return JsonResponse({'error': 'Barcha maydonlar to\'ldirilishi shart'}, status=400)
        customer = Customer.objects.get(id=customer_id)
        from django.utils.dateparse import parse_datetime
        parsed_date = parse_datetime(transaction_date)
        transaction = Transaction.objects.create(
            customer=customer,
            amount=amount,
            transaction_type=transaction_type,
            transaction_date=parsed_date
        )
        return JsonResponse({'transaction_id': transaction.transaction_id}, status=201)
    except Customer.DoesNotExist:
        return JsonResponse({'error': 'Mijoz topilmadi'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# YANGI QO'SHILDI: O'chirish funksiyasi
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_customer(request, id):
    if not check_pin(request):
        return JsonResponse({'error': 'Xato! O\'chirish huquqingiz yo\'q (PIN noto\'g\'ri).'}, status=403)
    try:
        customer = Customer.objects.get(id=id)
        customer.delete()
        return JsonResponse({'success': 'Mijoz muvaffaqiyatli o\'chirildi!'}, status=200)
    except Customer.DoesNotExist:
        return JsonResponse({'error': 'Mijoz topilmadi'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
