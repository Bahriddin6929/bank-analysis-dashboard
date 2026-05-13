const API_URL = "http://127.0.0.1:8000/api";

// Fetch Summary Data
async function loadSummary() {
    try {
        const response = await fetch(`${API_URL}/summary`);
        const data = await response.json();
        
        document.getElementById('total-kirim').innerText = `$${data.total_kirim.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        document.getElementById('total-chiqim').innerText = `$${data.total_chiqim.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        document.getElementById('total-transactions').innerText = data.total_transactions.toLocaleString();
    } catch (error) {
        console.error("Error loading summary:", error);
    }
}

// Fetch Top Customers & Render Chart
async function loadTopCustomers() {
    try {
        const response = await fetch(`${API_URL}/top-customers`);
        const data = await response.json();

        const labels = data.map(c => `Customer #${c.CustomerID}`);
        const amounts = data.map(c => c.Amount);

        renderChart(labels, amounts);
    } catch (error) {
        console.error("Error loading top customers:", error);
    }
}

// Render Chart.js
function renderChart(labels, data) {
    const ctx = document.getElementById('topCustomersChart').getContext('2d');
    
    // Gradient for bars
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); // red top
    gradient.addColorStop(1, 'rgba(239, 68, 68, 0.2)'); // red bottom

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses ($)',
                data: data,
                backgroundColor: gradient,
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

// Fetch Recent Transactions & Render Table
async function loadTransactions() {
    try {
        const response = await fetch(`${API_URL}/transactions`);
        const data = await response.json();

        const tbody = document.querySelector('#transactions-table tbody');
        tbody.innerHTML = ''; // clear

        data.forEach(t => {
            const tr = document.createElement('tr');
            
            const isKirim = t.TransactionType === 'Kirim';
            const badgeClass = isKirim ? 'type-kirim' : 'type-chiqim';

            tr.innerHTML = `
                <td>#${t.TransactionID}</td>
                <td>CUST-${t.CustomerID}</td>
                <td>${t.TransactionDate}</td>
                <td style="font-weight: 600;">$${t.Amount.toFixed(2)}</td>
                <td><span class="type-badge ${badgeClass}">${t.TransactionType}</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading transactions:", error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSummary();
    loadTopCustomers();
    loadTransactions();
});
