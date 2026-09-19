/* ==========================================================================
   Eventra — Event catalogue
   Single source of truth for every page. Every image points at a local file in
   assets/images/ (paths are relative to the pages/ folder).
   Naming:  <event-id>.jpg = cover photo,  <event-id>-2.jpg, -3.jpg … = gallery.
   ========================================================================== */

const EVENTS = [
  {
    "id": "coldplay-live",
    "title": "Coldplay Live in Concert",
    "category": "Music",
    "date": "2026-09-25",
    "time": "7:00 PM",
    "venue": "M. Chinnaswamy Stadium",
    "city": "Bangalore",
    "organizer": "Dream Events",
    "rating": 4.8,
    "reviews": 2500,
    "image": "../assets/images/coldplay-live.jpg",
    "gallery": [
      "../assets/images/coldplay-live.jpg",
      "../assets/images/coldplay-live-2.jpg",
      "../assets/images/coldplay-live-3.jpg",
      "../assets/images/coldplay-live-4.jpg"
    ],
    "about": "Get ready for an unforgettable night with Coldplay! Experience their biggest hits, stunning visuals and a magical atmosphere never before seen on an Indian stage.",
    "highlights": [
      "Live performance by Coldplay",
      "Food & beverage stalls",
      "Exclusive merchandise",
      "Safe & secure venue"
    ],
    "tickets": [
      {
        "type": "General Admission",
        "price": 2999,
        "desc": "Standing, general grounds access"
      },
      {
        "type": "VIP Pass",
        "price": 4999,
        "desc": "Front-section standing + fast entry"
      },
      {
        "type": "Premium Pass",
        "price": 7998,
        "desc": "Premium viewing deck + lounge access"
      }
    ]
  },
  {
    "id": "music-festival-2026",
    "title": "Music Festival 2026",
    "category": "Music",
    "date": "2026-09-25",
    "time": "6:00 PM",
    "venue": "Palace Grounds",
    "city": "Bangalore",
    "organizer": "Wave Collective",
    "rating": 4.6,
    "reviews": 1840,
    "image": "../assets/images/music-festival-2026.jpg",
    "gallery": [
      "../assets/images/music-festival-2026.jpg",
      "../assets/images/music-festival-2026-2.jpg",
      "../assets/images/music-festival-2026-3.jpg"
    ],
    "about": "Three stages, twelve acts, one unforgettable night. Music Festival 2026 brings together the biggest names in indie, electronic and hip-hop for a marathon celebration of sound.",
    "highlights": [
      "3 live stages",
      "12+ artists",
      "Food trucks & bars",
      "Free parking"
    ],
    "tickets": [
      {
        "type": "General Admission",
        "price": 1499,
        "desc": "Access to all stages"
      },
      {
        "type": "VIP Pass",
        "price": 3499,
        "desc": "Elevated viewing + express entry"
      }
    ]
  },
  {
    "id": "food-carnival",
    "title": "Food Carnival",
    "category": "Food & Drink",
    "date": "2026-10-10",
    "time": "11:00 AM",
    "venue": "Phoenix Marketcity",
    "city": "Bangalore",
    "organizer": "Flavour Republic",
    "rating": 4.5,
    "reviews": 960,
    "image": "../assets/images/food-carnival.jpg",
    "gallery": [
      "../assets/images/food-carnival.jpg",
      "../assets/images/food-carnival-2.jpg",
      "../assets/images/food-carnival-3.jpg"
    ],
    "about": "Sixty stalls, one appetite. Sample street food and fine dining mashups from the city's most loved kitchens, with live cooking stations and dessert pop-ups all day long.",
    "highlights": [
      "60+ food stalls",
      "Live cooking stations",
      "Kids' zone",
      "Dessert pop-ups"
    ],
    "tickets": [
      {
        "type": "General Admission",
        "price": 499,
        "desc": "All-day entry"
      },
      {
        "type": "Tasting Pass",
        "price": 999,
        "desc": "Entry + 5 tasting coupons"
      }
    ]
  },
  {
    "id": "tech-conference",
    "title": "Tech & Innovation Summit",
    "category": "Business",
    "date": "2026-10-18",
    "time": "9:00 AM",
    "venue": "World Trade Center",
    "city": "Bangalore",
    "organizer": "NextGen Ventures",
    "rating": 4.7,
    "reviews": 1120,
    "image": "../assets/images/tech-conference.jpg",
    "gallery": [
      "../assets/images/tech-conference.jpg",
      "../assets/images/tech-conference-2.jpg",
      "../assets/images/tech-conference-3.jpg"
    ],
    "about": "A full day of keynotes, panels and hands-on workshops covering AI, climate tech and the future of work — led by founders and researchers shaping the next decade.",
    "highlights": [
      "30+ speakers",
      "Hands-on workshops",
      "Startup expo",
      "Networking lounge"
    ],
    "tickets": [
      {
        "type": "Delegate Pass",
        "price": 1999,
        "desc": "Full-day access to all tracks"
      },
      {
        "type": "Investor Pass",
        "price": 4999,
        "desc": "Delegate pass + private mixer"
      }
    ]
  },
  {
    "id": "standup-comedy",
    "title": "Stand-up Comedy Night",
    "category": "Arts & Culture",
    "date": "2026-10-24",
    "time": "7:30 PM",
    "venue": "The Comedy Club",
    "city": "Bangalore",
    "organizer": "Laugh Riot Productions",
    "rating": 4.9,
    "reviews": 640,
    "image": "../assets/images/standup-comedy.jpg",
    "gallery": [
      "../assets/images/standup-comedy.jpg",
      "../assets/images/standup-comedy-2.jpg",
      "../assets/images/standup-comedy-3.jpg"
    ],
    "about": "An intimate night of sharp, unfiltered comedy from four of the country's fastest-rising stand-up acts. Small room, big laughs, zero mercy.",
    "highlights": [
      "4 headline comedians",
      "Intimate 200-seat venue",
      "Full bar service",
      "18+ show"
    ],
    "tickets": [
      {
        "type": "General Admission",
        "price": 799,
        "desc": "Standard seating"
      },
      {
        "type": "Front Row",
        "price": 1499,
        "desc": "First three rows, best view"
      }
    ]
  },
  {
    "id": "yoga-retreat",
    "title": "Yoga Retreat",
    "category": "Workshops",
    "date": "2026-11-08",
    "time": "6:00 AM",
    "venue": "Nandi Hills Resort",
    "city": "Bangalore",
    "organizer": "Stillwater Wellness",
    "rating": 4.8,
    "reviews": 310,
    "image": "../assets/images/yoga-retreat.jpg",
    "gallery": [
      "../assets/images/yoga-retreat.jpg",
      "../assets/images/yoga-retreat-2.jpg"
    ],
    "about": "Wake up with the hills. A sunrise flow, guided breathwork and a plant-based brunch designed to reset your week — mats and props provided.",
    "highlights": [
      "Sunrise flow session",
      "Guided breathwork",
      "Plant-based brunch",
      "Mats provided"
    ],
    "tickets": [
      {
        "type": "Single Pass",
        "price": 1099,
        "desc": "One morning session"
      },
      {
        "type": "Weekend Retreat",
        "price": 3499,
        "desc": "Two days, one overnight stay"
      }
    ]
  },
  {
    "id": "art-workshop",
    "title": "Art Workshop",
    "category": "Arts & Culture",
    "date": "2026-11-13",
    "time": "10:00 AM",
    "venue": "Studio Canvas",
    "city": "Bangalore",
    "organizer": "Studio Canvas Collective",
    "rating": 4.6,
    "reviews": 210,
    "image": "../assets/images/art-workshop.jpg",
    "gallery": [
      "../assets/images/art-workshop.jpg",
      "../assets/images/art-workshop-2.jpg",
      "../assets/images/art-workshop-3.jpg"
    ],
    "about": "A hands-on watercolour and ink workshop for all skill levels. Take home a finished piece and the techniques to keep making more.",
    "highlights": [
      "All materials included",
      "Small batch, 15 seats",
      "Beginner friendly",
      "Take your art home"
    ],
    "tickets": [
      {
        "type": "Workshop Seat",
        "price": 699,
        "desc": "Full 3-hour session + materials"
      }
    ]
  },
  {
    "id": "music-festival-nov",
    "title": "Music Festival",
    "category": "Music",
    "date": "2026-11-13",
    "time": "5:00 PM",
    "venue": "Jayamahal Palace Grounds",
    "city": "Bangalore",
    "organizer": "Wave Collective",
    "rating": 4.5,
    "reviews": 480,
    "image": "../assets/images/music-festival-nov.jpg",
    "gallery": [
      "../assets/images/music-festival-nov.jpg",
      "../assets/images/music-festival-nov-2.jpg",
      "../assets/images/music-festival-nov-3.jpg"
    ],
    "about": "The autumn edition of the city's favourite touring festival, with a fresh line-up spanning folk, funk and electronica.",
    "highlights": [
      "3 stages",
      "Local food vendors",
      "Art installations",
      "Late-night set"
    ],
    "tickets": [
      {
        "type": "General Admission",
        "price": 1499,
        "desc": "Full-day access"
      }
    ]
  },
  {
    "id": "art-exhibition",
    "title": "Art Exhibition",
    "category": "Arts & Culture",
    "date": "2026-11-20",
    "time": "11:00 AM",
    "venue": "National Gallery Annex",
    "city": "Bangalore",
    "organizer": "Modern Canvas Trust",
    "rating": 4.7,
    "reviews": 190,
    "image": "../assets/images/art-exhibition.jpg",
    "gallery": [
      "../assets/images/art-exhibition.jpg",
      "../assets/images/art-exhibition-2.jpg",
      "../assets/images/art-exhibition-3.jpg"
    ],
    "about": "A curated showcase of 40 contemporary South Asian artists working across painting, sculpture and new media.",
    "highlights": [
      "40+ artists",
      "Guided tours hourly",
      "Artist meet & greet",
      "On-site cafe"
    ],
    "tickets": [
      {
        "type": "General Admission",
        "price": 699,
        "desc": "All-day entry"
      }
    ]
  },
  {
    "id": "marathon-2026",
    "title": "Marathon 2026",
    "category": "Sports",
    "date": "2026-12-05",
    "time": "5:30 AM",
    "venue": "Cubbon Park",
    "city": "Bangalore",
    "organizer": "RunCity India",
    "rating": 4.6,
    "reviews": 870,
    "image": "../assets/images/marathon-2026.jpg",
    "gallery": [
      "../assets/images/marathon-2026.jpg",
      "../assets/images/marathon-2026-2.jpg",
      "../assets/images/marathon-2026-3.jpg"
    ],
    "about": "5K, 10K and half-marathon routes through the city's green heart, finishing with a runners' village of food, music and medals.",
    "highlights": [
      "3 race distances",
      "Finisher medal",
      "Hydration stations",
      "Post-run village"
    ],
    "tickets": [
      {
        "type": "5K Entry",
        "price": 699,
        "desc": "Timing chip + medal"
      },
      {
        "type": "Half Marathon",
        "price": 1299,
        "desc": "Timing chip + medal + kit"
      }
    ]
  },
  {
    "id": "gaming-expo",
    "title": "Gaming Expo",
    "category": "Sports",
    "date": "2026-12-18",
    "time": "10:00 AM",
    "venue": "KTPO Convention Centre",
    "city": "Bangalore",
    "organizer": "LevelUp Events",
    "rating": 4.8,
    "reviews": 1560,
    "image": "../assets/images/gaming-expo.jpg",
    "gallery": [
      "../assets/images/gaming-expo.jpg",
      "../assets/images/gaming-expo-2.jpg",
      "../assets/images/gaming-expo-3.jpg"
    ],
    "about": "Playtest unreleased titles, watch pro-circuit finals and meet the studios behind your favourite games across three packed halls.",
    "highlights": [
      "Playable demos",
      "Esports finals",
      "Cosplay contest",
      "Developer talks"
    ],
    "tickets": [
      {
        "type": "Day Pass",
        "price": 1299,
        "desc": "Single day entry"
      },
      {
        "type": "Weekend Pass",
        "price": 2199,
        "desc": "Both days + swag bag"
      }
    ]
  }
];

/* Which events the home page shows in each row. */
const FEATURED_IDS = ["coldplay-live", "food-carnival", "tech-conference", "standup-comedy"];
const POPULAR_IDS = ["music-festival-nov", "art-exhibition", "marathon-2026", "gaming-expo"];

/** Look up a single event by id. */
function getEventById(id) {
  return EVENTS.find((e) => e.id === id) || null;
}

/** Lowest ticket price for an event, used as its "from" price on cards. */
function eventFromPrice(ev) {
  return Math.min(...ev.tickets.map((t) => t.price));
}

/** ₹ formatter, no decimals. */
function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Human-friendly date from "2026-09-25" → "25 Sep 2026" (same result in every browser). */
function formatEventDate(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d)) return isoDate;
  return String(d.getDate()).padStart(2, "0") + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
}
