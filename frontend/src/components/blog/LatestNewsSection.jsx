import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowForward, CalendarMonth, Newspaper } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-PK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const LatestNewsSection = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/blogs/index.json", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setPosts(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#fff",
        py: { xs: 6, md: 9 },
        borderTop: "1px solid #e8f0ec",
        borderBottom: "1px solid #e8f0ec",
      }}
    >
      <Container>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.5 }}>
              <Newspaper color="primary" />
              <Chip
                label="Latest News"
                color="primary"
                sx={{ borderRadius: 1, color: "#fff", fontWeight: 800 }}
              />
            </Stack>
            <Typography component="h2" variant="h3" fontWeight={900} sx={{ color: "#004aad", lineHeight: 1.08 }}>
              Education trends worth following
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.75 }}>
              Fresh education summaries from the blog, covering tutoring, exams,
              language learning, Quran education, and digital learning trends.
            </Typography>
            <Button
              component={RouterLink}
              to="/blog"
              endIcon={<ArrowForward />}
              variant="contained"
              sx={{ mt: 3, borderRadius: 1, textTransform: "none", fontWeight: 800 }}
            >
              View all articles
            </Button>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2.5}>
              {posts.map((post, index) => (
                <Grid item xs={12} md={index === 0 ? 7 : 5} key={post.slug}>
                  <Paper
                    component={RouterLink}
                    to={`/blog/${post.slug}`}
                    elevation={0}
                    sx={{
                      display: "block",
                      height: "100%",
                      textDecoration: "none",
                      color: "inherit",
                      borderRadius: 1,
                      overflow: "hidden",
                      border: "1px solid #dde9e1",
                      background: index === 0 ? "#f7fbf8" : "#fff",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 14px 34px rgba(16, 32, 25, 0.12)",
                        borderColor: "#29b554",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={post.heroImage?.url}
                      alt={post.heroImage?.alt || post.title}
                      sx={{
                        width: "100%",
                        aspectRatio: index === 0 ? "16 / 10" : "16 / 9",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <Stack spacing={1.3} sx={{ p: { xs: 2.5, md: index === 0 ? 3 : 2.5 } }}>
                      <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                        <CalendarMonth sx={{ fontSize: 17 }} />
                        <Typography variant="caption" fontWeight={700}>
                          {formatDate(post.publishedAt)}
                        </Typography>
                      </Stack>
                      <Typography
                        component="h3"
                        variant={index === 0 ? "h5" : "h6"}
                        fontWeight={900}
                        sx={{ lineHeight: 1.25 }}
                      >
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                        {post.description}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LatestNewsSection;
