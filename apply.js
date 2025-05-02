import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import {
  collection, getDocs, addDoc, query, where
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

let currentUserId = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserId = user.uid;
    await loadSchemes();
    await loadApplications();
  } else {
    alert("You must be logged in.");
    window.location.href = "login.html";
  }
});

async function loadSchemes() {
  const schemeSelect = document.getElementById("schemeSelect");
  schemeSelect.innerHTML = "";
  const snapshot = await getDocs(collection(db, "schemes"));
  if (snapshot.empty) {
    const opt = document.createElement("option");
    opt.textContent = "No schemes available.";
    schemeSelect.appendChild(opt);
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    const opt = document.createElement("option");
    opt.value = doc.id;
    opt.textContent = data.title;
    schemeSelect.appendChild(opt);
  });
}

document.getElementById("schemeApplicationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const schemeId = document.getElementById("schemeSelect").value;

  if (!schemeId) {
    alert("Please select a scheme.");
    return;
  }

  try {
    await addDoc(collection(db, "applications"), {
      userId: currentUserId,
      schemeId: schemeId,
      status: "Pending"
    });
    alert("Application submitted!");
    await loadApplications();
  } catch (error) {
    alert("Error applying: " + error.message);
  }
});

async function loadApplications() {
  const list = document.getElementById("applicationStatusList");
  list.innerHTML = "";
  const q = query(collection(db, "applications"), where("userId", "==", currentUserId));
  const apps = await getDocs(q);

  for (const docSnap of apps.docs) {
    const app = docSnap.data();
    const schemeDoc = await getDocs(collection(db, "schemes"));
    let schemeTitle = "Unknown";
    schemeDoc.forEach((scheme) => {
      if (scheme.id === app.schemeId) {
        schemeTitle = scheme.data().title;
      }
    });

    const li = document.createElement("li");
    li.textContent = `Scheme: ${schemeTitle} | Status: ${app.status}`;
    list.appendChild(li);
  }
}