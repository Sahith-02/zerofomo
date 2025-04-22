import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {  GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVsg8a9VeyamPL94_X90zbtw8BVpjPofM",
  authDomain: "zerofomo-31603.firebaseapp.com",
  projectId: "zerofomo-31603",
  storageBucket: "zerofomo-31603.firebasestorage.app",
  messagingSenderId: "636116158828",
  appId: "1:636116158828:web:409c30bdaa1098ad3e8b49",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;

