import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowForward, CalendarMonth } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import useSEO from "../../hooks/useSEO";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-PK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useSEO({
    title: "A Plus Academy Blog | Education News, Study Tips & Tutor Guidance",
    description:
      "Read A Plus Academy education updates, tutoring guidance, exam news, study tips, and learning trends for students, parents, and tutors in Pakistan.",
    canonical: "https://www.aplusacademy.pk/blog",
    ogUrl: "https://www.aplusacademy.pk/blog",
    ogImage: "https://www.aplusacademy.pk/aplus-logo.png",
  });

  useEffect(() => {
    fetch("/blogs/index.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Blog index could not be loaded.");
        return response.json();
      })
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <Box>
      <Box
        component="section"
        sx={{
          bgcolor: "#102019",
          color: "#fff",
          py: { xs: 7, md: 10 },
        }}
      >
        <Container>
          <Chip
            label="Education Blog"
            color="primary"
            sx={{ borderRadius: 1, color: "#fff", fontWeight: 700, mb: 2 }}
          />
          <Typography
            component="h1"
            variant="h2"
            sx={{ fontWeight: 800, lineHeight: 1.08, maxWidth: 850 }}
          >
            Education news and learning guidance for Pakistan
          </Typography>
          <Typography
            component="p"
            variant="h6"
            sx={{ mt: 2, maxWidth: 760, opacity: 0.86, lineHeight: 1.7 }}
          >
            Fresh updates for students, parents, and tutors, with source references
            and practical takeaways for home and online learning.
          </Typography>
        </Container>
      </Box>

      <Container component="main" sx={{ py: { xs: 5, md: 8 } }}>
        {error && <Alert severity="warning">{error}</Alert>}

        {!error && posts.length === 0 && (
          <Alert severity="info">
            No blog posts are published yet. Run the blog generator script to create
            the first post.
          </Alert>
        )}

        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.slug}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid #dde9e1",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  component="img"
                  src={post.heroImage?.url}
                  alt={post.heroImage?.alt || post.title}
                  sx={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <Stack spacing={2} sx={{ p: 3, flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonth color="primary" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(post.publishedAt)} · {post.readTime}
                    </Typography>
                  </Stack>
                  <Typography component="h2" variant="h5" fontWeight={800}>
                    {post.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {post.description}
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Button
                    component={RouterLink}
                    to={`/blog/${post.slug}`}
                    endIcon={<ArrowForward />}
                    sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 700 }}
                  >
                    Read article
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogList;
