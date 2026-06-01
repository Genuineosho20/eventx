// IMPORT FIREBASE
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getDatabase,
ref,
set,
onValue
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// FIREBASE CONFIG
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwIt87mJuRyI7Fa7GEYBpEzbWumXX0Vis",
  authDomain: "eventx-4ea16.firebaseapp.com",
  databaseURL: "https://eventx-4ea16-default-rtdb.firebaseio.com",
  projectId: "eventx-4ea16",
  storageBucket: "eventx-4ea16.firebasestorage.app",
  messagingSenderId: "128689258427",
  appId: "1:128689258427:web:b6b0c14ec4a52c674f0e9e",
  measurementId: "G-GHZ43STFHT"
};


// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


// TEST
console.log("Firebase Connected");


// SAVE EVENTS TO DATABASE
set(ref(db, 'events/event1'), {

    name: "Afro Vibes Concert",
    price: 5000,
    tickets: 100,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200"

});


set(ref(db, 'events/event2'), {

    name: "Lagos Night Party",
    price: 10000,
    tickets: 50,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200"

});


set(ref(db, 'events/event3'), {

    name: "Summer Festival",
    price: 7500,
    tickets: 80,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200"

});


console.log("Events Added");
const eventsContainer = document.getElementById("eventsContainer");

onValue(ref(db, "events"), (snapshot) => {

    const events = snapshot.val();

    console.log(events);

    if (!eventsContainer) {
        console.error("eventsContainer not found");
        return;
    }

    eventsContainer.innerHTML = "";

    for (let id in events) {

        const event = events[id];

        eventsContainer.innerHTML += `
            <div class="col-md-4">
                <div class="card bg-dark text-white border-0 shadow-lg">

                    <img src="${event.image}" class="card-img-top">

                    <div class="card-body">

                        <h4>${event.name}</h4>

                        <p>Tickets Left: ${event.tickets}</p>

                        <div class="d-flex justify-content-between">

                            <span class="text-warning">
                                ₦${event.price.toLocaleString()}
                            </span>

   <button
class="btn btn-warning buy-btn"
data-id="${id}"
data-event="${event.name}"
data-price="${event.price}"
data-bs-toggle="modal"
data-bs-target="#ticketModal">

Buy Ticket

</button>

                        </div>

                    </div>

                </div>
            </div>
        `;
    }

});
export { db };