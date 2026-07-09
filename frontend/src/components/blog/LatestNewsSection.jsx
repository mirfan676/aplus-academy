import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { fetchBlogIndex } from "../../services/blogData";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-PK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const LatestNewsSection = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchBlogIndex()
      .then((data) => setPosts(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#111514",
        color: "#fff",
        py: { xs: 6, md: 9 },
      }}
    >
      <Container>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ pb: { xs: 4, md: 6 }, borderBottom: "1px solid rgba(255,255,255,0.22)" }}
        >
          <Box>
            <Typography component="p" sx={{ color: "#29b554", fontWeight: 900, mb: 1 }}>
              Latest Education News
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3.4rem" },
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: 0,
              }}
            >
              Explore our expert insights
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/blog"
            variant="outlined"
            sx={{
              borderRadius: 999,
              color: "#fff",
              borderColor: "rgba(255,255,255,0.4)",
              textTransform: "none",
              fontWeight: 800,
              px: 2.5,
              "&:hover": { borderColor: "#29b554", bgcolor: "rgba(41,181,84,0.12)" },
            }}
          >
            See all
          </Button>
        </Stack>

        <Stack>
          {posts.map((post) => (
            <Box
              key={post.slug}
              component={RouterLink}
              to={`/blog/${post.slug}`}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "260px 1fr auto" },
                gap: { xs: 2.5, md: 5 },
                alignItems: "center",
                py: { xs: 4, md: 5 },
                color: "inherit",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.22)",
                "&:hover h3": { color: "#29b554" },
                "&:hover .news-arrow": { bgcolor: "#29b554", color: "#fff", transform: "translate(4px, -4px)" },
              }}
            >
              <Box
                component="img"
                src={post.heroImage?.url}
                alt={post.heroImage?.alt || post.title}
                sx={{
                  width: "100%",
                  height: { xs: 190, md: 150 },
                  objectFit: "cover",
                  borderRadius: 3,
                  display: "block",
                }}
              />
              <Stack spacing={1.4}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#29b554" }} />
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.72)", fontWeight: 800 }}>
                    {formatDate(post.publishedAt)} · {post.readTime}
                  </Typography>
                </Stack>
                <Typography
                  component="h3"
                  sx={{
                    maxWidth: 780,
                    fontSize: { xs: "1.35rem", md: "1.8rem" },
                    fontWeight: 900,
                    lineHeight: 1.18,
                    transition: "color 0.2s ease",
                  }}
                >
                  {post.title}
                </Typography>
                <Typography sx={{ maxWidth: 760, color: "rgba(255,255,255,0.68)", lineHeight: 1.65 }}>
                  {post.description}
                </Typography>
              </Stack>
              <IconButton
                className="news-arrow"
                aria-label={`Read ${post.title}`}
                sx={{
                  justifySelf: { xs: "flex-start", md: "end" },
                  bgcolor: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  width: 56,
                  height: 56,
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

export default LatestNewsSection;
