function openDashboard() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const dashboardBtn = document.getElementById('dashboardBtn');
    dashboardBtn.classList.add('active');
    // Additional logic for opening the dashboard view
}

function openLatestExpenses() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const latestExpensesBtn = document.getElementById('latestExpensesBtn');
    latestExpensesBtn.classList.add('active');
    // Additional logic for opening the latest expenses view
}

function openAddExpense() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    addExpenseBtn.classList.add('active');
    // Additional logic for opening the add expense form
}

function openCategories() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const categoriesBtn = document.getElementById('categoriesBtn');
    categoriesBtn.classList.add('active');
    // Additional logic for opening the categories view
}

function openReports() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const reportsBtn = document.getElementById('reportsBtn');
    reportsBtn.classList.add('active');
    // Additional logic for opening the reports view
}

function openProfile() {
    const buttons = document.querySelectorAll('.navBtns');
    buttons.forEach(btn => btn.classList.remove('active'));
    const profileBtn = document.getElementById('profileBtn');
    profileBtn.classList.add('active');
    // Additional logic for opening the profile view
}
