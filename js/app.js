/**
 * Frontend Dynamic Rendering & Interactivity Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupClipboardCopy();
  setupContactForm();
  routePageRenderer();
});

function setupNavigation() {
  const toggle = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }
}

function setupClipboardCopy() {
  const copyItems = document.querySelectorAll(".copyable-item");
  copyItems.forEach(item => {
    item.addEventListener("click", () => {
      const textToCopy = item.getAttribute("data-copy");
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast("Copied to clipboard!");
        }).catch(() => {
          showToast("Failed to copy");
        });
      }
    });
  });
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const message = document.getElementById("contact-message").value;

    db.saveInquiry({ name, email, message });
    showToast("Message sent! We will respond shortly.");
    form.reset();
  });
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function routePageRenderer() {
  const path = window.location.pathname;

  if (path.endsWith("index.html") || path === "/" || path.endsWith("/")) {
    renderHome();
  } else if (path.endsWith("events.html")) {
    renderEventsPage();
  } else if (path.endsWith("announcements.html")) {
    renderAnnouncementsPage();
  } else if (path.endsWith("officers.html")) {
    renderOfficersPage();
  }
}

function renderHome() {
  const eventsContainer = document.getElementById("home-events-grid");
  const annContainer = document.getElementById("home-announcements-grid");

  if (eventsContainer) {
    const upcoming = db.getEvents().filter(e => e.status !== "past").slice(0, 3);
    eventsContainer.innerHTML = upcoming.length 
      ? upcoming.map(e => createEventCard(e)).join("") 
      : "<p class='text-muted'>No upcoming events scheduled at this time.</p>";
  }

  if (annContainer) {
    const announcements = db.getAnnouncements().slice(0, 3);
    annContainer.innerHTML = announcements.length 
      ? announcements.map(a => createAnnouncementCard(a)).join("") 
      : "<p class='text-muted'>No announcements published yet.</p>";
  }
}

function renderEventsPage() {
  const upcomingGrid = document.getElementById("upcoming-events-grid");
  const pastGrid = document.getElementById("past-events-grid");

  const events = db.getEvents();
  const upcoming = events.filter(e => e.status !== "past");
  const past = events.filter(e => e.status === "past");

  if (upcomingGrid) {
    upcomingGrid.innerHTML = upcoming.length 
      ? upcoming.map(e => createEventCard(e)).join("") 
      : "<p class='text-muted'>No upcoming events scheduled at this time.</p>";
  }

  if (pastGrid) {
    pastGrid.innerHTML = past.length 
      ? past.map(e => createEventCard(e)).join("") 
      : "<p class='text-muted'>No past events recorded in the archive.</p>";
  }
}

function renderAnnouncementsPage() {
  const grid = document.getElementById("announcements-grid");
  if (grid) {
    const announcements = db.getAnnouncements().sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    grid.innerHTML = announcements.length 
      ? announcements.map(a => createAnnouncementCard(a)).join("") 
      : "<p class='text-muted'>No announcements posted.</p>";
  }
}

function renderOfficersPage() {
  const grid = document.getElementById("officers-grid");
  if (grid) {
    const officers = db.getOfficers();
    grid.innerHTML = officers.map(o => `
      <div class="card">
        <img src="${o.photo}" alt="${o.name}" class="officer-img" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'">
        <div class="card-body">
          <div class="officer-role">${o.position}</div>
          <h3 class="card-title">${o.name}</h3>
          <p class="card-text">${o.bio}</p>
        </div>
      </div>
    `).join("");
  }
}

function createEventCard(e) {
  const isPast = e.status === "past";
  return `
    <div class="card">
      <div class="card-body">
        <span class="badge ${isPast ? 'badge-past' : 'badge-upcoming'}">${isPast ? 'Past Event' : 'Upcoming'}</span>
        <h3 class="card-title">${e.title}</h3>
        <div class="card-meta">
          <span>📅 ${e.date}</span> | <span>⏰ ${e.time}</span>
        </div>
        <div class="card-meta">📍 ${e.location}</div>
        <p class="card-text">${e.description}</p>
      </div>
    </div>
  `;
}

function createAnnouncementCard(a) {
  return `
    <div class="card">
      <div class="card-body">
        ${a.pinned ? '<span class="badge badge-pinned">📌 Pinned Announcement</span>' : ''}
        <h3 class="card-title">${a.title}</h3>
        <div class="card-meta">Posted on ${a.date}</div>
        <p class="card-text">${a.content}</p>
      </div>
    </div>
  `;
}
