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
  Avatar,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import LocationSelector from "./LocationSelector";

const RECAPTCHA_SITE_KEY = "6LcTdf8rAAAAAHUIrbcURlFEKtL4-4siGvJgYpxl";

export default function TutorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    qualification: "",
    experience: "",
    phone: "",
    bio: "",
    image: null,
    agree: false,
  });

  const [location, setLocation] = useState({
    province: "",
    district: "",
    city: "",
    area: "",
    latitude: "",
    longitude: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleCaptcha = (value) => setCaptchaVerified(!!value);

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    if (files) setFormData({ ...formData, image: files[0] });
    else if (type === "checkbox") setFormData({ ...formData, [name]: checked });
    else setFormData({ ...formData, [name]: value });
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
          subject: "",
          qualification: "",
          experience: "",
          phone: "",
          bio: "",
          image: null,
          agree: false,
        });
        setLocation({
          province: "",
          district: "",
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

              {/* Basic Info */}
              {[
                { name: "name", label: "Full Name" },
                { name: "subject", label: "Subjects" },
                { name: "qualification", label: "Qualification" },
                { name: "experience", label: "Experience (Years)", type: "number" },
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

              {/* Location */}
              <Typography variant="subtitle1" fontWeight={700} mt={2} mb={1}>
                📍 Location
              </Typography>
              <LocationSelector onChange={setLocation} />

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

              {/* Captcha */}
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
