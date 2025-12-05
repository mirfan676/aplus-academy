import React, { useState, useEffect, useMemo } from "react";
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

// ----------------------------------------------------------
// QUALIFICATIONS
// ----------------------------------------------------------
const qualificationsList = [
  "Matric / SSC",
  "O-Level / IGCSE",
  "Intermediate / (FSc-Pre-Medical)",
  "Intermediate / (FSc-Pre-Engineering)",
  "Intermediate / (ICS)",
  "Intermediate / (F.A)",
  "Intermediate / (I.Com)",
  "Associate Degree (2-year)",
  "BA / BSc",
  "BS",
  "BE",
  "BDS",
  "MBBS",
  "MSc",
  "MA",
  "MS / MPhil",
  "ME",
  "PhD",
];

const higherEducation = ["BS", "BE", "BDS", "MBBS", "MSc", "MA", "ME", "MS / MPhil", "PhD"];

// ----------------------------------------------------------
// FIELD → RELEVANT SUBJECTS
// ----------------------------------------------------------
const fieldSubjects = {
  Mathematics: ["Mathematics", "Algebra", "Calculus", "Geometry", "Trigonometry", "Statistics", "Discrete Mathematics", "Linear Algebra"],
  Physics: ["Physics", "Mechanics", "Thermodynamics", "Optics", "Electromagnetism", "Waves", "Quantum Mechanics", "Mathematics"],
  Chemistry: ["Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry", "Biochemistry", "Environmental Chemistry", "Laboratory Techniques"],
  Biology: ["Biology", "Botany", "Zoology", "Genetics", "Anatomy", "Physiology", "Microbiology", "Biochemistry"],
  "Computer Science / IT": ["Computer Science / IT", "Programming", "Data Structures", "Algorithms", "Databases", "Networking", "Operating Systems", "Software Engineering"],
  "Software Engineering": ["Software Engineering", "Programming", "Software Development", "Testing", "Databases", "Algorithms", "Computer Science / IT", "Project Management"],
  "Artificial Intelligence / AI": ["Artificial Intelligence / AI", "Machine Learning", "Deep Learning", "Python", "Data Science", "Mathematics", "Robotics", "Computer Vision"],
  Robotics: ["Robotics", "Electronics", "Mechanical Engineering", "Computer Science / IT", "Artificial Intelligence / AI", "Control Systems", "Programming", "Sensors"],
  "Chemical Engineering": ["Chemistry", "Biology", "Chemical Engineering", "Process Engineering", "Thermodynamics", "Materials Science", "Fluid Mechanics", "Organic Chemistry"],
  Metallurgy: ["Chemistry", "Biology", "Chemical Engineering", "Process Engineering", "Materials Science", "Mechanical Engineering", "Thermodynamics", "Physics"],
  Materials: ["Materials", "Physics", "Chemistry", "Mechanical Engineering", "Nanotechnology", "Metallurgy", "Material Science", "Engineering Drawing"],
  Economics: ["Economics", "Mathematics", "Accounting", "Finance", "Business Studies", "Statistics", "Political Science / Civics", "Sociology"],
  Finance: ["Finance", "Accounting", "Economics", "Mathematics", "Statistics", "Business Studies", "Investment", "Banking"],
  Accounting: ["Accounting", "Finance", "Economics", "Mathematics", "Business Studies", "Taxation", "Auditing", "Statistics"],
  "Business Studies": ["Business Studies", "Economics", "Accounting", "Finance", "Marketing", "Management", "Statistics", "Entrepreneurship"],
  Marketing: ["Marketing", "Business Studies", "Economics", "Public Relations", "Advertising", "Psychology", "Sales Management", "Statistics"],
  "English Language": ["English Language", "English Literature", "Communication Skills", "Grammar", "Writing Skills", "Public Speaking", "Linguistics", "Creative Writing"],
  "English Literature": ["English Literature", "English Language", "World Literature", "Poetry", "Creative Writing", "Drama / Theater", "History", "Philosophy"],
  Urdu: ["Urdu", "Pakistani Literature", "Poetry", "Grammar", "Creative Writing", "Communication Skills", "History", "Philosophy"],
  Arabic: ["Arabic", "Islamic Studies / Islamiat", "Grammar", "Communication Skills", "Linguistics", "Translation", "History", "Culture"],
  French: ["French", "Grammar", "Communication Skills", "Literature", "Culture", "Translation", "Writing Skills", "Reading Comprehension"],
  German: ["German", "Grammar", "Communication Skills", "Literature", "Culture", "Translation", "Writing Skills", "Reading Comprehension"],
  Psychology: ["Psychology", "Biology", "Sociology", "Behavioral Science", "Neuroscience", "Statistics", "Human Development", "Counseling"],
  Sociology: ["Sociology", "Psychology", "History", "Political Science / Civics", "Economics", "Anthropology", "Research Methods", "Culture Studies"],
  History: ["History", "Political Science / Civics", "Sociology", "Geography", "Culture Studies", "World History", "Archaeology", "Religion Studies"],
  Geography: ["Geography", "Environmental Science", "History", "Cartography", "Urban Planning", "GIS", "Meteorology", "Geology"],
  "Political Science / Civics": ["Political Science / Civics", "History", "Economics", "Law", "Sociology", "International Relations", "Public Administration", "Philosophy"],
  Philosophy: ["Philosophy", "Ethics", "Logic", "History", "Psychology", "Political Science / Civics", "Sociology", "Religion Studies"],
  "Islamic Studies / Islamiat": ["Islamic Studies / Islamiat", "Arabic", "History", "Philosophy", "Quran Studies", "Hadith Studies", "Religion", "Culture"],
  "Pakistan Studies": ["Pakistan Studies", "History", "Geography", "Political Science / Civics", "Economics", "Culture", "Current Affairs", "Sociology"],
  "Art & Design": ["Art & Design", "Painting", "Drawing", "Photography", "Fashion Design", "Sculpture", "Graphic Design", "Interior Design"],
  Music: ["Music", "Music Theory", "Vocal Training", "Instrumental", "Composition", "Performance", "Sound Engineering", "History of Music"],
  "Drama / Theater": ["Drama / Theater", "Acting", "Stagecraft", "Directing", "Scriptwriting", "History of Theater", "Public Speaking", "Music"],
  Photography: ["Photography", "Art & Design", "Digital Imaging", "Camera Techniques", "Photo Editing", "Lighting", "Composition", "Graphic Design"],
  "Fashion Design": ["Fashion Design", "Art & Design", "Textiles", "Drawing", "Photography", "Marketing", "Business Studies", "Creative Design"],
  "Food & Nutrition": ["Food & Nutrition", "Biology", "Chemistry", "Health Science", "Home Economics", "Dietetics", "Public Health", "Cooking Techniques"],
  "Home Economics": ["Home Economics", "Food & Nutrition", "Textiles", "Fashion Design", "Health Science", "Budgeting", "Child Development", "Household Management"],
  "Mass Communication": ["Mass Communication", "Media Studies", "Public Relations", "Journalism", "Writing Skills", "Communication Skills", "Advertising", "Broadcasting"],
  "Public Relations": ["Public Relations", "Marketing", "Mass Communication", "Communication Skills", "Media Studies", "Business Studies", "Psychology", "Event Management"],
  BDS: ["Oral Anatomy", "Dental Materials", "Oral Biology", "Physiology", "Biochemistry", "General Anatomy", "Oral Pathology", "Community Dentistry", "Prosthodontics", "Orthodontics", "Endodontics", "Periodontology", "Oral Surgery"],
  MBBS: ["Anatomy", "Physiology", "Biochemistry", "Pharmacology", "Pathology", "Microbiology", "Community Medicine", "Forensic Medicine", "General Medicine", "General Surgery", "Pediatrics", "Gynecology", "ENT", "Ophthalmology", "Cardiology Basics"],
};

// ----------------------------------------------------------
// SUBJECTS MASTER LIST
// ----------------------------------------------------------
const subjectsList = Object.keys(fieldSubjects);

// ----------------------------------------------------------
// QUALIFICATION → SUGGESTED SUBJECTS
// ----------------------------------------------------------
const qualificationSuggestions = {
  "Intermediate / (FSc-Pre-Medical)": ["Biology", "Chemistry", "Physics"],
  "Intermediate / (FSc-Pre-Engineering)": ["Mathematics", "Physics", "Chemistry"],
  "Intermediate / (ICS)": ["Mathematics", "Physics", "Computer Science"],
  "Intermediate / (I.Com)": ["Accounting", "Business Studies", "Finance"],
  "Intermediate / (F.A)": ["English Language", "Urdu", "Psychology"],
  BDS: ["Oral Anatomy", "Dental Materials", "Physiology"],
  MBBS: ["Anatomy", "Physiology", "Biochemistry"],
  BS: ["Mathematics", "Computer Science / IT", "Physics"],
  MSc: ["Mathematics", "Physics", "Chemistry"],
  MA: ["English Literature", "Sociology", "History"],
  "MS / MPhil": ["Research Methods", "Statistics", "Mathematics"],
  PhD: ["Research Methods", "Advanced Studies", "Statistics"],
};

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

  // ----------------------------------------------------------
  // LOAD reCAPTCHA
  // ----------------------------------------------------------
  useEffect(() => {
    if (!window.grecaptcha) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // ----------------------------------------------------------
  // GEOLOCATION WITH IP FALLBACK
  // ----------------------------------------------------------
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      async () => {
        setLocationBlocked(true);
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          setCoords({ lat: data.latitude, lng: data.longitude });
        } catch (err) {
          console.error("IP-based location failed:", err);
        }
      }
    );
  }, []);

  // ----------------------------------------------------------
  // QUALIFICATION CHANGE → RESET SUBJECT
  // ----------------------------------------------------------
  useEffect(() => {
    if (!higherEducation.includes(formData.qualification)) {
      setSelectedHigherSubject("");
      setFormData((p) => ({ ...p, subject: "" }));
    }
  }, [formData.qualification]);

  // ----------------------------------------------------------
  // HANDLE INPUT CHANGE
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // AUTO-SUGGEST SUBJECTS (MAX 3) - GHOST CHIPS
  // ----------------------------------------------------------
  const suggestedGhostSubjects = useMemo(() => {
    let q = formData.qualification;
    if (!q) return [];
    let suggestions = qualificationSuggestions[q] || [];
    if (selectedHigherSubject && fieldSubjects[selectedHigherSubject]) {
      suggestions = [...suggestions, ...fieldSubjects[selectedHigherSubject]];
    }
    suggestions = suggestions.filter((s) => !majorSubjects.includes(s));
    return [...new Set(suggestions)].slice(0, 3);
  }, [formData.qualification, selectedHigherSubject, majorSubjects]);

  // ----------------------------------------------------------
  // FILTER AVAILABLE MAJOR SUBJECT OPTIONS
  // ----------------------------------------------------------
  const filteredMajorSubjects = useMemo(() => {
    if (selectedHigherSubject && fieldSubjects[selectedHigherSubject]) {
      return [...fieldSubjects[selectedHigherSubject]];
    }
    let base = subjectsList;
    if (qualificationSuggestions[formData.qualification]) {
      base = [...qualificationSuggestions[formData.qualification], ...subjectsList];
    }
    return [...new Set(base)].filter((s) => s !== selectedHigherSubject);
  }, [formData.qualification, selectedHigherSubject]);

  // ----------------------------------------------------------
  // FORM SUBMIT
  // ----------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.agree) return setMessage("⚠️ Please agree to Terms.");
    if (!formData.image) {
      setImageError(true);
      return setMessage("⚠️ Please upload a profile picture.");
    }
    if (higherEducation.includes(formData.qualification) && !selectedHigherSubject)
      return setMessage("⚠️ Please select your subject for higher qualification.");

    setLoading(true);

    try {
      const token = await new Promise((resolve) => {
        window.grecaptcha?.enterprise?.ready(() => {
          window.grecaptcha.enterprise
            .execute(RECAPTCHA_SITE_KEY, { action: "tutor_register" })
            .then(resolve);
        });
      });

      const submissionData = new FormData();
      submissionData.append("subject", selectedHigherSubject || "");
      submissionData.append("major_subjects", majorSubjects.join(","));
      Object.entries(formData).forEach(([k, v]) => {
        if (k !== "image") submissionData.append(k, v ?? "");
      });
      submissionData.append("image", formData.image);
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
    }
    setLoading(false);
  };

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
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
            <Typography variant="h5" color="#0d6efd" fontWeight={700} textAlign="center" mb={3}>
              Register as Tutor
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              {/* IMAGE UPLOAD */}
              <Box textAlign="center" mb={2}>
                <Button variant="contained" component="label" color={imageError ? "error" : "primary"}>
                  Upload Profile Picture
                  <input type="file" hidden accept="image/*" name="image" onChange={handleChange} />
                </Button>
                {formData.image && (
                  <Avatar src={URL.createObjectURL(formData.image)} sx={{ width: 100, height: 100, mx: "auto", mt: 2 }} />
                )}
              </Box>

              {/* NAME */}
              <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required fullWidth margin="normal" />

              {/* QUALIFICATION */}
              <Autocomplete
                options={qualificationsList}
                value={formData.qualification || null}
                onChange={(e, v) => setFormData((p) => ({ ...p, qualification: v || "" }))}
                renderInput={(params) => <TextField {...params} label="Qualification" margin="normal" fullWidth required />}
              />

              {/* HIGHER QUALIFICATION SUBJECT */}
              {higherEducation.includes(formData.qualification) && (
                <Autocomplete
                  options={subjectsList} // all relevant subjects
                  value={selectedHigherSubject || null}
                  onChange={(e, val) => {
                    setSelectedHigherSubject(val || "");
                    setFormData((p) => ({ ...p, subject: val || "" }));
                    setMajorSubjects([]);
                  }}
                  renderInput={(params) => <TextField {...params} label="Higher Qualification Subject" margin="normal" fullWidth required />}
                />
              )}

              {/* MAJOR SUBJECTS WITH GHOST CHIPS */}
              <Autocomplete
                multiple
                options={filteredMajorSubjects}
                value={majorSubjects}
                onChange={(e, newValue) => newValue.length <= 5 && setMajorSubjects(newValue)}
                renderTags={(value, getTagProps) => {
                  if (!value.length && suggestedGhostSubjects.length)
                    return suggestedGhostSubjects.map((s, i) => (
                      <Chip key={i} label={s} variant="outlined" sx={{ opacity: 0.5 }} />
                    ));
                  return value.map((option, index) => <Chip {...getTagProps({ index })} label={option} color="primary" />);
                }}
                renderInput={(params) => <TextField {...params} label="Select Major Subjects (Max 5)" margin="normal" fullWidth />}
                disableCloseOnSelect
              />

              {/* EXPERIENCE */}
              <TextField
                label="Experience (Years)"
                name="experience"
                type="number"
                inputProps={{ min: 0, max: 40 }}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: Math.min(40, Math.max(0, Number(e.target.value))) })}
                required
                fullWidth
                margin="normal"
              />

              {/* PHONE */}
              <TextField label="Contact Number" name="phone" value={formData.phone} onChange={handleChange} required fullWidth margin="normal" />

              {/* BIO */}
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

              {/* LOCATION */}
              {locationBlocked && (
                <Box textAlign="center" mb={2}>
                  <Button variant="outlined" color="secondary" onClick={() => window.location.reload()}>
                    📍 Enable Location
                  </Button>
                </Box>
              )}

              {/* TERMS */}
              <FormControlLabel
                control={<Checkbox checked={formData.agree} onChange={handleChange} name="agree" color="success" />}
                label={
                  <Typography variant="body2">
                    I agree to the <MuiLink href="/terms" target="_blank">Terms</MuiLink> and <MuiLink href="/privacy" target="_blank">Privacy Policy</MuiLink>.
                  </Typography>
                }
              />

              {/* SUBMIT */}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Submit Registration"}
              </Button>

              {message && (
                <Alert severity={message.includes("success") ? "success" : message.startsWith("❌") ? "error" : "info"} sx={{ mt: 3, textAlign: "center" }}>
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
