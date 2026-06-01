import {
    getAuth,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

// CHECK LOGIN
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

    }

});
import { db } from "../js/firebase.js";

import {
    ref,
    onValue
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ======================
// DOM ELEMENTS
// ======================

const totalEvents =
document.getElementById("totalEvents");

const totalOrders =
document.getElementById("totalOrders");

const totalRevenue =
document.getElementById("totalRevenue");

const activities =
document.getElementById("activities");

// ======================
// LOAD EVENTS
// ======================

onValue(ref(db, "events"), (snapshot) => {

    const events = snapshot.val();

    if (!events) {

        totalEvents.textContent = "0";

        return;
    }

    totalEvents.textContent =
    Object.keys(events).length;

});

// ======================
// LOAD ORDERS
// ======================

onValue(ref(db, "orders"), (snapshot) => {

    const orders = snapshot.val();

    if (!orders) {

        totalOrders.textContent = "0";

        totalRevenue.textContent = "₦0";

        activities.innerHTML = `
            <div class="alert alert-secondary">
                No activities yet.
            </div>
        `;

        return;
    }

    const ordersArray =
    Object.entries(orders).map(([id, order]) => ({
        id,
        ...order
    }));

    // ======================
    // TOTAL ORDERS
    // ======================

    totalOrders.textContent =
    ordersArray.length;

    // ======================
    // TOTAL REVENUE
    // ======================

    let revenue = 0;

    ordersArray.forEach(order => {

        revenue += Number(
            order.totalAmount || 0
        );

    });

    totalRevenue.textContent =
    "₦" + revenue.toLocaleString();

    // ======================
    // RECENT ACTIVITIES
    // ======================

    ordersArray.sort((a, b) => {

        return (
            (b.createdAt || 0)
            -
            (a.createdAt || 0)
        );

    });

    const latestOrders =
    ordersArray.slice(0, 10);

    activities.innerHTML = "";

    latestOrders.forEach(order => {

        const date =
        order.createdAt
        ?
        new Date(order.createdAt)
        .toLocaleString()
        :
        "Unknown Date";

        activities.innerHTML += `

            <div
            class="card mb-3 activity-card shadow-sm border-0">

                <div class="card-body">

                    <div class="d-flex justify-content-between">

                        <div>

                            <h6 class="mb-1">

                                ${order.fullName || "Unknown User"}

                            </h6>

                            <p class="mb-1">

                                Purchased

                                <strong>
                                    ${order.quantity || 0}
                                </strong>

                                ticket(s) for

                                <strong>
                                    ${order.event || "Unknown Event"}
                                </strong>

                            </p>

                            <small class="text-muted">

                                ${date}

                            </small>

                        </div>

                        <div class="text-end">

                            <span
                            class="badge bg-success">

                                ₦${Number(
                                    order.totalAmount || 0
                                ).toLocaleString()}

                            </span>

                        </div>

                    </div>

                </div>

            </div>

        `;

    });

});

// ======================
// REALTIME CONNECTION LOG
// ======================

console.log(
    "Dashboard connected to Firebase successfully"
);
document.getElementById("logoutBtn")
.addEventListener("click", async () => {

    const auth = getAuth();

    await signOut(auth);

    window.location.href = "login.html";

});