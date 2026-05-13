from django.http import JsonResponse
import pandas as pd
import numpy as np

# Ma'lumotlarni generatsiya qilish (FastAPI dagi mantiqni Django ga ko'chiramiz)
def get_mock_data():
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

df_transactions = get_mock_data()

def get_summary(request):
    total_kirim = df_transactions[df_transactions['TransactionType'] == 'Kirim']['Amount'].sum()
    total_chiqim = df_transactions[df_transactions['TransactionType'] == 'Chiqim']['Amount'].sum()
    return JsonResponse({
        "total_kirim": float(total_kirim),
        "total_chiqim": float(total_chiqim),
        "total_transactions": len(df_transactions)
    })

def get_top_customers(request):
    chiqimlar = df_transactions[df_transactions['TransactionType'] == 'Chiqim']
    mijoz_xarajatlari = chiqimlar.groupby('CustomerID')['Amount'].sum().reset_index()
    top_mijozlar = mijoz_xarajatlari.sort_values(by='Amount', ascending=False).head(5)
    return JsonResponse(top_mijozlar.to_dict(orient='records'), safe=False)

def get_transactions(request):
    recent = df_transactions.sort_values(by='TransactionDate', ascending=False).head(10)
    return JsonResponse(recent.to_dict(orient='records'), safe=False)
