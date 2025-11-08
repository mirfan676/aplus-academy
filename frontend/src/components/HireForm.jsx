import React, { useState, useEffect } from "react";
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
import { useParams, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LcTdf8rAAAAAHUIrbcURlFEKtL4-4siGvJgYpxl";

const HireForm = () => {
  const { id: urlId } = useParams();
  const location = useLocation();
  const teacherId = location.state?.teacherId || urlId || null;
  const teacherNameFromState = location.state?.teacherName || null;

  const [teacher, setTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ✅ Fetch teacher info if ID exists
  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherId) {
        // If we only have teacherName (no ID)
        if (teacherNameFromState)
          setTeacher({ Name: teacherNameFromState });
        else
          setTeacher({ Name: "Unknown Teacher" });
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/teachers/${teacherId}`
        );
        if (!response.ok) throw new Error("Failed to fetch teacher data");
        const data = await response.json();
        setTeacher(data);
      } catch (err) {
        console.error("Error fetching teacher:", err);
        setTeacher({ Name: teacherNameFromState || "Unknown Teacher" });
      }
    };
    fetchTeacher();
  }, [teacherId, teacherNameFromState]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCaptcha = (value) => setCaptchaVerified(!!value);

  // ✅ Limit 2 requests/hour
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
    if (!formData.name || !formData.email || !formData.phone || !formData.message)
      return setError("Please fill all fields.");

    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          student_name: formData.name,
          student_email: formData.email,
          student_phone: formData.phone,
          teacher_name: teacher?.Name || teacherNameFromState || "Unknown",
          teacher_id: teacherId || "N/A",
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSuccess("✅ Hire request sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setCaptchaVerified(false);
    } catch (err) {
      console.error("EmailJS Error:", err);
      setError("❌ Failed to send request. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          color="#0d6efd"
          sx={{ mb: 2 }}
        >
          Hire {teacher ? teacher.Name : "Loading..."}
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Your Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
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

          {/* ✅ reCAPTCHA */}
          <Box textAlign="center" my={2}>
            <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptcha} />
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#0d6efd", fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send Request"
            )}
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default HireForm;
