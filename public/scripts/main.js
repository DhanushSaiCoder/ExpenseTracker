window.onload = function () {
    document.querySelector("#dashboardHeader h3").textContent = formatDateToDDMMYYYY(new Date());
    getExpensesFromDB();
    setDefaultView();
    refreshStats()
};

if (!localStorage.getItem('token')) window.location.href = '/auth/login'
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function logout() {
    localStorage.removeItem('token')
    window.location.href = '/auth/login'
}

function signout() {
    const token = localStorage.getItem('token');
    localStorage.removeItem('token')
    console.log(token);
    
    fetch('/auth/signout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: token
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Response not okay');
        return response.json();
    })
    .then(data => console.log(data))
    .catch(err => {
        console.error('Error signing out:', err);
    });
    window.location.href='/auth/signup'
}

function clearActiveClasses() {
    document.querySelectorAll('.navBtns').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.navBtns2').forEach(btn => btn.classList.remove('active2'));
}

function setActiveView(viewId) {
    document.querySelectorAll('#content > div').forEach(section => {
        section.style.display = section.id === viewId ? 'flex' : 'none';
    });
}

function setActiveViewWithButton(btnId, viewId) {
    clearActiveClasses();
    document.getElementById(btnId)?.classList.add('active');
    setActiveView(viewId);
}

function setDefaultView() {
    setActiveView('dashboard');
    document.getElementById('dashboardBtn')?.classList.add('active');
    document.getElementById('dashboardBtn2')?.classList.add('active2');
}

function openDashboard() {
    refreshStats?.(); // Check if refreshStats is defined
    setActiveViewWithButton('dashboardBtn', 'dashboard');
    document.getElementById('dashboardBtn2')?.classList.add('active2');
}

function openReports() {
    setActiveViewWithButton('reportsBtn', 'reports');
    document.getElementById('reportsBtn2')?.classList.add('active2');
    getExpensesFromDB()
}

function getExpensesFromDB() {
    const token = localStorage.getItem('token')
    fetch(`/expenses/${token}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(response => {
            if (!response.ok) throw new Error('response not okay');
            return response.json();
        })
        .then(data => displayReportTable(data))
        .catch(err => console.error('Error getting expenses:', err));

        
}

// function displayExpenses(ex) {
//     let tbody = '';
//     let k = 0;
//     for (let i = ex.length - 1; i >= 0 && k < 5; i--, k++) {
//         tbody += `<tr><td>${ex[i].amount}</td><td>${ex[i].reason}</td></tr>`;
//     }
//     tbody += `<tr><td colspan="2"><button id="showMore" onclick="openReports()">Show Report</button></td></tr>`;
//     document.getElementById('tbody').innerHTML = tbody;
//     displayReportTable(ex);
// }

function addExpense() {
    const button = document.getElementById('newExpenseBtn');
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.spinner');

    // Show loading animation
    buttonText.classList.add('hidden');
    spinner.classList.remove('hidden');
    button.disabled = true;

    const amount = document.getElementById('amountInp').value;
    const reason = document.getElementById('reasonInp').value;
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    // Debugging logs
    console.log('Token:', token);
    console.log('Amount:', amount);
    console.log('Reason:', reason);

    if (!amount || !reason || !token) {
        alert('Please fill in all fields.');
        buttonText.classList.remove('hidden');
        spinner.classList.add('hidden');
        button.disabled = false;
        return;
    }

    fetch('/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reason, token }),
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
        .catch(err => console.error('Error sending expense:', err))
        .finally(() => {
            // Restore button state
            buttonText.classList.remove('hidden');
            spinner.classList.add('hidden');
            button.disabled = false;
        });

    refreshStats();
}




function displayReportTable(ex) {
    if(ex.length == 0) {
        document.getElementById('reportTable').style.display = 'none'
        const noData = document.getElementById('noData')
        noData.innerText = 'No expenses yet!'
        return;
    }
    else{
        document.getElementById('reportTable').style.display = 'block'
        const noData = document.getElementById('noData')
        noData.innerText = ''
        
    }
    let bodyHtml = '';
    ex.reverse().forEach(item => {
        bodyHtml += `<tr class="reportRow">
                        <td class="amountColumn">${item.amount}</td>
                        <td>${item.reason}</td>
                        <td>${formatDateToDDMMYYYY(item.date)}</td>
                        <td class="opColumn"><button class="editExpenseBtn" onclick="editExpense('${item._id}')">edit</button>    <button class="deleteExpenseBtn" onclick="deleteExpense('${item._id}')">delete</button></td>
                    </tr>`;
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
function deleteExpense(id) {
    const button = document.querySelector(`button[onclick="deleteExpense('${id}')"]`);
    const originalText = button.textContent;

    // Add loading spinner to the delete button
    button.innerHTML = `<div class="spinner"></div>`;
    button.disabled = true;

    fetch(`/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(() => getExpensesFromDB()) // Refresh the expense list
        .catch(err => console.error('Error deleting expense:', err))
        .finally(() => {
            // Restore the button's original state
            button.innerHTML = originalText;
            button.disabled = false;
        });
}
function editExpense(id) {
    const button = document.querySelector(`button[onclick="editExpense('${id}')"]`);
    const originalText = button.innerHTML;

    // Add loading spinner to the button
    button.innerHTML = `<div class="spinner"></div>`;
    button.disabled = true;

    // Show the popup after fetching the data
    fetch(`/expenses/edit/${id}`, {
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

            // Show the popup
            popup.style.display = 'flex';
        })
        .catch(err => {
            console.error('Error getting expense data:', err);
            alert('Failed to fetch expense data.');
        })
        .finally(() => {
            // Restore the button's original state
            button.innerHTML = originalText;
            button.disabled = false;
        });
}
function updateExpense(id) {
    const button = document.getElementById('submitEditBtn');
    const originalText = button.innerHTML;

    // Add spinner to the button
    button.innerHTML = `<div class="spinner"></div> Saving...`;
    button.disabled = true;

    const amount = document.getElementById('amountInpPopup').value;
    const reason = document.getElementById('reasonInpPopup').value;

    if (!amount || !reason) {
        alert('Please fill in all fields.');
        button.innerHTML = originalText; // Restore the button
        button.disabled = false;
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
        .catch(err => {
            console.error('Error updating expense:', err);
            alert('Failed to update expense. Please try again.');
        })
        .finally(() => {
            // Restore the button state
            button.innerHTML = originalText;
            button.disabled = false;
        });
}

function refreshStats() {
    const token = localStorage.getItem('token')
    fetch(`/expenses/${token}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(response => {
            if (!response.ok) {
                throw new Error('Response not okay');
            }
            return response.json();
        })
        .then(data => {
            const dayExpensesTxt = document.getElementById('daysExpensesTxt');
            const monthExpensesTxt = document.getElementById('monthsExpenseTxt');

            const today = new Date();
            const currDate = formatDateToDDMMYYYY(today);
            const currMonth = today.getMonth(); // Month is zero-indexed

            let dailyExpenses = 0;
            let monthlyExpenses = 0;

            data.forEach((expense, index) => {
                if (!expense || !expense.date || expense.amount == null) {
                    return;
                }

                const expenseDate = new Date(expense.date); // Ensure Date object
                const expenseAmount = expense.amount;

                if (isNaN(expenseDate.getTime())) {
                    return;
                }

                // Daily Expenses
                if (expenseDate.toDateString() === today.toDateString()) {
                    dailyExpenses += expenseAmount;
                }

                // Monthly Expenses
                if (expenseDate.getMonth() === currMonth && expenseDate.getFullYear() === today.getFullYear()) {
                    monthlyExpenses += expenseAmount;
                }
            });

            // Update the DOM with the totals
            dayExpensesTxt.textContent = `₹${dailyExpenses}`;
            monthExpensesTxt.textContent = `₹${monthlyExpenses}`;
        })
        .catch(err => {
            document.getElementById('errorTxt').textContent = 'Failed to fetch expense data. Please try again later.';
            console.error('Error getting expenses:', err);
        });
}

