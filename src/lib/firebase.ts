import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Verified production API key for newvacancyalert project
const VALID_API_KEY = "AIzaSyCBU_DgzSo2JKXqzQXlGfj_3mV6HHuN20E";

const envKey = import.meta.env.VITE_FIREBASE_API_KEY;
// Guard against invalid key or keys containing typos from env
const apiKey = (envKey && envKey.length > 20 && !envKey.includes("QXLGfj") && !envKey.endsWith("N2E")) 
  ? envKey 
  : VALID_API_KEY;

// DO NOT import firebase-applet-config.json here. This project uses its own
// Firebase project (newvacancyalert), not an AI-Studio-generated one.
const firebaseConfig = {
  apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "newvacancyalert.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "newvacancyalert",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "newvacancyalert.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "945815225499",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:945815225499:web:e1f02d81ebd738e151f23e",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
