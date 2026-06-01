import { getAuth, onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { db } from "../js/firebase.js";

import {
    ref,
    push
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const auth = getAuth();

// =========================
// AUTH GUARD
// =========================
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
    }

});

// =========================
// ADD EVENT
// =========================
document
.getElementById("eventForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name =
    document.getElementById("eventName").value;

    const description =
    document.getElementById("eventDescription").value;

    const venue =
    document.getElementById("eventVenue").value;

    const date =
    document.getElementById("eventDate").value;

    const category =
    document.getElementById("eventCategory").value;

    const featured =
    document.getElementById("featured").checked;

    const price =
    Number(document.getElementById("eventPrice").value);

    const tickets =
    Number(document.getElementById("eventTickets").value);

    const image =
    document.getElementById("eventImage").value;

    const eventData = {
        name,
        description,
        venue,
        date,
        category,
        featured,
        price,
        tickets,
        image,
        createdAt: Date.now()
    };

    try {

        await push(ref(db, "events"), eventData);

        alert("✅ Event Added Successfully");

        document.getElementById("eventForm").reset();

    } catch (error) {

        console.error(error);

        alert("❌ Failed To Add Event");
    }

});

// =========================
// LOGOUT
// =========================
document.getElementById("logoutBtn")
.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";
});