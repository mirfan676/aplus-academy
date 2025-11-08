import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const TeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem("aplus_tutors_cache");
    if (cached) {
      const data = JSON.parse(cached).data;
      const found = data.find((t) => Number(t.id) === Number(id));
      setTeacher(found);
    }
  }, [id]);

  if (!teacher)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        {/* Top Section */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              src={teacher.imageUrl}
              alt={teacher.name}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid #0d6efd",
                mx: "auto",
              }}
            />
            {teacher.verified?.toLowerCase() === "yes" && (
              <Chip
                icon={<CheckCircle />}
                label="Verified"
                color="success"
                size="small"
                sx={{ mt: 2 }}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={8}>
            <Typography variant="h5" fontWeight={700} color="#0d6efd">
              {teacher.name}
            </Typography>
            <Typography color="text.secondary">{teacher.qualification}</Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Experience: {teacher.experience} years
            </Typography>
            <Typography color="text.secondary">{teacher.city}</Typography>
          </Grid>
        </Grid>

        {/* Subjects */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="#0d6efd"
            gutterBottom
          >
            Subjects
          </Typography>
          <Grid container spacing={1}>
            {teacher.subject
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((sub, i) => (
                <Grid item key={i}>
                  <Chip label={sub} color="primary" variant="outlined" />
                </Grid>
              ))}
          </Grid>
        </Box>

        {/* Preferred Areas */}
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="#0d6efd"
            gutterBottom
          >
            Preferred Areas
          </Typography>
          {[teacher.Area1, teacher.Area2, teacher.Area3]
            .filter(Boolean)
            .map((area, i) => (
              <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                📍 {area}
              </Typography>
            ))}
        </Box>

        {/* Bio */}
        {teacher.bio && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="#0d6efd"
              gutterBottom
            >
              About
            </Typography>
            <Typography variant="body2">{teacher.bio}</Typography>
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
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default TeacherProfile;
