import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


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


registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const name = registerForm.querySelector('input[placeholder="Full Name"]').value.trim();
    const email = registerForm.querySelector('input[type="email"]').value.trim();
    const dob = registerForm.querySelector('input[type="date"]').value;
    const gender = registerForm.querySelector('select').value;
    const state = registerForm.querySelector('input[placeholder="State"]').value.trim();
    const username = registerForm.querySelector('input[placeholder="Username"]').value.trim();
    const password = registerForm.querySelector('input[type="password"]').value;
    const role = document.getElementById("roleSelect").value;
  
    if (!role) {
      alert("Please select a role.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        dob,
        gender,
        state,
        username,
        role
      });
  
      alert("Registration Successful!");
  
  
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Error: " + error.message);
    }
  });
  