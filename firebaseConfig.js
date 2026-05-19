import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// 1. Kendi gerçek Firebase Console bilgilerini buraya yapıştır
const firebaseConfig = {
  apiKey: ,
  authDomain: ,
  projectId: ,
  storageBucket:,
  messagingSenderId: ,
  appId: ,
  measurementId: 
};

// 2. Güvenli Başlatma
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// 3. 🌐 Web'de ve 📱 Mobilde çökmesini önleyen dinamik kalıcılık ayarı
const auth = initializeAuth(app, {
  persistence: Platform.OS === "web" 
    ? browserLocalPersistence 
    : getReactNativePersistence(AsyncStorage),
});

export { app, db, auth };
