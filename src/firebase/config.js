// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArGxG_FrenTeXf_VMzrwtO5KqmnCQxZMw",
  authDomain: "encuestas360-41f0e.firebaseapp.com",
  projectId: "encuestas360-41f0e",
  storageBucket: "encuestas360-41f0e.firebasestorage.app",
  messagingSenderId: "388178398574",
  appId: "1:388178398574:web:7883b1f49fe5c22f0a457f",
  measurementId: "G-J6QZCP3KCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);