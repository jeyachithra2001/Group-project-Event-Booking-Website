/* SUMMARY DETAILS */

let bookingData = JSON.parse(localStorage.getItem("bookingData"))

let eventId = bookingData.eventId
let eventImage = bookingData.image
let eventTitle = bookingData.title
let eventDate = bookingData.date
let eventLocation = bookingData.location
let tickets = bookingData.tickets
let totalAmount = bookingData.totalAmount

let paymentTotalAmount = document.getElementById("paymentTotalAmount")

document.getElementById("paymentEventImage").src = bookingData.image
document.getElementById("paymentEventTitle").textContent = bookingData.title
document.getElementById("paymentEventDate").textContent = bookingData.date
document.getElementById("paymentEventLocation").textContent = bookingData.location

let ticket = bookingData.tickets[0]
document.getElementById("ticketType").textContent = ticket.ticketType
document.getElementById("ticketPrice").textContent = "₹" + ticket.price.toLocaleString("en-IN")
document.getElementById("ticketQuantity").textContent = "Quantity: " + ticket.quantity
document.getElementById("ticketSubTotal").textContent = "₹" + ticket.subtotal.toLocaleString("en-IN")
document.getElementById("paymentTotalAmount").textContent = "₹" + bookingData.totalAmount.toLocaleString("en-IN")

/* GET FROM ELEMENT */
let paymentForm = document.getElementById("payment-form")
const fullNameInput = document.getElementById("fullName")
const emailInput = document.getElementById("email")
const phoneNoInput = document.getElementById("phoneNo")
const paymentMethods = document.querySelectorAll("input[name='payment-method']")

const upiDetails = document.getElementById("upi-details")
const cardDetails = document.getElementById("card-details")
const upiId = document.getElementById("upiId")
const cardNo = document.getElementById("cardNo")
const cardName = document.getElementById("cardName")
const expiry = document.getElementById("expiry")
const cvv = document.getElementById("cvv")


/* HIDE UPI/CARD DETAILS */
upiDetails.style.display = "none"
cardDetails.style.display = "none"

/* PAYMENT METHOD CHANE */

paymentMethods.forEach(function (method) {
    method.addEventListener("change", function () {

        // Hide both first
        upiDetails.style.display = "none"
        cardDetails.style.display = "none"

        // Remove required
        upiId.required = false
        cardNo.required = false
        cardName.required = false
        expiry.required = false
        cvv.required = false

        // UPI
        if (method.value === "upi") {
            upiDetails.style.display = "block"
            upiId.required = true
        }

        // Card
        else if (method.value === "card") {
            cardDetails.style.display = "block"
            cardNo.required = true
            cardName.required = true
            expiry.required = true
            cvv.required = true
        }
    })
})

/* FORM SUBMIT */

paymentForm.addEventListener("submit", function (event) {
    event.preventDefault()

    /* GET VALUES WHEN USER SUBMIT */
    const fullName = fullNameInput.value.trim()
    const email = emailInput.value.trim()
    const phoneNo = phoneNoInput.value.trim()

    /* VALIDATION */

    // Name validation
    if (fullName.length < 3) {
        alert("Please enter a valid name")
        fullNameInput.focus()
        return
    }
    

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email")
        emailInput.focus()
        return
        console.log(emailPattern.test(email));
        
    }

    // Phone validation
    const phonePattern = /^[0-9]{10}$/
    if (!phonePattern.test(phoneNo)) {
        alert("Please enter a valid 10 digit phone number")
        phoneNoInput.focus()
        return
    }

    /* PAYMENT METHOD */
    const selectedPayment = document.querySelector(
        "input[name='payment-method']:checked"
    )

    if (!selectedPayment) {
        alert("Please select a payment method")
        return
    }

    const paymentMethod = selectedPayment.value

    /* PAYMENT DETAILS */

    let paymentDetails = {}
    if (paymentMethod === "upi") {
        const enteredUpi = upiId.value.trim()
        if (enteredUpi === "") {
            alert("Please enter your UPI ID")
            upiId.focus()
            return
        }

        paymentDetails = {
            upiId: enteredUpi
        }
    }

    else if (paymentMethod === "card") {
        const enteredCardNo = cardNo.value.trim()
        const enteredCardName = cardName.value.trim()
        const enteredExpiry = expiry.value.trim()
        const enteredCvv = cvv.value.trim()

        if (enteredCardNo === "") {
            alert("Please enter card number")
            cardNo.focus()
            return
        }

        if (enteredCardName === "") {
            alert("Please enter name on card")
            cardName.focus()
            return
        }

        if (enteredExpiry === "") {
            alert("Please enter card expiry")
            expiry.focus()
            return
        }

        if (!/^[0-9]{3}$/.test(enteredCvv)) {
            alert("Please enter a valid 3 digit CVV")
            cvv.focus()
            return
        }

        paymentDetails = {
            cardNo: enteredCardNo,
            cardName: enteredCardName,
            expiry: enteredExpiry
        }
    }

    /* GENERATE BOOKING ID */

    const bookingId = generateBookingId()

    /* ATTENDEE DATA */

    const attendeeData = {
        bookingId: bookingId,
        fullName: fullName,
        email: email,
        phoneNo: phoneNo,
        paymentMethod: paymentMethod,
        paymentDetails: paymentDetails,
        eventTitle: bookingData.title,
        eventDate: bookingData.date,
        eventLocation: bookingData.location,
        ticketType: ticket.ticketType,
        quantity: ticket.quantity,
        totalAmount: bookingData.totalAmount
    }

    /* LOCAL STORAGE */
    localStorage.setItem(
        "attendeeData",
        JSON.stringify(attendeeData)
    )

    /* REDIRECT */
    window.location.href = "booking-confirmation.html"
})

/* GENERATE BOOKING ID */
function generateBookingId() {
    const prefix = "EBK"
    const randomNum = Math.floor(Math.random() * 1000000) + 1
    return prefix + randomNum
}





