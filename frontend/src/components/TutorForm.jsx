import React, { useState, useEffect, useRef } from "react";
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
  Chip,
  Link as MuiLink,
  Autocomplete,
} from "@mui/material";
import api from "../api";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// --- Qualification & Subjects ---
const qualificationsList = [
  "Matric / SSC",
  "O-Level / IGCSE",
  "Intermediate / HSSC (FSc-Pre-Medical)",
  "Intermediate / HSSC (FSc-Pre-Engineering)",
  "Intermediate / HSSC (F.A)",
  "Intermediate / HSSC (I.Com)",
  "Associate Degree (2-year)",
  "BA / BSc (Pass)",
  "BS (4-year)",
  "MSc",
  "MA",
  "MS / MPhil",
  "PhD",
];

const higherEducation = ["BS (4-year)", "MSc", "MA", "MS / MPhil", "PhD"];

const subjectsList = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science / IT",
  "Software Development", "Artificial Intelligence / AI", "Robotics",
  "Economics", "Accounting", "Finance", "Business Studies", "Marketing",
  "English Language", "English Literature", "Urdu", "Arabic", "French",
  "German", "Psychology", "Sociology", "History", "Geography",
  "Political Science / Civics", "Philosophy", "Islamic Studies / Islamiat",
  "Pakistan Studies", "Art & Design", "Music", "Drama / Theater",
  "Food & Nutrition / Home Economics", "Fashion Design", "Photography",
  "Graphic Design", "Public Speaking", "Critical Thinking", "Soft Skills",
  "Time Management", "Career Counseling", "Personality Development",
];

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
  const [majorSubjects, setMajorSubjects] = useState([]);
  const [selectedHigherSubject, setSelectedHigherSubject] = useState("");
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [locationBlocked, setLocationBlocked] = useState(false);

  const recaptchaRef = useRef(null);

  // Get geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationBlocked(false);
        },
        () => setLocationBlocked(true)
      );
    } else {
      setLocationBlocked(true);
    }
  }, []);

  // Reset higher subject if qualification changes
  useEffect(() => {
    if (!higherEducation.includes(formData.qualification)) {
      setSelectedHigherSubject("");
      setFormData((p) => ({ ...p, subject: "" }));
    }
  }, [formData.qualification]);

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    if (files) {
      setFormData((p) => ({ ...p, image: files[0] }));
      setImageError(false);
    } else if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: checked }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleFindMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationBlocked(false);
        },
        () => setMessage("⚠️ Unable to fetch location. Please allow location access.")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic validations
    if (!formData.agree) {
      setMessage("⚠️ Please agree to Terms.");
      return;
    }
    if (!formData.image) {
      setImageError(true);
      setMessage("⚠️ Please upload a profile picture.");
      return;
    }
    if (higherEducation.includes(formData.qualification) && !selectedHigherSubject) {
      setMessage("⚠️ Please select your subject for higher qualification.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Safe reCAPTCHA Enterprise execution
      let token = "";
      if (window.grecaptcha && window.grecaptcha.enterprise) {
        token = await window.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, { action: "tutor_register" });
      }

      if (!token) {
        setMessage("⚠️ Unable to verify reCAPTCHA. Please try again.");
        setLoading(false);
        return;
      }

      const submissionData = new FormData();
      const subjectToSend = selectedHigherSubject || "";
      const majorSubjectsToSend = majorSubjects.join(", ");

      const dataToSend = {
        ...formData,
        subject: subjectToSend,
        major_subjects: majorSubjectsToSend,
      };

      Object.entries(dataToSend).forEach(([k, v]) => {
        if (k === "image" && v) {
          submissionData.append("image", v);
        } else {
          submissionData.append(k, v ?? "");
        }
      });

      submissionData.append("lat", coords.lat ?? "");
      submissionData.append("lng", coords.lng ?? "");
      submissionData.append("recaptcha_token", token);

      const res = await api.post("/tutors/register", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
        setMajorSubjects([]);
        setSelectedHigherSubject("");
      } else {
        setMessage("⚠️ Failed to submit. Try again.");
      }
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
                <Button
                  variant="contained"
                  component="label"
                  color={imageError ? "error" : "primary"}
                  sx={{ animation: imageError ? "shake 0.5s" : "none", mb: 1 }}
                >
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

              {/* Full Name */}
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />

              {/* Qualification */}
              <Autocomplete
                options={qualificationsList}
                value={formData.qualification || null}
                onChange={(e, newValue) =>
                  setFormData((p) => ({ ...p, qualification: newValue || "" }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Qualification" margin="normal" required fullWidth />
                )}
              />

              {/* Higher subject */}
              {higherEducation.includes(formData.qualification) && (
                <Autocomplete
                  options={subjectsList}
                  value={selectedHigherSubject || null}
                  onChange={(e, newValue) => {
                    setSelectedHigherSubject(newValue || "");
                    setFormData((p) => ({ ...p, subject: newValue || "" }));
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Higher Qualification Subject" margin="normal" fullWidth />
                  )}
                />
              )}

              {/* Major Subjects */}
              <Autocomplete
                multiple
                options={subjectsList}
                value={majorSubjects}
                onChange={(e, newValue) => {
                  if (newValue.length > 5) return;
                  setMajorSubjects(newValue);
                  setFormData({ ...formData, major_subjects: newValue.join(", ") });
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} color="primary" variant="outlined" />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Select Major Subjects" margin="normal" fullWidth />
                )}
                disableCloseOnSelect
              />

              {/* Experience */}
              <TextField
                label="Experience (Years)"
                name="experience"
                type="number"
                inputProps={{ min: 0, max: 40 }}
                value={formData.experience}
                onChange={(e) => {
                  let val = Number(e.target.value);
                  if (val < 0) val = 0;
                  if (val > 40) val = 40;
                  setFormData({ ...formData, experience: val });
                }}
                required
                fullWidth
                margin="normal"
              />

              {/* Phone */}
              <TextField
                label="Contact Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />

              {/* Bio */}
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

              {/* Conditional Find Me Button */}
              {locationBlocked && (
                <Box textAlign="center" mb={2}>
                  <Button variant="outlined" color="secondary" onClick={handleFindMe}>
                    📍 Find My Location
                  </Button>
                </Box>
              )}

              {/* Terms */}
              <FormControlLabel
                control={<Checkbox checked={formData.agree} onChange={handleChange} name="agree" color="success" />}
                label={
                  <Typography variant="body2">
                    I agree to the{" "}
                    <MuiLink href="/terms" target="_blank">Terms</MuiLink> and{" "}
                    <MuiLink href="/privacy" target="_blank">Privacy Policy</MuiLink>.
                  </Typography>
                }
              />

              {/* Submit */}
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

              {/* Message */}
              {message && (
                <Alert
                  severity={message.includes("success") ? "success" : message.startsWith("❌") ? "error" : "info"}
                  sx={{ mt: 3, textAlign: "center" }}
                >
                  {message}
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
