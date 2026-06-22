import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Card,
  CircularProgress,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useParams, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import useSEO from "../hooks/useSEO";
import { db } from "../firebase";
import { useAuth } from "../contexts/useAuth";
import { fetchTeacherFromFirestore } from "../services/teacherData";

const RECAPTCHA_SITE_KEY = "6LcTdf8rAAAAAHUIrbcURlFEKtL4-4siGvJgYpxl";

const HireForm = () => {
  const { hasFirebaseConfig, signInWithGoogle, user } = useAuth();
  const formRef = useRef();
  const { id: urlId } = useParams();
  const location = useLocation();
  const teacherId = location.state?.teacherId || urlId || null;
  const teacherNameFromState = location.state?.teacherName || null;

  const [teacher, setTeacher] = useState(null);
  const [formData, setFormData] = useState({
    student_name: "",
    student_email: "",
    student_phone: "",
    message: "",
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useSEO({
    title: teacher
      ? `Hire ${teacher.Name || teacher.name || "Tutor"} - A Plus Home Tutors`
      : "Hire a Verified Tutor - A Plus Home Tutors",
    description:
      "Send a secure tutor hiring request to A Plus Home Tutors and connect with a verified teacher.",
    canonical: `https://www.aplusacademy.pk/hire/${teacherId || ""}`,
  });

  // Fetch teacher info
  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherId) {
        setTeacher({ Name: teacherNameFromState || "Unknown Teacher" });
        return;
      }
      try {
        const data = await fetchTeacherFromFirestore(teacherId);
        setTeacher(data || { Name: teacherNameFromState || "Unknown Teacher" });
      } catch (err) {
        console.error("Error fetching teacher:", err);
        setTeacher({ Name: teacherNameFromState || "Unknown Teacher" });
      }
    };
    fetchTeacher();
  }, [teacherId, teacherNameFromState]);

  useEffect(() => {
    if (!user) return;
    setFormData((current) => ({
      ...current,
      student_name: current.student_name || user.displayName || "",
      student_email: current.student_email || user.email || "",
    }));
  }, [user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCaptcha = (value) => setCaptchaVerified(!!value);

  const canSendRequest = () => {
    const history = JSON.parse(localStorage.getItem("hireRequests") || "[]");
    const now = Date.now();
    const recent = history.filter((time) => now - time < 60 * 60 * 1000);
    if (recent.length >= 2) return false;
    recent.push(now);
    localStorage.setItem("hireRequests", JSON.stringify(recent));
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!captchaVerified)
      return setError("⚠️ Please verify the CAPTCHA before submitting.");
    if (!canSendRequest())
      return setError("⏳ You have reached the limit of 2 requests per hour.");
    if (
      !formData.student_name ||
      !formData.student_email ||
      !formData.student_phone ||
      !formData.message
    )
      return setError("Please fill all fields.");

    setLoading(true);

    try {
      if (!db || !user) throw new Error("Google sign-in is required before sending a tutor request.");
      await addDoc(collection(db, "tutorRequests"), {
        userId: user.uid,
        studentName: formData.student_name,
        studentEmail: user.email || formData.student_email,
        studentPhone: formData.student_phone,
        message: formData.message,
        teacherId: String(teacherId || ""),
        teacherName: teacher?.Name || teacher?.name || "Unknown Teacher",
        status: "new",
        source: "website",
        createdAt: serverTimestamp(),
      });

      try {
        await emailjs.sendForm(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          formRef.current,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        );
      } catch (notificationError) {
        console.warn("Tutor request saved, but email notification failed:", notificationError);
      }

      setSuccess("Tutor request saved successfully.");
      setFormData({
        student_name: "",
        student_email: "",
        student_phone: "",
        message: "",
      });
      setCaptchaVerified(false);
      formRef.current.reset();
    } catch (err) {
      console.error("Tutor request error:", err);
      setError(err.message || "Failed to save request. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Card sx={{ p: 4, borderRadius: 1, textAlign: "center" }}>
          <GoogleIcon sx={{ fontSize: 48, color: "#198754" }} />
          <Typography component="h1" variant="h4" fontWeight={900} sx={{ mt: 1 }}>
            Sign in to request a tutor
          </Typography>
          <Typography color="text.secondary" sx={{ my: 2 }}>
            Google sign-in connects this request to your A Plus Academy account.
          </Typography>
          {!hasFirebaseConfig && <Alert severity="warning" sx={{ mb: 2 }}>Firebase is not configured.</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button variant="contained" startIcon={<GoogleIcon />} disabled={!hasFirebaseConfig} onClick={async () => {
            setError("");
            try {
              await signInWithGoogle();
            } catch (signInError) {
              setError(signInError.message || "Google sign-in could not be started.");
            }
          }}>
            Continue with Google
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          color="#0d6efd"
          sx={{ mb: 3 }}
        >
          Hire {teacher ? teacher.Name : "Loading..."}
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box
          component="form"
          ref={formRef}
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Your Name"
            name="student_name"
            value={formData.student_name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Your Email"
            name="student_email"
            type="email"
            value={formData.student_email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Phone Number"
            name="student_phone"
            value={formData.student_phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={4}
          />

          {/* Hidden fields for EmailJS template */}
          <input
            type="hidden"
            name="teacher_name"
            value={teacher?.Name || "Unknown"}
          />
          <input
            type="hidden"
            name="teacher_profile_link"
            value={`https://aplusacademy.pk/teacher/${teacherId}`}
          />

          {/* reCAPTCHA */}
          <Box textAlign="center" my={2}>
            <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptcha} />
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#0d6efd", fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send Request"}
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default HireForm;
