import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYwAVX-ZgeFTq5kJ1qneLpDzs994AlGG4",
  authDomain: "trackedspace-4a1aa.firebaseapp.com",
  projectId: "trackedspace-4a1aa",
  storageBucket: "trackedspace-4a1aa.firebasestorage.app",
  messagingSenderId: "614363110695",
  appId: "1:614363110695:web:78e4b2375a8bd18755dd02",
  measurementId: "G-8S749CZCYY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
