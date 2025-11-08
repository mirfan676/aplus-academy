import React, { useState } from "react";
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

const HireForm = () => {
  const { teacherId } = useParams(); // if routing teacher/:id
  const [teacher, setTeacher] = useState({ name: "Teacher Name" }); // replace with real teacher fetch if needed

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    // Basic validation
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
          teacher_name: teacher.name,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSuccess("✅ Hire request sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
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
          Hire {teacher.name}
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
