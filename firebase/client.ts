// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCOpJj5Qq0Ow6Gnz1KmmP0dmlxrx28Lh84",
  authDomain: "prepwise-69dc4.firebaseapp.com",
  projectId: "prepwise-69dc4",
  storageBucket: "prepwise-69dc4.firebasestorage.app",
  messagingSenderId: "1053249240948",
  appId: "1:1053249240948:web:55f16618ecc31e0f3bf621",
  measurementId: "G-7RHS8SWNCN"
};


const app = !getApps.length ? initializeApp(firebaseConfig): getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);