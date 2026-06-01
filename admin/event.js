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
    onValue,
    remove
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const eventsContainer =
document.getElementById("eventsContainer");

// LOAD EVENTS
onValue(ref(db, "events"), (snapshot) => {

    const events = snapshot.val();

    if (!events) {

        eventsContainer.innerHTML = `

            <div class="alert alert-warning">
                No Events Found
            </div>

        `;

        return;
    }

    eventsContainer.innerHTML = "";

    Object.entries(events).forEach(([id, event]) => {

        eventsContainer.innerHTML += `

        <div class="col-md-4">

            <div class="card event-card">

                <img
                src="${event.image}"
                class="card-img-top">

                <div class="card-body">

                    <h5>
                        ${event.name}
                    </h5>

                    <p class="mb-1">

                        💵 ₦${Number(
                            event.price
                        ).toLocaleString()}

                    </p>

                    <p class="mb-3">

                        🎟 ${event.tickets}
                        Tickets Available

                    </p>
                    <a href="edit-event.html?id=${id}" class="btn btn-warning w-100 mb-2">
    Edit Event
</a>
                    <button
                        class="btn btn-danger w-100 delete-btn"
                        data-id="${id}">

                        Delete Event

                    </button>

                </div>

            </div>

        </div>

        `;

    });

});
document.addEventListener("click", async (e) => {

    if(
        e.target.classList.contains("delete-btn")
    ){

        const eventId =
        e.target.dataset.id;

        const confirmDelete =
        confirm(
            "Delete this event?"
        );

        if(!confirmDelete) return;

        try{

            await remove(
                ref(
                    db,
                    `events/${eventId}`
                )
            );

            alert(
                "Event Deleted Successfully"
            );

        }

        catch(error){

            console.error(error);

            alert(
                "Failed To Delete Event"
            );

        }

    }

});
document.getElementById("logoutBtn")
.addEventListener("click", async () => {

    const auth = getAuth();

    await signOut(auth);

    window.location.href = "login.html";

});