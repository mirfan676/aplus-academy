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
import { useParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LcTdf8rAAAAAHUIrbcURlFEKtL4-4siGvJgYpxl"; // ✅ your existing key

const HireForm = () => {
  const { id } = useParams(); // ✅ correct param name
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

  // ✅ Fetch teacher info
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/teachers/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch teacher data");
        const data = await response.json();
        setTeacher(data);
      } catch (err) {
        console.error("Error fetching teacher:", err);
        setTeacher({ Name: "Unknown Teacher" });
      }
    };
    fetchTeacher();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCaptcha = (value) => {
    setCaptchaVerified(!!value);
  };

  // ✅ Limit to 2 requests per hour (based on localStorage)
  const canSendRequest = () => {
    const history = JSON.parse(localStorage.getItem("hireRequests") || "[]");
    const now = Date.now();

    // Keep only requests within the last hour
    const recent = history.filter((time) => now - time < 60 * 60 * 1000);

    if (recent.length >= 2) return false;

    // Save updated history
    recent.push(now);
    localStorage.setItem("hireRequests", JSON.stringify(recent));
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!captchaVerified) {
      setError("⚠️ Please verify the CAPTCHA before submitting.");
      return;
    }

    if (!canSendRequest()) {
      setError("⏳ You have reached the limit of 2 requests per hour.");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          student_name: formData.name,
          student_email: formData.email,
          student_phone: formData.phone,
          teacher_name: teacher?.Name || "Unknown",
          teacher_id: id,
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
        <Typography variant="h5" fontWeight={700} color="#0d6efd" sx={{ mb: 2 }}>
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send Request"}
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default HireForm;
