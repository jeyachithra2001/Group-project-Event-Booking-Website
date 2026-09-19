/* FOR COPY BOOKING ID */
const btn = document.getElementById("copyBtn")

btn.addEventListener("click",function(){
    copyBookingId()
})
function copyBookingId(){
    const bookingId = localStorage.getItem("bookingId")

    if(bookingId){
        bookingId.innerText = bookingId
    }
    else{
        bookingId.innerText = "N/A"
    }

    navigator.clipboard.writeText(bookingId)
    .then(()=>{
        const originalText = btn.innerText
        btn.innerText = "Copied!"
        btn.disabled = true

        setTimeout(()=>{
            btn.innerText = originalText
            btn.disabled = false
        },2000)
    })
    .catch((error)=>{
        console.error("Failed to Copy: err");
        alert("Could not copy. Please copy manually.")
    })
}