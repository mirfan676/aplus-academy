import { createContext, useEffect, useMemo, useState } from "react";
import {
  browserLocalPersistence,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { adminEmails, auth, db, googleProvider, hasFirebaseConfig } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(hasFirebaseConfig);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    setPersistence(auth, browserLocalPersistence)
      .then(() => getRedirectResult(auth))
      .catch((error) => {
        console.error("Google sign-in redirect failed:", error);
        setAuthError(error?.message || "Google sign-in could not be completed.");
      });

    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser && db) {
        await setDoc(
          doc(db, "users", currentUser.uid),
          {
            uid: currentUser.uid,
            name: currentUser.displayName || "",
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || "",
            provider: "google",
            role: adminEmails.includes((currentUser.email || "").toLowerCase()) ? "admin" : "user",
            lastLoginAt: serverTimestamp(),
          },
          { merge: true },
        );
      }
    });
  }, []);

  const isAdmin = Boolean(user?.email && adminEmails.includes(user.email.toLowerCase()));

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      authError,
      hasFirebaseConfig,
      signInWithGoogle: async () => {
        if (!auth) throw new Error("Firebase is not configured.");
        setAuthError("");
        await setPersistence(auth, browserLocalPersistence);
        return signInWithRedirect(auth, googleProvider);
      },
      logout: () => (auth ? signOut(auth) : Promise.resolve()),
    }),
    [user, loading, isAdmin, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
