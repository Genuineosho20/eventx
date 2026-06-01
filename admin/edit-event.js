import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {

    if (!user) {

        // redirect if not logged in
        window.location.href = "login.html";

    }

});
import { db } from "../js/firebase.js";

import {
    ref,
    get,
    update
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// GET EVENT ID FROM URL
const urlParams =
new URLSearchParams(window.location.search);

const eventId =
urlParams.get("id");

// FORM ELEMENTS
const eventName =
document.getElementById("eventName");

const eventPrice =
document.getElementById("eventPrice");

const eventTickets =
document.getElementById("eventTickets");

const eventDate =
document.getElementById("eventDate");

const eventVenue =
document.getElementById("eventVenue");

const eventImage =
document.getElementById("eventImage");

const eventIdInput =
document.getElementById("eventId");

// ======================
// LOAD EVENT DATA
// ======================

async function loadEvent(){

    if(!eventId){
        alert("No Event ID Found");
        return;
    }

    const snapshot =
    await get(ref(db, `events/${eventId}`));

    if(!snapshot.exists()){
        alert("Event not found");
        return;
    }

    const data =
    snapshot.val();

    eventIdInput.value = eventId;
    eventName.value = data.name;
    eventPrice.value = data.price;
    eventTickets.value = data.tickets;
    eventDate.value = data.date;
    eventVenue.value = data.venue;
    eventImage.value = data.image;

}

loadEvent();

// ======================
// UPDATE EVENT
// ======================

document
.getElementById("editEventForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const id =
    eventIdInput.value;

    try {

        await update(ref(db, `events/${id}`), {

            name: eventName.value,
            price: Number(eventPrice.value),
            tickets: Number(eventTickets.value),
            date: eventDate.value,
            venue: eventVenue.value,
            image: eventImage.value

        });

        alert("Event Updated Successfully");

    } catch (err) {

        console.error(err);

        alert("Failed to update event");

    }

});
document.getElementById("logoutBtn")
.addEventListener("click", async () => {

    const auth = getAuth();

    await signOut(auth);

    window.location.href = "login.html";

});