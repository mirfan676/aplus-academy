import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { normalizeEssay } from "../../services/pteEssayData";

const emptyForm = {
  title: "",
  category: "General",
  prompt: "",
  sampleEssay: "",
  score: "",
  tags: "",
};

const PteEssayAdmin = () => {
  const [form, setForm] = useState(emptyForm);
  const [confirmedRights, setConfirmedRights] = useState(false);
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadEssays = async () => {
    if (!db) {
      setError("Firebase is not configured for this deployment.");
      setLoading(false);
      return;
    }
    try {
      const snapshot = await getDocs(query(collection(db, "pteEssays"), orderBy("createdAt", "desc")));
      setEssays(snapshot.docs.map((item, index) => normalizeEssay({ id: item.id, ...item.data() }, index)));
    } catch (loadError) {
      console.error(loadError);
      setError("PTE essays could not be read. Check Firestore rules for the pteEssays collection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEssays();
  }, []);

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const saveEssay = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!db) return setError("Firebase is not configured.");
    if (!confirmedRights) return setError("Confirm that the content is original or licensed before publishing.");

    setSaving(true);
    try {
      await addDoc(collection(db, "pteEssays"), {
        title: form.title.trim(),
        category: form.category.trim() || "General",
        prompt: form.prompt.trim(),
        sampleEssay: form.sampleEssay.trim(),
        score: Number(form.score) || null,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        createdAt: serverTimestamp(),
      });
      setForm(emptyForm);
      setConfirmedRights(false);
      setMessage("Essay published to Firestore.");
      await loadEssays();
    } catch (saveError) {
      console.error(saveError);
      setError("Essay could not be saved. Check your admin Firestore write rules.");
    } finally {
      setSaving(false);
    }
  };

  const removeEssay = async (id) => {
    setMessage("");
    setError("");
    try {
      await deleteDoc(doc(db, "pteEssays", id));
      setEssays((current) => current.filter((essay) => essay.id !== id));
      setMessage("Essay removed.");
    } catch (deleteError) {
      console.error(deleteError);
      setError("Essay could not be removed. Check your Firestore write rules.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#eef5ff" }}>
      <Box sx={{ bgcolor: "#102019", color: "#fff", py: 2.5, borderBottom: "4px solid #198754" }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" gap={2}>
            <Box>
              <Typography component="h1" variant="h4" fontWeight={900}>PTE essay library</Typography>
              <Typography sx={{ opacity: 0.75 }}>Publish approved prompts and sample responses to Firestore.</Typography>
            </Box>
            <Button component={RouterLink} to="/admin" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ color: "#fff", borderColor: "#6ea884" }}>
              Dashboard
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}
        {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 420px" }, gap: 3 }}>
          <Paper component="form" onSubmit={saveEssay} elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 1, border: "1px solid #dce8f1" }}>
            <Typography component="h2" variant="h5" fontWeight={900} gutterBottom>Add an essay</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Students will see this record in Sample Essays and the writing prompt selector.</Typography>
            <Stack spacing={2.2}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" }, gap: 2 }}>
                <TextField label="Title" value={form.title} onChange={updateField("title")} required />
                <TextField label="Category" value={form.category} onChange={updateField("category")} />
              </Box>
              <TextField label="Essay prompt" value={form.prompt} onChange={updateField("prompt")} multiline minRows={4} required />
              <TextField label="Sample response" value={form.sampleEssay} onChange={updateField("sampleEssay")} multiline minRows={12} required />
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" }, gap: 2 }}>
                <TextField label="Practice score / 60" value={form.score} onChange={updateField("score")} type="number" inputProps={{ min: 0, max: 60 }} />
                <TextField label="Tags separated by commas" value={form.tags} onChange={updateField("tags")} />
              </Box>
              <FormControlLabel
                control={<Checkbox checked={confirmedRights} onChange={(event) => setConfirmedRights(event.target.checked)} />}
                label="I confirm this content is original, licensed, or approved for publication."
              />
              <Button type="submit" variant="contained" size="large" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />} disabled={saving || !form.title.trim() || !form.prompt.trim() || !form.sampleEssay.trim()} sx={{ alignSelf: "flex-start", fontWeight: 900 }}>
                Publish essay
              </Button>
            </Stack>
          </Paper>

          <Box>
            <Typography component="h2" variant="h5" fontWeight={900}>Firestore essays</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>{essays.length} published record{essays.length === 1 ? "" : "s"}</Typography>
            {loading ? <CircularProgress /> : (
              <Stack spacing={1.5}>
                {essays.map((essay) => (
                  <Paper key={essay.id} elevation={0} sx={{ p: 2, borderRadius: 1, border: "1px solid #dce8f1" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight={900}>{essay.title}</Typography>
                        <Stack direction="row" gap={0.7} flexWrap="wrap" sx={{ mt: 1 }}>
                          <Chip label={essay.category} size="small" sx={{ borderRadius: 1 }} />
                          {essay.score && <Chip label={`${essay.score}/60`} size="small" color="primary" sx={{ borderRadius: 1, color: "#fff" }} />}
                        </Stack>
                      </Box>
                      <Tooltip title="Delete essay"><IconButton color="error" onClick={() => removeEssay(essay.id)} aria-label={`Delete ${essay.title}`}><DeleteOutlineIcon /></IconButton></Tooltip>
                    </Stack>
                  </Paper>
                ))}
                {!essays.length && <Alert severity="info">No Firestore essays yet. Students currently receive the bundled original samples.</Alert>}
              </Stack>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PteEssayAdmin;
