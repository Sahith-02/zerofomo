import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add this import

// Your Firebase configuration from environment variables
const firebaseConfig = {
  apiKey:
    import.meta.env?.VITE_FIREBASE_API_KEY ||
    "AIzaSyAVsg8a9VeyamPL94_X90zbtw8BVpjPofM",
  authDomain:
    import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN ||
    "zerofomo-31603.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "zerofomo-31603",
  storageBucket:
    import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET ||
    "zerofomo-31603.firebasestorage.app",
  messagingSenderId:
    import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "636116158828",
  appId:
    import.meta.env?.VITE_FIREBASE_APP_ID ||
    "1:636116158828:web:409c30bdaa1098ad3e8b49",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Add this export

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;
