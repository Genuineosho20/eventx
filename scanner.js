import { db } from "../firebase.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const result = document.getElementById("result");

let scanner;

// =======================
// VERIFY TICKET
// =======================
async function verify(ticketID) {

    const snap = await get(ref(db, "orders"));
    const data = snap.val();

    if (!data) {
        show("❌ NO TICKETS FOUND", "red");
        return;
    }

    for (let key in data) {

        const order = data[key];

        if (order.ticketID === ticketID) {

            if (order.used) {
                show(`❌ ALREADY USED<br>${order.fullName}`, "orange");
                return;
            }

            await update(ref(db, `orders/${key}`), {
                used: true
            });

            show(`✅ VALID TICKET<br>${order.fullName}<br>${order.event}`, "green");
            return;
        }
    }

    show("❌ INVALID TICKET", "red");
}

// =======================
// UI RESULT
// =======================
function show(text, color) {
    result.innerHTML = `
        <div style="
            padding:20px;
            margin-top:20px;
            font-size:22px;
            font-weight:bold;
            color:white;
            background:${color};
            border-radius:10px;
        ">
            ${text}
        </div>
    `;
}

// =======================
// START SCANNER (DEVICE SAFE)
// =======================
function startScanner(cameraId) {

    scanner = new Html5Qrcode("reader");

    scanner.start(
        cameraId,
        {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        },
        async (decodedText) => {

            await scanner.pause();

            verify(decodedText);

            setTimeout(() => {
                scanner.resume();
            }, 2500);

        }
    ).catch(err => {
        console.error("Camera start error:", err);
        show("❌ CAMERA START FAILED", "red");
    });
}

// =======================
// INIT CAMERA (ALL DEVICES FIX)
// =======================
Html5Qrcode.getCameras()
.then(devices => {

    if (!devices || devices.length === 0) {
        show("❌ NO CAMERA DETECTED", "red");
        return;
    }

    // 🔥 PRIORITY: BACK CAMERA (Android/iPhone fix)
    let cameraId =
        devices.find(d =>
            d.label.toLowerCase().includes("back") ||
            d.label.toLowerCase().includes("rear")
        )?.id || devices[0].id;

    startScanner(cameraId);

})
.catch(err => {
    console.error(err);
    show("❌ CAMERA PERMISSION BLOCKED", "red");
});