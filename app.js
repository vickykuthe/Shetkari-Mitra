import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// ✅ Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAJORewccRig_NRynA_iG3lFV2M4RXcZsU",
    authDomain: "shetkari-mitra-acc29.firebaseapp.com",
    projectId: "shetkari-mitra-acc29",
    storageBucket: "shetkari-mitra-acc29.firebasestorage.app",
    messagingSenderId: "903530203412",
    appId: "1:903530203412:web:f7c58f7940ab286c9c9a01",
    measurementId: "G-383QMEXX8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export Firebase instances
export { auth, db };



document.addEventListener("DOMContentLoaded", function () {
    
    // 🔹 User Registration
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Registration Successful!");
                window.location.href = "login.html";
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }

    // 🔹 User Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Login Successful!");
                window.location.href = "user-dashboard.html";
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }
  
    // 🔹 Apply for Government Schemes
    const schemeForm = document.getElementById("schemeForm");
    if (schemeForm) {
        schemeForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const schemeName = document.getElementById("schemeName").value;

            if (!auth.currentUser) {
                alert("Please login first.");
                return;
            }

            try {
                await addDoc(collection(db, "applications"), {
                    loginemail:auth.currentUser,loginemail,
                    userId: auth.currentUser.uid,
                    scheme: schemeName,
                    status: "Pending"
                });
                alert("Application Submitted!");
                schemeForm.reset();
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }

    // 🔹 Logout Functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async function () {
            try {
                await signOut(auth);
                alert("Logged Out!");
                window.location.href = "index.html";
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }
});

