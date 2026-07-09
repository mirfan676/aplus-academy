import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowForward, CalendarMonth } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import { fetchBlogIndex } from "../../services/blogData";

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
    title: "A Plus Academy Blog | Education News and Learning Trends",
    description:
      "Read compact education summaries and trend analysis across tutoring, exams, language learning, Quran education, skills, and digital learning.",
    canonical: "https://www.aplusacademy.pk/blog",
    ogUrl: "https://www.aplusacademy.pk/blog",
    ogImage: "https://www.aplusacademy.pk/aplus-logo.png",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "A Plus Academy Blog",
      url: "https://www.aplusacademy.pk/blog",
      description:
        "Read compact education summaries and trend analysis across tutoring, exams, language learning, Quran education, skills, and digital learning.",
      publisher: {
        "@type": "Organization",
        name: "A Plus Academy",
        logo: {
          "@type": "ImageObject",
          url: "https://www.aplusacademy.pk/aplus-logo.png",
        },
      },
    },
  });

  useEffect(() => {
    fetchBlogIndex()
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
            sx={{ borderRadius: 1, color: "#fff", fontWeight: 800, mb: 2 }}
          />
          <Typography
            component="h1"
            variant="h2"
            sx={{ fontWeight: 900, lineHeight: 1.08, maxWidth: 920 }}
          >
            Education insights, trends, and learning updates
          </Typography>
          <Typography
            component="p"
            variant="h6"
            sx={{ mt: 2, maxWidth: 780, opacity: 0.86, lineHeight: 1.7 }}
          >
            A magazine-style collection of education summaries covering tutoring,
            exams, language learning, Quran education, skills, and digital learning.
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

        <Stack sx={{ borderTop: "1px solid #dde9e1", bgcolor: "#fff" }}>
          {posts.map((post, index) => (
            <Box
              key={post.slug}
              component={RouterLink}
              to={`/blog/${post.slug}`}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "220px 1fr auto" },
                gap: { xs: 2, md: 4 },
                alignItems: "center",
                py: { xs: 3, md: 3.5 },
                color: "inherit",
                textDecoration: "none",
                borderBottom: "1px solid #dde9e1",
                "&:hover h2": { color: "#29b554" },
                "&:hover .blog-arrow": { bgcolor: "#29b554", color: "#fff" },
              }}
            >
              <Box
                component="img"
                src={post.heroImage?.url}
                alt={post.heroImage?.alt || post.title}
                sx={{
                  width: "100%",
                  height: { xs: 180, md: 130 },
                  objectFit: "cover",
                  borderRadius: 2,
                  display: "block",
                }}
              />
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                  <CalendarMonth color="primary" fontSize="small" />
                  <Typography variant="body2" fontWeight={700}>
                    {formatDate(post.publishedAt)} - {post.readTime}
                  </Typography>
                  {index === 0 && (
                    <Chip
                      label="Latest"
                      size="small"
                      color="primary"
                      sx={{ borderRadius: 1, color: "#fff", fontWeight: 800 }}
                    />
                  )}
                </Stack>
                <Typography
                  component="h2"
                  variant="h5"
                  fontWeight={900}
                  sx={{ transition: "color 0.2s ease", lineHeight: 1.25 }}
                >
                  {post.title}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.65, maxWidth: 780 }}>
                  {post.description}
                </Typography>
              </Stack>
              <IconButton
                className="blog-arrow"
                aria-label={`Read ${post.title}`}
                sx={{
                  justifySelf: { xs: "flex-start", md: "end" },
                  border: "1px solid #dde9e1",
                  color: "#102019",
                  transition: "all 0.2s ease",
                }}
              >
                <ArrowForward />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default BlogList;
