/* ==========================================================================
   Eventra — shared code, loaded on EVERY page (in <head>, before the page renders)

   1. Auth guard      – sends visitors to signup / login before they can see the app
   2. Auth helpers    – signup, login, logout (used by js/auth.js and the header menu)
   3. Per-user store  – wishlist + bookings saved in localStorage for the signed-in user
   4. Header wiring   – search / wishlist / account menu / mobile menu / logout
   5. Small helpers   – toast, heart icon

   NOTE: this is a front-end-only demo. Accounts live in this browser's localStorage and
   passwords are salted + hashed, but that is NOT a substitute for a real backend.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   1. Auth storage + guard
   --------------------------------------------------------------------------- */
const USERS_KEY = "eb_users";
const SESSION_KEY = "eb_session";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

const Auth = {
  users() {
    return readJSON(USERS_KEY, []);
  },
  session() {
    return readJSON(SESSION_KEY, null);
  },
  isLoggedIn() {
    const s = this.session();
    return Boolean(s && s.id);
  },
  currentUser() {
    return this.session();
  },
  /** Where a logged-out visitor should land: signup for a brand-new visitor, login otherwise. */
  entryPage() {
    return this.users().length ? "login.html" : "signup.html";
  },

  async hashPassword(password, salt) {
    const text = salt + ":" + password;
    if (window.crypto && window.crypto.subtle) {
      const buf = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    // Very old / insecure-context fallback (not cryptographically strong).
    let h = 5381;
    for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
    return "f" + h.toString(16);
  },
  makeSalt() {
    const bytes = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
    else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  },

  async signup({ name, email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.users();
    if (users.some((u) => u.email === cleanEmail)) {
      return { ok: false, code: "exists", error: "An account with this email already exists." };
    }
    const salt = this.makeSalt();
    const user = {
      id: "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      email: cleanEmail,
      salt,
      hash: await this.hashPassword(password, salt),
      createdAt: new Date().toISOString()
    };
    users.push(user);
    if (!writeJSON(USERS_KEY, users)) {
      return { ok: false, code: "storage", error: "Your browser blocked saving the account. Please allow site storage and try again." };
    }
    this.startSession(user);
    return { ok: true, user };
  },

  async login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.users().find((u) => u.email === cleanEmail);
    if (!user) {
      return { ok: false, code: "no-account", error: "We couldn't find an account with that email." };
    }
    const hash = await this.hashPassword(password, user.salt);
    if (hash !== user.hash) {
      return { ok: false, code: "bad-password", error: "That password isn't right. Please try again." };
    }
    this.startSession(user);
    return { ok: true, user };
  },

  startSession(user) {
    writeJSON(SESSION_KEY, { id: user.id, name: user.name, email: user.email });
  },

  logout() {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem("eb_pending_order");
      sessionStorage.removeItem("eb_last_booking");
    } catch (e) { /* ignore */ }
    window.location.replace("login.html");
  },

  /** Only allow redirects to another page of this site (never to an external URL). */
  safeNext(value) {
    if (!value) return "index.html";
    return /^[a-z][a-z-]*\.html(\?[^#\s]*)?$/i.test(value) && !/^(login|signup)\.html/i.test(value)
      ? value
      : "index.html";
  }
};

/* The guard runs immediately (this script is in <head>) so a logged-out visitor is redirected
   before the page paints — no flash of protected content. */
(function guard() {
  const isPublic = document.documentElement.getAttribute("data-auth") === "public";
  if (isPublic) {
    if (Auth.isLoggedIn()) window.location.replace("index.html");
    return;
  }
  if (!Auth.isLoggedIn()) {
    const here = window.location.pathname.split("/").pop() + window.location.search;
    const target = Auth.entryPage();
    window.location.replace(target + (here && here !== "index.html" ? "?next=" + encodeURIComponent(here) : ""));
  }
})();

/* ---------------------------------------------------------------------------
   2. Per-user data (wishlist + bookings)
   --------------------------------------------------------------------------- */
function userKey(name) {
  const s = Auth.session();
  return "eb_" + name + "_" + (s ? s.id : "guest");
}

function getWishlist() {
  return readJSON(userKey("wishlist"), []);
}
function setWishlist(ids) {
  writeJSON(userKey("wishlist"), ids);
  updateWishlistBadge();
}
function isWishlisted(id) {
  return getWishlist().includes(id);
}
/** Toggle an id in the wishlist and return the new state (true = saved). */
function toggleWishlist(id) {
  const list = getWishlist();
  const i = list.indexOf(id);
  if (i === -1) list.push(id); else list.splice(i, 1);
  setWishlist(list);
  return list.includes(id);
}

function getBookings() {
  return readJSON(userKey("bookings"), []);
}
function saveBookingRecord(booking) {
  const list = getBookings();
  list.unshift(booking);
  writeJSON(userKey("bookings"), list);
}
function updateBooking(id, changes) {
  const list = getBookings().map((b) => (b.id === id ? { ...b, ...changes } : b));
  writeJSON(userKey("bookings"), list);
}
function generateBookingId() {
  return "EBK" + Math.floor(100000 + Math.random() * 900000);
}

/* Order hand-off between event-details → payment → booking-confirmation (per tab). */
function setPendingOrder(order) {
  sessionStorage.setItem("eb_pending_order", JSON.stringify(order));
}
function getPendingOrder() {
  try {
    const raw = sessionStorage.getItem("eb_pending_order");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function setLastBooking(booking) {
  sessionStorage.setItem("eb_last_booking", JSON.stringify(booking));
}
function getLastBooking() {
  try {
    const raw = sessionStorage.getItem("eb_last_booking");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/* ---------------------------------------------------------------------------
   3. Small UI helpers
   --------------------------------------------------------------------------- */
function heartIcon(filled) {
  return `<svg viewBox="0 0 24 24" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8">
    <path d="M12 20.5S3 14.9 3 8.9C3 5.9 5.3 3.8 8 3.8c1.7 0 3.3.9 4 2.3.7-1.4 2.3-2.3 4-2.3 2.7 0 5 2.1 5 5.1 0 6-9 11.6-9 11.6Z"/>
  </svg>`;
}

/** Escape text before putting it into innerHTML. */
function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/** Short-lived pill notification (styled in css/index.css). */
function toast(message, tone = "default") {
  let root = document.getElementById("toastRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "toastRoot";
    root.className = "toast-root";
    document.body.appendChild(root);
  }
  const el = document.createElement("div");
  el.className = "toast-chip toast-" + tone;
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => {
    el.classList.add("toast-hide");
    setTimeout(() => el.remove(), 200);
  }, 2200);
}

/** One event card, used by Home, Explore and (via the same markup) anywhere else events are listed.
    Needs js/data.js on the page. */
function eventCardHTML(ev) {
  const saved = isWishlisted(ev.id);
  return `
    <article class="event-card" data-id="${ev.id}">
      <a href="event-details.html?id=${encodeURIComponent(ev.id)}" class="event-card-link">
        <div class="event-thumb">
          <img src="${ev.image}" alt="${esc(ev.title)}" width="600" height="450" loading="lazy" decoding="async">
          <button type="button" class="wishlist-toggle${saved ? " is-saved" : ""}" data-wishlist="${ev.id}" aria-pressed="${saved}" aria-label="${saved ? "Remove from wishlist" : "Add to wishlist"}">
            ${heartIcon(saved)}
          </button>
        </div>
        <div class="event-body">
          <h3 class="event-title">${esc(ev.title)}</h3>
          <div class="event-meta">
            <span>${formatEventDate(ev.date)} · ${ev.time}</span>
            <span>${esc(ev.venue)}, ${esc(ev.city)}</span>
          </div>
          <div class="event-price">${formatPrice(eventFromPrice(ev))} <small>onwards</small></div>
        </div>
      </a>
    </article>`;
}

/** Make the heart buttons inside a container work (event delegation, survives re-renders). */
function bindWishlistToggles(container, onChange) {
  container.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-wishlist]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const id = btn.getAttribute("data-wishlist");
    const saved = toggleWishlist(id);
    btn.classList.toggle("is-saved", saved);
    btn.setAttribute("aria-pressed", String(saved));
    btn.setAttribute("aria-label", saved ? "Remove from wishlist" : "Add to wishlist");
    btn.innerHTML = heartIcon(saved);
    toast(saved ? "Added to wishlist" : "Removed from wishlist", saved ? "success" : "default");
    if (typeof onChange === "function") onChange(id, saved);
  });
}

function updateWishlistBadge() {
  const btn = document.querySelector('.header-actions [aria-label="Wishlist"]');
  if (!btn) return;
  const n = getWishlist().length;
  btn.setAttribute("title", n ? "Wishlist (" + n + ")" : "Wishlist");
}

/* ---------------------------------------------------------------------------
   4. Header wiring (the header markup itself is static HTML on each page, so it
      paints instantly and never has to be rebuilt by JavaScript).
   --------------------------------------------------------------------------- */
function initHeader() {
  const actions = document.querySelector(".header-actions");
  const user = Auth.currentUser();

  if (actions) {
    const searchBtn = actions.querySelector('[aria-label="Search"]');
    const wishBtn = actions.querySelector('[aria-label="Wishlist"]');
    const accountBtn = actions.querySelector('[aria-label="Account"]');

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const input = document.getElementById("searchInput");
        if (input) {
          input.scrollIntoView({ behavior: "smooth", block: "center" });
          input.focus({ preventScroll: true });
        } else {
          window.location.href = "explore-events.html#search";
        }
      });
    }

    if (wishBtn) wishBtn.addEventListener("click", () => (window.location.href = "wishlist.html"));

    if (accountBtn && user) {
      const menu = document.createElement("div");
      menu.className = "account-menu";
      menu.setAttribute("role", "menu");
      menu.innerHTML =
        '<div class="account-menu-user"><strong>' + esc(user.name) + "</strong><span>" + esc(user.email) + "</span></div>" +
        '<a role="menuitem" href="my-bookings.html">My Bookings</a>' +
        '<a role="menuitem" href="wishlist.html">Wishlist</a>' +
        '<button type="button" role="menuitem" class="menu-logout" id="logoutBtn">Log out</button>';
      actions.appendChild(menu);
      accountBtn.setAttribute("aria-haspopup", "true");
      accountBtn.setAttribute("aria-expanded", "false");

      const setOpen = (open) => {
        menu.classList.toggle("is-open", open);
        accountBtn.setAttribute("aria-expanded", String(open));
      };
      accountBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setOpen(!menu.classList.contains("is-open"));
      });
      document.addEventListener("click", (e) => { if (!menu.contains(e.target)) setOpen(false); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
      menu.querySelector("#logoutBtn").addEventListener("click", () => Auth.logout());
    }
  }

  // Mobile menu: hamburger + a Log out row.
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mobileNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    if (user) {
      const out = document.createElement("button");
      out.type = "button";
      out.className = "mobile-logout";
      out.textContent = "Log out";
      out.addEventListener("click", () => Auth.logout());
      nav.appendChild(out);
    }
  }

  // Arrived from the header search icon on another page (…/explore-events.html#search).
  if (window.location.hash === "#search") {
    const box = document.getElementById("searchInput");
    if (box) box.focus();
  }

  updateWishlistBadge();
}

if (document.documentElement.getAttribute("data-auth") !== "public") {
  document.addEventListener("DOMContentLoaded", initHeader);
}
