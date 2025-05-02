// scripts/admin.js
import { auth, db } from '../firebase-config.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import {
  collection, addDoc, getDocs, query, where, updateDoc, doc
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert('You must be logged in.');
    window.location.href = 'login.html';
    return;
  }
  const docRef = doc(db, 'users', user.uid);
  const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', user.uid)));
  if (!userDoc.empty && userDoc.docs[0].data().role !== 'admin') {
    alert('Unauthorized. Redirecting...');
    window.location.href = 'login.html';
  }

  loadApplications();
});

document.getElementById('cropForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('cropName').value.trim();
  const season = document.getElementById('season').value.trim();
  await addDoc(collection(db, 'crops'), { name, season });
  alert('Crop added!');
  e.target.reset();
});

document.getElementById('schemeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('schemeTitle').value.trim();
  const description = document.getElementById('schemeDescription').value.trim();
  await addDoc(collection(db, 'schemes'), { title, description });
  alert('Scheme added!');
  e.target.reset();
});

async function loadApplications() {
  const list = document.getElementById('pendingAppsList');
  list.innerHTML = '';
  const q = query(collection(db, 'applications'), where('status', '==', 'Pending'));
  const snapshot = await getDocs(q);
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const li = document.createElement('li');
    li.textContent = `User ID: ${data.userId} | Scheme ID: ${data.schemeId}`;
    const approveBtn = document.createElement('button');
    approveBtn.textContent = 'Approve';
    approveBtn.onclick = async () => {
      const appRef = doc(db, 'applications', docSnap.id);
      await updateDoc(appRef, { status: 'Approved' });
      alert('Application approved!');
      loadApplications();
    };
    li.appendChild(approveBtn);
    list.appendChild(li);
  }
}
