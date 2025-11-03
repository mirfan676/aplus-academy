import React, { useState } from "react";
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
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
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
    exactLocation: "",
    phone: "",
    bio: "",
    image: null,
    lat: "",
    lng: "",
    agree: false,
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

  // Fetch areas dynamically from backend
  const fetchAreas = async (city) => {
    if (!city) return;
    try {
      const res = await axios.get(
        `https://aplus-academy.onrender.com/areas?city=${city}`
      );
      setAreas(res.data.areas || []);
    } catch (error) {
      console.error("Error fetching areas:", error);
      setAreas([]);
    }
  };

  // Get approximate coordinates for a given area and city using Nominatim
  const fetchAreaCoordinates = async (area, city) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: `${area}, ${city}, Pakistan`,
          format: "json",
          limit: 1,
        },
      });
      if (res.data && res.data.length > 0) {
        const { lat, lon } = res.data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
    return null;
  };

  // Generate random coordinates within 1km radius around given center
  const generateRandomNearby = (center) => {
    const radius = 1000; // meters
    const earthRadius = 6378137; // meters
    const randomDistance = Math.random() * radius;
    const randomBearing = Math.random() * 2 * Math.PI;

    const newLat =
      center.lat +
      (randomDistance / earthRadius) * (180 / Math.PI) * Math.cos(randomBearing);
    const newLng =
      center.lng +
      (randomDistance / earthRadius) *
        (180 / Math.PI) *
        Math.sin(randomBearing) /
        Math.cos((center.lat * Math.PI) / 180);

    return { lat: newLat.toFixed(6), lng: newLng.toFixed(6) };
  };

  const handleChange = async (e) => {
    const { name, value, files, checked, type } = e.target;

    if (files) {
      setFormData({ ...formData, image: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      if (name === "city") {
        setFormData({
          ...formData,
          city: value,
          area1: "",
          area2: "",
          area3: "",
          exactLocation: "",
          lat: "",
          lng: "",
        });
        fetchAreas(value);
      } else if (name === "exactLocation") {
        setFormData({ ...formData, exactLocation: value });
        if (formData.city) {
          const center = await fetchAreaCoordinates(value, formData.city);
          if (center) {
            const { lat, lng } = generateRandomNearby(center);
            setFormData((prev) => ({ ...prev, lat, lng }));
          }
        }
      } else {
        setFormData({ ...formData, [name]: value });
      }
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
    if (!formData.agree) {
      setMessage("⚠️ Please agree to the Terms and Conditions.");
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
          exactLocation: "",
          phone: "",
          bio: "",
          image: null,
          lat: "",
          lng: "",
          agree: false,
        });
        setAreas([]);
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

              {/* Basic Info */}
              {[
                { name: "name", label: "Full Name" },
                { name: "subject", label: "Subject(s)" },
                { name: "qualification", label: "Qualification" },
                {
                  name: "experience",
                  label: "Experience (Years)",
                  type: "number",
                },
                { name: "phone", label: "Contact Number" },
              ].map(({ name, label, type = "text" }) => (
                <TextField
                  key={name}
                  name={name}
                  label={label}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                />
              ))}

              {/* City */}
              <TextField
                select
                name="city"
                label="City"
                value={formData.city || ""}
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

              {/* Exact Location */}
              <TextField
                select
                name="exactLocation"
                label="Select Exact Location (for map)"
                value={formData.exactLocation || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={!areas.length}
                helperText={
                  formData.lat && formData.lng
                    ? `📍 Approx. coordinates: ${formData.lat}, ${formData.lng}`
                    : "Select your nearby area to mark approximate location (1 km radius)"
                }
              >
                {areas.map((area, index) => (
                  <MenuItem key={index} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </TextField>

              {/* Preferred Areas */}
              {[1, 2, 3].map((num) => (
                <TextField
                  key={num}
                  select
                  name={`area${num}`}
                  label={`Preferred Area ${num}`}
                  value={formData[`area${num}`] || ""}
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

              {/* Bio */}
              <TextField
                name="bio"
                label="Tutor Bio / Description"
                multiline
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="Describe your teaching experience, style, and achievements..."
              />

              {/* CAPTCHA */}
              <Box textAlign="center" mt={3} mb={2}>
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptcha}
                />
              </Box>

              {/* Terms */}
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
                      Terms & Conditions
                    </MuiLink>{" "}
                    and{" "}
                    <MuiLink href="/privacy" target="_blank">
                      Privacy Policy
                    </MuiLink>
                    .
                  </Typography>
                }
              />

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

            {/* Message */}
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

        {/* Right Column: Illustration */}
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
              src="/logo-register-page.svg"
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
