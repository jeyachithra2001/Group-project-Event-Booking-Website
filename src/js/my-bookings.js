/* ==========================================================================
   My Bookings — the signed-in user's real bookings (created on the payment page)
   ========================================================================== */
(function () {
  "use strict";

  const ICON_CAL =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 9.5H21" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 3V6.5M16.5 3V6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const ICON_PIN =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9.5" r="2.3" stroke="currentColor" stroke-width="1.8"/></svg>';

  let activeTab = "upcoming";
  const listEl = document.getElementById("bookingList");
  const tabUpcoming = document.getElementById("tabUpcoming");
  const tabPast = document.getElementById("tabPast");
  const countUpcoming = document.getElementById("countUpcoming");
  const countPast = document.getElementById("countPast");

  /** upcoming | past | cancelled — "past" is worked out from the event date. */
  function statusOf(b) {
    if (b.status === "cancelled") return "cancelled";
    if (b.eventDate && new Date(b.eventDate + "T23:59:59") < new Date()) return "past";
    return "upcoming";
  }

  function ticketSummary(b) {
    return (b.tickets || []).map((t) => t.type).join(", ");
  }

  function bookingCard(b) {
    const st = statusOf(b);
    const label = st === "upcoming" ? "Upcoming" : st === "cancelled" ? "Cancelled" : "Past";
    return (
      '<article class="booking-card" data-id="' + esc(b.id) + '">' +
        '<div class="booking-thumb"><img src="' + esc(imageSrc(b.image)) + '" alt="' + esc(b.title) + '" width="200" height="150" decoding="async"></div>' +
        '<div class="booking-info">' +
          '<div class="booking-top-row"><span class="status-pill ' + st + '">' + label + "</span></div>" +
          '<h3 class="booking-title">' + esc(b.title) + "</h3>" +
          '<div class="booking-meta">' +
            "<span>" + ICON_CAL + esc(b.date) + " · " + esc(b.time) + "</span>" +
            "<span>" + ICON_PIN + esc(b.venue) + "</span>" +
          "</div>" +
          '<div class="booking-sub-meta">' +
            "<span>Booking ID: <b>" + esc(b.id) + "</b></span>" +
            "<span><b>" + b.qty + "</b> Tickets · " + esc(ticketSummary(b)) + " · " + formatPrice(b.total) + "</span>" +
          "</div>" +
        "</div>" +
        '<div class="booking-actions">' +
          '<button class="btn btn-primary" data-action="view">View Ticket</button>' +
          '<button class="btn btn-outline" data-action="cancel"' + (st !== "upcoming" ? " disabled" : "") + ">Cancel</button>" +
        "</div>" +
      "</article>"
    );
  }

  function emptyState(tab) {
    return (
      '<div class="empty-state">' +
        '<div class="empty-icon">' + ICON_CAL + "</div>" +
        "<h3>No " + tab + " bookings</h3>" +
        "<p>Once you book an event, it will show up here.</p>" +
        '<a class="btn btn-primary" href="explore-events.html">Explore events</a>' +
      "</div>"
    );
  }

  function render() {
    const all = getBookings();
    const upcoming = all.filter((b) => statusOf(b) === "upcoming");
    const past = all.filter((b) => statusOf(b) !== "upcoming");
    countUpcoming.textContent = "(" + upcoming.length + ")";
    countPast.textContent = "(" + past.length + ")";
    const shown = activeTab === "upcoming" ? upcoming : past;
    listEl.innerHTML = shown.length ? shown.map(bookingCard).join("") : emptyState(activeTab);
  }

  function setTab(tab) {
    activeTab = tab;
    tabUpcoming.classList.toggle("is-active", tab === "upcoming");
    tabPast.classList.toggle("is-active", tab === "past");
    tabUpcoming.setAttribute("aria-selected", String(tab === "upcoming"));
    tabPast.setAttribute("aria-selected", String(tab === "past"));
    render();
  }

  tabUpcoming.addEventListener("click", () => setTab("upcoming"));
  tabPast.addEventListener("click", () => setTab("past"));

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn || btn.disabled) return;
    const id = btn.closest(".booking-card").getAttribute("data-id");
    const booking = getBookings().find((b) => b.id === id);
    if (!booking) return;

    if (btn.dataset.action === "cancel") {
      if (confirm('Cancel your booking for "' + booking.title + '"?')) {
        updateBooking(id, { status: "cancelled" });
        toast("Booking cancelled");
        render();
      }
    }
    if (btn.dataset.action === "view") {
      setLastBooking(booking);
      window.location.href = "booking-confirmation.html";
    }
  });

  /* ---------------------------------------------------------------------------
     Demo data. Bookings live only in THIS browser's localStorage, so a fresh browser (or the
     GitHub Pages site) starts with none. To keep the Past tab from looking empty, each account
     gets two sample finished bookings once. Set SEED_DEMO_PAST to false to turn this off.
     --------------------------------------------------------------------------- */
  const SEED_DEMO_PAST = true;

  function seedDemoPastBookings() {
    if (!SEED_DEMO_PAST) return;
    const user = Auth.currentUser();
    if (!user) return;
    const flag = "eb_demo_past_seeded_" + user.id;
    try {
      if (localStorage.getItem(flag)) return;
    } catch (e) {
      return;
    }

    const samples = [
      { id: "EBK410276", eventId: "yoga-retreat", eventDate: "2026-08-09", qty: 2, bookedAt: "2026-07-20T10:15:00.000Z" },
      { id: "EBK528913", eventId: "art-exhibition", eventDate: "2026-07-18", qty: 1, bookedAt: "2026-06-30T16:40:00.000Z" }
    ];

    const existing = getBookings();
    const added = [];
    samples.forEach((d) => {
      const ev = getEventById(d.eventId);
      if (!ev || existing.some((b) => b.id === d.id)) return;
      const t = ev.tickets[0];
      added.push({
        id: d.id,
        status: "upcoming", // shown as "Past" automatically because the date has gone by
        eventId: ev.id,
        title: ev.title,
        image: ev.image,
        eventDate: d.eventDate,
        date: formatEventDate(d.eventDate),
        time: ev.time,
        venue: ev.venue + ", " + ev.city,
        tickets: [{ type: t.type, price: t.price, qty: d.qty }],
        qty: d.qty,
        total: t.price * d.qty,
        attendee: { name: user.name, email: user.email, phone: "" },
        paymentMethod: "demo",
        bookedAt: d.bookedAt,
        demo: true
      });
    });

    if (added.length) writeJSON(userKey("bookings"), existing.concat(added));
    try {
      localStorage.setItem(flag, "1");
    } catch (e) { /* ignore */ }
  }

  seedDemoPastBookings();
  render();
})();