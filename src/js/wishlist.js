/* ==========================================================================
   Wishlist — the events the signed-in user has hearted anywhere in the app
   ========================================================================== */
(function () {
  "use strict";

  const ICON_CAL =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 9.5H21" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 3V6.5M16.5 3V6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const ICON_PIN =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9.5" r="2.3" stroke="currentColor" stroke-width="1.8"/></svg>';
  const ICON_TRASH =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V4.8c0-.44.36-.8.8-.8h4.4c.44 0 .8.36.8.8V7M6.5 7l.7 12.2c.05.99.87 1.8 1.87 1.8h6.86c1 0 1.82-.8 1.87-1.8L18.5 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_HEART =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 20.5S3 14.9 3 8.9C3 5.9 5.3 3.8 8 3.8c1.7 0 3.3.9 4 2.3.7-1.4 2.3-2.3 4-2.3 2.7 0 5 2.1 5 5.1 0 6-9 11.6-9 11.6Z" stroke="currentColor" stroke-width="1.7"/></svg>';

  const listEl = document.getElementById("wishlistList");
  const countEl = document.getElementById("wishlistCount");
  const clearBtn = document.getElementById("clearAllBtn");

  function savedEvents() {
    return getWishlist().map(getEventById).filter(Boolean);
  }

  function wishlistCard(ev) {
    return (
      '<article class="wishlist-card" data-id="' + ev.id + '">' +
        '<a class="wishlist-thumb" href="event-details.html?id=' + encodeURIComponent(ev.id) + '"><img src="' + ev.image + '" alt="' + esc(ev.title) + '" width="200" height="150" decoding="async"></a>' +
        '<div class="wishlist-info">' +
          '<h3 class="wishlist-title">' + esc(ev.title) + "</h3>" +
          '<div class="wishlist-meta">' +
            "<span>" + ICON_CAL + formatEventDate(ev.date) + " · " + ev.time + "</span>" +
            "<span>" + ICON_PIN + esc(ev.venue) + ", " + esc(ev.city) + "</span>" +
          "</div>" +
          '<div class="wishlist-price">' + formatPrice(eventFromPrice(ev)) + " <small>onwards</small></div>" +
        "</div>" +
        '<div class="wishlist-actions">' +
          '<button class="remove-btn" data-action="remove" aria-label="Remove from wishlist">' + ICON_TRASH + "</button>" +
          '<button class="btn btn-primary" data-action="book">Book Now</button>' +
        "</div>" +
      "</article>"
    );
  }

  function emptyState() {
    return (
      '<div class="empty-state">' +
        '<div class="empty-icon">' + ICON_HEART + "</div>" +
        "<h3>Your wishlist is empty</h3>" +
        "<p>Tap the heart on any event to save it here for later.</p>" +
        '<a class="btn btn-primary" href="explore-events.html">Explore events</a>' +
      "</div>"
    );
  }

  function render() {
    const items = savedEvents();
    countEl.textContent = items.length;
    clearBtn.style.display = items.length ? "" : "none";
    listEl.innerHTML = items.length ? items.map(wishlistCard).join("") : emptyState();
  }

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.closest(".wishlist-card").getAttribute("data-id");

    if (btn.dataset.action === "remove") {
      setWishlist(getWishlist().filter((x) => x !== id));
      toast("Removed from wishlist");
      render();
    }
    if (btn.dataset.action === "book") {
      window.location.href = "event-details.html?id=" + encodeURIComponent(id);
    }
  });

  clearBtn.addEventListener("click", () => {
    if (!getWishlist().length) return;
    if (confirm("Remove all events from your wishlist?")) {
      setWishlist([]);
      render();
    }
  });

  render();
})();
