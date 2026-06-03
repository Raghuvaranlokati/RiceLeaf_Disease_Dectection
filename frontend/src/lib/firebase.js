import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// getAnalytics requires the browser window object, so we shouldn't use it in API routes
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB-6vEdmFgwdB1ZkbreYthfenSf8GhgfRw",
  authDomain: "personal-22894.firebaseapp.com",
  projectId: "personal-22894",
  storageBucket: "personal-22894.firebasestorage.app",
  messagingSenderId: "642489601049",
  appId: "1:642489601049:web:544e065b1e3cb0b01aae88",
  measurementId: "G-E9C6XQV656"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
