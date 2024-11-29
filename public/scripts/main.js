document.querySelector("#dashboardHeader h3").textContent = new Date().toLocaleDateString();

function setActiveView(viewId) {
    const sections = document.querySelectorAll('#content > div');
    sections.forEach(section => {
        if (section.id === viewId) {
            section.style.display = 'flex';
        } else {
            section.style.display = 'none';
        }
    });
}

function setDefaultView() {
    // Set Dashboard as the default active view
    const dashboardBtn = document.getElementById('dashboardBtn');
    dashboardBtn.classList.add('active');

    setActiveView('dashboard');
}

function openDashboard() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const dashboardBtn = document.getElementById('dashboardBtn');
    dashboardBtn.classList.add('active');

    setActiveView('dashboard');
}

function openLatestExpenses() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const latestExpensesBtn = document.getElementById('latestExpensesBtn');
    latestExpensesBtn.classList.add('active');

    setActiveView('latestExpenses');
}

function openAddExpense() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    addExpenseBtn.classList.add('active');

    setActiveView('addExpense');
}

function openCategories() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const categoriesBtn = document.getElementById('categoriesBtn');
    categoriesBtn.classList.add('active');

    setActiveView('categories');
}

function openReports() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const reportsBtn = document.getElementById('reportsBtn');
    reportsBtn.classList.add('active');

    setActiveView('reports');
}

function openProfile() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const profileBtn = document.getElementById('profileBtn');
    profileBtn.classList.add('active');

    setActiveView('profile');
}

// Initialize default view on page load
window.onload = function () {
    setDefaultView();
};

function getExpensesFromDB() {
    fetch('/expenses', {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) throw new Error('response not okay');
            return response.json()
        })
        .then(data => {
            const expenses = data;
            displayExpenses(expenses)
        })
        .catch(err => {
            console.error('Error getting expenses', err)

        })
}

getExpensesFromDB()
function displayExpenses(ex) {
    console.log(ex);
    let inner = ''; // Start with an empty string
    let k = 0; // Counter for limiting to 5 expenses
  
    // Iterate through the expenses array from the end, up to 5 items
    for (let i = ex.length - 1; i >= 0 && k < 5; i--) {
      let html = `<tr>
                    <td>${ex[i].amount}</td>
                    <td>${ex[i].reason}</td>
                  </tr>`;
      inner += html; // Append the new row
      k++;
    }
    inner +=`<td colspan="2"><button onclick="openReports()" id="showMore">Show more...</button></td>
                </tr>`
  
    console.log(inner);
    document.getElementById('tbody').innerHTML = inner; // Update the table body
  }
  

function addExpense() {
    const amount = document.getElementById('amountInp').value
    const reason = document.getElementById('reasonInp').value

    fetch('/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, reason })

    })  
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success', data)

        })
        .catch(err => {
            console.error('error sending expense', err)
        })
    document.getElementById('amountInp').value = ''
    document.getElementById('reasonInp').value = ''
    getExpensesFromDB()
}
