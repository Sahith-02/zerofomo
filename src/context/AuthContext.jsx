import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../config/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  async function signup(email, password, firstName, lastName) {
    // eslint-disable-next-line no-useless-catch
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        createdAt: serverTimestamp()
      });
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  // Google Sign-in function
  async function signInWithGoogle() {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // If it's a new user, store user data in Firestore
        // Extract first and last name from displayName
        const nameParts = user.displayName ? user.displayName.split(' ') : ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        await setDoc(userDocRef, {
          firstName,
          lastName,
          email: user.email,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          authProvider: 'google'
        });
      } else {
        // Update last login time for existing user
        await setDoc(userDocRef, {
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}