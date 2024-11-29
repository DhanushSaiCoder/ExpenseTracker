function setActiveView(viewId) {
    const sections = document.querySelectorAll('#content > div');
    sections.forEach(section => {
      if (section.id === viewId) {
        section.style.display = 'block';
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
  