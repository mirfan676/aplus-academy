import { createContext, useEffect, useMemo, useState } from "react";
import {
  browserLocalPersistence,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { adminEmails, auth, db, googleProvider, hasFirebaseConfig } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileRole, setProfileRole] = useState("user");
  const [isBlogEditor, setIsBlogEditor] = useState(false);
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
      setProfileRole("user");
      setIsBlogEditor(false);

      if (currentUser && db) {
        const email = (currentUser.email || "").toLowerCase();
        const isBootstrapAdmin = adminEmails.includes(email);
        const userRef = doc(db, "users", currentUser.uid);
        const editorRef = doc(db, "blogEditors", email);
        const [profileSnapshot, editorSnapshot] = await Promise.all([
          getDoc(userRef).catch(() => null),
          getDoc(editorRef).catch(() => null),
        ]);
        const existingRole = profileSnapshot?.data()?.role;
        const role = existingRole || (isBootstrapAdmin ? "admin" : "user");

        await setDoc(
          userRef,
          {
            uid: currentUser.uid,
            name: currentUser.displayName || "",
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || "",
            provider: "google",
            role,
            lastLoginAt: serverTimestamp(),
          },
          { merge: true },
        );

        setProfileRole(role);
        setIsBlogEditor(Boolean(editorSnapshot?.exists()));
      }

      setLoading(false);
    });
  }, []);

  const isAdmin = Boolean(user?.email && (adminEmails.includes(user.email.toLowerCase()) || profileRole === "admin"));
  const canManageBlogs = Boolean(isAdmin || profileRole === "blog-editor" || isBlogEditor);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      canManageBlogs,
      profileRole,
      authError,
      hasFirebaseConfig,
      signInWithGoogle: async () => {
        if (!auth) throw new Error("Firebase is not configured.");
        setAuthError("");
        await setPersistence(auth, browserLocalPersistence);

        try {
          return await signInWithPopup(auth, googleProvider);
        } catch (error) {
          const redirectFallbackCodes = [
            "auth/popup-blocked",
            "auth/popup-closed-by-user",
            "auth/cancelled-popup-request",
            "auth/operation-not-supported-in-this-environment",
          ];

          if (redirectFallbackCodes.includes(error?.code)) {
            return signInWithRedirect(auth, googleProvider);
          }

          setAuthError(error?.message || "Google sign-in could not be started.");
          throw error;
        }
      },
      logout: () => (auth ? signOut(auth) : Promise.resolve()),
    }),
    [user, loading, isAdmin, canManageBlogs, profileRole, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
