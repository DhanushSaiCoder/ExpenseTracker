window.onload = function () {
    document.querySelector("#dashboardHeader h3").textContent = formatDateToDDMMYYYY(new Date());
    getExpensesFromDB();
    setDefaultView();
};

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

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
    
    // Debugging logs to ensure values are being captured correctly
    console.log('Amount:', amount);
    console.log('Reason:', reason);

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
        .then(() => {
            getExpensesFromDB(); // Refresh the expense list after adding
            // Clear the input fields after successful submission
            document.getElementById('amountInp').value = '';
            document.getElementById('reasonInp').value = '';
        })
        .catch(err => console.error('Error sending expense:', err));
}

function displayReportTable(ex) {
    let bodyHtml = '';
    ex.reverse().forEach(item => {
        bodyHtml += `<tr class="reportRow">
                        <td>${item.amount}</td>
                        <td>${item.reason}</td>
                        <td>${formatDateToDDMMYYYY(item.date)}</td>
                        <td class="opColumn"><button class="editExpenseBtn" onclick="editExpense('${item._id}')">edit</button>    <button class="deleteExpenseBtn" onclick="deleteExpense('${item._id}')">delete</button></td>
                    </tr>`;
    });
    document.getElementById('reportTableBody').innerHTML = bodyHtml;
}

function editExpense(id) {
    console.log(id);
}

function formatDateToDDMMYYYY(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Ensures 2 digits for day
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

function deleteExpense(id) {
    fetch(`/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(() => getExpensesFromDB())
        .catch(err => console.error('Error sending expense:', err));
}

function editExpense(id) {
    // Show the popup
    popup.style.display = 'flex';

    // Get the current expense data (you can either fetch this data from the database or pass it with the expense object)
    fetch(`/expenses/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (!response.ok) throw new Error('Error fetching expense data');
            return response.json();
        })
        .then(data => {
            // Populate the input fields in the popup with the expense data
            document.getElementById('amountInpPopup').value = data.amount;
            document.getElementById('reasonInpPopup').value = data.reason;

            // Store the ID on the submit button so we can reference it when the form is submitted
            document.getElementById('submitEditBtn').onclick = function () {
                updateExpense(id);
            };
        })
        .catch(err => console.error('Error getting expense data:', err));
}

function updateExpense(id) {
    const amount = document.getElementById('amountInpPopup').value;
    const reason = document.getElementById('reasonInpPopup').value;

    if (!amount || !reason) {
        alert('Please fill in all fields.');
        return;
    }

    fetch(`/expenses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reason }),
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(() => {
            getExpensesFromDB(); // Refresh the expense list
            popup.style.display = 'none'; // Close the popup after updating
        })
        .catch(err => console.error('Error updating expense:', err));
}
