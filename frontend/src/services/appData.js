import { collection, doc, getDoc, getDocs, limit, query } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase";

const requireFirestore = () => {
  if (!hasFirebaseConfig || !db) throw new Error("Firebase is not configured.");
};

export const fetchJobsFromFirestore = async () => {
  requireFirestore();
  const snapshot = await getDocs(query(collection(db, "jobs"), limit(500)));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .filter((job) => String(job.status || job.Status || "active").toLowerCase() !== "closed");
};

export const fetchLocationsFromFirestore = async () => {
  requireFirestore();
  const snapshot = await getDoc(doc(db, "siteConfig", "locations"));
  if (!snapshot.exists()) throw new Error("Location data has not been imported to Firestore.");
  return snapshot.data().data || {};
};

export const fetchTeachersForAdmin = async () => {
  requireFirestore();
  const snapshot = await getDocs(query(collection(db, "teachers"), limit(500)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};
