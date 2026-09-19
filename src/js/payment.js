// =============================================================================
// Payment — renders the pending order, validates attendee details, and
// creates the booking before handing off to booking-confirmation.html
// =============================================================================
(function () {
  "use strict";

  const order = getPendingOrder();
  const layout = document.getElementById("paymentLayout");
  const emptyState = document.getElementById("noOrderState");

  if (!order) {
    layout.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  function renderSummary() {
    document.getElementById("summaryImage").src = order.eventImage;
    document.getElementById("summaryImage").alt = order.eventTitle;
    document.getElementById("summaryTitle").textContent = order.eventTitle;
    document.getElementById("summaryDateTime").textContent = `${formatEventDate(order.eventDate)} · ${order.eventTime}`;
    document.getElementById("summaryVenue").textContent = `${order.venue}, ${order.city}`;

    document.getElementById("summaryTickets").innerHTML = order.tickets
      .map((t) => `<li><span>${t.type} × ${t.qty}</span><b>${formatPrice(t.price * t.qty)}</b></li>`)
      .join("");

    document.getElementById("summaryTotal").textContent = formatPrice(order.totalPrice);
    document.getElementById("payAmount").textContent = formatPrice(order.totalPrice);
  }

  function toggleCardFields() {
    const method = document.querySelector('input[name="paymentMethod"]:checked').value;
    document.getElementById("cardFields").hidden = method !== "Card";
  }

  function setFieldError(name, message) {
    const input = document.getElementById(name);
    const errorEl = document.querySelector(`[data-error-for="${name}"]`);
    input.classList.toggle("has-error", Boolean(message));
    errorEl.textContent = message || "";
  }

  function validate() {
    let ok = true;
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!fullName) { setFieldError("fullName", "Please enter your full name."); ok = false; }
    else setFieldError("fullName", "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError("email", "Enter a valid email address."); ok = false; }
    else setFieldError("email", "");

    if (!/^[+\d][\d\s-]{7,14}$/.test(phone)) { setFieldError("phone", "Enter a valid phone number."); ok = false; }
    else setFieldError("phone", "");

    return ok;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      toast("Please fix the highlighted fields", "error");
      return;
    }

    const payBtn = document.getElementById("payBtn");
    payBtn.disabled = true;
    payBtn.textContent = "Processing…";

    const booking = {
      id: generateBookingId(),
      status: "upcoming",
      eventId: order.eventId,
      title: order.eventTitle,
      image: order.eventImage,
      eventDate: order.eventDate,
      date: formatEventDate(order.eventDate),
      time: order.eventTime,
      venue: `${order.venue}, ${order.city}`,
      tickets: order.tickets,
      qty: order.totalQty,
      total: order.totalPrice,
      attendee: {
        name: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim()
      },
      paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
      bookedAt: new Date().toISOString()
    };

    // Simulate a brief processing delay so the flow feels real.
    setTimeout(() => {
      saveBookingRecord(booking);
      setLastBooking(booking);
      sessionStorage.removeItem("eb_pending_order");
      window.location.href = "booking-confirmation.html";
    }, 900);
  }

  // Pre-fill the attendee details from the signed-in account.
  function prefillFromAccount() {
    const user = Auth.currentUser();
    if (!user) return;
    const nameEl = document.getElementById("fullName");
    const emailEl = document.getElementById("email");
    if (nameEl && !nameEl.value) nameEl.value = user.name;
    if (emailEl && !emailEl.value) emailEl.value = user.email;
  }

  document.addEventListener("DOMContentLoaded", () => {
    prefillFromAccount();
    renderSummary();
    toggleCardFields();
    document.querySelectorAll('input[name="paymentMethod"]').forEach((r) => r.addEventListener("change", toggleCardFields));
    document.getElementById("checkoutForm").addEventListener("submit", handleSubmit);
  });
})();