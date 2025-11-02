import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Divider,
  Alert,
  Container,
  Chip,
  Stack,
} from "@mui/material";
import { CheckCircle, LocationOn, Phone, School } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const TeacherDirectory = () => {
  const [teachers, setTeachers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://aplus-academy.onrender.com/tutors")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const mapped = res.data.map((t, i) => ({
            id: i,
            name: t["Full Name"] || "Unknown",
            subject: String(t["Subject(s)"] || ""),
            qualification: t["Qualification"] || "",
            experience: t["Experience (Years)"] || "",
            city: t["City"] || "",
            phone: t["Contact Number"] || "",
            lat: 31.5204 + Math.random() * 0.1,
            lng: 74.3587 + Math.random() * 0.1,
          }));
          setTeachers(mapped);
          setFiltered(mapped);
        } else setError("Invalid data format.");
      })
      .catch(() => setError("Unable to fetch teacher data."));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      teachers.filter(
        (t) =>
          t.name.toLowerCase().includes(value) ||
          t.subject.toLowerCase().includes(value) ||
          t.city.toLowerCase().includes(value)
      )
    );
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#f9f9f9", py: 4 }}>
      <Container maxWidth={false} sx={{ width: "90%" }}>
        {/* Header */}
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Teacher Directory
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          label="Search by name, subject, or city"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          sx={{ mb: 4 }}
        />

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Teacher Cards */}
        <Box
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
            mb: 4,
            pr: 1,
          }}
        >
          {filtered.map((t) => (
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
                {/* Top Row */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#0d6efd" }}
                  >
                    {t.name}
                  </Typography>

                  <Chip
                    label="VERIFIED"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Basic Info */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ color: "text.secondary", mb: 1 }}
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
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  <School fontSize="small" />
                  <Typography>{t.qualification}</Typography>
                  <Typography>| {t.experience} years experience</Typography>
                </Stack>

                <Divider sx={{ mb: 1 }} />

                {/* Subjects */}
                <Box sx={{ mb: 1 }}>
                  {t.subject
                    .split(",")
                    .filter(Boolean)
                    .map((s, i) => (
                      <Stack
                        direction="row"
                        spacing={1}
                        key={i}
                        alignItems="center"
                      >
                        <CheckCircle
                          fontSize="small"
                          color="success"
                          sx={{ opacity: 0.8 }}
                        />
                        <Typography variant="body2">{s.trim()}</Typography>
                      </Stack>
                    ))}
                </Box>

                {/* Bio */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t.name} is a qualified teacher based in {t.city}, specializing in{" "}
                  {t.subject}. With {t.experience} years of experience, they hold a
                  {t.qualification ? ` ${t.qualification}` : ""} and are available for
                  tutoring sessions.
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Map Section */}
        <Box
          sx={{
            height: "40vh",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          <MapContainer
            center={[31.5204, 74.3587]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((teacher) => (
              <Marker key={teacher.id} position={[teacher.lat, teacher.lng]}>
                <Popup>
                  <strong>{teacher.name}</strong>
                  <br />
                  {teacher.subject}
                  <br />
                  {teacher.city}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      </Container>
    </Box>
  );
};

export default TeacherDirectory;
