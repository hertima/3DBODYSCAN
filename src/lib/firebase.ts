import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA60DM5kX0Fj8bpmk5HVbMW-wHWSqjpai4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "d-body-scan.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "d-body-scan",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "d-body-scan.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "395247947865",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:395247947865:web:facf2e2b767f03725a2148",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YSGVF9Z56B",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);

// Offline persistence: dados ficam no cache local e sincronizam ao voltar a internet
export const db = (() => {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache(),
    });
  } catch {
    return getFirestore(app);
  }
})();
