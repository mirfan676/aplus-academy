import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Container, Typography, Box, Button, Alert } from "@mui/material";
import TeacherFilters from "./TeacherFilters";
import TeacherList from "./TeacherList";
import TeacherMapSection from "./TeacherMapSection";
import { mapTutor, filterTeachers } from "./teacherUtils";
import L from "leaflet";

const personIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function TeacherDirectory() {
  const [teachers, setTeachers] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapVisible, setMapVisible] = useState(false);

  const [userLocation, setUserLocation] = useState([31.5204, 74.3587]);

  useEffect(() => {
    axios.get("https://aplus-academy.onrender.com/tutors/")
      .then(res => setTeachers(res.data.map(mapTutor)))
      .catch(() => setError("Unable to fetch data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation([pos.coords.latitude, pos.coords.longitude])
    );
  }, []);

  const subjects = useMemo(() => [...new Set(teachers.flatMap(t => t.subjects))], [teachers]);
  const cities = useMemo(() => [...new Set(teachers.map(t => t.city).filter(Boolean))], [teachers]);

  const filtered = filterTeachers(teachers, selectedCity, selectedSubject, userLocation);

  const [showMoreBio, setShowMoreBio] = useState({});
  const [showMoreSubjects, setShowMoreSubjects] = useState({});

  return (
    <Box sx={{ background: "#e8f2ff", py: 6 }}>
      <Container maxWidth="lg">

        <Typography variant="h4" align="center" fontWeight={700} sx={{ mb: 4 }}>
          Find Teachers Near You
        </Typography>

        <TeacherMapSection
          mapVisible={mapVisible}
          setMapVisible={setMapVisible}
          filtered={filtered}
          userLocation={userLocation}
          personIcon={personIcon}
        />

        <TeacherFilters
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          cities={cities}
          subjects={subjects}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <TeacherList
          loading={loading}
          filtered={filtered}
          visibleCount={visibleCount}
          showMoreBio={showMoreBio}
          showMoreSubjects={showMoreSubjects}
          toggleBio={(id) => setShowMoreBio(prev => ({ ...prev, [id]: !prev[id] }))}
          toggleSubjects={(id) => setShowMoreSubjects(prev => ({ ...prev, [id]: !prev[id] }))}
        />

        {!loading && visibleCount < filtered.length && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button variant="contained" onClick={() => setVisibleCount(v => v + 12)}>
              Load More
            </Button>
          </Box>
        )}

      </Container>
    </Box>
  );
}
