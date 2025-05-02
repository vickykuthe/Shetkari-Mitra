import { auth, db } from './firebase-config.js'; // Make sure this path is correct
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

window.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    console.error("loginForm not found. Make sure your HTML contains a form with id='loginForm'");
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const roleField = document.getElementById("role");

    if (!emailField || !passwordField || !roleField) {
      alert("Missing form fields. Check your HTML.");
      return;
    }

    const email = emailField.value.trim();
    const password = passwordField.value;
    const role = roleField.value;

    if (!role) {
      alert("Please select your role.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.role !== role) {
          alert(`You are not registered as ${role}.`);
          return;
        }

        localStorage.setItem("user", JSON.stringify({
          email: user.email,
          role: userData.role
        }));

        if (role === "admin") {
          window.location.href = "admin-dashboard.html";
        } else if (role === "farmer") {
          window.location.href = "user-dashboard.html";
        }
      } else {
        alert("User data not found in Firestore.");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
});
