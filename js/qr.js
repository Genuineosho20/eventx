document.addEventListener("DOMContentLoaded", () => {
    const qrCodeElement = document.getElementById("qr-code");
    const nameElement = document.getElementById("ticket-name");
    const eventElement = document.getElementById("ticket-event");
    const codeElement = document.getElementById("ticket-code");

    if (!qrCodeElement) {
        return;
    }

    const ticketData = JSON.parse(localStorage.getItem("ticketData") || "null");

    if (!ticketData) {
        qrCodeElement.textContent = "No ticket data available. Please complete your purchase first.";
        return;
    }

    nameElement.textContent = ticketData.name || "N/A";
    eventElement.textContent = ticketData.eventName || "N/A";
    codeElement.textContent = ticketData.ticketCode || "N/A";

    qrCodeElement.textContent = `QR Code: ${ticketData.ticketCode}`;
});
