// utils/firebase.js
"use client";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0LvJDwBWsD5kMdCFhRLVPQA5uATrUEoM",
  authDomain: "qr-attendance-app-18e3f.firebaseapp.com",
  projectId: "qr-attendance-app-18e3f",
  storageBucket: "qr-attendance-app-18e3f.firebasestorage.app",
  messagingSenderId: "656780505208",
  appId: "1:656780505208:web:df5538df2587cb22efbd8d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
