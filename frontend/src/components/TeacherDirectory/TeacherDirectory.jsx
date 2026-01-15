// TeacherDirectory.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import TeacherFilters from "./TeacherFilters";
import TeacherList from "./TeacherList";
import TeacherMapSection from "./TeacherMapSection";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ------------------------------------------------------
// FIX LEAFLET ICON ISSUE
// ------------------------------------------------------
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom tutor icon
const personIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// ------------------------------------------------------
// FILTER FUNCTION (city + subject + search + distance)
// ------------------------------------------------------
function filterTeachers(
  teachers,
  selectedCity,
  selectedSubject,
  search,
  userLocation
) {
  const [userLat, userLng] = userLocation;

  return teachers
    .filter((tutor) => {
      const matchesCity = selectedCity ? tutor.city === selectedCity : true;
      const matchesSubject = selectedSubject
        ? tutor.subjects.includes(selectedSubject)
        : true;
      const matchesSearch = search
        ? tutor.name.toLowerCase().includes(search.toLowerCase()) ||
          tutor.subjects.join(" ").toLowerCase().includes(search.toLowerCase())
        : true;

      return matchesCity && matchesSubject && matchesSearch;
    })
    .map((tutor) => {
      const latDiff = (tutor.location?.lat || 0) - userLat;
      const lngDiff = (tutor.location?.lng || 0) - userLng;
      return { ...tutor, distance: Math.sqrt(latDiff ** 2 + lngDiff ** 2) };
    })
    .sort((a, b) => a.distance - b.distance);
}

// ------------------------------------------------------
export default function TeacherDirectory() {
  const [teachers, setTeachers] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapVisible, setMapVisible] = useState(false);

  const [userLocation, setUserLocation] = useState([31.5204, 74.3587]); // Lahore default

  const [showMoreBio, setShowMoreBio] = useState({});
  const [showMoreSubjects, setShowMoreSubjects] = useState({});

  // ------------------------------------------------------
  // FETCH TEACHERS + NORMALIZE API FIELDS
  // ------------------------------------------------------
  useEffect(() => {
    axios
      .get("https://aplus-academy.onrender.com/tutors/")
      .then((res) =>
        setTeachers(
          res.data.map((t) => ({
            id: t.id || t._id || Math.random(),
            name: t.Name || "",
            city: t.City || "",
            subjects: t.Subjects || [],
            bio: t.Bio || "",
            experience: t.Experience || 0,
            qualification: t.Qualification || "",
            thumbnail: t.Thumbnail || "",
            phone: t.Phone || "",
            verified: t.Verified === "Yes",
            location: {
              lat: Number(t.Latitude) || 31.5204,
              lng: Number(t.Longitude) || 74.3587,
            },
          }))
        )
      )
      .catch(() => setError("Unable to fetch teacher data"))
      .finally(() => setLoading(false));
  }, []);

  // ------------------------------------------------------
  // GET USER LIVE LOCATION
  // ------------------------------------------------------
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  // ------------------------------------------------------
  // UNIQUE SUBJECTS & CITIES
  // ------------------------------------------------------
  const subjects = useMemo(
    () => [...new Set(teachers.flatMap((t) => t.subjects))],
    [teachers]
  );

  const cities = useMemo(
    () => [...new Set(teachers.map((t) => t.city).filter(Boolean))],
    [teachers]
  );

  // ------------------------------------------------------
  // FILTERED LIST FINAL
  // ------------------------------------------------------
  const filtered = filterTeachers(
    teachers,
    selectedCity,
    selectedSubject,
    search,
    userLocation
  );

  return (
    <Box sx={{ background: "#e8f2ff", py: 6, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* ===== SEO CONTENT (CRITICAL FOR ADSENSE) ===== */}
        <Typography
          component="h1"
          variant="h3"
          align="center"
          fontWeight={800}
          sx={{ mb: 2, color: "#004aad" }}
        >
          Find Verified Home & Online Tutors in Pakistan
        </Typography>

        <Typography
          component="p"
          align="center"
          sx={{
            maxWidth: 760,
            mx: "auto",
            mb: 4,
            color: "#444",
            fontSize: "1.05rem",
          }}
        >
          A Plus Academy connects students with experienced and verified tutors
          for home tuition and online classes across Pakistan. Browse teachers
          for Matric, O Levels, A Levels, Intermediate, Quran, Maths, Science,
          and more. Filter tutors by city, subject, and distance.
        </Typography>

        {/* MAP SECTION */}
        <TeacherMapSection
          mapVisible={mapVisible}
          setMapVisible={setMapVisible}
          filtered={filtered}
          userLocation={userLocation}
          personIcon={personIcon}
        />

        {/* FILTERS */}
        <TeacherFilters
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          search={search}
          setSearch={setSearch}
          cities={cities}
          subjects={subjects}
        />

        {error && <Alert severity="error">{error}</Alert>}

        {/* LIST */}
        <TeacherList
          loading={loading}
          filtered={filtered}
          visibleCount={visibleCount}
          showMoreBio={showMoreBio}
          showMoreSubjects={showMoreSubjects}
          toggleBio={(id) =>
            setShowMoreBio((prev) => ({ ...prev, [id]: !prev[id] }))
          }
          toggleSubjects={(id) =>
            setShowMoreSubjects((prev) => ({ ...prev, [id]: !prev[id] }))
          }
        />

        {!loading && visibleCount < filtered.length && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              sx={{ background: "#004aad", fontWeight: 600 }}
              onClick={() => setVisibleCount((v) => v + 12)}
            >
              Load More
            </Button>
          </Box>
        )}

      </Container>
    </Box>
  );
}
