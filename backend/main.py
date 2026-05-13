import pandas as pd
import numpy as np

# We'll generate mock data to memory for the API to serve it quickly
def generate_mock_df():
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

df_transactions = generate_mock_df()

def get_summary():
    total_kirim = df_transactions[df_transactions['TransactionType'] == 'Kirim']['Amount'].sum()
    total_chiqim = df_transactions[df_transactions['TransactionType'] == 'Chiqim']['Amount'].sum()
    total_transactions = len(df_transactions)
    return {
        "total_kirim": float(total_kirim),
        "total_chiqim": float(total_chiqim),
        "total_transactions": total_transactions
    }

def get_top_customers():
    chiqimlar = df_transactions[df_transactions['TransactionType'] == 'Chiqim']
    mijoz_xarajatlari = chiqimlar.groupby('CustomerID')['Amount'].sum().reset_index()
    top_mijozlar = mijoz_xarajatlari.sort_values(by='Amount', ascending=False).head(5)
    return top_mijozlar.to_dict(orient='records')

def get_recent_transactions():
    recent = df_transactions.sort_values(by='TransactionDate', ascending=False).head(10)
    return recent.to_dict(orient='records')
