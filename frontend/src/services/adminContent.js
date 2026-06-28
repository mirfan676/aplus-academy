import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const requireDb = () => {
  if (!db) throw new Error("Firebase is not configured.");
};

const listCollection = async (name, max = 500) => {
  requireDb();
  const snapshot = await getDocs(query(collection(db, name), limit(max)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const fetchAdminJobs = () => listCollection("jobs");
export const fetchTeamMembers = () => listCollection("teamMembers");
export const fetchTeacherLeads = () => listCollection("teacherLeads", 2000);
export const fetchPteQuestions = async () => {
  requireDb();
  const snapshot = await getDocs(query(collection(db, "pteQuestions"), orderBy("updatedAt", "desc"), limit(500)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};
export const fetchSiteAiTutorLogs = async () => {
  requireDb();
  const snapshot = await getDocs(query(collection(db, "siteAiTutorLogs"), orderBy("createdAt", "desc"), limit(200)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

const normalizeLeadPhone = (phone) => String(phone || "").replace(/\D/g, "");

const leadDocId = (lead) => {
  const normalizedPhone = normalizeLeadPhone(lead.phone);
  if (!normalizedPhone) throw new Error("Each teacher lead needs a phone number.");
  return normalizedPhone;
};

export const fetchTeacherRecords = async () => {
  const [teachers, applications, privateProfiles] = await Promise.all([
    listCollection("teachers"), listCollection("teacherApplications"), listCollection("teacherPrivate"),
  ]);
  const privateById = new Map(privateProfiles.map((item) => [item.id, item]));
  const pendingIds = new Set(applications.filter((item) => item.status === "pending").map((item) => item.id));
  return [
    ...applications.filter((item) => item.status === "pending").map((item) => ({ ...item, recordState: "pending" })),
    ...teachers.filter((item) => !pendingIds.has(item.id)).map((item) => ({ ...item, ...privateById.get(item.id), recordState: "verified" })),
  ];
};

export const saveJob = async (job) => {
  requireDb();
  const payload = {
    title: job.title.trim(),
    grade: job.grade.trim(),
    school: job.school.trim(),
    subjects: job.subjects.trim(),
    timing: job.timing.trim(),
    fee: Number(job.fee) || 0,
    location: job.location.trim(),
    city: job.city.trim(),
    gender: job.gender.trim() || "Both",
    contact: job.contact.trim(),
    status: job.status || "Open",
    students: Number(job.students) || 1,
    updatedAt: serverTimestamp(),
  };
  if (job.id) {
    await setDoc(doc(db, "jobs", job.id), payload, { merge: true });
    return job.id;
  }
  return (await addDoc(collection(db, "jobs"), { ...payload, createdAt: serverTimestamp() })).id;
};

export const removeJob = async (id) => {
  requireDb();
  await deleteDoc(doc(db, "jobs", id));
};

export const saveTeacherApplication = async (application) => {
  requireDb();
  const applicationData = { ...application };
  delete applicationData.id;
  delete applicationData.recordState;
  await setDoc(doc(db, "teacherApplications", application.id), {
    ...applicationData,
    subjects: String(application.subjects || "").split(",").map((item) => item.trim()).filter(Boolean),
    experience: Number(application.experience) || 0,
    latitude: Number(application.latitude) || null,
    longitude: Number(application.longitude) || null,
    verified: false,
    status: "pending",
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const saveVerifiedTeacher = async (teacher) => {
  requireDb();
  const teacherData = { ...teacher };
  ["id", "phone", "profileUrl", "exactLocation", "recordState"].forEach((field) => delete teacherData[field]);
  await setDoc(doc(db, "teachers", teacher.id), {
    ...teacherData,
    subjects: String(teacher.subjects || "").split(",").map((item) => item.trim()).filter(Boolean),
    experience: Number(teacher.experience) || 0,
    latitude: Number(teacher.latitude) || null,
    longitude: Number(teacher.longitude) || null,
    verified: true,
    status: "approved",
    updatedAt: serverTimestamp(),
  }, { merge: true });
  await setDoc(doc(db, "teacherPrivate", teacher.id), {
    phone: teacher.phone || "", profileUrl: teacher.profileUrl || "", exactLocation: teacher.exactLocation || "", updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const saveTeamMember = async (member) => {
  requireDb();
  const payload = {
    name: member.name.trim(),
    role: member.role.trim(),
    bio: member.bio.trim(),
    photoURL: member.photoURL.trim(),
    expertise: String(member.expertise || "").split(",").map((item) => item.trim()).filter(Boolean),
    linkedin: member.linkedin.trim(),
    email: member.email.trim(),
    sortOrder: Number(member.sortOrder) || 0,
    active: Boolean(member.active),
    updatedAt: serverTimestamp(),
  };
  if (member.id) {
    await setDoc(doc(db, "teamMembers", member.id), payload, { merge: true });
    return member.id;
  }
  return (await addDoc(collection(db, "teamMembers"), { ...payload, createdAt: serverTimestamp() })).id;
};

export const removeTeamMember = async (id) => {
  requireDb();
  await deleteDoc(doc(db, "teamMembers", id));
};

export const savePteQuestion = async (question) => {
  requireDb();
  const payload = {
    title: String(question.title || "").trim(),
    section: String(question.section || "").trim(),
    taskSlug: String(question.taskSlug || "").trim(),
    questionType: String(question.questionType || "text").trim(),
    difficulty: String(question.difficulty || "medium").trim(),
    source: String(question.source || "A Plus Academy original").trim(),
    prompt: String(question.prompt || "").trim(),
    transcript: String(question.transcript || "").trim(),
    audioText: String(question.audioText || "").trim(),
    audioUrl: String(question.audioUrl || "").trim(),
    sample: String(question.sample || "").trim(),
    explanation: String(question.explanation || "").trim(),
    notes: String(question.notes || "").trim(),
    options: String(question.options || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    tips: String(question.tips || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    acceptableAnswers: String(question.acceptableAnswers || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    correctAnswers: String(question.correctAnswers || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    minWords: question.minWords === "" ? null : Number(question.minWords) || null,
    maxWords: question.maxWords === "" ? null : Number(question.maxWords) || null,
    order: Number(question.order) || 0,
    published: Boolean(question.published),
    updatedAt: serverTimestamp(),
  };

  if (question.id) {
    await setDoc(doc(db, "pteQuestions", question.id), payload, { merge: true });
    return question.id;
  }

  return (
    await addDoc(collection(db, "pteQuestions"), {
      ...payload,
      createdAt: serverTimestamp(),
    })
  ).id;
};

export const removePteQuestion = async (id) => {
  requireDb();
  await deleteDoc(doc(db, "pteQuestions", id));
};

export const saveTeacherLead = async (lead) => {
  requireDb();
  const id = leadDocId(lead);
  await setDoc(doc(db, "teacherLeads", id), {
    name: String(lead.name || "").trim(),
    phone: normalizeLeadPhone(lead.phone),
    subject: String(lead.subject || "").trim(),
    city: String(lead.city || "").trim(),
    notes: String(lead.notes || "").trim(),
    source: String(lead.source || "admin-import").trim(),
    status: String(lead.status || "pending").trim(),
    contactedAt: lead.contactedAt || null,
    joinedAt: lead.joinedAt || null,
    updatedAt: serverTimestamp(),
    createdAt: lead.createdAt || serverTimestamp(),
  }, { merge: true });
  return id;
};

export const importTeacherLeads = async (leads, onProgress) => {
  requireDb();
  const normalizedLeads = leads
    .map((lead) => ({
      name: String(lead.name || lead.teacher || lead.fullName || "").trim(),
      phone: normalizeLeadPhone(lead.phone || lead.whatsapp || lead.mobile || lead.contact),
      subject: String(lead.subject || lead.subjects || "").trim(),
      city: String(lead.city || lead.location || "").trim(),
      notes: String(lead.notes || lead.message || "").trim(),
      source: String(lead.source || "excel-csv-import").trim(),
      status: "pending",
    }))
    .filter((lead) => lead.phone);

  const uniqueByPhone = new Map();
  normalizedLeads.forEach((lead) => {
    if (!uniqueByPhone.has(lead.phone)) uniqueByPhone.set(lead.phone, lead);
  });

  const existingLeads = await fetchTeacherLeads();
  const existingPhones = new Set(existingLeads.map((lead) => normalizeLeadPhone(lead.phone || lead.id)));
  const uniqueLeads = [...uniqueByPhone.values()];
  const duplicatesInFile = normalizedLeads.length - uniqueLeads.length;
  const duplicateExisting = uniqueLeads.filter((lead) => existingPhones.has(lead.phone)).length;
  const toCreate = uniqueLeads.filter((lead) => !existingPhones.has(lead.phone));

  let completed = 0;
  for (const lead of toCreate) {
    await saveTeacherLead(lead);
    completed += 1;
    onProgress?.({
      completed,
      total: toCreate.length,
      imported: completed,
      duplicates: duplicatesInFile + duplicateExisting,
    });
  }

  return {
    imported: toCreate.length,
    duplicates: duplicatesInFile + duplicateExisting,
    totalValid: normalizedLeads.length,
  };
};
