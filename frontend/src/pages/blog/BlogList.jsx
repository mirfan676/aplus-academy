import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
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
  const [visibleCount, setVisibleCount] = useState(16);

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

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <Box sx={{ bgcolor: "#f7fbf8", minHeight: "100vh" }}>
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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
            },
            gap: { xs: 2, md: 3 },
          }}
        >
          {visiblePosts.map((post, index) => (
            <Box
              key={post.slug}
              component={RouterLink}
              to={`/blog/${post.slug}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: 420,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#fff",
                border: "1px solid #dbe8e2",
                color: "inherit",
                textDecoration: "none",
                boxShadow: "0 14px 32px rgba(16, 32, 25, 0.06)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  borderColor: "#4ed0c6",
                  background: "linear-gradient(145deg, #e8fff5 0%, #eef8ff 52%, #e4f7ff 100%)",
                  boxShadow: "0 18px 38px rgba(16, 32, 25, 0.14)",
                },
                "&:hover h2": { color: "#0d6f63" },
                "&:hover .blog-arrow": {
                  bgcolor: "#102019",
                  color: "#fff",
                  borderColor: "#102019",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Box
                component="img"
                src={post.heroImage?.url}
                alt={post.heroImage?.alt || post.title}
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 10",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <Stack spacing={1.5} sx={{ p: { xs: 2, md: 2.25 }, flex: 1 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                  useFlexGap
                  color="text.secondary"
                >
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
                  sx={{
                    transition: "color 0.2s ease",
                    lineHeight: 1.22,
                    fontSize: { xs: "1.5rem", md: "1.65rem" },
                  }}
                >
                  {post.title}
                </Typography>

                <Typography color="text.secondary" sx={{ lineHeight: 1.72 }}>
                  {post.description}
                </Typography>

                <Box sx={{ mt: "auto", pt: 1 }}>
                  <IconButton
                    className="blog-arrow"
                    aria-label={`Read ${post.title}`}
                    sx={{
                      border: "1px solid #d7e3dd",
                      color: "#102019",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ArrowForward />
                  </IconButton>
                </Box>
              </Stack>
            </Box>
          ))}
        </Box>

        {hasMore && (
          <Stack alignItems="center" sx={{ pt: { xs: 4, md: 5 } }}>
            <Button
              variant="contained"
              onClick={() => setVisibleCount((current) => current + 16)}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 900,
                bgcolor: "#102019",
                "&:hover": { bgcolor: "#1a5044" },
              }}
            >
              Load More Articles
            </Button>
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default BlogList;
