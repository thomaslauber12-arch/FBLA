/**
 * Administrator Panel & CRUD Operations Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  if (!db.isAuthenticated()) {
    window.location.href = "login.html";
    return;
  }

  setupAdminTabs();
  renderAdminTables();
  setupModalHandlers();
});

function setupAdminTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.style.display = "none");

      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");
      document.getElementById(target + "-tab").style.display = "block";
    });
  });
}

function renderAdminTables() {
  renderEventsTable();
  renderAnnouncementsTable();
  renderOfficersTable();
  loadSettingsForm();
}

function renderEventsTable() {
  const tbody = document.getElementById("admin-events-list");
  if (!tbody) return;

  const events = db.getEvents();
  tbody.innerHTML = events.map(e => `
    <tr>
      <td><strong>${e.title}</strong></td>
      <td>${e.date}</td>
      <td>${e.location}</td>
      <td><span class="badge ${e.status === 'past' ? 'badge-past' : 'badge-upcoming'}">${e.status}</span></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteEventItem('${e.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

function renderAnnouncementsTable() {
  const tbody = document.getElementById("admin-announcements-list");
  if (!tbody) return;

  const list = db.getAnnouncements();
  tbody.innerHTML = list.map(a => `
    <tr>
      <td><strong>${a.title}</strong></td>
      <td>${a.date}</td>
      <td>${a.pinned ? 'Yes' : 'No'}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteAnnouncementItem('${a.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

function renderOfficersTable() {
  const tbody = document.getElementById("admin-officers-list");
  if (!tbody) return;

  const list = db.getOfficers();
  tbody.innerHTML = list.map(o => `
    <tr>
      <td><strong>${o.name}</strong></td>
      <td>${o.position}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteOfficerItem('${o.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

function loadSettingsForm() {
  const settings = db.getSettings();
  if (document.getElementById("set-email")) {
    document.getElementById("set-email").value = settings.contactEmail || "";
    document.getElementById("set-phone").value = settings.phone || "";
    document.getElementById("set-address").value = settings.schoolAddress || "";
  }
}

function setupModalHandlers() {
  document.getElementById("btn-add-event")?.addEventListener("click", () => {
    openModal("Add Event", getEventFormHTML());
  });

  document.getElementById("btn-add-announcement")?.addEventListener("click", () => {
    openModal("Create Announcement", getAnnouncementFormHTML());
  });

  document.getElementById("btn-add-officer")?.addEventListener("click", () => {
    openModal("Add Officer", getOfficerFormHTML());
  });

  document.getElementById("settings-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const settings = {
      chapterName: "Southeast Bulloch High School FBLA",
      contactEmail: document.getElementById("set-email").value,
      phone: document.getElementById("set-phone").value,
      schoolAddress: document.getElementById("set-address").value
    };
    db.saveSettings(settings);
    alert("Chapter settings saved successfully!");
  });
}

function openModal(title, html) {
  const modal = document.getElementById("admin-modal");
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").innerHTML = html;
  modal.classList.add("open");
}

function closeModal() {
  document.getElementById("admin-modal").classList.remove("open");
}

window.deleteEventItem = function(id) {
  if (confirm("Are you sure you want to delete this event?")) {
    db.deleteEvent(id);
    renderEventsTable();
  }
};

window.deleteAnnouncementItem = function(id) {
  if (confirm("Are you sure you want to delete this announcement?")) {
    db.deleteAnnouncement(id);
    renderAnnouncementsTable();
  }
};

window.deleteOfficerItem = function(id) {
  if (confirm("Are you sure you want to delete this officer?")) {
    db.deleteOfficer(id);
    renderOfficersTable();
  }
};

window.handleFormSubmit = function(event, type) {
  event.preventDefault();
  if (type === 'event') {
    db.saveEvent({
      title: document.getElementById("evt-title").value,
      date: document.getElementById("evt-date").value,
      time: document.getElementById("evt-time").value,
      location: document.getElementById("evt-location").value,
      description: document.getElementById("evt-desc").value,
      status: document.getElementById("evt-status").value
    });
    renderEventsTable();
  } else if (type === 'announcement') {
    db.saveAnnouncement({
      title: document.getElementById("ann-title").value,
      date: new Date().toISOString().split('T')[0],
      content: document.getElementById("ann-content").value,
      pinned: document.getElementById("ann-pinned").checked
    });
    renderAnnouncementsTable();
  } else if (type === 'officer') {
    db.saveOfficer({
      name: document.getElementById("off-name").value,
      position: document.getElementById("off-role").value,
      bio: document.getElementById("off-bio").value,
      photo: document.getElementById("off-photo").value || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    });
    renderOfficersTable();
  }
  closeModal();
};

function getEventFormHTML() {
  return `
    <form onsubmit="handleFormSubmit(event, 'event')">
      <div class="form-group"><label>Event Title</label><input type="text" id="evt-title" class="form-control" required></div>
      <div class="form-group"><label>Date</label><input type="date" id="evt-date" class="form-control" required></div>
      <div class="form-group"><label>Time</label><input type="text" id="evt-time" class="form-control" placeholder="e.g. 3:30 PM - 4:30 PM" required></div>
      <div class="form-group"><label>Location</label><input type="text" id="evt-location" class="form-control" required></div>
      <div class="form-group"><label>Status</label><select id="evt-status" class="form-control"><option value="upcoming">Upcoming</option><option value="past">Past</option></select></div>
      <div class="form-group"><label>Description</label><textarea id="evt-desc" class="form-control" rows="3" required></textarea></div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Save Event</button>
    </form>
  `;
}

function getAnnouncementFormHTML() {
  return `
    <form onsubmit="handleFormSubmit(event, 'announcement')">
      <div class="form-group"><label>Title</label><input type="text" id="ann-title" class="form-control" required></div>
      <div class="form-group"><label>Content</label><textarea id="ann-content" class="form-control" rows="4" required></textarea></div>
      <div class="form-group"><label><input type="checkbox" id="ann-pinned"> Pin Announcement</label></div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Post Announcement</button>
    </form>
  `;
}

function getOfficerFormHTML() {
  return `
    <form onsubmit="handleFormSubmit(event, 'officer')">
      <div class="form-group"><label>Officer Name</label><input type="text" id="off-name" class="form-control" required></div>
      <div class="form-group"><label>Position</label><input type="text" id="off-role" class="form-control" required></div>
      <div class="form-group"><label>Photo URL</label><input type="url" id="off-photo" class="form-control" placeholder="https://..."></div>
      <div class="form-group"><label>Bio</label><textarea id="off-bio" class="form-control" rows="3" required></textarea></div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Add Officer</button>
    </form>
  `;
}

function logoutAdmin() {
  db.logout();
  window.location.href = "login.html";
}
