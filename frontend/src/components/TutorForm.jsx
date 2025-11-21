import React, { useState, useEffect } from "react";
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
import ReCAPTCHA from "react-google-recaptcha";
import api from "../api";

const RECAPTCHA_SITE_KEY = "6LcTdf8rAAAAAHUIrbcURlFEKtL4-4siGvJgYpxl";

// --- Lists ---
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
  "Mathematics",
  "Additional Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Applied Mathematics",
  "Environmental Science",
  "Statistics",
  "Computer Science / IT",
  "Information Technology",
  "Software Development",
  "Artificial Intelligence / AI",
  "Robotics",
  "Biochemistry",
  "Anatomy",
  "Physiology",
  "Pharmacology",
  "Pathology",
  "Microbiology",
  "Nursing",
  "Medical Terminology",
  "Health Sciences",
  "First Aid / Emergency Care",
  "Engineering Mathematics",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Electronics",
  "Computer Engineering",
  "Web Development",
  "Programming (Python, C++, Java, etc.)",
  "Data Science / Machine Learning",
  "Economics",
  "Microeconomics",
  "Macroeconomics",
  "Accounting",
  "Finance",
  "Business Studies",
  "Commerce",
  "Marketing",
  "Management",
  "Entrepreneurship",
  "English Language",
  "English Literature",
  "Urdu",
  "Urdu Literature",
  "Arabic",
  "Persian",
  "French",
  "German",
  "Spoken English",
  "Creative Writing",
  "Psychology",
  "Sociology",
  "History",
  "Geography",
  "Political Science / Civics",
  "Philosophy",
  "Islamic Studies / Islamiat",
  "Pakistan Studies",
  "Art & Design",
  "Fine Arts",
  "Music",
  "Drama / Theater",
  "Food & Nutrition / Home Economics",
  "Fashion Design",
  "Photography",
  "Calligraphy",
  "Graphic Design",
  "Public Speaking",
  "Critical Thinking",
  "Soft Skills",
  "Time Management",
  "Career Counseling",
  "Personality Development",
];

export default function TutorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    subject: "", // will hold single Master/higher subject when selected
    major_subjects: "", // raw text (kept for storing on backend)
    experience: "",
    phone: "",
    bio: "",
    image: null,
    agree: false,
  });

  // major subjects chips (derived from major_subjects text)
  const [majorSubjects, setMajorSubjects] = useState([]);


  // single subject for Master-or-higher UI
  const [selectedHigherSubject, setSelectedHigherSubject] = useState("");

  const [locationsData, setLocationsData] = useState({});
  const [location, setLocation] = useState({
    province: "",
    district: "",
    tehsil: "",
    city: "",
    area1: "",
    area2: "",
    area3: "",
  });

  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [districtsList, setDistrictsList] = useState([]);
  const [tehsilsList, setTehsilsList] = useState([]);
  const [areasList, setAreasList] = useState([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [imageError, setImageError] = useState(false);

  // get browser geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => console.log("Location access denied")
      );
    }
  }, []);

  // fetch locations
  useEffect(() => {
    api
      .get("/locations")
      .then((res) => {
        if (res.data) setLocationsData(res.data);
      })
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  // When qualification changes:
  // - show/hide higher subject dropdown
  // - if not higher, clear selectedHigherSubject and formData.subject
  useEffect(() => {
    if (!higherEducation.includes(formData.qualification)) {
      setSelectedHigherSubject("");
      setFormData((prev) => ({ ...prev, subject: "" }));
    } else {
      // keep major_subjects intact; only show the higher subject dropdown
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.qualification]);

  // dependent dropdowns for location
  useEffect(() => {
    if (location.province && locationsData[location.province]) {
      setDistrictsList(Object.keys(locationsData[location.province]));
    } else {
      setDistrictsList([]);
    }
    setTehsilsList([]);
    setAreasList([]);
    setLocation((p) => ({ ...p, district: "", tehsil: "", area1: "", area2: "", area3: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.province, locationsData]);

  useEffect(() => {
    if (location.province && location.district) {
      setTehsilsList(Object.keys(locationsData[location.province][location.district] || {}));
    } else {
      setTehsilsList([]);
    }
    setAreasList([]);
    setLocation((p) => ({ ...p, tehsil: "", area1: "", area2: "", area3: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.district]);

  useEffect(() => {
    if (location.province && location.district && location.tehsil) {
      const areas = locationsData[location.province][location.district][location.tehsil] || [];
      setAreasList(areas);
      setLocation((p) => ({
        ...p,
        area1: areas[0] || "",
        area2: areas[1] || areas[0] || "",
        area3: areas[2] || areas[0] || "",
      }));
    } else {
      setAreasList([]);
      setLocation((p) => ({ ...p, area1: "", area2: "", area3: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.tehsil]);

  const handleCaptcha = (value) => setCaptchaVerified(!!value);

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


  const handleLocationChange = (name, value) => {
    setLocation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  // --- Basic validations ---
  if (!captchaVerified) {
    setMessage("⚠️ Please verify CAPTCHA.");
    return;
  }
  if (!formData.agree) {
    setMessage("⚠️ Please agree to Terms.");
    return;
  }
  if (!formData.image) {
    setImageError(true);
    setMessage("⚠️ Please upload a profile picture.");
    return;
  }

  // --- Subject validation ---
  if (!selectedHigherSubject && majorSubjects.length === 0) {
    setMessage("⚠️ Please select at least one subject.");
    return;
  }

  setLoading(true);

  try {
    // Determine subject to send
    const subjectToSend = selectedHigherSubject || ""; // single higher subject
    const majorSubjectsToSend = majorSubjects.join(", "); // multiple subjects

    // Build form data
    const submissionData = new FormData();
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

    // Append location and coordinates
    Object.entries(location).forEach(([k, v]) => submissionData.append(k, v ?? ""));
    submissionData.append("lat", coords.lat ?? "");
    submissionData.append("lng", coords.lng ?? "");

    // Send API request
    const res = await api.post("/tutors/register", submissionData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 200) {
      setMessage("✅ Tutor registered successfully!");

      // Reset form
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
      setLocation({
        province: "",
        district: "",
        tehsil: "",
        city: "",
        area1: "",
        area2: "",
        area3: "",
      });
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
        <Typography variant="subtitle1">Join A+ Academy and connect with students across Pakistan</Typography>
      </Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" color="#0d6efd" fontWeight={700} textAlign="center" mb={3}>
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
                  <input type="file" hidden accept="image/*" name="image" onChange={handleChange} />
                </Button>

                {formData.image && (
                  <Avatar src={URL.createObjectURL(formData.image)} alt="Preview" sx={{ width: 100, height: 100, mx: "auto", mt: 2 }} />
                )}
              </Box>

              {/* Full Name */}
              <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required fullWidth margin="normal" />

              {/* Qualification */}
              <Autocomplete
                options={qualificationsList}
                value={formData.qualification || null}
                onChange={(e, newValue) => setFormData((p) => ({ ...p, qualification: newValue || "" }))}
                renderInput={(params) => <TextField {...params} label="Qualification" margin="normal" required fullWidth />}
              />

              {/* --- Single subject dropdown for Master-or-higher (visible only when selected) --- */}
              {higherEducation.includes(formData.qualification) && (
                <Autocomplete
                  options={subjectsList}
                  value={selectedHigherSubject || null}
                  onChange={(e, newValue) => {
                    setSelectedHigherSubject(newValue || "");
                    // keep formData.subject updated too (optional, but keeps state consistent)
                    setFormData((p) => ({ ...p, subject: newValue || "" }));
                  }}
                  renderInput={(params) => <TextField {...params} label="Higher Qualification Subject (single)" margin="normal" fullWidth />}
                />
              )}

              {/* --- Major Subjects text input + chips (available for ALL qualifications) --- */}
              <Autocomplete
                multiple
                options={subjectsList}   // subjects come ONLY from this list
                value={majorSubjects}
                onChange={(e, newValue) => {
                  if (newValue.length > 5) return; 

                  setMajorSubjects(newValue);
                  setFormData({
                    ...formData,
                    major_subjects: newValue.join(", "),
                  });
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Major Subjects"
                    margin="normal"
                    fullWidth
                  />
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

                  // clamp value between 0 and 40
                  if (val < 0) val = 0;
                  if (val > 40) val = 40;

                  setFormData({ ...formData, experience: val });
                }}
                required
                fullWidth
                margin="normal"
              />

              {/* Phone */}
              <TextField label="Contact Number" name="phone" value={formData.phone} onChange={handleChange} required fullWidth margin="normal" />

              {/* Location Autocomplete Dropdowns */}
              <Typography variant="subtitle1" fontWeight={700} mt={2} mb={1}>
                📍 Location
              </Typography>

              <Autocomplete
                options={Object.keys(locationsData)}
                value={location.province || null}
                onChange={(e, newValue) => handleLocationChange("province", newValue || "")}
                renderInput={(params) => <TextField {...params} label="Province" margin="normal" required fullWidth />}
              />

              <Autocomplete
                options={districtsList}
                value={location.district || null}
                onChange={(e, newValue) => handleLocationChange("district", newValue || "")}
                renderInput={(params) => <TextField {...params} label="District" margin="normal" required fullWidth />}
                disabled={!districtsList.length}
              />

              <Autocomplete
                options={tehsilsList}
                value={location.tehsil || null}
                onChange={(e, newValue) => handleLocationChange("tehsil", newValue || "")}
                renderInput={(params) => <TextField {...params} label="Tehsil" margin="normal" required fullWidth />}
                disabled={!tehsilsList.length}
              />

              <Autocomplete
                options={location.province && location.district && location.tehsil ? locationsData[location.province][location.district][location.tehsil] : []}
                value={location.city || null}
                onChange={(e, newValue) => handleLocationChange("city", newValue || "")}
                renderInput={(params) => <TextField {...params} label="City / Town" margin="normal" required fullWidth />}
                disabled={!location.tehsil}
              />

              <Autocomplete
                options={areasList}
                value={location.area1 || null}
                onChange={(e, newValue) => handleLocationChange("area1", newValue || "")}
                renderInput={(params) => <TextField {...params} label="Area 1" margin="normal" fullWidth />}
                disabled={!areasList.length}
              />
              <Autocomplete
                options={areasList}
                value={location.area2 || null}
                onChange={(e, newValue) => handleLocationChange("area2", newValue || "")}
                renderInput={(params) => <TextField {...params} label="Area 2" margin="normal" fullWidth />}
                disabled={!areasList.length}
              />
              <Autocomplete
                options={areasList}
                value={location.area3 || null}
                onChange={(e, newValue) => handleLocationChange("area3", newValue || "")}
                renderInput={(params) => <TextField {...params} label="Area 3" margin="normal" fullWidth />}
                disabled={!areasList.length}
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

              {/* CAPTCHA */}
              <Box textAlign="center" mt={3} mb={2}>
                <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptcha} />
              </Box>

              {/* Terms */}
              <FormControlLabel
                control={<Checkbox checked={formData.agree} onChange={handleChange} name="agree" color="success" />}
                label={
                  <Typography variant="body2">
                    I agree to the <MuiLink href="/terms" target="_blank">Terms</MuiLink> and <MuiLink href="/privacy" target="_blank">Privacy Policy</MuiLink>.
                  </Typography>
                }
              />

              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Registration"}
              </Button>
            </Box>

            {message && (
              <Alert severity={message.includes("success") ? "success" : message.startsWith("❌") ? "error" : "info"} sx={{ mt: 3, textAlign: "center" }}>
                {message}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
