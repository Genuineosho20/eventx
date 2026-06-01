function generateTicketCode() {
    const segments = [];
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i = 0; i < 4; i += 1) {
        let segment = "";
        for (let j = 0; j < 4; j += 1) {
            segment += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        segments.push(segment);
    }

    return segments.join("-");
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const eventInput = document.getElementById("event");

        const ticketData = {
            id: Date.now().toString(36),
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            eventName: eventInput.value,
            ticketCode: generateTicketCode(),
            purchasedAt: new Date().toISOString(),
        };

        localStorage.setItem("ticketData", JSON.stringify(ticketData));
        window.location.href = "success.html";
    });
});
