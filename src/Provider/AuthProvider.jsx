import React, { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /** ✅ Helper to persist user locally */
  const persistUser = (userData) => {
    if (userData) localStorage.setItem("userData", JSON.stringify(userData));
    else localStorage.removeItem("userData");
  };

  /** ✅ On initial mount, restore user from localStorage */
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  /** ✅ Listen for Firebase Auth state changes */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const newUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          token,
        };
        setUser(newUser);
        persistUser(newUser);

        // 🔄 Optionally sync with backend `/users`
        try {
          await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newUser),
          });
        } catch (error) {
          console.error("⚠️ Failed to sync user with backend:", error);
        }
      } else {
        setUser(null);
        persistUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /** 🔹 Sign up with email + password */
  const signUp = async (email, password, name, photoURL) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name, photoURL });

    const token = await result.user.getIdToken();
    const newUser = {
      uid: result.user.uid,
      email,
      displayName: name,
      photoURL,
      token,
    };
    setUser(newUser);
    persistUser(newUser);
    setLoading(false);

    // 🔄 Save to backend
    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser),
    });

    return result.user;
  };

  /** 🔹 Login with email + password */
  const login = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    const loggedUser = {
      uid: result.user.uid,
      email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      token,
    };
    setUser(loggedUser);
    persistUser(loggedUser);
    setLoading(false);
    return result.user;
  };

  /** 🔹 Google Sign-in */
  const signInWithGoogle = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();

    const newUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      token,
    };
    setUser(newUser);
    persistUser(newUser);
    setLoading(false);

    // 🔄 Sync with backend
    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser),
    });

    return result.user;
  };

  /** 🔹 Log out */
  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    persistUser(null);
    setLoading(false);
  };

  /** 🔹 Update profile info */
  const updateProfileData = async (name, photoURL) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      const updatedUser = {
        ...user,
        displayName: name,
        photoURL,
      };
      setUser(updatedUser);
      persistUser(updatedUser);
    }
  };

  /** 🔹 Get Firebase ID Token for secure API calls */
  const getIdToken = async () => {
    if (auth.currentUser) return await auth.currentUser.getIdToken();
    return null;
  };

  const authInfo = {
    user,
    loading,
    signUp,
    login,
    signInWithGoogle,
    logOut,
    updateProfileData,
    setUser,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
