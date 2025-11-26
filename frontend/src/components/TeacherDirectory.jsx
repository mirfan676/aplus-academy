import React, { useEffect, useState, Suspense, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Grid,
  CircularProgress,
  Container,
  MenuItem,
  Avatar,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  Paper,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LazyMap = React.lazy(() => import("./LazyMapSection"));

const personIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const TeacherDirectory = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [userLocation, setUserLocation] = useState([31.5204, 74.3587]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapVisible, setMapVisible] = useState(false);

  const [progressPerCard, setProgressPerCard] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://aplus-academy.onrender.com/tutors/");
        if (Array.isArray(res.data)) {
          const mapped = res.data.map((t, i) => ({
            id: i,
            name: t["Name"] || "Unknown",
            subjects: Array.isArray(t["Subjects"]) ? t["Subjects"] : [],
            qualification: t["Qualification"] || "",
            experience: t["Experience"] || "",
            city: t["District"] ? String(t["District"]) : "",
            bio: t["Bio"] || "",
            price: t["Price"] || "Rs 2000",
            thumbnail: t["Thumbnail"] || "",
            lat: isNaN(parseFloat(t["Latitude"])) ? 31.5204 : parseFloat(t["Latitude"]),
            lng: isNaN(parseFloat(t["Longitude"])) ? 74.3587 : parseFloat(t["Longitude"]),
            verified: t["Verified"]?.trim(),
          }));
          setTeachers(mapped);

          // Initialize card progress & image load
          const initialProgress = {};
          const initialImages = {};
          mapped.forEach((t) => {
            initialProgress[t.id] = 0;
            initialImages[t.id] = false;
          });
          setProgressPerCard(initialProgress);
          setImageLoaded(initialImages);
        }
      } catch {
        setError("Unable to fetch teacher data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  const subjects = useMemo(() => [...new Set(teachers.flatMap((t) => t.subjects || []))], [teachers]);
  const cities = useMemo(() => [...new Set(teachers.map((t) => t.city).filter(Boolean))], [teachers]);

  const filtered = useMemo(() => {
    let list = [...teachers];
    if (selectedCity) list = list.filter((t) => t.city?.toLowerCase() === selectedCity.toLowerCase());
    if (selectedSubject) list = list.filter((t) => t.subjects.includes(selectedSubject));
    list.sort(
      (a, b) => Math.hypot(a.lat - userLocation[0], a.lng - userLocation[1]) - Math.hypot(b.lat - userLocation[0], b.lng - userLocation[1])
    );
    return list;
  }, [selectedCity, selectedSubject, teachers, userLocation]);

  const handleLoadMore = () => setVisibleCount((v) => v + 12);
  const [showMoreSubjects, setShowMoreSubjects] = useState({});
  const handleToggleSubjects = (id) => setShowMoreSubjects((prev) => ({ ...prev, [id]: !prev[id] }));
  const [showMoreBio, setShowMoreBio] = useState({});
  const handleToggleBio = (id) => setShowMoreBio((prev) => ({ ...prev, [id]: !prev[id] }));

  // Animate per-card progress
  useEffect(() => {
    if (!loading && teachers.length > 0) {
      const timers = filtered.slice(0, visibleCount).map((t) =>
        setInterval(() => {
          setProgressPerCard((prev) => {
            const next = Math.min((prev[t.id] || 0) + Math.random() * 15, 100);
            return { ...prev, [t.id]: next };
          });
        }, 100)
      );
      return () => timers.forEach(clearInterval);
    }
  }, [loading, teachers, filtered, visibleCount]);

  return (
    <Box sx={{ background: "#e8f2ff", py: 6, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 5, color: "#004aad" }}>
          Find Teachers Near You
        </Typography>

        {/* Map */}
        <Box sx={{ height: { xs: "240px", md: "340px" }, borderRadius: "22px", overflow: "hidden", mb: 4 }}>
          {mapVisible ? (
            <Suspense fallback={<CircularProgress />}>
              <LazyMap userLocation={userLocation} filtered={filtered} personIcon={personIcon} />
            </Suspense>
          ) : (
            <Box onMouseEnter={() => setMapVisible(true)} sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              Hover to load map 🗺️
            </Box>
          )}
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: "22px", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(12px)" }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={6} sx={{ minWidth: "240px" }}>
              <FormControl fullWidth>
                <InputLabel>Select City</InputLabel>
                <Select value={selectedCity} label="Select City" onChange={(e) => setSelectedCity(e.target.value)}>
                  <MenuItem value=""><em>All Cities</em></MenuItem>
                  {cities.map((city, i) => <MenuItem key={i} value={city}>{city}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sx={{ minWidth: "240px" }}>
              <FormControl fullWidth>
                <InputLabel>Select Subject</InputLabel>
                <Select value={selectedSubject} label="Select Subject" onChange={(e) => setSelectedSubject(e.target.value)}>
                  <MenuItem value=""><em>All Subjects</em></MenuItem>
                  {subjects.map((s, i) => <MenuItem key={i} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}

        {/* Teacher Cards */}
        <Grid container spacing={3} sx={{ width: "100%", maxWidth: "xl" }} justifyContent="center">
          {filtered.slice(0, visibleCount).map((t) => (
            <Grid item key={t.id} xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <Card sx={{ p: 2, borderRadius: "22px", flex: 1, minHeight: 400, minWidth: 320, maxWidth: 320 }}>
                  {/* Card Loader */}
                  {progressPerCard[t.id] < 100 ? (
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress variant="determinate" value={progressPerCard[t.id]} />
                      <Typography sx={{ textAlign: "center", mt: 1 }}>{Math.round(progressPerCard[t.id])}%</Typography>
                    </Box>
                  ) : (
                    <Box>
                      {/* Avatar with circular loader */}
                      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                        {!imageLoaded[t.id] && <CircularProgress />}
                        <Avatar
                          src={t.thumbnail}
                          sx={{ width: 70, height: 70, borderRadius: "14px", display: imageLoaded[t.id] ? "block" : "none" }}
                          onLoad={() => setImageLoaded((prev) => ({ ...prev, [t.id]: true }))}
                        />
                      </Box>

                      <Typography fontWeight={700} textAlign="center">{t.name}</Typography>
                      <Typography textAlign="center">{t.qualification}</Typography>
                      <Typography textAlign="center">{t.city}</Typography>
                      {/* You can include full card content (subjects, bio, buttons) here */}
                    </Box>
                  )}
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {!loading && visibleCount < filtered.length && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button variant="contained" onClick={handleLoadMore}>Load More</Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TeacherDirectory;
