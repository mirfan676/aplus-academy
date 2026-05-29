import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowForward, Newspaper } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

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
    <Box component="section" sx={{ bgcolor: "#f7fbf8", py: { xs: 6, md: 8 } }}>
      <Container>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Newspaper color="primary" />
            <Typography component="h2" variant="h4" fontWeight={800}>
              Latest Education News
            </Typography>
          </Stack>
          <Button
            component={RouterLink}
            to="/blog"
            endIcon={<ArrowForward />}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            View all
          </Button>
        </Stack>

        <Grid container spacing={2.5}>
          {posts.map((post) => (
            <Grid item xs={12} md={4} key={post.slug}>
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
                  background: "#fff",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                  },
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
                <Stack spacing={1.2} sx={{ p: 2.5 }}>
                  <Typography variant="caption" color="primary" fontWeight={800}>
                    {post.topic}
                  </Typography>
                  <Typography component="h3" variant="h6" fontWeight={800}>
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
      </Container>
    </Box>
  );
};

export default LatestNewsSection;
