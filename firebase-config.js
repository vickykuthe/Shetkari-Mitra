// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJORewccRig_NRynA_iG3lFV2M4RXcZsU",
  authDomain: "shetkari-mitra-acc29.firebaseapp.com",
  projectId: "shetkari-mitra-acc29",
  storageBucket: "shetkari-mitra-acc29.appspot.com",
  messagingSenderId: "903530203412",
  appId: "1:903530203412:web:f7c58f7940ab286c9c9a01",
  measurementId: "G-383QMEXX8H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
