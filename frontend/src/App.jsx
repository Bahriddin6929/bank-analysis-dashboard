import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  CreditCard,
  LayoutDashboard
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API_BASE = "/api";

function App() {
  const [summary, setSummary] = useState({ total_kirim: 0, total_chiqim: 0, total_transactions: 0 });
  const [topCustomers, setTopCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, topRes, trxRes] = await Promise.all([
          fetch(`${API_BASE}/summary`),
          fetch(`${API_BASE}/top-customers`),
          fetch(`${API_BASE}/transactions`)
        ]);

        const sumData = await sumRes.json();
        const topData = await topRes.json();
        const trxData = await trxRes.json();

        setSummary(sumData);
        setTopCustomers(topData);
        setTransactions(trxData);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // 10 soniyada yangilab turish
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: topCustomers.map(c => `Mijoz #${c.CustomerID}`),
    datasets: [
      {
        label: 'Xarajatlar ($)',
        data: topCustomers.map(c => c.Amount),
        backgroundColor: 'rgba(56, 189, 248, 0.6)',
        borderColor: '#38bdf8',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };

  return (
    <div className="app-container">
      <div className="blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="glass-panel">
        <header>
          <div className="logo-section">
            <div style={{ padding: '8px', background: '#38bdf8', borderRadius: '12px' }}>
              <LayoutDashboard size={24} color="white" />
            </div>
            <h1>Bank Mijozlari Tahlili</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Bahriddin Dashboard</span>
            <div style={{ width: '32px', height: '32px', background: '#818cf8', borderRadius: '50%' }}></div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="stat-label">Umumiy Kirim</span>
              <TrendingUp color="#10b981" size={20} />
            </div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              ${summary.total_kirim.toLocaleString()}
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="stat-label">Umumiy Chiqim</span>
              <TrendingDown color="#ef4444" size={20} />
            </div>
            <div className="stat-value" style={{ color: '#ef4444' }}>
              ${summary.total_chiqim.toLocaleString()}
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="stat-label">Tranzaksiyalar</span>
              <Activity color="#38bdf8" size={20} />
            </div>
            <div className="stat-value">
              {summary.total_transactions}
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="section-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Users size={18} color="#38bdf8" />
              <h2 style={{ margin: 0 }}>Top 5 Xarajatlar</h2>
            </div>
            <div style={{ height: '300px' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="section-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <CreditCard size={18} color="#38bdf8" />
              <h2 style={{ margin: 0 }}>Oxirgi Tranzaksiyalar</h2>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mijoz</th>
                    <th>Sana</th>
                    <th>Summa</th>
                    <th>Tur</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.TransactionID}>
                      <td>#{t.TransactionID}</td>
                      <td>C-{t.CustomerID}</td>
                      <td style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{t.TransactionDate}</td>
                      <td style={{ fontWeight: 700 }}>${t.Amount}</td>
                      <td>
                        <span className={`badge badge-${t.TransactionType.toLowerCase()}`}>
                          {t.TransactionType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
