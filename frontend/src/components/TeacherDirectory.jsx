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
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Lazy load the map
const LazyMap = React.lazy(() => import("./LazyMapSection"));

// Custom person icon for map markers
const personIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Cache constants
const CACHE_KEY = "aplus_tutors_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day

const TeacherDirectory = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [userLocation, setUserLocation] = useState([31.5204, 74.3587]); // Lahore fallback
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapVisible, setMapVisible] = useState(false);

  // Fetch tutors with caching
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);

        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            setTeachers(parsed.data);
            setLoading(false);
            return;
          }
        }

        const res = await axios.get("https://aplus-academy.onrender.com/tutors");
        if (Array.isArray(res.data)) {
          const mapped = res.data.map((t, i) => ({
            id: i,
            name: t["Name"] || "Unknown",
            subject: String(t["Subject"] || ""),
            qualification: t["Qualification"] || "",
            experience: t["Experience"] || "",
            city: t["City"] || "",
            phone: t["Phone"] || "",
            bio: t["Bio"] || "",
            imageUrl: t["Image URL"] || "",
            Area1: t["Area1"] || "",
            Area2: t["Area2"] || "",
            Area3: t["Area3"] || "",
            lat: parseFloat(t["Latitude"]) || 31.5204,
            lng: parseFloat(t["Longitude"]) || 74.3587,
            verified: t["Verified"]?.trim(),
          }));

          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data: mapped, timestamp: Date.now() })
          );
          setTeachers(mapped);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to fetch teacher data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => console.warn("Geolocation not allowed — using Lahore fallback")
    );
  }, []);

  // Subjects & Cities
  const subjects = useMemo(() => {
    return [
      ...new Set(
        teachers.flatMap((t) => t.subject?.split(",").map((s) => s.trim()) || [])
      ),
    ];
  }, [teachers]);

  const cities = useMemo(() => {
    return [...new Set(teachers.map((t) => t.city).filter(Boolean))];
  }, [teachers]);

  // Filter & sort
  const filtered = useMemo(() => {
    let list = [...teachers];
    if (selectedCity)
      list = list.filter((t) => t.city.toLowerCase() === selectedCity.toLowerCase());
    if (selectedSubject)
      list = list.filter((t) => t.subject.toLowerCase().includes(selectedSubject.toLowerCase()));
    list.sort(
      (a, b) =>
        Math.hypot(a.lat - userLocation[0], a.lng - userLocation[1]) -
        Math.hypot(b.lat - userLocation[0], b.lng - userLocation[1])
    );
    return list;
  }, [selectedCity, selectedSubject, teachers, userLocation]);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 5);

  return (
    <Box sx={{ bgcolor: "#f9f9f9", py: 2 }}>
      <Container maxWidth="lg">
        {/* Map */}
        <Box
          sx={{
            height: { xs: "1in", md: "1.5in" },
            borderRadius: 2,
            overflow: "hidden",
            mb: 3,
            boxShadow: 3,
          }}
          onMouseEnter={() => !mapVisible && setMapVisible(true)}
        >
          {mapVisible ? (
            <Suspense fallback={<CircularProgress />}>
              <LazyMap userLocation={userLocation} filtered={filtered} personIcon={personIcon} />
            </Suspense>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#6c757d",
              }}
            >
              Hover to load map 🗺️
            </Box>
          )}
        </Box>

        {/* Heading */}
        <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3 }}>
          Find Teachers Near You
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel shrink>Select City</InputLabel>
              <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                <MenuItem value="">
                  <em>All Cities</em>
                </MenuItem>
                {cities.map((city, i) => (
                  <MenuItem key={i} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel shrink>Select Subject</InputLabel>
              <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                <MenuItem value="">
                  <em>All Subjects</em>
                </MenuItem>
                {subjects.map((s, i) => (
                  <MenuItem key={i} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Error */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Cards */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}><CircularProgress /></Box>
        ) : filtered.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
            No teachers found matching your filters.
          </Typography>
        ) : (
          filtered.slice(0, visibleCount).map((t) => (
            <Card key={t.id} sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Avatar src={t.imageUrl || ""} alt={t.name} sx={{ width: 80, height: 80 }} />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography variant="h6" fontWeight={700} color="#0d6efd">{t.name}</Typography>
                  {t.verified?.toLowerCase() === "yes" && <CheckCircle color="success" />}
                  <Typography variant="body2" color="text.secondary">{t.qualification}</Typography>
                  <Typography variant="body2" color="text.secondary">{t.city}</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">SUBJECTS</Typography>
                  {t.subject?.split(",").map((s, i) => (
                    <Typography key={i} variant="body2">⭐ {s.trim()}</Typography>
                  ))}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">PREFERRED AREAS</Typography>
                  {[t.Area1, t.Area2, t.Area3].filter(Boolean).map((a, i) => (
                    <Typography key={i} variant="body2">📍 {a}</Typography>
                  ))}
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: "#29b554", "&:hover": { backgroundColor: "#218838" } }}
                 onClick={() => window.location.href=`/teacher/${t.id}`}>VIEW DETAILS</Button>
                <Button
                  component={Link}
                  to={`/hire/${t.id}`}
                  state={{ teacherId: t.id, teacherName: t.name  }}  
                  variant="contained"
                  sx={{ backgroundColor: "#004aad", "&:hover": { backgroundColor: "#003a8d" } }}
                >
                  Hire ME
                </Button>
              </Box>
            </Card>
          ))
        )}

        {/* Load More */}
        {!loading && visibleCount < filtered.length && (
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button variant="contained" onClick={handleLoadMore}>Load More</Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TeacherDirectory;
