import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase web config değerleriniz
const firebaseConfig = {
  apiKey: "AIzaSyBeMwAj2k_KuAnGjwdl6BCvEgGyorkJSQI",
  authDomain: "pazarlik-botu.firebaseapp.com",
  projectId: "pazarlik-botu",
  storageBucket: "pazarlik-botu.firebasestorage.app",
  messagingSenderId: "236213940651",
  appId: "1:236213940651:web:07a16ff9707c8a8316a2ee",
  measurementId: "G-W4LSMLYJTB"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Veritabanı referansını dışa aktar
export const db = getFirestore(app);