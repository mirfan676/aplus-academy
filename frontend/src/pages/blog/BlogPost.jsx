import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBack, CalendarMonth, OpenInNew } from "@mui/icons-material";
import { Link as RouterLink, useParams } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import { fetchBlogPostBySlug } from "../../services/blogData";

const siteUrl = "https://www.aplusacademy.pk";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-PK", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const allowedTags = new Set([
  "a",
  "article",
  "blockquote",
  "br",
  "div",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "section",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

const sanitizeBlogHtml = (html) => {
  if (!html || typeof window === "undefined") return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("script, style, link, meta, title, iframe, object, embed, form, input, button, textarea").forEach((node) => node.remove());

  const sanitizeNode = (node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tagName = node.tagName.toLowerCase();
    if (!allowedTags.has(tagName)) {
      const parent = node.parentNode;
      if (!parent) return;
      while (node.firstChild) parent.insertBefore(node.firstChild, node);
      parent.removeChild(node);
      return;
    }

    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value || "";
      const isSafeHref = name === "href" && /^(https?:|mailto:|tel:|\/)/i.test(value);
      const isSafeSrc = name === "src" && /^(https?:|data:|\/)/i.test(value);
      const isAlt = name === "alt";
      const isTitle = name === "title";
      const isTarget = name === "target";

      if (isSafeHref || isSafeSrc || isAlt || isTitle || isTarget) return;
      node.removeAttribute(attribute.name);
    });

    node.removeAttribute("class");
    node.removeAttribute("id");
    node.removeAttribute("style");

    if (tagName === "a") {
      node.setAttribute("rel", "noopener noreferrer");
      if (!node.getAttribute("target")) {
        node.setAttribute("target", "_blank");
      }
    }

    [...node.children].forEach(sanitizeNode);
  };

  [...doc.body.children].forEach(sanitizeNode);
  return doc.body.innerHTML.trim();
};

const ArticleImage = ({ image }) => {
  if (!image?.url) return null;

  return (
    <Box component="figure" sx={{ my: 5, mx: 0 }}>
      <Box
        component="img"
        src={image.url}
        alt={image.alt || "A Plus Academy education blog image"}
        sx={{
          width: "100%",
          borderRadius: 1,
          aspectRatio: "16 / 9",
          objectFit: "cover",
          display: "block",
        }}
      />
      <Typography
        component="figcaption"
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}
      >
        {image.credit}
      </Typography>
    </Box>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setPost(null);
    setError("");
    fetchBlogPostBySlug(slug)
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
    type: post ? "article" : "website",
    publishedTime: post?.publishedAt,
    modifiedTime: post?.updatedAt || post?.publishedAt,
    section: post?.topic || post?.category || "Education",
    tags: [post?.topic, post?.category].filter(Boolean),
    structuredData: post
      ? {
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
          articleSection: post.topic || post.category || "Education",
          keywords: [post.topic, post.category].filter(Boolean).join(", "),
        }
      : undefined,
  });

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

  const hasAdminContent = Boolean(post.rawContent || post.htmlContent || post.subtitle);
  const heroUrl = post.heroImage?.url || "https://www.aplusacademy.pk/aplus-logo.png";
  const references = post.references || [];
  const images = post.images || (post.heroImage ? [post.heroImage] : []);
  const adminHtml = String(post.htmlContent || "").trim();
  const adminRaw = String(post.rawContent || "").trim();
  const sanitizedAdminHtml = sanitizeBlogHtml(adminHtml);
  const shouldRenderRaw = !sanitizedAdminHtml && adminRaw;

  return (
    <Box component="article">
      <Box sx={{ bgcolor: "#f4f7f5", borderBottom: "1px solid #dce8e1" }}>
        <Container sx={{ py: { xs: 6, md: 8 } }}>
          <Button
            component={RouterLink}
            to="/blog"
            startIcon={<ArrowBack />}
            sx={{ color: "#102019", mb: 2, textTransform: "none", fontWeight: 700 }}
          >
            Blog
          </Button>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.1fr) minmax(320px, 0.9fr)" },
              gap: { xs: 3, md: 5 },
              alignItems: "center",
            }}
          >
            <Box>
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
                  color: "#102019",
                  fontSize: { xs: "2rem", md: "3.7rem" },
                }}
              >
                {post.title}
              </Typography>
              <Typography
                component="p"
                variant="h6"
                color="text.secondary"
                sx={{ mt: 2, maxWidth: 760, lineHeight: 1.8 }}
              >
                {post.subtitle || post.description}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, color: "text.secondary" }}>
                <CalendarMonth fontSize="small" />
                <Typography>
                  {formatDate(post.publishedAt)} · {post.readTime}
                </Typography>
              </Stack>
            </Box>

            <Box
              component="img"
              src={heroUrl}
              alt={post.heroImage?.alt || post.title}
              sx={{
                width: "100%",
                aspectRatio: "16 / 10",
                objectFit: "cover",
                borderRadius: 2,
                display: "block",
                boxShadow: "0 18px 38px rgba(16, 32, 25, 0.12)",
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container
        sx={{
          py: { xs: 5, md: 8 },
          maxWidth: hasAdminContent ? "1120px !important" : "980px !important",
        }}
      >
        {hasAdminContent && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "180px minmax(0, 1fr)" },
              gap: { xs: 3, md: 5 },
              alignItems: "start",
            }}
          >
            <Box sx={{ color: "text.secondary", borderTop: "3px solid #102019", pt: 2 }}>
              <Typography variant="body2" fontWeight={900} color="text.primary">
                A Plus Academy
              </Typography>
              <Typography variant="body2">{formatDate(post.publishedAt)}</Typography>
              <Typography variant="body2">{post.readTime}</Typography>
            </Box>

            <Box
              sx={{
                "& p": { fontSize: "1.08rem", lineHeight: 1.9, color: "text.secondary", mb: 2.4 },
                "& h2": {
                  fontSize: { xs: "1.8rem", md: "2.25rem" },
                  lineHeight: 1.18,
                  mt: 4.5,
                  mb: 1.5,
                },
                "& h3": { fontSize: "1.45rem", lineHeight: 1.25, mt: 3.5, mb: 1.2 },
                "& img": { maxWidth: "100%", borderRadius: 1 },
                "& a": { color: "#198754", fontWeight: 800 },
                "& blockquote": {
                  borderLeft: "4px solid #198754",
                  m: "28px 0",
                  pl: 2.5,
                  color: "#102019",
                  fontSize: "1.22rem",
                  lineHeight: 1.75,
                },
              }}
            >
              {shouldRenderRaw && (
                <Typography
                  sx={{
                    whiteSpace: "pre-line",
                    fontSize: "1.08rem",
                    lineHeight: 1.9,
                    color: "text.secondary",
                  }}
                >
                  {adminRaw}
                </Typography>
              )}
              {sanitizedAdminHtml && <Box dangerouslySetInnerHTML={{ __html: sanitizedAdminHtml }} />}
            </Box>
          </Box>
        )}

        {!hasAdminContent && (
          <>
            <Box sx={{ mb: 5, p: 3, borderRadius: 1, bgcolor: "#f7fbf8", border: "1px solid #e3eee7" }}>
              <Typography component="h2" variant="h5" fontWeight={800} gutterBottom>
                Key takeaways
              </Typography>
              <Stack component="ul" spacing={1.2} sx={{ pl: 3, mb: 0 }}>
                {(post.takeaways || []).map((item) => (
                  <Typography component="li" key={item} sx={{ lineHeight: 1.7 }}>
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Box>

            {(post.sections || []).slice(0, 1).map((section) => (
              <Box key={section.heading} sx={{ mb: 4 }}>
                <Typography component="h2" variant="h4" fontWeight={800} gutterBottom>
                  {section.heading}
                </Typography>
                <Typography sx={{ lineHeight: 1.9, color: "text.secondary", whiteSpace: "pre-line" }}>
                  {section.body}
                </Typography>
              </Box>
            ))}

            <ArticleImage image={post.images?.[1]} />

            {post.sourceAnalyses?.map((analysis, index) => (
              <Box key={`${analysis.source}-${analysis.title}`} sx={{ mb: 5 }}>
                <Chip
                  label={analysis.source}
                  color="primary"
                  sx={{ borderRadius: 1, color: "#fff", fontWeight: 800, mb: 1.5 }}
                />
                <Typography component="h2" variant="h4" fontWeight={800} gutterBottom>
                  {analysis.title}
                </Typography>
                <Typography sx={{ lineHeight: 1.95, color: "text.secondary", whiteSpace: "pre-line" }}>
                  {analysis.summary}
                </Typography>
                <ArticleImage image={post.images?.[index + 2]} />
              </Box>
            ))}

            {(post.sections || []).slice(post.sourceAnalyses ? 1 : 0).map((section) => (
              <Box key={section.heading} sx={{ mb: 4 }}>
                <Typography component="h2" variant="h4" fontWeight={800} gutterBottom>
                  {section.heading}
                </Typography>
                <Typography sx={{ lineHeight: 1.9, color: "text.secondary", whiteSpace: "pre-line" }}>
                  {section.body}
                </Typography>
              </Box>
            ))}
          </>
        )}

        {(references.length > 0 || images.length > 0) && <Divider sx={{ my: 5 }} />}

        {(references.length > 0 || images.length > 0) && (
          <Typography component="h2" variant="h4" fontWeight={800} gutterBottom>
            References
          </Typography>
        )}
        <Stack spacing={1.5}>
          {references.map((reference) => (
            <Box
              key={`${reference.title}-${reference.url}`}
              component="a"
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "block",
                p: 2,
                borderRadius: 1,
                border: "1px solid #e3eee7",
                bgcolor: "#f7fbf8",
                color: "inherit",
                textDecoration: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#29b554",
                  bgcolor: "#eef8f1",
                },
              }}
            >
              <Typography component="span" sx={{ fontWeight: 800, lineHeight: 1.6 }}>
                {reference.title}
              </Typography>{" "}
              <OpenInNew sx={{ fontSize: 14, verticalAlign: "text-top", color: "#198754" }} />{" "}
              <Typography component="span" color="text.secondary">
                {reference.source ? `- ${reference.source}` : ""}
              </Typography>
            </Box>
          ))}
          {images.filter(Boolean).map((image, index) => (
            <Box
              key={`${image.url}-${index}`}
              component={image.sourceUrl ? "a" : "div"}
              href={image.sourceUrl || undefined}
              target={image.sourceUrl ? "_blank" : undefined}
              rel={image.sourceUrl ? "noopener noreferrer" : undefined}
              sx={{
                display: "block",
                p: 2,
                borderRadius: 1,
                border: "1px solid #e3eee7",
                bgcolor: "#fff",
                color: "inherit",
                textDecoration: "none",
                "&:hover": image.sourceUrl
                  ? { borderColor: "#29b554", bgcolor: "#f7fbf8" }
                  : undefined,
              }}
            >
              <Typography component="span" sx={{ fontWeight: 800 }}>
                Image {index + 1}:{" "}
              </Typography>
              {image.sourceUrl ? (
                <Typography component="span" color="text.secondary">
                  {image.credit}
                </Typography>
              ) : (
                image.credit
              )}
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default BlogPost;
