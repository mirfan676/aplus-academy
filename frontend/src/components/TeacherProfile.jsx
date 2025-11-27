import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Grid,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Container,
  Alert,
} from "@mui/material";
import { CheckCircle, Star } from "@mui/icons-material";
import axios from "axios";

const TeacherProfile = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchTeacher = async () => {
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
            featured: t["Featured"]?.trim(),
            Area1: t["Area1"] || "",
            Area2: t["Area2"] || "",
            Area3: t["Area3"] || "",
            rating: t["Rating"] || 5,
          }));
          const found = mapped.find((t) => Number(t.id) === Number(id));
          if (found) setTeacher(found);
          else setError("Teacher not found.");
        } else {
          setError("No teacher data available.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load teacher profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button variant="outlined" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Box>
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          boxShadow: 6,
          border: "4px solid",
          borderImage: "linear-gradient(45deg, #4facfe, #00f2fe) 1",
          overflow: "hidden",
        }}
      >
        {/* Top Section */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              src={teacher.thumbnail}
              alt={teacher.name}
              sx={{
                width: 130,
                height: 130,
                border: "4px solid white",
                mx: "auto",
                boxShadow: "0 0 15px rgba(0,0,0,0.2)",
              }}
            />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
              {teacher.verified?.toLowerCase() === "yes" && (
                <Chip
                  icon={<CheckCircle />}
                  label="Verified"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
              {teacher.featured?.toLowerCase() === "yes" && (
                <Chip
                  label="Featured"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
              {teacher.rating && (
                <Chip
                  icon={<Star />}
                  label={`${teacher.rating} ★`}
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Typography variant="h4" fontWeight={700} color="#004aad">
              {teacher.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 0.5 }}>
              {teacher.qualification}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Experience: {teacher.experience} years
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {teacher.city}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, color: "#29b554", fontWeight: 700 }}>
              {teacher.price}/hr
            </Typography>
          </Grid>
        </Grid>

        {/* Subjects */}
        {teacher.subjects?.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight={700} color="#004aad" gutterBottom>
              Subjects
            </Typography>
            <Grid container spacing={1}>
              {teacher.subjects.map((sub, i) => (
                <Grid item key={i}>
                  <Chip label={sub} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Preferred Areas */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight={700} color="#004aad" gutterBottom>
            Preferred Areas
          </Typography>
          {[teacher.Area1, teacher.Area2, teacher.Area3]
            .filter(Boolean)
            .map((area, i) => (
              <Typography key={i} variant="body1" sx={{ mb: 0.5 }}>
                📍 {area}
              </Typography>
            ))}
        </Box>

        {/* Bio */}
        {teacher.bio && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" fontWeight={700} color="#004aad" gutterBottom>
              About
            </Typography>
            <Typography variant="body1">{teacher.bio}</Typography>
          </Box>
        )}

        {/* Contact & Hire Button */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="success"
            component={Link}
            to={`/hire/${teacher.id}`}
            state={{ teacherId: teacher.id, teacherName: teacher.name }}
          >
            Hire {teacher.name?.split(" ")[0] || "Teacher"}
          </Button>
          <Button variant="outlined" onClick={() => window.history.back()}>
            Back
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default TeacherProfile;
