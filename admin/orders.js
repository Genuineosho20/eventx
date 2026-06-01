
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

const ordersContainer =
document.getElementById("ordersContainer");

const searchInput =
document.getElementById("searchInput");

let allOrders = [];

// LOAD ORDERS REALTIME
onValue(ref(db, "orders"), (snapshot) => {

    const data = snapshot.val();

    if (!data) {

        ordersContainer.innerHTML = `
            <div class="alert alert-warning">
                No orders found
            </div>
        `;

        return;
    }

    allOrders = Object.entries(data).map(([id, order]) => ({
        id,
        ...order
    }));

    renderOrders(allOrders);

});

// RENDER FUNCTION
function renderOrders(orders){

    ordersContainer.innerHTML = "";

    orders
    .sort((a,b) => b.createdAt - a.createdAt)
    .forEach(order => {

        ordersContainer.innerHTML += `

        <div class="card mb-3 shadow-sm">

            <div class="card-body">

                <div class="row">

                    <div class="col-md-8">

                        <h5>
                            ${order.fullName}
                        </h5>

                        <p class="mb-1">
                            🎉 ${order.event}
                        </p>

                        <p class="mb-1">
                            🎫 Ticket ID: <b>${order.ticketID}</b>
                        </p>

                        <p class="mb-1">
                            📧 ${order.email}
                        </p>

                        <p class="mb-1">
                            🔢 Qty: ${order.quantity}
                        </p>

                        <small class="text-muted">
                            Ref: ${order.paymentRef}
                        </small>

                    </div>

                    <div class="col-md-4 text-md-end">

                        <h5 class="text-success">
                            ₦${Number(order.totalAmount).toLocaleString()}
                        </h5>

                        <button
                            class="btn btn-danger btn-sm mt-2 delete-btn"
                            data-id="${order.id}">

                            Delete

                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}

// SEARCH FUNCTION
searchInput.addEventListener("input", () => {

    const value =
    searchInput.value.toLowerCase();

    const filtered =
    allOrders.filter(order => {

        return (
            order.email?.toLowerCase().includes(value) ||
            order.ticketID?.toLowerCase().includes(value)
        );

    });

    renderOrders(filtered);

});

// DELETE ORDER
document.addEventListener("click", async (e) => {

    if(e.target.classList.contains("delete-btn")){

        const id = e.target.dataset.id;

        if(!confirm("Delete this order?")) return;

        await remove(ref(db, `orders/${id}`));

        alert("Order deleted");

    }

});
document.getElementById("logoutBtn")
.addEventListener("click", async () => {

    const auth = getAuth();

    await signOut(auth);

    window.location.href = "login.html";

});
document.getElementById("exportPDF")
.addEventListener("click", () => {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.text("EventX Orders Report", 14, 15);

    const tableColumn = [
        "Name",
        "Event",
        "Email",
        "Qty",
        "Amount",
        "Ticket ID"
    ];

    const tableRows = [];

    allOrders.forEach(order => {

        tableRows.push([
            order.fullName || "",
            order.event || "",
            order.email || "",
            order.quantity || 0,
            "₦" + Number(order.totalAmount || 0).toLocaleString(),
            order.ticketID || ""
        ]);

    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 25
    });

    doc.save("eventx-orders.pdf");

});
console.log("Orders JS Loaded");