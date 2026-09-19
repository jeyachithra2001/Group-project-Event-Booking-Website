/* EVENT DATA */

let events = {

    1: {
        title: "Food Festival 2026",
        category: "Food & Drink",
        date: "10 October 2026 - 11:00 AM",
        location: "Bangalore Food Street, Bangalore",
        organizer: "Taste Events",
        price: "₹499",

        about:
            "Enjoy delicious food from different cuisines, live entertainment and a wonderful atmosphere with your friends and family.",

        image: "../assets/images/food.jpg"
    },


    2: {
        title: "City Marathon 2026",
        category: "Sports",
        date: "15 October 2026 - 6:00 AM",
        location: "City Stadium, Bangalore",
        organizer: "Run Bangalore",
        price: "₹799",

        about:
            "Take part in an exciting marathon event and enjoy a healthy and energetic experience with runners from different places.",

        image: "../assets/images/marathon1.jpg"
    },


    3: {
        title: "Tech & Innovation Summit",
        category: "Technology",
        date: "20 October 2026 - 9:00 AM",
        location: "Technology Centre, Bangalore",
        organizer: "Tech World",
        price: "₹1,999",

        about:
            "Discover modern technology, innovation and new ideas. Meet developers, students and technology enthusiasts.",

        image: "../assets/images/tech.jpg"
    },


    4: {
        title: "Music Festival 2026",
        category: "Music",
        date: "25 September 2026 - 7:00 PM",
        location: "M. Chinnaswamy Stadium, Bangalore",
        organizer: "Dream Events",
        price: "₹2,999",

        about:
            "Enjoy an unforgettable evening with amazing music performances, entertainment and a wonderful crowd.",

        image:
            "../assets/images/music.jpg"
    },


    5: {
        title: "Family Fun Day",
        category: "Family",
        date: "30 October 2026 - 10:00 AM",
        location: "Grand Community Hall, Bangalore",
        organizer: "Happy Events",
        price: "₹999",

        about:
            "Spend a memorable day with your family with fun activities, food and entertainment.",

        image:
            "../assets/images/family.jpg"
    },
    6: {
        title: "Grand Wedding Expo 2026",
        category: "Family",
        date: "5 November 2026 - 10:00 AM",
        location: "Convention Centre, Bangalore",
        organizer: "Royal Events",
        price: "₹1,499",

        about:
            "Explore wedding ideas, decorations, fashion, catering and other services at this special wedding expo.",

        image:
            "../assets/images/wedding.jpg"
    },

    7: {
        title: "Startup & Business Expo 2026",
        category: "Business",
        date: "12 November 2026 - 9:30 AM",
        location: "Bangalore International Centre",
        organizer: "Business Connect",
        price: "₹1,299",

        about:
            "Meet entrepreneurs, startup founders and business professionals and discover new business opportunities.",

        image:
            "../assets/images/business.jpg"
    },

    8: {
        title: "Art & Culture Exhibition 2026",
        category: "Art & Culture",
        date: "18 November 2026 - 11:00 AM",
        location: "Art Gallery, Bangalore",
        organizer: "Creative Arts India",
        price: "₹599",

        about:
            "Experience beautiful paintings, traditional artwork, modern art and cultural performances.",

        image:
            "../assets/images/art.jpg"
    },

    9: {
        title: "Comedy Night 2026",
        category: "Entertainment",
        date: "22 November 2026 - 7:30 PM",
        location: "Grand Auditorium, Bangalore",
        organizer: "Laugh Out Loud",
        price: "₹899",

        about:
            "Enjoy an entertaining evening filled with comedy performances, laughter and live entertainment.",

        image:
            "../assets/images/comedy.jpg"
    },

    10: {
        title: "Education & Career Fair 2026",
        category: "Education",
        date: "28 November 2026 - 10:00 AM",
        location: "Education Hall, Bangalore",
        organizer: "Career Connect",
        price: "₹399",

        about:
            "Meet colleges, training institutes and career experts to explore education and career opportunities.",

        image:
            "../assets/images/education.jpg"
    }

};


/* GET ID FROM URL */

let url = new URLSearchParams(
    window.location.search
);

let eventId = url.get("id");


/* GET SELECTED EVENT */

let selectedEvent = events[eventId];


/* DISPLAY EVENT */

if (selectedEvent) {

    document.getElementById("eventTitle").textContent =
        selectedEvent.title;

    document.getElementById("eventCategory").textContent =
        selectedEvent.category;

    document.getElementById("eventDate").textContent =
        selectedEvent.date;

    document.getElementById("eventLocation").textContent =
        selectedEvent.location;

    document.getElementById("eventOrganizer").textContent =
        selectedEvent.organizer;

    document.getElementById("eventPrice").textContent =
        selectedEvent.price;

    document.getElementById("eventAbout").textContent =
        selectedEvent.about;

    document.getElementById("eventImage").src =
        selectedEvent.image;


    /* EVENT DETAILS TAB */

    document.getElementById("detailsTitle").textContent =
        selectedEvent.title;

    document.getElementById("detailsDate").textContent =
        selectedEvent.date;

    document.getElementById("detailsLocation").textContent =
        selectedEvent.location;

    document.getElementById("detailsOrganizer").textContent =
        selectedEvent.organizer;


    /* ORGANIZER TAB */

    document.getElementById("organizerName").textContent =
        selectedEvent.organizer;

}


/* INVALID EVENT */

else {

    document.getElementById("eventTitle").textContent =
        "Event Not Found";

}


/* BACK BUTTON */

let backButton =
    document.getElementById("backButton");

backButton.addEventListener(
    "click",
    function () {

        window.history.back();

    }
);


/* TOP BOOK BUTTON */

let topBookButton =
    document.getElementById("topBookButton");

topBookButton.addEventListener(
    "click",
    function () {

        document.querySelector(".tickets").scrollIntoView({
            behavior: "smooth"
        })

    }
);


/* BOTTOM BOOK BUTTON */

let bottomBookButton =
    document.getElementById("bottomBookButton");

bottomBookButton.addEventListener(
    "click",
    function () {

        let total =
            document.getElementById(
                "totalAmount"
            ).textContent;


        if (total.includes("0")) {

            alert(
                "Please select at least one ticket.");

        } else {

            alert("Booking amount: " + total);
            window.location.href = "payment.html";
            const bookingData = {
                eventId: eventId,
                image: selectedEvent.image,
                title: selectedEvent.title,
                location: selectedEvent.location,
                date: selectedEvent.date,
                tickets: selectedTickets,
                totalAmount: total
            };

            localStorage.setItem(
                "bookingData",
                JSON.stringify(bookingData)
            );
        }

    }
);


/* TAB FUNCTIONALITY */

let tabs =
    document.querySelectorAll(".tab");

let contents =
    document.querySelectorAll(".tab-content");


tabs.forEach(function (tab) {

    tab.addEventListener(
        "click",
        function () {

            tabs.forEach(function (item) {

                item.classList.remove("active");

            });


            contents.forEach(function (content) {

                content.classList.remove("active");

            });


            tab.classList.add("active");


            let tabName =
                tab.getAttribute("data-tab");


            document
                .getElementById(tabName)
                .classList.add("active");

        }
    );

});


/* TICKET QUANTITY */

let quantities =
    document.querySelectorAll(".quantity");


let generalPrice = 2999;

let vipPrice = 4999;

let premiumPrice = 7999;


function calculateTotal() {

    let generalQuantity =
        Number(quantities[0].value);


    let vipQuantity =
        Number(quantities[1].value);


    let premiumQuantity =
        Number(quantities[2].value);


    let generalTotal =
        generalQuantity * generalPrice;


    let vipTotal =
        vipQuantity * vipPrice;


    let premiumTotal =
        premiumQuantity * premiumPrice;


    let total =
        generalTotal +
        vipTotal +
        premiumTotal;


    document.getElementById(
        "totalAmount"
    ).textContent = "₹" + total;

}


/* WHEN QUANTITY CHANGES */

quantities.forEach(function (quantity) {

    quantity.addEventListener(
        "change",
        function () {

            calculateTotal();

        }
    );

});


/* VENUE BUTTON */

let venueButton =
    document.getElementById("venueButton");

venueButton.addEventListener(
    "click",
    function () {

        alert(
            "Location: " +
            selectedEvent.location
        );

    }
);