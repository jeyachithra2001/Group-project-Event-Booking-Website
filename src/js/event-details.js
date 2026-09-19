// =============================================================================
// Event Details — render a single event, manage ticket quantities, hand off
// the selected order to payment.html via sessionStorage.
// =============================================================================
(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const event = eventId ? getEventById(eventId) : null;

  const contentEl = document.getElementById("eventDetailsContent");
  const notFoundEl = document.getElementById("notFoundState");

  if (!event) {
    contentEl.style.display = "none";
    notFoundEl.style.display = "block";
    return;
  }

  const quantities = {}; // ticketType -> qty
  event.tickets.forEach((t) => (quantities[t.type] = 0));

  function renderHero() {
    document.getElementById("heroImage").src = event.image;
    document.getElementById("heroImage").alt = event.title;
    document.title = `${event.title} — Eventra`;
  }

  function renderSummary() {
    document.getElementById("eventCategory").textContent = event.category;
    document.getElementById("eventTitle").textContent = event.title;
    document.getElementById("eventRating").textContent = `${event.rating} (${event.reviews.toLocaleString("en-IN")} reviews)`;
    document.getElementById("eventDateTime").textContent = `${formatEventDate(event.date)} · ${event.time}`;
    document.getElementById("eventVenue").innerHTML = `📍 ${event.venue}, ${event.city}`;
    document.getElementById("eventOrganizer").innerHTML = `🏷️ Organized by ${event.organizer}`;
  }

  function renderAboutPanel() {
    document.getElementById("eventAbout").textContent = event.about;
    document.getElementById("eventHighlights").innerHTML = event.highlights.map((h) => `<li>${h}</li>`).join("");

    const shown = event.gallery.slice(0, 4);
    const extra = event.gallery.length - 4;
    document.getElementById("eventGallery").innerHTML = shown
      .map((src, i) => {
        const isLast = i === 3 && extra > 0;
        return `<img src="${src}" alt="${event.title} photo ${i + 1}" class="${isLast ? "gallery-more" : ""}" ${isLast ? `data-more="+${extra}"` : ""}>`;
      })
      .join("");
  }

  function renderDetailsPanel() {
    document.getElementById("detailsDate").textContent = formatEventDate(event.date);
    document.getElementById("detailsTime").textContent = event.time;
    document.getElementById("detailsCategory").textContent = event.category;
  }

  function renderVenuePanel() {
    document.getElementById("venueText").textContent = `${event.venue}, ${event.city}. Doors open 45 minutes before the listed start time — please carry a valid photo ID.`;
  }

  function renderOrganizerPanel() {
    document.getElementById("organizerAvatar").textContent = "";
    document.getElementById("organizerName").textContent = event.organizer;
  }

  function renderReviewsPanel() {
    document.getElementById("reviewScore").textContent = event.rating;
    document.getElementById("reviewCount").textContent = `${event.reviews.toLocaleString("en-IN")} reviews`;
  }

  function ticketRowHTML(t) {
    return `
      <div class="ticket-row" data-ticket="${t.type}">
        <span>
          <span class="ticket-type-name">${t.type}</span>
          <span class="ticket-type-desc">${t.desc}</span>
        </span>
        <span class="ticket-price">${formatPrice(t.price)}</span>
        <span class="qty-stepper" data-ticket-stepper="${t.type}">
          <button type="button" data-action="dec" aria-label="Decrease quantity">−</button>
          <span data-qty-display>0</span>
          <button type="button" data-action="inc" aria-label="Increase quantity">+</button>
        </span>
      </div>`;
  }

  function renderTickets() {
    document.getElementById("ticketRows").innerHTML = event.tickets.map(ticketRowHTML).join("");
    document.getElementById("bookingFromPrice").textContent = formatPrice(eventFromPrice(event));
  }

  function updateBookingSummary() {
    const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);
    const totalPrice = event.tickets.reduce((sum, t) => sum + t.price * quantities[t.type], 0);
    const selectedBlock = document.getElementById("bookingSelected");
    selectedBlock.hidden = totalQty === 0;
    document.getElementById("bookingQtyTotal").textContent = totalQty;
    document.getElementById("bookingPriceTotal").textContent = formatPrice(totalPrice);
    document.getElementById("bookNowBtn").disabled = totalQty === 0;
  }

  function bindTicketSteppers() {
    document.getElementById("ticketRows").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const row = btn.closest("[data-ticket-stepper]");
      const type = row.getAttribute("data-ticket-stepper");
      if (btn.dataset.action === "inc") quantities[type] = Math.min(10, quantities[type] + 1);
      if (btn.dataset.action === "dec") quantities[type] = Math.max(0, quantities[type] - 1);
      row.querySelector("[data-qty-display]").textContent = quantities[type];
      updateBookingSummary();
    });
  }

  function bindTabs() {
    const tabs = document.querySelectorAll(".detail-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        const name = tab.getAttribute("data-tab");
        document.querySelectorAll(".detail-panel").forEach((p) => {
          p.hidden = p.getAttribute("data-panel") !== name;
        });
      });
    });
  }

  function syncWishlistButtons() {
    const saved = isWishlisted(event.id);
    const heroBtn = document.getElementById("heroWishlistBtn");
    const sideBtn = document.getElementById("wishlistBtn");
    heroBtn.innerHTML = heartIcon(saved);
    heroBtn.classList.toggle("is-saved", saved);
    heroBtn.setAttribute("aria-pressed", String(saved));
    sideBtn.textContent = saved ? "Saved to Wishlist" : "Add to Wishlist";
    sideBtn.classList.toggle("btn-outline", true);
  }

  function bindWishlist() {
    const toggle = () => {
      const saved = toggleWishlist(event.id);
      syncWishlistButtons();
      toast(saved ? "Added to wishlist" : "Removed from wishlist", saved ? "success" : "default");
    };
    document.getElementById("heroWishlistBtn").addEventListener("click", toggle);
    document.getElementById("wishlistBtn").addEventListener("click", toggle);
  }

  function bindBookNow() {
    document.getElementById("bookNowBtn").addEventListener("click", () => {
      const selectedTickets = event.tickets
        .filter((t) => quantities[t.type] > 0)
        .map((t) => ({ type: t.type, price: t.price, qty: quantities[t.type] }));
      if (!selectedTickets.length) return;

      const totalQty = selectedTickets.reduce((a, t) => a + t.qty, 0);
      const totalPrice = selectedTickets.reduce((a, t) => a + t.qty * t.price, 0);

      setPendingOrder({
        eventId: event.id,
        eventTitle: event.title,
        eventImage: event.image,
        eventDate: event.date,
        eventTime: event.time,
        venue: event.venue,
        city: event.city,
        tickets: selectedTickets,
        totalQty,
        totalPrice
      });

      window.location.href = "payment.html";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHero();
    renderSummary();
    renderAboutPanel();
    renderDetailsPanel();
    renderVenuePanel();
    renderOrganizerPanel();
    renderReviewsPanel();
    renderTickets();
    updateBookingSummary();
    bindTicketSteppers();
    bindTabs();
    syncWishlistButtons();
    bindWishlist();
    bindBookNow();
  });
})();