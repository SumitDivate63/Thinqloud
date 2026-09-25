import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh5xjyntdR6RzxtJcD-r8_M5P0VQtw2Xo",
  authDomain: "conferenceplatform-bb134.firebaseapp.com",
  projectId: "conferenceplatform-bb134",
  storageBucket: "conferenceplatform-bb134.firebasestorage.app",
  messagingSenderId: "1093928811908",
  appId: "1:1093928811908:web:eacf6021e6cc5dc4e331d1",
  measurementId: "G-G4RTTN0YF5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics conditionally (only in supported environments)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics, firebaseConfig };
