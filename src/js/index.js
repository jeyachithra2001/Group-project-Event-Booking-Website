/* ==========================================================================
   Home page — event rows, category shortcuts, hero search, newsletter
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const featuredGrid = document.getElementById("featuredGrid");
  const popularGrid = document.getElementById("popularGrid");

  const pick = (ids) => ids.map(getEventById).filter(Boolean);
  featuredGrid.innerHTML = pick(FEATURED_IDS).map(eventCardHTML).join("");
  popularGrid.innerHTML = pick(POPULAR_IDS).map(eventCardHTML).join("");
  bindWishlistToggles(featuredGrid);
  bindWishlistToggles(popularGrid);

  // Category shortcuts → Explore, pre-filtered.
  const catRow = document.getElementById("catRow");
  catRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-item");
    if (!btn) return;
    catRow.querySelectorAll(".cat-item").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const cat = btn.dataset.cat;
    window.location.href = PAGES + "explore-events.html" + (cat === "More" ? "" : "?category=" + encodeURIComponent(cat));
  });

  // Hero search → Explore with ?q=
  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("searchInput").value.trim();
    window.location.href = PAGES + "explore-events.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });

  // Newsletter
  const form = document.getElementById("newsletterForm");
  const status = document.getElementById("newsletterStatus");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.style.color = "#FFC2CF";
      status.textContent = "Please enter a valid email address.";
      return;
    }
    status.style.color = "#C9F5D0";
    status.textContent = "Thanks — a confirmation link has been sent to " + email + ".";
    form.reset();
  });
});
