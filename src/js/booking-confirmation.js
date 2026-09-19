// =============================================================================
// Booking Confirmation — render the just-created booking, offer a copyable
// booking ID, a generated QR-style graphic, and a downloadable ticket file.
// =============================================================================
(function () {
  "use strict";

  const booking = getLastBooking();
  const content = document.getElementById("confirmationContent");
  const emptyState = document.getElementById("noBookingState");

  if (!booking) {
    content.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  function renderBooking() {
    document.getElementById("bookingIdValue").textContent = booking.id;
    document.getElementById("ticketImage").src = booking.image;
    document.getElementById("ticketImage").alt = booking.title;
    document.getElementById("ticketTitle").textContent = booking.title;
    document.getElementById("ticketDateTime").textContent = `${booking.date} · ${booking.time}`;
    document.getElementById("ticketVenue").textContent = booking.venue;

    const ticketTypeLabel = booking.tickets.map((t) => t.type).join(", ");
    document.getElementById("ticketTypeValue").textContent = ticketTypeLabel;
    document.getElementById("ticketQtyValue").textContent = booking.qty;
    document.getElementById("ticketTotalValue").textContent = formatPrice(booking.total);
    document.getElementById("emailNote").textContent = booking.attendee.email;
  }

  /**
   * Draws a deterministic, QR-look grid seeded from the booking ID. It is a
   * decorative stand-in — not a scannable code — since there's no backend or
   * network call to encode against in this preview build.
   */
  function renderQr() {
    const size = 11;
    const cell = 12;
    const seedStr = booking.id + "|" + booking.eventId;
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;

    function rand() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    let cells = "";
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const inFinder =
          (x < 3 && y < 3) || (x > size - 4 && y < 3) || (x < 3 && y > size - 4);
        const on = inFinder ? (x === 1 && y === 1 ? false : true) : rand() > 0.55;
        if (on) cells += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" rx="2"/>`;
      }
    }

    const viewBoxSize = size * cell;
    document.getElementById("qrCode").innerHTML = `
      <svg viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="100%" height="100%" fill="#1B1730">
        <rect x="0" y="0" width="${viewBoxSize}" height="${viewBoxSize}" fill="#fff" rx="10"/>
        ${cells}
      </svg>`;
  }

  function bindCopy() {
    document.getElementById("copyIdBtn").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(booking.id);
      } catch {
        /* clipboard API unavailable — the ID is still visible to copy manually */
      }
      toast("Booking ID copied", "success");
    });
  }

  function bindDownload() {
    document.getElementById("downloadBtn").addEventListener("click", () => {
      const lines = [
        "EVENTRA — E-TICKET",
        "========================",
        `Booking ID: ${booking.id}`,
        `Event: ${booking.title}`,
        `Date & Time: ${booking.date} · ${booking.time}`,
        `Venue: ${booking.venue}`,
        "",
        "Ticket Details",
        "--------------",
        ...booking.tickets.map((t) => `${t.type} × ${t.qty} — ${formatPrice(t.price * t.qty)}`),
        "",
        `Total Paid: ${formatPrice(booking.total)}`,
        `Payment Method: ${booking.paymentMethod}`,
        "",
        "Attendee",
        "--------",
        `Name: ${booking.attendee.name}`,
        `Email: ${booking.attendee.email}`,
        `Phone: ${booking.attendee.phone}`,
        "",
        "Please carry a valid photo ID and present this ticket at the venue gate."
      ];
      const blob = new Blob([lines.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${booking.id}-eticket.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast("Ticket downloaded", "success");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderBooking();
    renderQr();
    bindCopy();
    bindDownload();
  });
})();