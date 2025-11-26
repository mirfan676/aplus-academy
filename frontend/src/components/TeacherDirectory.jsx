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
  const [visibleCount, setVisibleCount] = useState(12); // first 12
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapVisible, setMapVisible] = useState(false);

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

  const handleLoadMore = () => setVisibleCount((v) => v + 12); // load 12 more

  const [showMoreSubjects, setShowMoreSubjects] = useState({});
  const handleToggleSubjects = (id) => setShowMoreSubjects(prev => ({ ...prev, [id]: !prev[id] }));

  const [showMoreBio, setShowMoreBio] = useState({});
  const handleToggleBio = (id) => setShowMoreBio(prev => ({ ...prev, [id]: !prev[id] }));

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

        {/* Cards */}
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
                <Card
                  sx={{
                    p: 0,
                    borderRadius: "22px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    flex: 1,
                    minHeight: 400,
                    minWidth: 320,
                    maxWidth: 320,
                  }}
                >
                  {/* Floating Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "#00a6ff",
                      color: "white",
                      px: 2,
                      py: 0.5,
                      borderRadius: "16px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    Featured
                  </Box>

                  {/* Top Section */}
                  <Box
                    sx={{
                      display: "flex",
                      p: 2,
                      background: "rgba(0,80,200,0.25)",
                      backdropFilter: "blur(12px)",
                      borderTopLeftRadius: "22px",
                      borderTopRightRadius: "22px",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      src={t.thumbnail} // <-- use secure thumbnail
                      alt={t.name}
                      sx={{ width: 70, height: 70, borderRadius: "14px" }}
                    />
                    <Box sx={{ textAlign: "left" }}>
                      {t.verified?.toLowerCase() === "yes" && (
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontWeight: 700,
                            maxWidth: 180,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <CheckCircleIcon fontSize="small" color="success" />
                          {t.name}
                        </Typography>
                      )}
                      <Typography sx={{ fontSize: "0.85rem", color: "#004aad", fontWeight: 700 }}>
                        {t.qualification}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "gold" }}>★★★★★</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "green" }}>{t.city}</Typography>
                    </Box>
                  </Box>

                  {/* Middle Section */}
                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    {/* Subjects */}
                    <Typography sx={{ mt: 1, fontWeight: 700 }}>Subjects:</Typography>
                    <Box sx={{ fontSize: "0.85rem", mt: 0.5 }}>
                      {(showMoreSubjects[t.id] ? t.subjects : t.subjects.slice(0, 2)).map((subject, i) => (
                        <Typography key={i} sx={{ lineHeight: 1.5 }}>{subject}</Typography>
                      ))}
                      {t.subjects.length > 2 && (
                        <Button size="small" onClick={() => handleToggleSubjects(t.id)} sx={{ mt: 0.5, textTransform: "none", fontSize: "0.75rem" }}>
                          {showMoreSubjects[t.id] ? "See less" : "See more"}
                        </Button>
                      )}
                    </Box>

                    {/* Bio */}
                    <Typography sx={{ mt: 1, fontWeight: 700 }}>Bio:</Typography>
                    <Box sx={{ fontSize: "0.85rem", mt: 0.5 }}>
                      <Typography
                        sx={{
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: showMoreBio[t.id] ? "none" : 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          wordBreak: "break-word",
                          width: "100%",
                        }}
                      >
                        {showMoreBio[t.id] ? t.bio : t.bio.split(" ").slice(0, 40).join(" ")}
                      </Typography>
                      {t.bio.split(" ").length > 40 && (
                        <Button size="small" onClick={() => handleToggleBio(t.id)} sx={{ mt: 0.5, textTransform: "none", fontSize: "0.75rem" }}>
                          {showMoreBio[t.id] ? "See less" : "See more"}
                        </Button>
                      )}
                    </Box>
                  </Box>

                  {/* Footer Price */}
                  <Box sx={{ background: "rgba(0,200,100,0.25)", backdropFilter: "blur(8px)", textAlign: "center", py: 1, fontWeight: 700 }}>
                    1500/hr
                  </Box>

                  {/* Buttons */}
                  <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                    <Button component={Link} to={`/teacher/${t.id}`} variant="contained" sx={{ flex: 1, mr: 1 }}>
                      View Profile
                    </Button>
                    <Button component={Link} to={`/hire/${t.id}`} variant="contained" sx={{ flex: 1, backgroundColor: "#29b554" }}>
                      Hire Me
                    </Button>
                  </Box>
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
