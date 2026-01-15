// TeacherList.jsx
import { Grid, Box, Typography } from "@mui/material";
import TeacherCard from "./TeacherCard";
import TeacherCardLoader from "./TeacherCardLoader";

export default function TeacherList({
  loading,
  filtered = [],
  visibleCount = 12,
  showMoreBio = {},
  toggleBio = () => {},
  showMoreSubjects = {},
  toggleSubjects = {},
}) {
  // ------------------------------
  // LOADING STATE
  // ------------------------------
  if (loading) return <TeacherCardLoader count={visibleCount} />;

  // ------------------------------
  // EMPTY STATE (IMPORTANT FOR SEO)
  // ------------------------------
  if (!filtered.length) {
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography component="h2" variant="h6" gutterBottom>
          No tutors found
        </Typography>
        <Typography component="p" sx={{ color: "#555" }}>
          Try changing your city, subject, or search keyword to find more
          qualified teachers near you.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* SEO-friendly section heading */}
      <Typography
        component="h2"
        variant="h5"
        fontWeight={700}
        align="center"
        sx={{ mb: 3, color: "#003b8e" }}
      >
        Available Tutors
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {filtered.slice(0, visibleCount).map((t) => (
          <Grid
            item
            key={t.id}
            xs={12}
            sm={6}
            md={4}
            sx={{ display: "flex" }}
          >
            {/* Wrapper ensures real text exists in DOM */}
            <Box sx={{ width: "100%" }}>
              {/* Hidden semantic heading for crawlers */}
              <Typography
                component="h3"
                sx={{
                  position: "absolute",
                  left: "-10000px",
                  top: "auto",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                }}
              >
                {t.name} – {t.subjects.join(", ")} Tutor in {t.city}
              </Typography>

              <TeacherCard
                t={t}
                showMoreBio={!!showMoreBio[t.id]}
                toggleBio={() => toggleBio(t.id)}
                showMoreSubjects={!!showMoreSubjects[t.id]}
                toggleSubjects={() => toggleSubjects(t.id)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
