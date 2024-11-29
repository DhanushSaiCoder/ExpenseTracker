window.onload = function () {
    document.querySelector("#dashboardHeader h3").textContent = formatDateToDDMMYYYY(new Date());

    getExpensesFromDB();
    setDefaultView();
};

function setActiveView(viewId) {
    const sections = document.querySelectorAll('#content > div');
    sections.forEach(section => {
        section.style.display = section.id === viewId ? 'flex' : 'none';
    });
}

function setDefaultView() {
    document.getElementById('dashboardBtn').classList.add('active');
    setActiveView('dashboard');
}

function openDashboard() {
    setActiveViewWithButton('dashboardBtn', 'dashboard');
}

function openReports() {
    setActiveViewWithButton('reportsBtn', 'reports');
}

function openProfile() {
    setActiveViewWithButton('profileBtn', 'profile');
}

function setActiveViewWithButton(btnId, viewId) {
    document.querySelectorAll('.navBtns').forEach(btn => btn.classList.remove('active'));
    document.getElementById(btnId).classList.add('active');
    setActiveView(viewId);
}

function getExpensesFromDB() {
    fetch('/expenses', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(response => {
            if (!response.ok) throw new Error('response not okay');
            return response.json();
        })
        .then(data => displayExpenses(data))
        .catch(err => console.error('Error getting expenses:', err));
}

function displayExpenses(ex) {
    let tbody = '';
    let k = 0;
    for (let i = ex.length - 1; i >= 0 && k < 5; i--, k++) {
        tbody += `<tr><td>${ex[i].amount}</td><td>${ex[i].reason}</td></tr>`;
    }
    tbody += `<tr><td colspan="2"><button id="showMore" onclick="openReports()">Show more...</button></td></tr>`;
    document.getElementById('tbody').innerHTML = tbody;
    displayReportTable(ex);
}

function addExpense() {
    const amount = document.getElementById('amountInp').value;
    const reason = document.getElementById('reasonInp').value;

    if (!amount || !reason) {
        alert('Please fill in all fields.');
        return;
    }

    fetch('/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reason }),
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(() => getExpensesFromDB())
        .catch(err => console.error('Error sending expense:', err));

    document.getElementById('amountInp').value = '';
    document.getElementById('reasonInp').value = '';
}

function displayReportTable(ex) {
    let bodyHtml = '';
    ex.forEach(item => {
        bodyHtml += `<tr class="reportRow"><td>${item.amount}</td><td>${item.reason}</td><td>${formatDateToDDMMYYYY(item.date)}</td></tr>`;
    });
    document.getElementById('reportTableBody').innerHTML = bodyHtml;
}
function formatDateToDDMMYYYY(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Ensures 2 digits for day
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}
