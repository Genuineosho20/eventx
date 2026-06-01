import { db } from "./firebase.js";

import {
ref,
onValue,
update,
get,
set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
// =========================
// GLOBAL STATE
// =========================
let selectedEvent = null;
let latestTicket = null;

// =========================
// LOAD EVENTS
// =========================
onValue(ref(db, "events"), (snapshot) => {

const data = snapshot.val();

const container = document.getElementById("eventsContainer");
const featuredContainer = document.getElementById("featuredContainer");

if (!container || !featuredContainer) return;

container.innerHTML = "";
featuredContainer.innerHTML = "";

let totalEvents = 0;
let totalTickets = 0;
let revenue = 0;

for (let id in data) {

const event = data[id];
totalEvents++;

if (event.featured) {
featuredContainer.innerHTML += card(id, event);
}

container.innerHTML += card(id, event);

totalTickets += (event.sold || 0);
revenue += (event.sold || 0) * event.price;
}

const t1 = document.getElementById("totalEvents");
const t2 = document.getElementById("totalTickets");
const t3 = document.getElementById("totalRevenue");

if (t1) t1.innerText = totalEvents;
if (t2) t2.innerText = totalTickets;
if (t3) t3.innerText = "₦" + revenue.toLocaleString();

});

// =========================
// EMAIL FUNCTION
// =========================
function sendTicketEmail(data) {

console.log("Sending email with:", data);

emailjs.send("service_m6jdmz8", "template_7saq83p", {
    name: data.name,
    email: data.email,
    event_name: data.event,
    ticket_id: data.ticketID,
    quantity: data.qty,
    amount: data.amount,
    qr_code: data.qr
})
.then((res) => {
    console.log("Email sent SUCCESS:", res.status, res.text);
})
.catch((err) => {
    console.error("Email FAILED:", err);
});

}


// =========================
// EVENT CARD
// =========================
function card(id, e) {

let status = e.tickets <= 0 ? "SOLD OUT" : `${e.tickets} left`;

return `
<div class="col-md-4">

<div class="card bg-black text-white border-light">

<img src="${e.image}" class="card-img-top">

<div class="card-body">

<h5>${e.name}</h5>

<p>₦${e.price}</p>

<p>${status}</p>

<button class="btn btn-warning"
onclick="openEvent('${id}')">
View Details
</button>

</div>

</div>

</div>
`;
}

// =========================
// OPEN EVENT MODAL
// =========================


window.openEvent = async function(id) {

try {

const snapshot = await get(ref(db, "events/" + id));

if (!snapshot.exists()) {
alert("Event not found");
return;
}

const event = snapshot.val();
selectedEvent = { id, ...event };

const set = (id, val) => {
const el = document.getElementById(id);
if (el) el.innerText = val ?? "";
};

set("modalTitle", event.name);
set("modalDesc", event.description || "");
set("modalVenue", event.venue || "");
set("modalDate", event.date || "");
set("modalPrice", event.price);
set("modalTickets", event.tickets + " tickets left");

const img = document.getElementById("modalImage");
if (img) img.src = event.image;

startCountdown(event.date);

bootstrap.Modal
.getOrCreateInstance(document.getElementById("eventModal"))
.show();

} catch (err) {
console.error(err);
alert("Failed to load event");
}

};

// =========================
// COUNTDOWN
// =========================
function startCountdown(date) {

if (!date) return;

let target = new Date(date).getTime();

setInterval(() => {

let now = new Date().getTime();
let diff = target - now;

if (diff < 0) return;

let days = Math.floor(diff / (1000 * 60 * 60 * 24));

const c = document.getElementById("countdown");
if (c) c.innerText = "Starts in " + days + " days";

}, 1000);

}

// =========================
// BUY MODAL
// =========================
document.getElementById("buyBtn").onclick = () => {

    const modalEl = document.getElementById("buyModal");

    if (!modalEl) return;

    bootstrap.Modal.getOrCreateInstance(modalEl).show();

};
// =========================
// TOTAL PRICE
// =========================
document.getElementById("quantity").oninput = () => {

if (!selectedEvent) return;

let qty = document.getElementById("quantity").value;

document.getElementById("totalPrice").innerText =
qty * selectedEvent.price;

};

// =========================
// PAYSTACK PAYMENT
// =========================
console.log("Starting Paystack payment...");
document.getElementById("ticketForm").onsubmit = (e) => {

e.preventDefault();

if (!selectedEvent) {
alert("No event selected");
return;
}

if (selectedEvent.tickets <= 0) {
alert("Sold out");
return;
}

let name = document.getElementById("buyerName").value;
let email = document.getElementById("buyerEmail").value;
let qty = Number(document.getElementById("quantity").value);

let amount = qty * selectedEvent.price;

const handler = PaystackPop.setup({
    key: "pk_live_39f7516478546caf6e4c2d6b329c5417373b5bd8",
    email: email,
    amount: amount * 100,

    callback: function (response) {
        handlePaystackSuccess(response, {
            name,
            email,
            qty,
            amount,
        });
    },

    onClose: function () {
        alert("Payment cancelled");
    },
});

handler.openIframe();

async function verifyPaystackPayment(reference, expectedAmount) {
    const verifyUrl = `/.netlify/functions/verify-payment?reference=${encodeURIComponent(reference)}&amount=${encodeURIComponent(expectedAmount)}`;

    try {
        const response = await fetch(verifyUrl);
        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                error: result.error || "Payment verification failed.",
                details: result.details,
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || "Network error while verifying payment.",
        };
    }
}

async function handlePaystackSuccess(response, purchase) {
    const reference = response.reference || response.trxref;

    if (!reference) {
        alert("Payment reference missing from Paystack response.");
        return;
    }

    const verification = await verifyPaystackPayment(reference, purchase.amount * 100);

    if (!verification.success) {
        console.error("Paystack verification error:", verification);
        alert("Payment verification failed. Please contact support.");
        return;
    }

    if (verification.data.amount !== purchase.amount * 100) {
        alert("Verified payment amount does not match order amount.");
        return;
    }

    const ticketID = "TKT-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    let qrContainer = document.getElementById("qrTemp");

    if (!qrContainer) {
        qrContainer = document.createElement("div");
        qrContainer.id = "qrTemp";
        qrContainer.style.display = "none";
        document.body.appendChild(qrContainer);
    }

    const verificationUrl = `${window.location.origin}/ticket-verify.html?ticket=${ticketID}`;
    new QRCode(qrContainer, {
        text: verificationUrl,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
    });

    setTimeout(() => {
        const canvas = qrContainer.querySelector("canvas");
        const qrData = canvas ? canvas.toDataURL("image/png") : "";

        update(ref(db, "events/" + selectedEvent.id), {
            tickets: selectedEvent.tickets - purchase.qty,
            sold: (selectedEvent.sold || 0) + purchase.qty,
        });

        set(ref(db, "orders/" + ticketID), {
            fullName: purchase.name,
            email: purchase.email,
            event: selectedEvent.name,
            ticketID: ticketID,
            quantity: purchase.qty,
            totalAmount: purchase.amount,
            qrCode: qrData,
            createdAt: Date.now(),
            paymentRef: reference,
            paystackStatus: verification.data.status,
        });

        sendTicketEmail({
            name: purchase.name,
            email: purchase.email,
            event: selectedEvent.name,
            ticketID: ticketID,
            qty: purchase.qty,
            amount: purchase.amount,
            qr: qrData,
        });

        alert("Payment Successful! Ticket sent to email.");
    }, 800);
}


};