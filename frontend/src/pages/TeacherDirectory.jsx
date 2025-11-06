import React, { useEffect, useState, Suspense, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  Grid,
  CircularProgress,
  Container,
  MenuItem,
  Stack,
  Avatar,
  Chip,
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
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapVisible, setMapVisible] = useState(false);

  // Load tutors (with caching)
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

  // Extract subjects & cities for dropdowns
  const subjects = useMemo(() => {
    if (!teachers.length) return [];
    return [
      ...new Set(
        teachers.flatMap((t) => t.subject.split(",").map((s) => s.trim()))
      ),
    ];
  }, [teachers]);

  const cities = useMemo(() => {
    if (!teachers.length) return [];
    return [...new Set(teachers.map((t) => t.city).filter(Boolean))];
  }, [teachers]);

  // Filter + sort tutors (memoized for performance)
  const filtered = useMemo(() => {
    if (!teachers.length) return [];
    let list = [...teachers];

    if (selectedCity)
      list = list.filter(
        (t) => t.city.toLowerCase() === selectedCity.toLowerCase()
      );
    if (selectedSubject)
      list = list.filter((t) =>
        t.subject.toLowerCase().includes(selectedSubject.toLowerCase())
      );

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
        {/* Lazy Map Section */}
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
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress size={28} />
                </Box>
              }
            >
              <LazyMap
                userLocation={userLocation}
                filtered={filtered}
                personIcon={personIcon}
              />
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
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Find Teachers Near You
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ minWidth: 180 }}>
              <InputLabel shrink>Select City</InputLabel>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                label="Select City"
                displayEmpty
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  height: { xs: 50, sm: 56 },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  boxShadow: 1,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ccc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0d6efd",
                  },
                  "& .MuiSelect-select": {
                    py: { xs: 1, sm: 1.3 },
                    px: 2,
                  },
                }}
              >
                <MenuItem value="">
                  <em>All Cities</em>
                </MenuItem>
                {cities.map((city, i) => (
                  <MenuItem key={i} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ minWidth: 180 }}>
              <InputLabel shrink>Select Subject</InputLabel>
              <Select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                label="Select Subject"
                displayEmpty
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  height: { xs: 50, sm: 56 },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  boxShadow: 1,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ccc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0d6efd",
                  },
                  "& .MuiSelect-select": {
                    py: { xs: 1, sm: 1.3 },
                    px: 2,
                  },
                }}
              >
                <MenuItem value="">
                  <em>All Subjects</em>
                </MenuItem>
                {subjects.map((s, i) => (
                  <MenuItem key={i} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Error Message */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Teacher Cards */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : filtered.length ? (
          /* --- Paste this inside your render where you map tutors --- */
filtered.slice(0, visibleCount).map((t) => (
  <Card
    key={t.id}
    sx={{
      mb: 3,
      p: { xs: 2, md: 3 },
      borderRadius: 3,
      boxShadow: 3,
      position: "relative",         // important for absolute children
      overflow: "visible",
      transition: "0.3s",
      "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
    }}
  >
    {/* Top-left avatar (absolute) */}
    <Avatar
      src={t.imageUrl}
      alt={t.name}
      sx={{
        width: 84,
        height: 84,
        border: "3px solid #0d6efd",
        position: "absolute",
        left: 16,
        top: 16,
        boxShadow: 1,
      }}
    />

    {/* Verified badge + stars (top-right absolute group) */}
    <Box sx={{ position: "absolute", right: 16, top: 18, textAlign: "right" }}>
      {t.verified?.toLowerCase() === "yes" && (
        <Chip
          icon={<CheckCircle />}
          label="Verified"
          color="success"
          size="small"
          sx={{ mb: 0.5 }}
        />
      )}
      <Box>
        <Typography component="span" variant="body2" sx={{ color: "gold" }}>
          {"⭐".repeat(5)}
        </Typography>
      </Box>
    </Box>

    {/* Content container: add left padding to avoid avatar overlap */}
    <Grid container spacing={2} sx={{ pl: { xs: 0, md: 12 } }} alignItems="flex-start">
      {/* Top row: Name / Qualification / Location */}
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" fontWeight="700" color="#0d6efd">
              {t.name}
            </Typography>
            {t.qualification && (
              <Typography variant="body2" color="text.secondary">
                {t.qualification}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {(t.Area1 || t.Area2 || t.city) && (
                <>
                  {t.Area1 || t.Area2 ? `${t.Area1 || t.Area2}, ` : ""}
                  {t.city}
                </>
              )}
            </Typography>
          </Box>

          {/* on smaller screens the top-right absolute badge still shows; keep an empty box here to preserve layout */}
          <Box sx={{ display: { xs: "none", md: "block" }, width: 120 }} />
        </Stack>
      </Grid>

      {/* Divider */}
      <Grid item xs={12}>
        <Box sx={{ borderBottom: "1px solid #eee", my: 1 }} />
      </Grid>

      {/* Main body: Subjects (left, two-column) and Preferred Areas (right, single column) */}
      <Grid item xs={12} md={7}>
        <Typography
          variant="subtitle2"
          fontWeight="700"
          sx={{ borderBottom: "2px solid #0d6efd", display: "inline-block", pb: 0.4, mb: 1 }}
        >
          Subjects
        </Typography>

        <Grid container spacing={1} sx={{ mt: 1 }}>
          {t.subject
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((s, i) => (
              // each subject occupies half width on md+ and full width on xs
              <Grid item xs={12} sm={6} key={i}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2">⭐</Typography>
                  <Typography variant="body2">{s}</Typography>
                </Stack>
              </Grid>
            ))}
        </Grid>
      </Grid>

      <Grid item xs={12} md={5}>
        <Typography
          variant="subtitle2"
          fontWeight="700"
          sx={{ borderBottom: "2px solid #0d6efd", display: "inline-block", pb: 0.4, mb: 1 }}
        >
          Preferred Areas
        </Typography>

        <Box sx={{ mt: 1 }}>
          {[t.Area1, t.Area2, t.Area3]
            .filter(Boolean)
            .map((area, i) => (
              <Typography key={i} variant="body2" sx={{ mt: 0.5 }}>
                📍 {area}
              </Typography>
            ))}
        </Box>
      </Grid>

      {/* Action row: aligned right */}
      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => (window.location.href = `/teacher/${t.id}`)}
          >
            View Details
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0d6efd",
              borderRadius: 3,
              "&:hover": { backgroundColor: "#0b5ed7" },
            }}
            onClick={() => (window.location.href = `/hire/${t.id}`)}
          >
            Hire Me
          </Button>
        </Box>
      </Grid>
    </Grid>
  </Card>


          ))
        ) : (
          <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
            No teachers found matching your filters.
          </Typography>
        )}

        {/* Load More */}
        {!loading && visibleCount < filtered.length && (
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleLoadMore}
              sx={{
                backgroundColor: "#0d6efd",
                borderRadius: 3,
                px: 4,
                py: 1,
                "&:hover": { backgroundColor: "#0b5ed7" },
              }}
            >
              Load More
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TeacherDirectory;
