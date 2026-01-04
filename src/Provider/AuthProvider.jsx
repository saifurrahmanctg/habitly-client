import React, { createContext, useContext, useEffect, useState } from "react";
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
import Swal from "sweetalert2";

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const toast = (icon, title) =>
  Swal.fire({
    icon,
    title,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistUser = (u) =>
    u
      ? localStorage.setItem("userData", JSON.stringify(u))
      : localStorage.removeItem("userData");

  // Fetch user from MongoDB
  const fetchUserFromDB = async (email, token) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${email}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error("Failed to fetch user from DB");
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Sync user to MongoDB
  const syncUserToDB = async (userData, token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userData.displayName || "No Name",
          email: userData.email,
          photoURL: userData.photoURL || "",
          role: "user",
        }),
      });
      const result = await res.json();
      return result;
    } catch (err) {
      console.error("Error syncing user to DB:", err);
      return null;
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem("userData");
    if (raw) setUser(JSON.parse(raw));

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const token = await fbUser.getIdToken();
        const dbUser = await fetchUserFromDB(fbUser.email, token);

        const profile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          role: dbUser?.role || "user",
          token,
        };

        setUser(profile);
        persistUser(profile);
      } else {
        setUser(null);
        persistUser(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  // ---------- Auth Actions ----------
  const signUp = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name, photoURL });

      const token = await cred.user.getIdToken();
      await syncUserToDB(cred.user, token);

      const profile = {
        uid: cred.user.uid,
        email,
        displayName: name,
        photoURL,
        role: "user",
        token,
      };

      setUser(profile);
      persistUser(profile);
      toast("success", "Account created!");
      return cred.user;
    } catch (err) {
      toast("error", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();

      const dbUser = await fetchUserFromDB(email, token);

      const profile = {
        uid: cred.user.uid,
        email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
        role: dbUser?.role || "user",
        token,
      };

      setUser(profile);
      persistUser(profile);
      toast("success", "Welcome back!");
      return cred.user;
    } catch (err) {
      toast("error", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const token = await cred.user.getIdToken();

      await syncUserToDB(cred.user, token);

      const profile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
        role: "user",
        token,
      };

      setUser(profile);
      persistUser(profile);
      toast("success", "Signed in with Google!");
      return cred.user;
    } catch (err) {
      toast("error", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    persistUser(null);
    setLoading(false);
  };

  const updateProfileData = async (name, photoURL) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name, photoURL });
    const updated = { ...user, displayName: name, photoURL };
    setUser(updated);
    persistUser(updated);
    toast("success", "Profile updated");
  };

  const getIdToken = () => auth.currentUser?.getIdToken() || null;

  const value = {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
