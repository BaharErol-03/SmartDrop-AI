import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase web config değerleriniz
const firebaseConfig = {
  
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Veritabanı referansını dışa aktar
export const db = getFirestore(app);
