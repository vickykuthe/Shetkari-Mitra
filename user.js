// user.js
import { db, auth } from './firebase-config.js';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';

const cropList = document.getElementById('cropList');
const schemeList = document.getElementById('schemeList');
const schemeSelect = document.getElementById('schemeSelect');
const schemeForm = document.getElementById('schemeApplicationForm');
const applicationStatusList = document.getElementById('applicationStatusList');

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await loadCrops();
    await loadSchemes();
    await loadUserApplications();
  } else {
    alert('Please log in to continue.');
    window.location.href = 'login.html';
  }
});

async function loadCrops() {
  const cropsSnap = await getDocs(collection(db, 'crops'));
  cropList.innerHTML = '';
  cropsSnap.forEach(doc => {
    const data = doc.data();
    const li = document.createElement('li');
    li.textContent = `${data.name} (${data.season})`;
    cropList.appendChild(li);
  });
}

async function loadSchemes() {
  const schemesSnap = await getDocs(collection(db, 'schemes'));
  schemeList.innerHTML = '';
  schemeSelect.innerHTML = '<option value="">-- Select a scheme --</option>';
  schemesSnap.forEach(doc => {
    const data = doc.data();
    const li = document.createElement('li');
    li.textContent = `${data.title} - ${data.description}`;
    schemeList.appendChild(li);

    const option = document.createElement('option');
    option.value = data.title;
    option.textContent = data.title;
    schemeSelect.appendChild(option);
  });
}

schemeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const selectedScheme = schemeSelect.value;
  if (!selectedScheme || !currentUser) {
    alert('Please select a scheme.');
    return;
  }

  try {
    await addDoc(collection(db, 'applications'), {
      uid: currentUser.uid,
      email: currentUser.email,
      scheme: selectedScheme,
      status: 'pending'
    });
    alert('Application submitted!');
    schemeForm.reset();
    await loadUserApplications();
  } catch (err) {
    alert('Failed to apply: ' + err.message);
  }
});

async function loadUserApplications() {
  const q = query(collection(db, 'applications'), where('uid', '==', currentUser.uid));
  const appsSnap = await getDocs(q);
  applicationStatusList.innerHTML = '';

  appsSnap.forEach(doc => {
    const app = doc.data();
    const li = document.createElement('li');
    li.textContent = `${app.scheme} - ${app.status}`;
    applicationStatusList.appendChild(li);
  });
}