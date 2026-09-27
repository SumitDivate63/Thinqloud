import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration with Environment Variable support
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyDh5xjyntdR6RzxtJcD-r8_M5P0VQtw2Xo",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "conferenceplatform-bb134.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "conferenceplatform-bb134",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "conferenceplatform-bb134.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1093928811908",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:1093928811908:web:eacf6021e6cc5dc4e331d1",
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-G4RTTN0YF5"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Core Services (100% Free on Spark Plan)
const auth = getAuth(app);
const db = getFirestore(app);

// Safe optional initialization for Storage (guarantees zero-cost deployment on Spark plan)
let storage = null;
try {
  storage = getStorage(app);
} catch (e) {
  console.warn("Firebase Storage optional initialization skipped on free tier.");
}

// Initialize Analytics conditionally
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics, firebaseConfig };
