import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";

const legacyApi = "https://aplus-academy.onrender.com";

const asList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
};

const numberOrNull = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const migrateThumbnail = async (sourceUrl, teacherId) => {
  if (!sourceUrl) return "";
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`Image returned ${response.status}`);
  const blob = await response.blob();
  const imageRef = ref(storage, `teachers/${teacherId}/profile.jpg`);
  await uploadBytes(imageRef, blob, { contentType: blob.type || "image/jpeg" });
  return getDownloadURL(imageRef);
};

export const getFirestoreMigrationCounts = async () => {
  const names = ["teachers", "teacherApplications", "jobs", "pteEssays", "pteEssayResponses"];
  const counts = {};
  await Promise.all(names.map(async (name) => {
    try {
      counts[name] = (await getCountFromServer(collection(db, name))).data().count;
    } catch {
      counts[name] = null;
    }
  }));
  return counts;
};

export const migrateLegacyData = async (onProgress = () => {}) => {
  if (!db || !storage) throw new Error("Firebase is not configured.");
  const tutorResponse = await fetch(`${legacyApi}/tutors/`);
  if (!tutorResponse.ok) throw new Error("Legacy teacher API could not be loaded.");
  const tutors = await tutorResponse.json();
  let imageFailures = 0;

  for (let index = 0; index < tutors.length; index += 1) {
    const legacy = tutors[index];
    const teacherId = `legacy-${String(index).padStart(3, "0")}`;
    onProgress({ stage: "teachers", current: index + 1, total: tutors.length, label: legacy.Name || "Tutor" });
    let thumbnail = "";
    try {
      thumbnail = await migrateThumbnail(legacy.Thumbnail, teacherId);
    } catch (error) {
      console.warn(`Image migration failed for ${teacherId}:`, error);
      imageFailures += 1;
    }

    const subjects = [...new Set([
      ...asList(legacy.Subjects),
      ...asList(legacy["Major Subjects"]),
      ...asList(legacy.Subject),
    ])];
    await setDoc(doc(db, "teachers", teacherId), {
      name: legacy.Name || "Tutor",
      qualification: legacy.Qualification || "",
      subject: legacy.Subject || subjects[0] || "Teaching",
      subjects,
      experience: numberOrNull(legacy.Experience) || 0,
      bio: legacy.Bio || "",
      city: legacy.City || legacy.District || "Pakistan",
      province: legacy.Province || "",
      district: legacy.District || "",
      tehsil: legacy.Tehsil || "",
      area1: legacy.Area1 || "",
      area2: legacy.Area2 || "",
      area3: legacy.Area3 || "",
      latitude: numberOrNull(legacy.Latitude),
      longitude: numberOrNull(legacy.Longitude),
      thumbnail,
      photoURL: thumbnail,
      verified: true,
      status: "approved",
      source: "google-sheets-migration",
      legacyIndex: index,
      importedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    await setDoc(doc(db, "teacherPrivate", teacherId), {
      phone: legacy.Phone || "",
      profileUrl: legacy["Profile URL"] || "",
      exactLocation: legacy.ExactLocation || "",
      source: "google-sheets-migration",
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  onProgress({ stage: "jobs", current: 0, total: 1, label: "Tutor jobs" });
  const jobsResponse = await fetch(`${legacyApi}/jobs`);
  if (jobsResponse.ok) {
    const jobsPayload = await jobsResponse.json();
    const jobs = Array.isArray(jobsPayload) ? jobsPayload : jobsPayload.jobs || [];
    for (let index = 0; index < jobs.length; index += 1) {
      await setDoc(doc(db, "jobs", `legacy-${String(index).padStart(3, "0")}`), {
        ...jobs[index],
        source: "google-sheets-migration",
        importedAt: serverTimestamp(),
      }, { merge: true });
    }
  }

  onProgress({ stage: "locations", current: 0, total: 1, label: "Pakistan locations" });
  const locationsResponse = await fetch(`${legacyApi}/locations`);
  if (!locationsResponse.ok) throw new Error("Legacy locations could not be loaded.");
  await setDoc(doc(db, "siteConfig", "locations"), {
    data: await locationsResponse.json(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  onProgress({ stage: "pte", current: 0, total: 1, label: "PTE sample essays" });
  const samplesResponse = await fetch("/pte/essays.json", { cache: "no-store" });
  if (samplesResponse.ok) {
    const samples = await samplesResponse.json();
    for (const sample of samples) {
      await setDoc(doc(db, "pteEssays", sample.id), {
        ...sample,
        createdAt: serverTimestamp(),
        source: "aplus-original",
      }, { merge: true });
    }
  }

  return { teachers: tutors.length, imageFailures };
};

export const fetchPendingTeacherApplications = async () => {
  const snapshot = await getDocs(query(collection(db, "teacherApplications"), where("status", "==", "pending")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const approveTeacherApplication = async (application) => {
  const publicProfile = {
    uid: application.uid,
    name: application.name || application.displayName || "Tutor",
    qualification: application.qualification || "",
    subject: application.subject || application.subjects?.[0] || "Teaching",
    subjects: application.subjects || [],
    experience: Number(application.experience) || 0,
    bio: application.bio || "",
    city: application.city || "Pakistan",
    latitude: application.latitude || null,
    longitude: application.longitude || null,
    thumbnail: application.thumbnail || application.photoURL || "",
    photoURL: application.photoURL || application.thumbnail || "",
    verified: true,
    status: "approved",
    source: "firestore-registration",
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, "teachers", application.id), publicProfile, { merge: true });
  await setDoc(doc(db, "teacherApplications", application.id), {
    status: "approved",
    verified: true,
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  await setDoc(doc(db, "users", application.id), {
    role: "teacher",
    applicationStatus: "approved",
    updatedAt: serverTimestamp(),
  }, { merge: true });
};
