import { db } from "./firebase.js";

import {
    ref,
    get,
    update
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const result = document.getElementById("result");
function onScanSuccess(decodedText) {
    console.log("SCANNED:", decodedText);
    verifyTicket(decodedText);
}
async function verifyTicket(ticketID) {

    const snapshot = await get(ref(db, "orders"));
    const orders = snapshot.val();

    if (!orders) {
        result.innerHTML = `
            <div class="alert alert-warning">
                No tickets found in database
            </div>
        `;
        return;
    }

    let found = false;

    for (let key in orders) {

        const order = orders[key];

        if (order.ticketID === ticketID) {

            found = true;

            if (order.used) {

                result.innerHTML = `
                    <div class="alert alert-danger">
                        ❌ Ticket Already Used
                    </div>
                `;

            } else {

                await update(ref(db, `orders/${key}`), {
                    used: true
                });

                result.innerHTML = `
                    <div class="alert alert-success">
                        ✅ Valid Ticket<br>
                        ${order.fullName}<br>
                        ${order.event}
                    </div>
                `;
            }

            return;
        }
    }

    result.innerHTML = `
        <div class="alert alert-warning">
            ❌ Invalid Ticket
        </div>
    `;
}
const html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras()
.then(devices => {

    if (!devices || devices.length === 0) {
        console.error("No camera found");
        return;
    }

    const cameraId = devices[0].id;

    html5QrCode.start(
        cameraId,
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        onScanSuccess
    )
    .then(() => {
        console.log("Scanner started");
    })
    .catch(err => {
        console.error("Scanner failed to start:", err);
    });

})
.catch(err => {
    console.error("Camera error:", err);
});