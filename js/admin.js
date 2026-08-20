// ==========================================
// SEBHS FBLA ADMIN CONTROL CENTER
// ==========================================

// ✏️ EDIT YOUR USERNAME AND PASSWORD HERE:
const ADMIN_CREDENTIALS = {
  username: "FBLAOfficers2026",      // Change to your desired username
  password: "SEBHSFbla2026"   // Change to your desired password
};

// ------------------------------------------
// 1. Session Protection
// ------------------------------------------
if (window.location.pathname.includes('admin.html')) {
  if (localStorage.getItem('fbla_admin_session') !== 'active') {
    window.location.href = 'login.html';
  }
}

// ------------------------------------------
// 2. DOM Initialization
// ------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initTabs();
  initDashboard();
});

// ------------------------------------------
// 3. Login Handling
// ------------------------------------------
function initLogin() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value.trim();
    const alertBox = document.getElementById('login-alert');

    if (userInput === ADMIN_CREDENTIALS.username && passInput === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('fbla_admin_session', 'active');
      window.location.href = 'admin.html';
    } else {
      if (alertBox) {
        alertBox.textContent = 'Invalid username or password.';
        alertBox.style.display = 'block';
      }
    }
  });
}

// ------------------------------------------
// 4. Logout Action
// ------------------------------------------
function logoutAdmin() {
  localStorage.removeItem('fbla_admin_session');
  window.location.href = 'login.html';
}

// ------------------------------------------
// 5. Admin Navigation Tabs
// ------------------------------------------
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (!tabButtons.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => (c.style.display = 'none'));

      btn.classList.add('active');
      const activeContent = document.getElementById(`${target}-tab`);
      if (activeContent) {
        activeContent.style.display = 'block';
      }
    });
  });
}

// ------------------------------------------
// 6. Dashboard Stat Counters
// ------------------------------------------
function initDashboard() {
  if (!window.location.pathname.includes('admin.html')) return;

  const pending = JSON.parse(localStorage.getItem('fbla_pending_inquiries')) || [];
  const completed = JSON.parse(localStorage.getItem('fbla_completed_inquiries')) || [];
  const events = JSON.parse(localStorage.getItem('fbla_events')) || [];
  const officers = JSON.parse(localStorage.getItem('fbla_officers')) || [];

  const pendingEl = document.getElementById('stat-pending');
  const completedEl = document.getElementById('stat-completed');
  const eventsEl = document.getElementById('stat-events');
  const officersEl = document.getElementById('stat-officers');

  if (pendingEl) pendingEl.textContent = pending.length;
  if (completedEl) completedEl.textContent = completed.length;
  if (eventsEl) eventsEl.textContent = events.length;
  if (officersEl) officersEl.textContent = officers.length;
}

// ------------------------------------------
// 7. Modal Control
// ------------------------------------------
function closeModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.style.display = 'none';
}
