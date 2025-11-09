import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Avatar,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Chip,
  Link as MuiLink,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import LocationSelector from "./LocationSelector";

const RECAPTCHA_SITE_KEY = "6LcTdf8rAAAAAHUIrbcURlFEKtL4-4siGvJgYpxl";

const qualificationsList = [
  "O-Level",
  "A-Level",
  "FSc/F.A",
  "BSc/BA",
  "BS",
  "MSc",
  "MA",
  "MS/MPhil",
  "PhD",
];

const higherEducation = ["BS", "MSc", "MA", "MS/MPhil", "PhD"];
const subjectsList = ["Computer Science", "Mathematics", "Physics", "Economics", "Biology"];

export default function TutorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    subject: "",
    major_subjects: "",
    experience: "",
    phone: "",
    bio: "",
    image: null,
    agree: false,
  });

  const [majorSubjectsList, setMajorSubjectsList] = useState([]);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const [location, setLocation] = useState({
    province: "",
    district: "",
    tehsil: "",
    city: "",
    area: "",
    latitude: "",
    longitude: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  useEffect(() => {
    setShowSubjectDropdown(higherEducation.includes(formData.qualification));
    if (!higherEducation.includes(formData.qualification)) {
      setFormData({ ...formData, subject: "" });
    }
  }, [formData.qualification]);

  const handleCaptcha = (value) => setCaptchaVerified(!!value);

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    if (files) setFormData({ ...formData, image: files[0] });
    else if (type === "checkbox") setFormData({ ...formData, [name]: checked });
    else setFormData({ ...formData, [name]: value });
  };

  const handleMajorSubjectsChange = (e) => {
    const words = e.target.value.trim().split(/\s+/).slice(0, 5);
    setFormData({ ...formData, major_subjects: words.join(" ") });
    setMajorSubjectsList(words);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!captchaVerified) return setMessage("⚠️ Please verify CAPTCHA.");
    if (!formData.agree) return setMessage("⚠️ Please agree to Terms.");

    setLoading(true);

    const submissionData = new FormData();
    Object.entries(formData).forEach(([k, v]) => submissionData.append(k, v));
    Object.entries(location).forEach(([k, v]) => submissionData.append(k, v));

    try {
      const res = await axios.post(
        "https://aplus-academy.onrender.com/tutors/register",
        submissionData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        setMessage("✅ Tutor registered successfully!");
        setFormData({
          name: "",
          qualification: "",
          subject: "",
          major_subjects: "",
          experience: "",
          phone: "",
          bio: "",
          image: null,
          agree: false,
        });
        setMajorSubjectsList([]);
        setLocation({
          province: "",
          district: "",
          tehsil: "",
          city: "",
          area: "",
          latitude: "",
          longitude: "",
        });
      } else setMessage("⚠️ Failed to submit. Try again.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error submitting form. Server might be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh", py: 6 }}>
      <Box
        sx={{
          textAlign: "center",
          mb: 5,
          py: 6,
          color: "white",
          background: "linear-gradient(135deg, #a8e063, #56ab2f)",
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Tutor Registration
        </Typography>
        <Typography variant="subtitle1">
          Join A+ Academy and connect with students across Pakistan
        </Typography>
      </Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
            <Typography
              variant="h5"
              color="#0d6efd"
              fontWeight={700}
              textAlign="center"
              mb={3}
            >
              Register as Tutor
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              {/* Upload Image */}
              <Box textAlign="center" mb={2}>
                <Button variant="contained" component="label" color="primary">
                  Upload Profile Picture
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    name="image"
                    onChange={handleChange}
                  />
                </Button>
                {formData.image && (
                  <Avatar
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    sx={{ width: 100, height: 100, mx: "auto", mt: 2 }}
                  />
                )}
              </Box>

              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />

              <TextField
                select
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              >
                {qualificationsList.map((q) => (
                  <MenuItem key={q} value={q}>
                    {q}
                  </MenuItem>
                ))}
              </TextField>

              {showSubjectDropdown ? (
                <TextField
                  select
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                >
                  {subjectsList.map((sub) => (
                    <MenuItem key={sub} value={sub}>
                      {sub}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <Box>
                  <TextField
                    label="Major Subjects (Max 5 words)"
                    name="major_subjects"
                    value={formData.major_subjects}
                    onChange={handleMajorSubjectsChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                  <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {majorSubjectsList.map((word, idx) => (
                      <Chip key={idx} label={word} color="primary" size="small" />
                    ))}
                  </Box>
                </Box>
              )}

              <TextField
                label="Experience (Years)"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Contact Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />

              <Typography variant="subtitle1" fontWeight={700} mt={2} mb={1}>
                📍 Location
              </Typography>
              <LocationSelector
                onChange={(loc) => setLocation({ ...location, ...loc })}
              />

              <TextField
                name="bio"
                label="Tutor Bio"
                multiline
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="Describe your teaching experience"
              />

              <Box textAlign="center" mt={3} mb={2}>
                <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptcha} />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agree}
                    onChange={handleChange}
                    name="agree"
                    color="success"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{" "}
                    <MuiLink href="/terms" target="_blank">
                      Terms
                    </MuiLink>{" "}
                    and{" "}
                    <MuiLink href="/privacy" target="_blank">
                      Privacy Policy
                    </MuiLink>
                    .
                  </Typography>
                }
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Registration"}
              </Button>
            </Box>

            {message && (
              <Alert
                severity={
                  message.includes("✅")
                    ? "success"
                    : message.includes("❌")
                    ? "error"
                    : "info"
                }
                sx={{ mt: 3, textAlign: "center" }}
              >
                {message}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
