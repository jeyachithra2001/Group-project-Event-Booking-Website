# Eventra

Eventra is a front-end event-discovery and ticket-booking demo — browse events, filter and
search, view details, add tickets to a booking, pay (simulated), and manage bookings and a
wishlist, all with a persistent per-user account. It's built with plain HTML/CSS/JS (no
framework, no build step, no backend) so it's easy to read, fork, and extend.

**Live demo:** https://suriyavr.github.io/Eventra/

## ✨ Features

- **Browse & discover** — featured/popular events on the homepage, category shortcuts
  (Music, Sports, Arts & Culture, Food & Drink, Business, Workshops)
- **Explore & filter** — search, filter by event type / date / location / price range, sort by
  popularity
- **Event details** — full description, highlights, ticket types & pricing, organizer info,
  photo gallery
- **Booking flow** — pick ticket type & quantity → attendee details → payment (UPI / card /
  net banking / wallet, all simulated) → confirmation screen with a booking ID and QR code
- **Accounts** — sign up / log in, salted + hashed passwords, session persisted in the browser
- **My Bookings** — upcoming vs. past bookings, view ticket / cancel
- **Wishlist** — heart any event from anywhere in the app to save it for later
- **Responsive header** — search, wishlist, and account menu, with a mobile nav

## 🛠 Tech stack

Plain **HTML5, CSS3, and vanilla JavaScript** — no frameworks, no bundler, no dependencies.
Data (11 sample events across 6 categories) lives in `js/data.js`; accounts, wishlist, and
bookings are stored in the browser's `localStorage` (this is a front-end demo only — there is
no real backend, payment processor, or database).

## 🚀 Run locally

Run any static server in this folder, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/` (or just double-click `index.html`).
First visit → **Sign up**. After that → **Log in** (or sign up again to try a second account).

## 📁 Project structure

```
Eventra/
├── index.html           home page (GitHub Pages opens it automatically)
├── README.md
├── assets/
│   ├── icons/           UI icons (search, heart, calendar, category icons, …)
│   ├── images/          event cover + gallery photos
│   └── logos/           Eventra logo marks + favicon
└── src/
    ├── css/             one stylesheet per page, plus shared tokens/header/footer styles
    ├── js/
    │   ├── common.js    shared: auth guard, auth helpers, per-user storage, header wiring
    │   ├── data.js      the event catalogue — single source of truth for all pages
    │   ├── auth.js      login / signup page logic
    │   └── *.js         one file per page (index, explore-events, event-details, payment, …)
    └── pages/           explore-events, event-details, payment, booking-confirmation,
                         my-bookings, wishlist, login, signup
```

## 🖼 Photos

`assets/images/` contains the event cover + gallery photos.

To use your own picture for an event instead, just save a `.jpg` over the file with the
matching name (`<event-id>.jpg` = cover photo, `<event-id>-2.jpg`, `-3.jpg` … = gallery).

## ⚠️ Notes & limitations

- This is a **front-end-only demo**: accounts, wishlists, and bookings are stored in the
  browser's `localStorage`, not a real database — clearing browser data clears everything.
- Payment is **simulated**; no real payment processor is involved and no money moves.
- Not intended for production use as-is — there's no server-side validation, real auth, or
  persistence beyond the browser it's opened in.
