import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBwIt87mJuRyI7Fa7GEYBpEzbWumXX0Vis",
  authDomain: "eventx-4ea16.firebaseapp.com",
  projectId: "eventx-4ea16"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("loginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(auth, email, password);

        alert("Login successful");

        window.location.href = "index.html";

    } catch (error) {

        alert("Login failed: " + error.message);

    }

});