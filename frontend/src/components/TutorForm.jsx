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
  MenuItem,
  Avatar,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LcTdf8rAAAAAHUIrbcURlFEKtL4-4siGvJgYpxl";

export default function TutorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    qualification: "",
    experience: "",
    city: "",
    area1: "",
    area2: "",
    area3: "",
    phone: "",
    bio: "",
    image: null,
  });

  const [areas, setAreas] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const cities = [
    "Lahore",
    "Karachi",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Gujranwala",
    "Sialkot",
  ];

  // Fetch areas dynamically from OpenStreetMap (Nominatim)
  const fetchAreas = async (city) => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${city}&country=Pakistan&format=json&limit=15`,
        { headers: { "User-Agent": "AplusAcademy/1.0" } }
      );
      const data = await response.json();
      const uniqueAreas = [
        ...new Set(data.map((item) => item.display_name.split(",")[0])),
      ];
      setAreas(uniqueAreas);
    } catch (error) {
      console.error("Error fetching areas:", error);
      setAreas([]);
    }
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
      if (id === "city") fetchAreas(value);
    }
  };

  const handleCaptcha = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      setMessage("⚠️ Please verify the CAPTCHA before submitting.");
      return;
    }

    setLoading(true);
    setMessage("Submitting...");

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      submissionData.append(key, value)
    );

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
          subject: "",
          qualification: "",
          experience: "",
          city: "",
          area1: "",
          area2: "",
          area3: "",
          phone: "",
          bio: "",
          image: null,
        });
      } else {
        setMessage("⚠️ Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("❌ Error submitting form. Server might be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f5f9f5", minHeight: "100vh", py: 6 }}>
      {/* Banner Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 5,
          background: "linear-gradient(135deg, #a8e063, #56ab2f)",
          py: 6,
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Tutor Registration Portal
        </Typography>
        <Typography variant="subtitle1">
          Join A+ Academy and connect with thousands of students today!
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Left Column: Form */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 4, borderRadius: 3, mx: "auto", maxWidth: 600 }}
          >
            <Typography
              variant="h5"
              color="success.main"
              textAlign="center"
              mb={3}
            >
              Tutor Registration Form
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              {/* Image Upload */}
              <Box textAlign="center" mb={2}>
                <Button variant="contained" component="label" color="success">
                  Upload Profile Picture
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    id="image"
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

              {/* Input Fields */}
              {[
                { id: "name", label: "Full Name" },
                { id: "subject", label: "Subject(s)" },
                { id: "qualification", label: "Qualification" },
                { id: "experience", label: "Experience (Years)", type: "number" },
                { id: "phone", label: "Contact Number" },
              ].map(({ id, label, type = "text" }) => (
                <TextField
                  key={id}
                  id={id}
                  label={label}
                  type={type}
                  value={formData[id]}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                />
              ))}

              {/* City Dropdown */}
              <TextField
                select
                id="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>

              {/* Preferred Areas Dropdowns */}
              {[1, 2, 3].map((num) => (
                <TextField
                  key={num}
                  select
                  id={`area${num}`}
                  label={`Preferred Area ${num}`}
                  value={formData[`area${num}`]}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled={!areas.length}
                >
                  {areas.map((area, index) => (
                    <MenuItem key={index} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </TextField>
              ))}

              {/* Bio Field */}
              <TextField
                id="bio"
                label="Tutor Bio / Description"
                multiline
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="Describe your teaching experience, style, and achievements..."
              />

              {/* reCAPTCHA */}
              <Box textAlign="center" mt={3} mb={2}>
                <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptcha} />
              </Box>

              {/* Submit */}
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2, py: 1 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </Box>

            {/* Status Message */}
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

        {/* Right Column: Banner SVG / Info */}
        <Grid
          item
          xs={12}
          md={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign="center" px={2}>
            <img
              src="https://www.svgrepo.com/show/382175/browser-education-internet-online-graduation-school-web.svg"
              alt="Tutor Illustration"
              style={{ width: "100%", maxWidth: 350 }}
            />
            <Typography variant="subtitle1" mt={2} color="text.secondary">
              Empower your teaching career — register now and reach eager
              students across Pakistan.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
