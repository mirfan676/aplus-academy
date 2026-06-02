import React from "react";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { ArrowForward, Search } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const searches = [
  {
    title: "Female Home Tutor Lahore",
    body: "Find female tutors for school subjects, Quran, English, and exam support at home or online.",
    to: "/female-home-tutor-lahore",
  },
  {
    title: "Home Tuition Lahore",
    body: "One-to-one home tuition for Matric, FSc, O/A Level, Quran, IELTS, and university subjects.",
    to: "/home-tuition-lahore",
  },
  {
    title: "O Level Tutors Lahore",
    body: "Cambridge O Level support with syllabus coverage, concepts, and past-paper practice.",
    to: "/o-level-tutors-lahore",
  },
  {
    title: "IELTS Tutor Pakistan",
    body: "IELTS speaking, writing, reading, listening, mock practice, and band-score improvement.",
    to: "/ielts-tutor-pakistan",
  },
  {
    title: "Quran Tutor with Tajweed",
    body: "Quran reading, Tajweed rules, makharij, fluency, duas, and regular recitation practice.",
    to: "/quran-tutor-with-tajweed",
  },
  {
    title: "Verified Tutors Pakistan",
    body: "Home and online tutors matched by subject, class, city, timing, and teaching experience.",
    to: "/verified-tutors-pakistan",
  },
];

export default function PopularTutorSearches() {
  return (
    <Box component="section" sx={{ bgcolor: "#f7fbf8", py: { xs: 6, md: 8 } }}>
      <Container>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
              <Search color="primary" />
              <Typography component="p" color="primary" fontWeight={900}>
                Popular Tutor Searches
              </Typography>
            </Stack>
            <Typography component="h2" variant="h3" fontWeight={900} sx={{ color: "#004aad", lineHeight: 1.08 }}>
              Find the right tutor faster
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.75 }}>
              Explore focused tutoring pages for the most common searches from families across Lahore and Pakistan.
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {searches.map((item) => (
                <Grid item xs={12} sm={6} key={item.to}>
                  <Box
                    sx={{
                      height: "100%",
                      bgcolor: "#fff",
                      border: "1px solid #dde9e1",
                      borderRadius: 1,
                      p: 2.5,
                    }}
                  >
                    <Typography component="h3" variant="h6" fontWeight={900} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.65, mb: 2 }}>
                      {item.body}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={item.to}
                      endIcon={<ArrowForward />}
                      sx={{ textTransform: "none", fontWeight: 800, p: 0 }}
                    >
                      View page
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
