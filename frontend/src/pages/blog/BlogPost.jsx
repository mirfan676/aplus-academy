import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBack, CalendarMonth, OpenInNew } from "@mui/icons-material";
import { Link as RouterLink, useParams } from "react-router-dom";
import useSEO from "../../hooks/useSEO";

const siteUrl = "https://www.aplusacademy.pk";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-PK", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setPost(null);
    setError("");
    fetch(`/blogs/${slug}.json`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("This blog post is not available.");
        return response.json();
      })
      .then(setPost)
      .catch((err) => setError(err.message));
  }, [slug]);

  useSEO({
    title: post?.seoTitle || post?.title || "A Plus Academy Blog",
    description:
      post?.description ||
      "Education news, tutoring guidance, and study insights from A Plus Academy.",
    canonical: post ? `${siteUrl}/blog/${post.slug}` : `${siteUrl}/blog`,
    ogUrl: post ? `${siteUrl}/blog/${post.slug}` : `${siteUrl}/blog`,
    ogImage: post?.heroImage?.url || "https://www.aplusacademy.pk/aplus-logo.png",
  });

  useEffect(() => {
    if (!post) return undefined;

    const id = `blog-structured-data-${post.slug}`;
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image: post.heroImage?.url,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        "@type": "Organization",
        name: "A Plus Academy",
      },
      publisher: {
        "@type": "Organization",
        name: "A Plus Academy",
        logo: {
          "@type": "ImageObject",
          url: "https://www.aplusacademy.pk/aplus-logo.png",
        },
      },
      mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    });
    document.head.appendChild(script);

    return () => script.remove();
  }, [post]);

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button component={RouterLink} to="/blog" startIcon={<ArrowBack />}>
          Back to blog
        </Button>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>Loading article...</Typography>
      </Container>
    );
  }

  return (
    <Box component="article">
      <Box
        sx={{
          minHeight: { xs: 460, md: 560 },
          display: "flex",
          alignItems: "flex-end",
          color: "#fff",
          backgroundImage: `linear-gradient(180deg, rgba(4, 20, 16, 0.25), rgba(4, 20, 16, 0.92)), url(${post.heroImage.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container sx={{ py: { xs: 6, md: 8 } }}>
          <Button
            component={RouterLink}
            to="/blog"
            startIcon={<ArrowBack />}
            sx={{ color: "#fff", mb: 2, textTransform: "none", fontWeight: 700 }}
          >
            Blog
          </Button>
          <Chip
            label={post.topic}
            color="primary"
            sx={{ borderRadius: 1, color: "#fff", fontWeight: 700, mb: 2 }}
          />
          <Typography
            component="h1"
            variant="h2"
            sx={{
              fontWeight: 800,
              lineHeight: 1.08,
              maxWidth: 920,
              fontSize: { xs: "2.15rem", md: "4rem" },
            }}
          >
            {post.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
            <CalendarMonth fontSize="small" />
            <Typography>
              {formatDate(post.publishedAt)} · {post.readTime}
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 5, md: 8 }, maxWidth: "980px !important" }}>
        <Typography
          component="p"
          variant="h6"
          color="text.secondary"
          sx={{ lineHeight: 1.8, mb: 4 }}
        >
          {post.description}
        </Typography>

        <Box sx={{ mb: 5, p: 3, borderRadius: 1, bgcolor: "#f7fbf8", border: "1px solid #e3eee7" }}>
          <Typography component="h2" variant="h5" fontWeight={800} gutterBottom>
            Key takeaways
          </Typography>
          <Stack component="ul" spacing={1.2} sx={{ pl: 3, mb: 0 }}>
            {post.takeaways.map((item) => (
              <Typography component="li" key={item} sx={{ lineHeight: 1.7 }}>
                {item}
              </Typography>
            ))}
          </Stack>
        </Box>

        {post.sections.map((section) => (
          <Box key={section.heading} sx={{ mb: 4 }}>
            <Typography component="h2" variant="h4" fontWeight={800} gutterBottom>
              {section.heading}
            </Typography>
            <Typography sx={{ lineHeight: 1.9, color: "text.secondary", whiteSpace: "pre-line" }}>
              {section.body}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 5 }} />

        <Typography component="h2" variant="h4" fontWeight={800} gutterBottom>
          References
        </Typography>
        <Stack spacing={1.5} component="ol" sx={{ pl: 3 }}>
          {post.references.map((reference) => (
            <Typography component="li" key={`${reference.title}-${reference.url}`}>
              <Link href={reference.url} target="_blank" rel="noopener noreferrer">
                {reference.title}
              </Link>{" "}
              <OpenInNew sx={{ fontSize: 14, verticalAlign: "text-top" }} />{" "}
              <Typography component="span" color="text.secondary">
                {reference.source ? `- ${reference.source}` : ""}
              </Typography>
            </Typography>
          ))}
          {post.heroImage?.sourceUrl && (
            <Typography component="li">
              Hero image:{" "}
              <Link href={post.heroImage.sourceUrl} target="_blank" rel="noopener noreferrer">
                {post.heroImage.credit}
              </Link>
            </Typography>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default BlogPost;
