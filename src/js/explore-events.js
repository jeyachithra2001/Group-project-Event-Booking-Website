// =============================================================================
// Explore Events — filter / sort / paginate the shared EVENTS catalogue
// =============================================================================
(function () {
  "use strict";

  const PAGE_SIZE = 6;
  let currentPage = 1;

  const grid = document.getElementById("resultsGrid");
  const emptyState = document.getElementById("emptyState");
  const resultsCount = document.getElementById("resultsCount");
  const pagination = document.getElementById("pagination");
  const searchInput = document.getElementById("searchInput");
  const dateFilter = document.getElementById("dateFilter");
  const locationFilter = document.getElementById("locationFilter");
  const priceRange = document.getElementById("priceRange");
  const priceRangeValue = document.getElementById("priceRangeValue");
  const sortSelect = document.getElementById("sortSelect");
  const categoryChecks = () => Array.from(document.querySelectorAll('input[name="category"]'));

  function populateLocations() {
    const cities = [...new Set(EVENTS.map((e) => e.city))].sort();
    cities.forEach((city) => {
      const opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      locationFilter.appendChild(opt);
    });
  }

  function readFilters() {
    const categories = categoryChecks().filter((c) => c.checked).map((c) => c.value);
    return {
      q: (searchInput.value || "").trim().toLowerCase(),
      categories,
      dateWithin: dateFilter.value ? Number(dateFilter.value) : null,
      city: locationFilter.value,
      maxPrice: Number(priceRange.value),
      sort: sortSelect.value
    };
  }

  function applyFilters() {
    const f = readFilters();
    const now = new Date();
    let list = EVENTS.filter((ev) => {
      if (f.q && !(ev.title.toLowerCase().includes(f.q) || ev.city.toLowerCase().includes(f.q) || ev.venue.toLowerCase().includes(f.q))) return false;
      if (f.categories.length && !f.categories.includes(ev.category)) return false;
      if (f.city && ev.city !== f.city) return false;
      if (f.maxPrice < 8000 && eventFromPrice(ev) > f.maxPrice) return false;
      if (f.dateWithin) {
        const days = (new Date(ev.date) - now) / 86400000;
        if (days < 0 || days > f.dateWithin) return false;
      }
      return true;
    });

    switch (f.sort) {
      case "price-asc": list.sort((a, b) => eventFromPrice(a) - eventFromPrice(b)); break;
      case "price-desc": list.sort((a, b) => eventFromPrice(b) - eventFromPrice(a)); break;
      case "date": list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => b.reviews - a.reviews);
    }

    return list;
  }

  function render() {
    const list = applyFilters();
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);

    resultsCount.textContent = `Showing ${list.length} event${list.length === 1 ? "" : "s"}`;
    grid.style.display = list.length ? "grid" : "none";
    emptyState.style.display = list.length ? "none" : "block";
    grid.innerHTML = pageItems.map(eventCardHTML).join("");

    renderPagination(totalPages);
    updateClearButtonVisibility();
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) { pagination.innerHTML = ""; return; }
    let html = `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""} aria-label="Previous page">‹</button>`;
    for (let p = 1; p <= totalPages; p++) {
      html += `<button class="page-btn${p === currentPage ? " is-active" : ""}" data-page="${p}">${p}</button>`;
    }
    html += `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""} aria-label="Next page">›</button>`;
    pagination.innerHTML = html;
  }

  function updateClearButtonVisibility() {
    const f = readFilters();
    const dirty = f.q || f.categories.length || f.dateWithin || f.city || f.maxPrice < 8000;
    document.getElementById("clearFilters").style.display = dirty ? "inline" : "none";
  }

  function clearAllFilters() {
    searchInput.value = "";
    categoryChecks().forEach((c) => (c.checked = false));
    dateFilter.value = "";
    locationFilter.value = "";
    priceRange.value = 8000;
    priceRangeValue.textContent = "₹8,000+";
    sortSelect.value = "popularity";
    currentPage = 1;
    render();
  }

  function bindEvents() {
    document.getElementById("searchForm").addEventListener("submit", (e) => { e.preventDefault(); currentPage = 1; render(); });
    categoryChecks().forEach((c) => c.addEventListener("change", () => { currentPage = 1; render(); }));
    dateFilter.addEventListener("change", () => { currentPage = 1; render(); });
    locationFilter.addEventListener("change", () => { currentPage = 1; render(); });
    sortSelect.addEventListener("change", () => { currentPage = 1; render(); });
    priceRange.addEventListener("input", () => {
      priceRangeValue.textContent = Number(priceRange.value) >= 8000 ? "₹8,000+" : formatPrice(priceRange.value);
      currentPage = 1;
      render();
    });
    document.getElementById("clearFilters").addEventListener("click", clearAllFilters);
    document.getElementById("clearFiltersBottom").addEventListener("click", clearAllFilters);
    document.getElementById("emptyClearBtn").addEventListener("click", clearAllFilters);

    bindWishlistToggles(grid);

    pagination.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-page]");
      if (!btn || btn.disabled) return;
      currentPage = Number(btn.getAttribute("data-page"));
      render();
      window.scrollTo({ top: document.querySelector(".explore-layout").offsetTop - 100, behavior: "smooth" });
    });
  }

  function applyUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const category = params.get("category");
    if (q) searchInput.value = q;
    if (category) {
      const match = categoryChecks().find((c) => c.value === category);
      if (match) match.checked = true;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    populateLocations();
    applyUrlParams();
    bindEvents();
    render();
  });
})();