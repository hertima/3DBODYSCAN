import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA60DM5kX0Fj8bpmk5HVbMW-wHWSqjpai4",
  authDomain: "d-body-scan.firebaseapp.com",
  projectId: "d-body-scan",
  storageBucket: "d-body-scan.firebasestorage.app",
  messagingSenderId: "395247947865",
  appId: "1:395247947865:web:facf2e2b767f03725a2148",
  measurementId: "G-YSGVF9Z56B",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
