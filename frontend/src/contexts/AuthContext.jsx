import { createContext, useEffect, useMemo, useState } from "react";
import { getRedirectResult, onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { adminEmails, auth, db, googleProvider, hasFirebaseConfig } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(hasFirebaseConfig);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    getRedirectResult(auth).catch((error) => {
      console.error("Google sign-in redirect failed:", error);
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
      hasFirebaseConfig,
      signInWithGoogle: () => {
        if (!auth) throw new Error("Firebase is not configured.");
        return signInWithRedirect(auth, googleProvider);
      },
      logout: () => (auth ? signOut(auth) : Promise.resolve()),
    }),
    [user, loading, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
