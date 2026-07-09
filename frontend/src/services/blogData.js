import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, hasFirebaseConfig, storage } from "../firebase";

const staticBlogIndexUrl = "/blogs/index.json";

export const createSlug = (title) => {
  const base = String(title || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

  return base || `blog-${Date.now()}`;
};

export const estimateReadTime = (text) => {
  const wordCount = String(text || "")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 220))} min read`;
};

const timestampToIso = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return "";
};

export const normalizeBlogPost = (id, data = {}) => {
  const publishedAt =
    timestampToIso(data.publishedAt) ||
    timestampToIso(data.updatedAt) ||
    timestampToIso(data.createdAt) ||
    new Date().toISOString();
  const heroImage = data.heroImage || {
    url: data.featuredImageUrl || "",
    alt: data.featuredImageAlt || data.title || "A Plus Academy blog image",
    credit: data.featuredImageCredit || "",
  };

  return {
    ...data,
    id,
    slug: data.slug || id,
    title: data.title || "Untitled blog",
    subtitle: data.subtitle || "",
    description: data.description || data.subtitle || "",
    topic: data.topic || data.category || "A Plus Academy",
    category: data.category || "Blog",
    readTime: data.readTime || estimateReadTime(`${data.rawContent || ""} ${data.htmlContent || ""}`),
    publishedAt,
    updatedAt: timestampToIso(data.updatedAt) || publishedAt,
    heroImage,
  };
};

export const fetchStaticBlogIndex = async () => {
  const response = await fetch(staticBlogIndexUrl, { cache: "no-store" });
  if (!response.ok) throw new Error("Blog index could not be loaded.");
  const posts = await response.json();
  return Array.isArray(posts) ? posts : [];
};

export const fetchPublishedFirestoreBlogs = async () => {
  if (!hasFirebaseConfig || !db) return [];

  const snapshot = await getDocs(
    query(collection(db, "blogPosts"), where("status", "==", "published"), orderBy("publishedAt", "desc")),
  );
  return snapshot.docs.map((item) => normalizeBlogPost(item.id, item.data()));
};

export const fetchAllBlogPostsForAdmin = async () => {
  if (!hasFirebaseConfig || !db) return [];
  const snapshot = await getDocs(query(collection(db, "blogPosts"), orderBy("updatedAt", "desc")));
  return snapshot.docs.map((item) => normalizeBlogPost(item.id, item.data()));
};

export const fetchBlogPostBySlug = async (slug) => {
  if (hasFirebaseConfig && db) {
    const snapshot = await getDoc(doc(db, "blogPosts", slug)).catch(() => null);
    if (snapshot?.exists()) return normalizeBlogPost(snapshot.id, snapshot.data());

    const querySnapshot = await getDocs(
      query(collection(db, "blogPosts"), where("slug", "==", slug)),
    ).catch(() => null);
    if (querySnapshot?.docs?.length) {
      const match = querySnapshot.docs[0];
      return normalizeBlogPost(match.id, match.data());
    }
  }

  const response = await fetch(`/blogs/${slug}.json`, { cache: "no-store" });
  if (!response.ok) throw new Error("This blog post is not available.");
  return response.json();
};

export const fetchBlogIndex = async () => {
  const [staticPosts, firestorePosts] = await Promise.all([
    fetchStaticBlogIndex().catch(() => []),
    fetchPublishedFirestoreBlogs().catch(() => []),
  ]);
  const bySlug = new Map();

  staticPosts.forEach((post) => bySlug.set(post.slug, post));
  firestorePosts.forEach((post) => bySlug.set(post.slug, post));

  return [...bySlug.values()].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
};

export const uploadBlogImage = async ({ slug, file }) => {
  if (!storage) throw new Error("Firebase Storage is not enabled. Paste an image URL instead.");
  const extension = file.name.split(".").pop() || "jpg";
  const imageRef = ref(storage, `blog-images/${slug}/featured-${Date.now()}.${extension}`);
  const result = await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(result.ref);
};

export const saveBlogPost = async ({ post, user }) => {
  if (!db) throw new Error("Firebase is not configured.");
  const slug = post.slug || createSlug(post.title);
  const now = serverTimestamp();
  const payload = {
    ...post,
    slug,
    title: String(post.title || "").trim(),
    subtitle: String(post.subtitle || "").trim(),
    description: String(post.description || post.subtitle || "").trim(),
    rawContent: String(post.rawContent || "").trim(),
    htmlContent: String(post.htmlContent || "").trim(),
    status: post.status || "draft",
    category: post.category || "Blog",
    topic: post.topic || post.category || "A Plus Academy",
    readTime: post.readTime || estimateReadTime(`${post.rawContent || ""} ${post.htmlContent || ""}`),
    heroImage: {
      url: post.heroImage?.url || "",
      alt: post.heroImage?.alt || post.title || "A Plus Academy blog image",
      credit: post.heroImage?.credit || "",
    },
    updatedAt: now,
    updatedBy: user?.email || "",
  };

  if (!post.createdAt) payload.createdAt = now;
  if (payload.status === "published" && !post.publishedAt) payload.publishedAt = now;

  await setDoc(doc(db, "blogPosts", slug), payload, { merge: true });
  return slug;
};

export const listBlogEditors = async () => {
  if (!db) return [];
  const snapshot = await getDocs(query(collection(db, "blogEditors"), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const addBlogEditor = async ({ email, user }) => {
  if (!db) throw new Error("Firebase is not configured.");
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) throw new Error("Enter a valid email address.");
  await setDoc(doc(db, "blogEditors", normalizedEmail), {
    email: normalizedEmail,
    role: "blog-editor",
    createdAt: serverTimestamp(),
    createdBy: user?.email || "",
  });
};

export const removeBlogEditor = async (email) => {
  if (!db) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(db, "blogEditors", String(email || "").trim().toLowerCase()));
};
