/**
 * Data Store & Persistence Layer for SEHS FBLA Website
 */

const SEED_DATA = {
  settings: {
    chapterName: "Southeast Bulloch High School FBLA",
    contactEmail: "sehs-fbla@bulloch.k12.ga.us",
    schoolAddress: "9184 Brooklet-Denmark Rd, Brooklet, GA 30415",
    phone: "(912) 842-8400",
    instagram: "@sehs_fbla",
    facebook: "Southeast Bulloch High School FBLA"
  },
  events: [
    {
      id: "evt-101",
      title: "Fall Leadership Conference (FLC)",
      date: "2026-11-15",
      time: "8:00 AM - 4:00 PM",
      location: "Athens Convention Center, Athens, GA",
      description: "Join state-wide FBLA chapters for intensive leadership workshops, competitive event orientation, and keynote speakers.",
      status: "upcoming"
    },
    {
      id: "evt-102",
      title: "Region 4 Leadership Conference",
      date: "2027-01-22",
      time: "9:00 AM - 3:00 PM",
      location: "Georgia Southern University, Statesboro, GA",
      description: "Compete against regional high school chapters in accounting, web design, entrepreneurship, and public speaking.",
      status: "upcoming"
    },
    {
      id: "evt-103",
      title: "Monthly Chapter Organizational Meeting",
      date: "2026-09-10",
      time: "3:30 PM - 4:30 PM",
      location: "Room 402 (Business Lab)",
      description: "Orientation for new members, discussion on membership dues, competitive event selection, and officer roles.",
      status: "past"
    }
  ],
  announcements: [
    {
      id: "ann-201",
      title: "2026-2027 Official Membership Registration Now Open",
      date: "2026-08-20",
      content: "Official membership registration for the upcoming school year is now active. Pay your annual dues online or visit Room 402 to receive your official SEHS FBLA shirt.",
      pinned: true
    },
    {
      id: "ann-202",
      title: "Competitive Event Preference Form Deadline",
      date: "2026-09-01",
      content: "Please select your top three competitive event categories by September 15th to ensure study prep materials and practice tests are ordered in time.",
      pinned: false
    }
  ],
  officers: [
    {
      id: "off-301",
      name: "Emma Davis",
      position: "Chapter President",
      bio: "Senior at SEHS. Passionate about healthcare administration and competitive public speaking. Leading chapter growth initiatives for 2026.",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "off-302",
      name: "Marcus Johnson",
      position: "Vice President of Competition",
      bio: "Junior focusing on Financial Accounting and Web Design events. Aiming for national qualification at NLC.",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "off-303",
      name: "Sophia Martinez",
      position: "Secretary & Reporter",
      bio: "Sophomore overseeing chapter communications, social media outreach, and official event documentation.",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"
    }
  ]
};

class DataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem("sehs_fbla_initialized")) {
      localStorage.setItem("sehs_fbla_events", JSON.stringify(SEED_DATA.events));
      localStorage.setItem("sehs_fbla_announcements", JSON.stringify(SEED_DATA.announcements));
      localStorage.setItem("sehs_fbla_officers", JSON.stringify(SEED_DATA.officers));
      localStorage.setItem("sehs_fbla_settings", JSON.stringify(SEED_DATA.settings));
      localStorage.setItem("sehs_fbla_initialized", "true");
    }
  }

  // Events
  getEvents() {
    return JSON.parse(localStorage.getItem("sehs_fbla_events") || "[]");
  }

  saveEvent(event) {
    const events = this.getEvents();
    if (event.id) {
      const idx = events.findIndex(e => e.id === event.id);
      if (idx !== -1) events[idx] = event;
    } else {
      event.id = "evt-" + Date.now();
      events.unshift(event);
    }
    localStorage.setItem("sehs_fbla_events", JSON.stringify(events));
  }

  deleteEvent(id) {
    const events = this.getEvents().filter(e => e.id !== id);
    localStorage.setItem("sehs_fbla_events", JSON.stringify(events));
  }

  // Announcements
  getAnnouncements() {
    return JSON.parse(localStorage.getItem("sehs_fbla_announcements") || "[]");
  }

  saveAnnouncement(ann) {
    const items = this.getAnnouncements();
    if (ann.id) {
      const idx = items.findIndex(a => a.id === ann.id);
      if (idx !== -1) items[idx] = ann;
    } else {
      ann.id = "ann-" + Date.now();
      items.unshift(ann);
    }
    localStorage.setItem("sehs_fbla_announcements", JSON.stringify(items));
  }

  deleteAnnouncement(id) {
    const items = this.getAnnouncements().filter(a => a.id !== id);
    localStorage.setItem("sehs_fbla_announcements", JSON.stringify(items));
  }

  // Officers
  getOfficers() {
    return JSON.parse(localStorage.getItem("sehs_fbla_officers") || "[]");
  }

  saveOfficer(officer) {
    const officers = this.getOfficers();
    if (officer.id) {
      const idx = officers.findIndex(o => o.id === officer.id);
      if (idx !== -1) officers[idx] = officer;
    } else {
      officer.id = "off-" + Date.now();
      officers.push(officer);
    }
    localStorage.setItem("sehs_fbla_officers", JSON.stringify(officers));
  }

  deleteOfficer(id) {
    const officers = this.getOfficers().filter(o => o.id !== id);
    localStorage.setItem("sehs_fbla_officers", JSON.stringify(officers));
  }

  // Settings
  getSettings() {
    return JSON.parse(localStorage.getItem("sehs_fbla_settings") || "{}");
  }

  saveSettings(settings) {
    localStorage.setItem("sehs_fbla_settings", JSON.stringify(settings));
  }

  // Authentication
  isAuthenticated() {
    return sessionStorage.getItem("sehs_fbla_admin_session") === "true";
  }

  login(username, password) {
    if (username === "admin" && password === "fbla2026!") {
      sessionStorage.setItem("sehs_fbla_admin_session", "true");
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem("sehs_fbla_admin_session");
  }
}

const db = new DataStore();
