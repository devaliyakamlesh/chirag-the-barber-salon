/* ========================= */
/* POPUP FUNCTION */
/* ========================= */

function showPopup(message){

    const popup =
    document.getElementById("popup");

    const popupMessage =
    document.getElementById("popup-message");

    if(popup && popupMessage){

        popupMessage.innerText = message;

        popup.classList.add("show");

        setTimeout(()=>{

            popup.classList.remove("show");

        },3000);

    }

}

/* ========================= */
/* ELEMENTS */
/* ========================= */

const bookingForm =
document.getElementById("bookingForm");

const cancelForm =
document.getElementById("cancelForm");

const loginForm =
document.getElementById("loginForm");

const dashboard =
document.getElementById("dashboard");

const bookingsList =
document.querySelector(".bookings-list");

const totalBookingEl =
document.querySelectorAll(".stat-card p")[0];

const totalRevenueEl =
document.querySelectorAll(".stat-card p")[1];

const tomorrowBookingEl =
document.querySelectorAll(".stat-card p")[2];

/* ========================= */
/* STORAGE */
/* ========================= */

let bookings =
JSON.parse(localStorage.getItem("bookings")) || [];

let closedDates =
JSON.parse(localStorage.getItem("closedDates")) || [];

/* ========================= */
/* SERVICE PRICES */
/* ========================= */

const servicePrices = {

    "Hair Cutting":400,
    "Beard Trimming":200,
    "Keratine Treatment":2500,
    "Curly Hair Treatment":3000,
    "Basic Facial":1300,
    "Premium Facial":1700,
    "Advance Facial":2200,
    "Manicure":1000,
    "Pedicure":2000,
    "Manicure + Pedicure":2500,
    "Permanent Spa":1500,
    "D&D Hair Spa":800,
    "Hair Color":500,
    "Hair Styling":200,
    "Groom Makeup Basic":2000,
    "Groom Makeup Premium":3500

};

/* ========================= */
/* BOOKING SYSTEM */
/* ========================= */

if(bookingForm){

bookingForm.addEventListener("submit", function(e){

    e.preventDefault();

    const date =
    document.getElementById("booking-date").value;

    const name =
    bookingForm.querySelector('input[type="text"]').value;

    const phone =
    bookingForm.querySelector('input[type="tel"]').value;

    const slot =
    document.getElementById("time-slot").value;

    let services = [];

    document.querySelectorAll(
    '.checkbox-group input:checked'
    ).forEach((item)=>{

        services.push(
        item.parentElement.innerText.trim());

    });

    if(date === ""){

        showPopup("Please Select Date");
        return;

    }

    if(name === ""){

        showPopup("Please Enter Name");
        return;

    }

    if(phone === ""){

        showPopup("Please Enter Phone Number");
        return;

    }

    if(services.length === 0){

        showPopup("Please Select Service");
        return;

    }

    if(closedDates.includes(date)){

        showPopup("Salon Closed On This Date");
        return;

    }

    const alreadyBooked = bookings.find((booking)=>{

        return booking.date === date &&
               booking.slot === slot;

    });

    if(alreadyBooked){

        showPopup("This Slot Already Booked");
        return;

    }

    let totalAmount = 0;

    services.forEach((service)=>{

        totalAmount +=
        servicePrices[service] || 0;

    });

    const booking = {

        date,
        name,
        phone,
        slot,
        services,
        amount:totalAmount

    };

    bookings.push(booking);

    localStorage.setItem(
    "bookings",
    JSON.stringify(bookings)
    );

    showPopup("Booking Successful");

    const ownerNumber = "919537531732";

    const whatsappMessage = 
`New Salon Booking

Client Name: ${name}
Phone: ${phone}
Date: ${date}
Time Slot: ${slot}

Services:
${services.join(", ")}

Amount: ₹${totalAmount}`;

    window.open(

    `https://wa.me/${ownerNumber}?text=${encodeURIComponent(whatsappMessage)}`,

    "_blank"

    );

    bookingForm.reset();

    renderBookings();

});

}

/* ========================= */
/* CANCEL BOOKING */
/* ========================= */

if(cancelForm){

cancelForm.addEventListener("submit", function(e){

    e.preventDefault();

    const name =
    cancelForm.querySelector('input[type="text"]').value;

    const phone =
    cancelForm.querySelector('input[type="tel"]').value;

    bookings = bookings.filter((booking)=>{

        return !(

            booking.name === name &&
            booking.phone === phone

        );

    });

    localStorage.setItem(

        "bookings",
        JSON.stringify(bookings)

    );

    showPopup("Booking Cancelled");

    const ownerNumber = "919537531732";

    const cancelMessage =
`Booking Cancelled

Client Name: ${name}
Phone: ${phone}`;

    window.open(

    `https://wa.me/${ownerNumber}?text=${encodeURIComponent(cancelMessage)}`,

    "_blank"

    );

    cancelForm.reset();

    renderBookings();

});

}

/* ========================= */
/* OWNER LOGIN */
/* ========================= */

if(loginForm){

loginForm.addEventListener("submit", function(e){

    e.preventDefault();

    const username =
    loginForm.querySelector('input[type="text"]').value;

    const password =
    loginForm.querySelector('input[type="password"]').value;

    if(

        username === "Chirag" &&
        password === "18082008"

    ){

        dashboard.style.display = "block";

        showPopup("Login Successful");

        window.scrollTo({

            top:dashboard.offsetTop,
            behavior:"smooth"

        });

    }

    else{

        showPopup("Wrong Username Or Password");

    }

});

}

/* ========================= */
/* RENDER BOOKINGS */
/* ========================= */

function renderBookings(){

    if(!bookingsList) return;

    bookingsList.innerHTML = `

    <h3 style="margin-bottom:30px;">
    All Bookings
    </h3>

    `;

    let totalRevenue = 0;

    let tomorrowCount = 0;

    const tomorrow = new Date();

    tomorrow.setDate(
    tomorrow.getDate() + 1
    );

    const tomorrowDate =
    tomorrow.toISOString().split("T")[0];

    bookings.forEach((booking,index)=>{

        totalRevenue += booking.amount;

        if(booking.date === tomorrowDate){

            tomorrowCount++;

        }

        bookingsList.innerHTML += `

        <div class="booking-card">

            <p>
            <strong>Client Name:</strong>
            ${booking.name}
            </p>

            <p>
            <strong>Phone:</strong>
            ${booking.phone}
            </p>

            <p>
            <strong>Date:</strong>
            ${booking.date}
            </p>

            <p>
            <strong>Time Slot:</strong>
            ${booking.slot}
            </p>

            <p>
            <strong>Services:</strong>
            ${booking.services.join(", ")}
            </p>

            <p>
            <strong>Amount:</strong>
            ₹${booking.amount}
            </p>

            <button onclick="deleteBooking(${index})">

            Cancel Booking

            </button>

        </div>

        `;

    });

    if(totalBookingEl){

        totalBookingEl.innerText =
        bookings.length;

    }

    if(totalRevenueEl){

        totalRevenueEl.innerText =
        `₹${totalRevenue}`;

    }

    if(tomorrowBookingEl){

        tomorrowBookingEl.innerText =
        tomorrowCount;

    }

}

/* ========================= */
/* DELETE BOOKING */
/* ========================= */

function deleteBooking(index){

    bookings.splice(index,1);

    localStorage.setItem(

        "bookings",
        JSON.stringify(bookings)

    );

    renderBookings();

    showPopup("Booking Deleted");

}

/* ========================= */
/* CLOSE SALON */
/* ========================= */

const closeBtn =
document.querySelector(".close-salon-box button");

if(closeBtn){

closeBtn.addEventListener("click", function(){

    const closeDate =
    document.querySelector(
    ".close-salon-box input"
    ).value;

    if(closeDate === ""){

        showPopup("Please Select Date");

        return;

    }

    closedDates.push(closeDate);

    localStorage.setItem(

        "closedDates",
        JSON.stringify(closedDates)

    );

    showPopup("Salon Closed Successfully");

});

}

/* ========================= */
/* LOGOUT */
/* ========================= */

const logoutBtn =
document.querySelector(".logout-btn");

if(logoutBtn){

logoutBtn.addEventListener("click", function(){

    dashboard.style.display = "none";

    showPopup("Logout Successful");

    window.scrollTo({

        top:0,
        behavior:"smooth"

    });

});

}

/* ========================= */
/* INITIAL LOAD */
/* ========================= */

renderBookings();

/* ========================= */
/* WEBSITE LOADER */
/* ========================= */

window.addEventListener("load", function(){

    const loader =
    document.querySelector(".loader");

    if(loader){

        loader.classList.add("hide");

    }

});