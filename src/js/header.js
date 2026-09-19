/* ==========================================================================
   EventBooking — shared header actions
   Wires the Search / Wishlist / Account icons in the header on EVERY page,
   and the mobile hamburger menu on pages that do not load index.js.
   Include with:  <script src="…/src/js/header.js"></script>
   ========================================================================== */
(function () {
  "use strict";

  // Resolve page URLs relative to THIS file, so links work from index.html
  // (site root) and from every page inside src/pages/.
  var SCRIPT_SRC = document.currentScript && document.currentScript.src;
  function pageUrl(name) {
    return SCRIPT_SRC ? new URL("../pages/" + name, SCRIPT_SRC).href : name;
  }

  var EXPLORE_URL = pageUrl("explore-events.html");
  var WISHLIST_URL = pageUrl("wishlist.html");
  var BOOKINGS_URL = pageUrl("my-bookings.html");

  // Styles for the account dropdown (injected so no CSS file needs editing).
  var styleEl = document.createElement("style");
  styleEl.textContent =
    ".header-actions{position:relative}\n" +
    ".account-menu{position:absolute;top:calc(100% + 10px);right:0;min-width:190px;background:#fff;" +
    "border:1px solid var(--line,#E7E4EF);border-radius:14px;box-shadow:0 18px 40px -18px rgba(27,20,54,.35);" +
    "padding:6px;display:none;z-index:60}\n" +
    ".account-menu.is-open{display:block}\n" +
    ".account-menu a{display:block;padding:10px 12px;border-radius:9px;font-size:.9rem;font-weight:500;" +
    "color:var(--ink,#1B1730)}\n" +
    ".account-menu a:hover{background:#F1EFFD;color:var(--indigo-dark,#372AA8)}\n";
  document.head.appendChild(styleEl);

  function init() {
    var actions = document.querySelector(".header-actions");
    if (actions) {
      var searchBtn = actions.querySelector('[aria-label="Search"]');
      var wishBtn = actions.querySelector('[aria-label="Wishlist"]');
      var accountBtn = actions.querySelector('[aria-label="Account"]');

      // Search icon: focus the page's search box if it has one, otherwise open Explore with it focused.
      if (searchBtn) {
        searchBtn.addEventListener("click", function () {
          var input = document.getElementById("searchInput");
          if (input) {
            input.scrollIntoView({ behavior: "smooth", block: "center" });
            input.focus({ preventScroll: true });
          } else {
            window.location.href = EXPLORE_URL + "#search";
          }
        });
      }

      // Heart icon: go to the wishlist.
      if (wishBtn) {
        wishBtn.addEventListener("click", function () {
          window.location.href = WISHLIST_URL;
        });
      }

      // Account icon: small dropdown (there is no login system yet).
      if (accountBtn) {
        var menu = document.createElement("div");
        menu.className = "account-menu";
        menu.setAttribute("role", "menu");
        menu.innerHTML =
          '<a role="menuitem" href="' + BOOKINGS_URL + '">My Bookings</a>' +
          '<a role="menuitem" href="' + WISHLIST_URL + '">Wishlist</a>';
        actions.appendChild(menu);
        accountBtn.setAttribute("aria-haspopup", "true");
        accountBtn.setAttribute("aria-expanded", "false");

        var setOpen = function (open) {
          menu.classList.toggle("is-open", open);
          accountBtn.setAttribute("aria-expanded", String(open));
        };
        accountBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          setOpen(!menu.classList.contains("is-open"));
        });
        document.addEventListener("click", function (e) {
          if (!menu.contains(e.target)) setOpen(false);
        });
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape") setOpen(false);
        });
      }
    }

    // Arrived from another page via the search icon (…/explore-events.html#search).
    if (window.location.hash === "#search") {
      var box = document.getElementById("searchInput");
      if (box) box.focus();
    }

    // Hamburger menu: wired here unless index.js already did it (data-menu-bound flag prevents a double toggle).
    {
      var toggle = document.getElementById("menuToggle");
      var nav = document.getElementById("mobileNav");
      if (toggle && nav && !toggle.dataset.menuBound) {
        toggle.dataset.menuBound = "1";
        toggle.addEventListener("click", function () {
          var open = nav.classList.toggle("is-open");
          toggle.setAttribute("aria-expanded", String(open));
        });
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
