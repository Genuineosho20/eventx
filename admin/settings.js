import { db } from "../js/firebase.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut,
    updatePassword
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

const adminEmail =
document.getElementById("adminEmail");

const logoutBtn =
document.getElementById("logoutBtn");

// ======================
// LOAD ADMIN INFO
// ======================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

    } else {

        adminEmail.textContent = user.email;

    }

});

// ======================
// LOGOUT
// ======================

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});

// ======================
// CHANGE PASSWORD
// ======================

document
.getElementById("passwordForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const newPassword =
    document.getElementById("newPassword").value;

    const user = auth.currentUser;

    if (!user) {

        alert("No user logged in");
        return;

    }

    try {

        await updatePassword(user, newPassword);

        alert("Password updated successfully");

        document.getElementById("passwordForm").reset();

    } catch (error) {

        console.error(error);

        alert("Failed to update password");

    }

});