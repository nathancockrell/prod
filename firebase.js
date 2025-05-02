import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBeEsgouNQVwOQGVZfDG7FY9JfxgAGsIZU",
  authDomain: "prod-c26a1.firebaseapp.com",
  projectId: "prod-c26a1",
  storageBucket: "prod-c26a1.appspot.com",
  messagingSenderId: "279795802739",
  appId: "1:279795802739:web:f96715a47635d2d3ef0006",
  databaseURL: "https://prod-c26a1-default-rtdb.firebaseio.com"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  document.getElementById("loginbtn").addEventListener("click", ()=>{
    login();
  })
  document.getElementById("registerbtn").addEventListener("click", ()=>{
    register();
  })

  async function register() {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid
      });
  
      alert("User registered and saved in Firestore!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Logged in as " + userCredential.user.email);
        document.getElementById("loginPassword").value="";
        document.getElementById("loginEmail").value="";
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }