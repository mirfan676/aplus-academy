import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Container,
  MenuItem,
  Grid,
  Stack,
  Avatar,
  Chip,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { CheckCircle, LocationOn, Phone, School } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- Custom Person Marker Icon ---
const personIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const TeacherDirectory = () => {
  const [teachers, setTeachers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [userLocation, setUserLocation] = useState([31.5204, 74.3587]); // fallback: Lahore
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch teachers from backend
  useEffect(() => {
    axios
      .get("https://aplus-academy.onrender.com/tutors")
      .then((res) => {
        if (Array.isArray(res.data)) {
          // Filter: only tutors with verified field
          const validTutors = res.data.filter((t) => t["Verified"] && t["Verified"].trim() !== "");

          const mapped = validTutors.map((t, i) => ({
            id: i,
            name: t["Name"] || "Unknown",
            subject: String(t["Subject"] || ""),
            qualification: t["Qualification"] || "",
            experience: t["Experience"] || "",
            city: t["City"] || "",
            phone: t["Phone"] || "",
            bio: t["Bio"] || "",
            imageUrl: t["Image URL"] || "",
            lat: parseFloat(t["Latitude"]) || 31.5204,
            lng: parseFloat(t["Longitude"]) || 74.3587,
            verified: t["Verified"]?.trim(),
          }));

          setTeachers(mapped);
          setFiltered(mapped);

          setSubjects([
            ...new Set(
              mapped.flatMap((t) =>
                t.subject.split(",").map((s) => s.trim())
              )
            ),
          ]);
          setCities([...new Set(mapped.map((t) => t.city).filter(Boolean))]);
        } else setError("Invalid data format from server.");
      })
      .catch(() => setError("Unable to fetch teacher data."))
      .finally(() => setLoading(false));
  }, []);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => console.warn("Geolocation not allowed — using fallback Lahore")
    );
  }, []);

  // Filter and sort
  useEffect(() => {
    let list = [...teachers];

    if (selectedCity)
      list = list.filter(
        (t) => t.city.toLowerCase() === selectedCity.toLowerCase()
      );

    if (selectedSubject)
      list = list.filter((t) =>
        t.subject.toLowerCase().includes(selectedSubject.toLowerCase())
      );

    if (userLocation) {
      list.sort(
        (a, b) =>
          Math.hypot(a.lat - userLocation[0], a.lng - userLocation[1]) -
          Math.hypot(b.lat - userLocation[0], b.lng - userLocation[1])
      );
    }

    setFiltered(list);
    setVisibleCount(5);
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
        >
          {userLocation ? (
            <MapContainer
              center={userLocation}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Circle
                center={userLocation}
                radius={20000}
                pathOptions={{
                  color: "#0d6efd",
                  fillColor: "#0d6efd",
                  fillOpacity: 0.1,
                }}
              />
              <Marker position={userLocation} icon={personIcon}>
                <Popup>You are here</Popup>
              </Marker>

              {filtered.map((t) => (
                <Marker key={t.id} position={[t.lat, t.lng]} icon={personIcon}>
                  <Popup>
                    <strong>{t.name}</strong>
                    <br />
                    {t.subject}
                    <br />
                    {t.city}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <CircularProgress size={24} />
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
              <InputLabel>Filter by City</InputLabel>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                label="Filter by City"
              >
                <MenuItem value="">All Cities</MenuItem>
                {cities.map((city, i) => (
                  <MenuItem key={i} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Subject</InputLabel>
              <Select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                label="Filter by Subject"
              >
                <MenuItem value="">All Subjects</MenuItem>
                {subjects.map((subj, i) => (
                  <MenuItem key={i} value={subj}>
                    {subj}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {error && <Alert severity="error">{error}</Alert>}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Teacher Cards */}
        {!loading &&
          filtered.slice(0, visibleCount).map((t) => (
            <Card
              key={t.id}
              sx={{
                mb: 3,
                boxShadow: 3,
                borderRadius: 2,
                transition: "0.2s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  spacing={2}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={t.imageUrl} alt={t.name} sx={{ width: 56, height: 56 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0d6efd" }}>
                      {t.name}
                    </Typography>
                  </Stack>

                  {t.verified === "Yes" && (
                    <Chip label="VERIFIED" color="success" size="small" />
                  )}
                  {t.verified === "No" && (
                    <Chip label="NEW TEACHER" sx={{ bgcolor: "#ff80ab", color: "white" }} size="small" />
                  )}
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ color: "text.secondary", mt: 1 }}
                >
                  <LocationOn fontSize="small" />
                  <Typography>{t.city}</Typography>
                  <Phone fontSize="small" />
                  <Typography>{t.phone}</Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ color: "text.secondary", mt: 1 }}
                >
                  <School fontSize="small" />
                  <Typography>{t.qualification}</Typography>
                  <Typography>| {t.experience} years experience</Typography>
                </Stack>

                <Box sx={{ mt: 1 }}>
                  {t.subject.split(",").filter(Boolean).map((s, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="center">
                      <CheckCircle fontSize="small" color="success" sx={{ opacity: 0.8 }} />
                      <Typography variant="body2">{s.trim()}</Typography>
                    </Stack>
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: "pre-line" }}>
                  {t.bio}
                </Typography>
              </CardContent>
            </Card>
          ))}

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

        {!loading && filtered.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
            No verified teachers found matching your filters.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default TeacherDirectory;
