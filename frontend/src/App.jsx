import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { LayoutDashboard, Users, CreditCard, TrendingUp, TrendingDown, Activity, Plus, Search, BarChart2, Menu, X } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const API_BASE = "/api";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    for (let cookie of document.cookie.split(';')) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function Sidebar({ activePage, setActivePage, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Bosh Sahifa', icon: LayoutDashboard },
    { id: 'customers', label: 'Mijozlar', icon: Users },
    { id: 'transactions', label: 'Tranzaksiyalar', icon: CreditCard },
    { id: 'analytics', label: 'Tahlillar', icon: BarChart2 },
  ];
  return (
    <>
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🏦</span>
            <span className="logo-text">Bank Tahlil</span>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}><X size={20} /></button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${activePage === id ? 'nav-active' : ''}`}
              onClick={() => { setActivePage(id); setIsOpen(false); }}>
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">B</div>
          <div>
            <div className="user-name">Bahriddin</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
      </div>
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className="stat-icon-wrap" style={{ background: color + '22' }}>
          <Icon size={20} color={color} />
        </div>
      </div>
      <div className="stat-value" style={{ color }}>{value}</div>
    </div>
  );
}

function Alert({ msg }) {
  if (!msg) return null;
  const isError = msg.startsWith('❌');
  return <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>{msg}</div>;
}

function DashboardPage({ summary, topCustomers, transactions }) {
  const chartData = {
    labels: topCustomers.map(c => `C-${c.CustomerID}`),
    datasets: [{ label: 'Xarajatlar ($)', data: topCustomers.map(c => c.Amount), backgroundColor: 'rgba(99,102,241,0.7)', borderColor: '#6366f1', borderWidth: 1, borderRadius: 8 }],
  };
  const opts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } } };
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Bosh Sahifa</h1>
        <p className="page-sub">Bank operatsiyalarining umumiy ko'rinishi</p>
      </div>
      <div className="stats-grid">
        <StatCard label="Umumiy Kirim" value={`$${Number(summary.total_kirim).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={TrendingUp} color="#10b981" />
        <StatCard label="Umumiy Chiqim" value={`$${Number(summary.total_chiqim).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={TrendingDown} color="#ef4444" />
        <StatCard label="Jami Tranzaksiyalar" value={summary.total_transactions} icon={Activity} color="#6366f1" />
        <StatCard label="Sof Daromad" value={`$${(Number(summary.total_kirim) - Number(summary.total_chiqim)).toFixed(2)}`} icon={TrendingUp} color="#f59e0b" />
      </div>
      <div className="content-grid">
        <div className="card">
          <div className="card-head"><h2 className="card-title">Top 5 Xarajat Qiluvchi Mijozlar</h2></div>
          <div style={{ height: '260px' }}><Bar data={chartData} options={opts} /></div>
        </div>
        <div className="card">
          <div className="card-head"><h2 className="card-title">Oxirgi Tranzaksiyalar</h2></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Mijoz</th><th>Summa</th><th>Tur</th></tr></thead>
              <tbody>
                {transactions.slice(0, 7).map(t => (
                  <tr key={t.TransactionID}>
                    <td>#{t.TransactionID}</td>
                    <td>C-{t.CustomerID}</td>
                    <td style={{ fontWeight: 700 }}>${t.Amount}</td>
                    <td><span className={`badge badge-${t.TransactionType === 'Kirim' ? 'kirim' : 'chiqim'}`}>{t.TransactionType}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer_id: '', full_name: '' });
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    fetch(`${API_BASE}/customers`).then(r => r.json()).then(d => { setCustomers(d); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/add-customer`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMsg('✅ Mijoz muvaffaqiyatli qo\'shildi!'); setForm({ customer_id: '', full_name: '' }); setShowForm(false); load(); }
    else setMsg(`❌ ${data.error}`);
    setTimeout(() => setMsg(''), 3000);
  };

  const filtered = customers.filter(c => c.customer_id.toLowerCase().includes(search.toLowerCase()) || c.full_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Mijozlar</h1><p className="page-sub">Barcha bank mijozlari ro'yxati</p></div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={16} /> Yangi Mijoz</button>
      </div>
      <Alert msg={msg} />
      {showForm && (
        <div className="card form-card">
          <h3 className="card-title">Yangi Mijoz Qo'shish</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Mijoz ID</label>
              <input type="text" placeholder="Masalan: 201" value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>To'liq Ismi</label>
              <input type="text" placeholder="Masalan: Alisher Karimov" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Saqlash</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Bekor qilish</button>
            </div>
          </form>
        </div>
      )}
      <div className="card">
        <div className="card-head">
          <h2 className="card-title">Mijozlar Ro'yxati ({filtered.length})</h2>
          <div className="search-box"><Search size={15} /><input type="text" placeholder="Qidirish..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>
        {loading ? <div className="loading">Yuklanmoqda...</div> : filtered.length === 0 ? (
          <div className="empty"><Users size={48} color="#475569" /><p>Hali mijozlar yo'q. Yangi mijoz qo'shing!</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Mijoz ID</th><th>To'liq Ismi</th></tr></thead>
              <tbody>{filtered.map((c, i) => (<tr key={c.id}><td>{i + 1}</td><td><span className="id-badge">C-{c.customer_id}</span></td><td>{c.full_name || '—'}</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionsPage({ transactions, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customer_id: '', amount: '', transaction_type: 'Kirim', transaction_date: new Date().toISOString().slice(0, 16) });
  const [msg, setMsg] = useState('');
  const [filter, setFilter] = useState('Barchasi');

  useEffect(() => { fetch(`${API_BASE}/customers`).then(r => r.json()).then(setCustomers).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/add-transaction`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMsg('✅ Tranzaksiya muvaffaqiyatli qo\'shildi!'); setForm({ customer_id: '', amount: '', transaction_type: 'Kirim', transaction_date: new Date().toISOString().slice(0, 16) }); setShowForm(false); onRefresh(); }
    else setMsg(`❌ ${data.error}`);
    setTimeout(() => setMsg(''), 3000);
  };

  const filtered = filter === 'Barchasi' ? transactions : transactions.filter(t => t.TransactionType === filter);

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Tranzaksiyalar</h1><p className="page-sub">Barcha bank operatsiyalari</p></div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={16} /> Yangi Tranzaksiya</button>
      </div>
      <Alert msg={msg} />
      {showForm && (
        <div className="card form-card">
          <h3 className="card-title">Yangi Tranzaksiya Qo'shish</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Mijoz</label>
              <select value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })} required>
                <option value="">Mijoz tanlang</option>
                {customers.map(c => (<option key={c.id} value={c.id}>C-{c.customer_id} {c.full_name && `— ${c.full_name}`}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label>Summa ($)</label>
              <input type="number" step="0.01" min="0" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Turi</label>
              <select value={form.transaction_type} onChange={e => setForm({ ...form, transaction_type: e.target.value })}>
                <option value="Kirim">Kirim</option>
                <option value="Chiqim">Chiqim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sana va Vaqt</label>
              <input type="datetime-local" value={form.transaction_date} onChange={e => setForm({ ...form, transaction_date: e.target.value })} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Saqlash</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Bekor qilish</button>
            </div>
          </form>
        </div>
      )}
      <div className="card">
        <div className="card-head">
          <h2 className="card-title">Tranzaksiyalar Tarixi</h2>
          <div className="filter-tabs">
            {['Barchasi', 'Kirim', 'Chiqim'].map(f => (<button key={f} className={`filter-tab ${filter === f ? 'tab-active' : ''}`} onClick={() => setFilter(f)}>{f}</button>))}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Mijoz</th><th>Sana</th><th>Summa</th><th>Tur</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.TransactionID}>
                  <td>#{t.TransactionID}</td><td>C-{t.CustomerID}</td>
                  <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{t.TransactionDate}</td>
                  <td style={{ fontWeight: 700 }}>${t.Amount}</td>
                  <td><span className={`badge badge-${t.TransactionType === 'Kirim' ? 'kirim' : 'chiqim'}`}>{t.TransactionType}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage({ summary, transactions }) {
  const kirimCount = transactions.filter(t => t.TransactionType === 'Kirim').length;
  const chiqimCount = transactions.filter(t => t.TransactionType === 'Chiqim').length;
  const net = Number(summary.total_kirim) - Number(summary.total_chiqim);

  const doughnutData = { labels: ['Kirim', 'Chiqim'], datasets: [{ data: [kirimCount, chiqimCount], backgroundColor: ['#10b981', '#ef4444'], borderWidth: 0 }] };
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
  const seed = (n) => { let x = Math.sin(n) * 10000; return x - Math.floor(x); };
  const lineData = {
    labels: months,
    datasets: [
      { label: 'Kirim', data: months.map((_, i) => Math.round(seed(i + 1) * 5000 + 2000)), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.4, fill: true },
      { label: 'Chiqim', data: months.map((_, i) => Math.round(seed(i + 10) * 4000 + 1500)), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', tension: 0.4, fill: true },
    ]
  };
  const lineOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } } };

  return (
    <div className="page">
      <div className="page-header"><h1 className="page-title">Tahlillar</h1><p className="page-sub">Moliyaviy ko'rsatkichlar va statistika</p></div>
      <div className="stats-grid">
        <StatCard label="Umumiy Kirim" value={`$${Number(summary.total_kirim).toFixed(2)}`} icon={TrendingUp} color="#10b981" />
        <StatCard label="Umumiy Chiqim" value={`$${Number(summary.total_chiqim).toFixed(2)}`} icon={TrendingDown} color="#ef4444" />
        <StatCard label="Sof Daromad" value={`$${net.toFixed(2)}`} icon={Activity} color={net >= 0 ? "#10b981" : "#ef4444"} />
        <StatCard label="Jami Operatsiyalar" value={summary.total_transactions} icon={CreditCard} color="#6366f1" />
      </div>
      <div className="content-grid analytics-grid">
        <div className="card span-2">
          <div className="card-head"><h2 className="card-title">📅 Oylik Daromad Tahlili</h2></div>
          <div style={{ height: '280px' }}><Line data={lineData} options={lineOpts} /></div>
        </div>
        <div className="card">
          <div className="card-head"><h2 className="card-title">Tranzaksiya Turlari</h2></div>
          <div style={{ height: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8' } } } }} />
          </div>
          <div className="doughnut-stats">
            <div className="d-stat"><span style={{ color: '#10b981' }}>● Kirim</span><strong>{kirimCount}</strong></div>
            <div className="d-stat"><span style={{ color: '#ef4444' }}>● Chiqim</span><strong>{chiqimCount}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState({ total_kirim: 0, total_chiqim: 0, total_transactions: 0 });
  const [topCustomers, setTopCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    try {
      const [s, t, tr] = await Promise.all([fetch(`${API_BASE}/summary`), fetch(`${API_BASE}/top-customers`), fetch(`${API_BASE}/transactions`)]);
      setSummary(await s.json()); setTopCustomers(await t.json()); setTransactions(await tr.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 15000); return () => clearInterval(i); }, []);

  const pageLabels = { dashboard: '🏠 Bosh Sahifa', customers: '👥 Mijozlar', transactions: '💳 Tranzaksiyalar', analytics: '📊 Tahlillar' };

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="main">
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
          <span className="topbar-title">{pageLabels[activePage]}</span>
          <div className="avatar">B</div>
        </div>
        <div className="content">
          {activePage === 'dashboard' && <DashboardPage summary={summary} topCustomers={topCustomers} transactions={transactions} />}
          {activePage === 'customers' && <CustomersPage />}
          {activePage === 'transactions' && <TransactionsPage transactions={transactions} onRefresh={fetchData} />}
          {activePage === 'analytics' && <AnalyticsPage summary={summary} transactions={transactions} />}
        </div>
      </div>
    </div>
  );
}
