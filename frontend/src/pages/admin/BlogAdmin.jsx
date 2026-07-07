import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SaveIcon from "@mui/icons-material/Save";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { hasFirebaseStorage } from "../../firebase";
import {
  addBlogEditor,
  createSlug,
  estimateReadTime,
  fetchAllBlogPostsForAdmin,
  listBlogEditors,
  removeBlogEditor,
  saveBlogPost,
  uploadBlogImage,
} from "../../services/blogData";

const emptyPost = {
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  category: "A Plus Academy",
  status: "draft",
  rawContent: "",
  htmlContent: "",
  heroImage: {
    url: "",
    alt: "",
    credit: "",
  },
};

const dateLabel = (value) => {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en-PK", { dateStyle: "medium" }).format(new Date(value));
};

const BlogAdmin = () => {
  const { isAdmin, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(emptyPost);
  const [editors, setEditors] = useState([]);
  const [editorEmail, setEditorEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const previewSlug = useMemo(() => editPost.slug || createSlug(editPost.title), [editPost.slug, editPost.title]);
  const readTime = useMemo(
    () => estimateReadTime(`${editPost.rawContent || ""} ${editPost.htmlContent || ""}`),
    [editPost.rawContent, editPost.htmlContent],
  );

  const loadAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const [blogPosts, blogEditors] = await Promise.all([
        fetchAllBlogPostsForAdmin(),
        isAdmin ? listBlogEditors() : Promise.resolve([]),
      ]);
      setPosts(blogPosts);
      setEditors(blogEditors);
    } catch (err) {
      console.error(err);
      setError(err.message || "Blog admin data could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAdmin]);

  const updateField = (field, value) => {
    setEditPost((current) => ({ ...current, [field]: value }));
  };

  const updateHeroImage = (field, value) => {
    setEditPost((current) => ({
      ...current,
      heroImage: { ...(current.heroImage || {}), [field]: value },
    }));
  };

  const startNewPost = () => {
    setEditPost(emptyPost);
    setImageFile(null);
    setMessage("");
    setError("");
  };

  const startEditPost = (post) => {
    setEditPost({
      ...emptyPost,
      ...post,
      description: post.description || post.subtitle || "",
      heroImage: {
        ...emptyPost.heroImage,
        ...(post.heroImage || {}),
      },
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (!editPost.title.trim()) throw new Error("Title is required.");
      if (!editPost.rawContent.trim() && !editPost.htmlContent.trim()) {
        throw new Error("Add raw content, HTML content, or both.");
      }

      const slug = previewSlug;
      let imageUrl = editPost.heroImage?.url || "";
      if (imageFile) imageUrl = await uploadBlogImage({ slug, file: imageFile });

      await saveBlogPost({
        user,
        post: {
          ...editPost,
          slug,
          readTime,
          description: editPost.description || editPost.subtitle,
          heroImage: {
            ...(editPost.heroImage || {}),
            url: imageUrl,
            alt: editPost.heroImage?.alt || editPost.title,
          },
        },
      });

      setMessage("Blog post saved.");
      setEditPost((current) => ({ ...current, slug, heroImage: { ...(current.heroImage || {}), url: imageUrl } }));
      setImageFile(null);
      await loadAdminData();
    } catch (err) {
      console.error(err);
      setError(err.message || "Blog post could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddEditor = async () => {
    setMessage("");
    setError("");
    try {
      await addBlogEditor({ email: editorEmail, user });
      setEditorEmail("");
      setMessage("Blog manager added.");
      setEditors(await listBlogEditors());
    } catch (err) {
      setError(err.message || "Blog manager could not be added.");
    }
  };

  const handleRemoveEditor = async (email) => {
    setMessage("");
    setError("");
    try {
      await removeBlogEditor(email);
      setEditors(await listBlogEditors());
      setMessage("Blog manager removed.");
    } catch (err) {
      setError(err.message || "Blog manager could not be removed.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f7fb" }}>
      <Box sx={{ bgcolor: "#102019", color: "#fff", py: 2, borderBottom: "4px solid #198754" }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography component="h1" variant="h4" fontWeight={900}>
                Blog Manager
              </Typography>
              <Typography sx={{ opacity: 0.75 }}>Create article pages with featured images, subtitles, raw text, and trusted HTML.</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button component={RouterLink} to="/admin" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ color: "#fff", borderColor: "#6ea884" }}>
                Dashboard
              </Button>
              <Button component={RouterLink} to="/blog" target="_blank" variant="contained" startIcon={<OpenInNewIcon />}>
                View blog
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.35fr) minmax(340px, 0.65fr)" }, gap: 3 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: "1px solid #dce8f1", borderRadius: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.5} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h5" fontWeight={900}>Post editor</Typography>
                <Typography color="text.secondary">URL preview: /blog/{previewSlug || "new-post"}</Typography>
              </Box>
              <Button onClick={startNewPost} variant="outlined" sx={{ fontWeight: 900 }}>New post</Button>
            </Stack>

            <Stack spacing={2.2}>
              <TextField label="Featured image URL" value={editPost.heroImage?.url || ""} onChange={(event) => updateHeroImage("url", event.target.value)} fullWidth />
              {hasFirebaseStorage && (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
                  <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateIcon />} sx={{ fontWeight: 900 }}>
                    Upload featured image
                    <input hidden type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
                  </Button>
                  <Typography color="text.secondary">{imageFile ? imageFile.name : "Firebase Storage upload enabled."}</Typography>
                </Stack>
              )}
              {(editPost.heroImage?.url || imageFile) && (
                <Box
                  component="img"
                  src={imageFile ? URL.createObjectURL(imageFile) : editPost.heroImage.url}
                  alt={editPost.heroImage?.alt || editPost.title || "Featured image preview"}
                  sx={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 1, border: "1px solid #dce8f1" }}
                />
              )}
              <TextField label="Featured image alt text" value={editPost.heroImage?.alt || ""} onChange={(event) => updateHeroImage("alt", event.target.value)} fullWidth />
              <TextField label="Featured image credit" value={editPost.heroImage?.credit || ""} onChange={(event) => updateHeroImage("credit", event.target.value)} fullWidth />
              <TextField label="Title" value={editPost.title} onChange={(event) => updateField("title", event.target.value)} fullWidth required />
              <TextField label="Subtitle" value={editPost.subtitle} onChange={(event) => updateField("subtitle", event.target.value)} fullWidth multiline minRows={2} />
              <TextField label="SEO/list description" value={editPost.description} onChange={(event) => updateField("description", event.target.value)} fullWidth multiline minRows={2} />
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField label="Category" value={editPost.category} onChange={(event) => updateField("category", event.target.value)} fullWidth />
                <TextField label="Slug" value={editPost.slug} onChange={(event) => updateField("slug", createSlug(event.target.value))} fullWidth />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" value={editPost.status} onChange={(event) => updateField("status", event.target.value)}>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <TextField label="Raw content" value={editPost.rawContent} onChange={(event) => updateField("rawContent", event.target.value)} fullWidth multiline minRows={8} />
              <TextField
                label="HTML content"
                value={editPost.htmlContent}
                onChange={(event) => updateField("htmlContent", event.target.value)}
                fullWidth
                multiline
                minRows={10}
                placeholder="<p>Paste formatted article HTML here.</p>"
              />
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.5}>
                <Chip label={readTime} sx={{ alignSelf: { xs: "flex-start", sm: "center" }, fontWeight: 800 }} />
                <Button onClick={handleSave} disabled={saving} variant="contained" size="large" startIcon={<SaveIcon />} sx={{ fontWeight: 900 }}>
                  {saving ? "Saving..." : "Save blog post"}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #dce8f1", borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={900}>Saved posts</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>{loading ? "Loading..." : `${posts.length} Firestore posts`}</Typography>
              <Stack spacing={1.5}>
                {posts.map((post) => (
                  <Box key={post.slug} sx={{ p: 1.5, border: "1px solid #e2ebf2", borderRadius: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                      <Box>
                        <Typography fontWeight={900}>{post.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {post.status || "draft"} - {dateLabel(post.publishedAt)}
                        </Typography>
                      </Box>
                      <IconButton aria-label={`Edit ${post.title}`} onClick={() => startEditPost(post)}>
                        <EditIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                ))}
                {!loading && posts.length === 0 && <Alert severity="info">No admin-created blog posts yet.</Alert>}
              </Stack>
            </Paper>

            {isAdmin && (
              <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #dce8f1", borderRadius: 2 }}>
                <Typography variant="h5" fontWeight={900}>Blog managers</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>Add Google account emails that can create and edit blog posts.</Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <TextField label="Email address" value={editorEmail} onChange={(event) => setEditorEmail(event.target.value)} fullWidth />
                  <Button onClick={handleAddEditor} variant="contained" startIcon={<GroupAddIcon />} sx={{ fontWeight: 900 }}>
                    Add
                  </Button>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  {editors.map((editor) => (
                    <Stack key={editor.id} direction="row" justifyContent="space-between" alignItems="center">
                      <Typography>{editor.email}</Typography>
                      <IconButton aria-label={`Remove ${editor.email}`} onClick={() => handleRemoveEditor(editor.email)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                  {editors.length === 0 && <Typography color="text.secondary">No extra blog managers added yet.</Typography>}
                </Stack>
              </Paper>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogAdmin;
