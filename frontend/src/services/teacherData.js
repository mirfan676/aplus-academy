import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase";

export const hasTeacherDataConfig = hasFirebaseConfig && !!db;

const teacherCollection = "teachers";

const asArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const asVerified = (value) => {
  if (typeof value === "boolean") return value;
  return ["yes", "true", "verified", "approved", "active"].includes(String(value || "").toLowerCase());
};

export const normalizeTeacher = (teacher, index = 0, collectionName = "teachers") => {
  const subjects = asArray(
    teacher.Subjects ||
      teacher.subjects ||
      teacher.MajorSubjects ||
      teacher.majorSubjects ||
      teacher.major_subjects ||
      teacher.subject,
  );
  const lat = Number(teacher.Latitude ?? teacher.latitude ?? teacher.lat ?? teacher.location?.lat);
  const lng = Number(teacher.Longitude ?? teacher.longitude ?? teacher.lng ?? teacher.location?.lng);
  const verified = asVerified(teacher.Verified ?? teacher.verified ?? teacher.status ?? teacher.approvalStatus);

  return {
    ...teacher,
    id: teacher.id || teacher.uid || `${collectionName}-${index}`,
    name: teacher.Name || teacher.name || teacher.displayName || "Tutor",
    Name: teacher.Name || teacher.name || teacher.displayName || "Tutor",
    city: teacher.City || teacher.city || teacher.locationCity || "Pakistan",
    City: teacher.City || teacher.city || teacher.locationCity || "Pakistan",
    subjects: subjects.length ? subjects : ["Teaching"],
    Subjects: subjects.length ? subjects : ["Teaching"],
    bio: teacher.Bio || teacher.bio || teacher.about || teacher.description || "",
    Bio: teacher.Bio || teacher.bio || teacher.about || teacher.description || "",
    experience: Number(teacher.Experience ?? teacher.experience ?? teacher.yearsOfExperience) || 0,
    Experience: Number(teacher.Experience ?? teacher.experience ?? teacher.yearsOfExperience) || 0,
    qualification: teacher.Qualification || teacher.qualification || "",
    Qualification: teacher.Qualification || teacher.qualification || "",
    thumbnail: teacher.Thumbnail || teacher.thumbnail || teacher.photoURL || teacher.imageUrl || "",
    Thumbnail: teacher.Thumbnail || teacher.thumbnail || teacher.photoURL || teacher.imageUrl || "",
    phone: teacher.Phone || teacher.phone || teacher.contact || "",
    Phone: teacher.Phone || teacher.phone || teacher.contact || "",
    verified,
    Verified: verified ? "Yes" : "",
    location: {
      lat: Number.isFinite(lat) ? lat : 31.5204,
      lng: Number.isFinite(lng) ? lng : 74.3587,
    },
    Latitude: Number.isFinite(lat) ? lat : 31.5204,
    Longitude: Number.isFinite(lng) ? lng : 74.3587,
    Area1: teacher.Area1 || teacher.area1 || "",
    Area2: teacher.Area2 || teacher.area2 || "",
    Area3: teacher.Area3 || teacher.area3 || "",
    Price: teacher.Price || teacher.price || "Rs 2000",
    Rating: teacher.Rating || teacher.rating || 5,
    Featured: teacher.Featured || teacher.featured || "",
  };
};

const fetchTeachersFromCollection = async (collectionName) => {
  const snapshots = [];
  const baseCollection = collection(db, collectionName);
  const approvedQueries = [
    query(baseCollection, where("verified", "==", true), limit(300)),
    query(baseCollection, where("Verified", "==", "Yes"), limit(300)),
    query(baseCollection, where("status", "==", "approved"), limit(300)),
  ];

  for (const approvedQuery of approvedQueries) {
    try {
      const snapshot = await getDocs(approvedQuery);
      if (!snapshot.empty) snapshots.push(snapshot);
    } catch {
      // A legacy field may not exist. Continue with the remaining approved-only query shapes.
    }
  }

  const teachersById = new Map();
  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((docSnapshot, index) => {
      const data = { id: docSnapshot.id, ...docSnapshot.data() };
      teachersById.set(docSnapshot.id, normalizeTeacher(data, index, collectionName));
    });
  });

  return [...teachersById.values()];
};

export const fetchTeachersFromFirestore = async () => {
  if (!hasTeacherDataConfig) {
    throw new Error("Firebase is not configured.");
  }

  return fetchTeachersFromCollection(teacherCollection);
};

export const fetchTeacherFromFirestore = async (id) => {
  if (!hasTeacherDataConfig || !id) return null;

  try {
    const snapshot = await getDoc(doc(db, teacherCollection, String(id)));
    if (snapshot.exists()) {
      const teacher = normalizeTeacher({ id: snapshot.id, ...snapshot.data() }, 0, teacherCollection);
      return teacher.verified ? teacher : null;
    }
  } catch {
    return null;
  }
  return null;
};
