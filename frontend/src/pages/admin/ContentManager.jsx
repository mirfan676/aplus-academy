import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert, Avatar, Box, Button, Checkbox, Chip, CircularProgress, Container, Dialog,
  DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem,
  Paper, Stack, Tab, Tabs, TextField, Tooltip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  fetchAdminJobs, fetchSiteAiTutorLogs, fetchTeacherLeads, fetchTeacherRecords, fetchTeamMembers, importTeacherLeads,
  removeJob, removeTeamMember, saveJob, saveTeacherApplication, saveTeacherLead, saveTeamMember, saveVerifiedTeacher,
} from "../../services/adminContent";
import { approveTeacherApplication } from "../../services/firestoreMigration";

const emptyJob = { title: "", grade: "", school: "", subjects: "", timing: "", fee: "", location: "", city: "", gender: "Both", contact: "", status: "Open", students: 1 };
const emptyMember = { name: "", role: "", bio: "", photoURL: "", expertise: "", linkedin: "", email: "", sortOrder: 0, active: true };
const leadStatuses = ["pending", "contacted", "joined", "skip"];
const teacherFields = [
  ["name", "Full name"], ["qualification", "Qualification"], ["subject", "Primary subject"],
  ["subjects", "Subjects (comma separated)"], ["experience", "Years of experience"], ["phone", "Phone"],
  ["city", "City"], ["province", "Province"], ["district", "District"], ["tehsil", "Tehsil"],
  ["area1", "Primary area"], ["area2", "Secondary area"], ["area3", "Additional area"],
  ["latitude", "Latitude"], ["longitude", "Longitude"], ["photoURL", "Profile image URL"],
];

const parseCsvLine = (line) => {
  const cells = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === "\"") {
      if (insideQuotes && next === "\"") {
        current += "\"";
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
};

const parseCsvText = (text) => {
  const lines = String(text || "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase().trim());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((record, header, index) => {
      record[header] = values[index] || "";
      return record;
    }, {});
  });
};

const normalizePhone = (value) => String(value || "").replace(/\D/g, "");

const extractLeadsFromCsv = (text) => {
  const lines = String(text || "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const leads = [];
  lines.slice(1).forEach((line) => {
    parseCsvLine(line).forEach((cell) => {
      const phone = normalizePhone(cell);
      if (phone.length >= 10) leads.push({ phone });
    });
  });

  return leads;
};

const ContentManager = () => {
  const [tab, setTab] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [members, setMembers] = useState([]);
  const [aiLogs, setAiLogs] = useState([]);
  const [teacherLeads, setTeacherLeads] = useState([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [leadMessage, setLeadMessage] = useState("Assalam o Alaikum {name}, A Plus Academy invites teachers to join our platform for free. Create your profile here: https://www.aplusacademy.pk/register");
  const [editor, setEditor] = useState(null);
  const [editorType, setEditorType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      const [nextJobs, nextApplications, nextMembers, nextAiLogs, nextTeacherLeads] = await Promise.all([
        fetchAdminJobs(), fetchTeacherRecords(), fetchTeamMembers(), fetchSiteAiTutorLogs(), fetchTeacherLeads(),
      ]);
      setJobs(nextJobs.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))));
      setApplications(nextApplications);
      setMembers(nextMembers.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
      setAiLogs(nextAiLogs);
      setTeacherLeads(nextTeacherLeads.sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))));
    } catch (loadError) {
      setError(loadError.message || "Dashboard content could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const openEditor = (type, record) => {
    setEditorType(type);
    if (type === "teacher") {
      setEditor({ ...record, subjects: Array.isArray(record.subjects) ? record.subjects.join(", ") : record.subjects || "" });
    } else if (type === "team") {
      setEditor({ ...emptyMember, ...record, expertise: Array.isArray(record?.expertise) ? record.expertise.join(", ") : record?.expertise || "" });
    } else if (type === "lead") {
      setEditor({ ...record });
    } else setEditor({ ...emptyJob, ...record });
  };

  const change = (field) => (event) => setEditor((current) => ({
    ...current,
    [field]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
  }));

  const save = async () => {
    setSaving(true); setError(""); setMessage("");
    try {
      if (editorType === "job") await saveJob(editor);
      if (editorType === "teacher") {
        if (editor.recordState === "verified") await saveVerifiedTeacher(editor);
        else await saveTeacherApplication(editor);
      }
      if (editorType === "lead") await saveTeacherLead(editor);
      if (editorType === "team") await saveTeamMember(editor);
      setMessage(`${editorType === "team" ? "Team member" : editorType} saved.`);
      setEditor(null);
      await refresh();
    } catch (saveError) {
      setError(saveError.message || "Changes could not be saved.");
    } finally { setSaving(false); }
  };

  const approve = async (application) => {
    setSaving(true); setError("");
    try {
      await saveTeacherApplication(application);
      await approveTeacherApplication({ ...application, subjects: String(application.subjects || "").split(",").map((item) => item.trim()).filter(Boolean) });
      setMessage(`${application.name || "Teacher"} verified and published.`);
      setEditor(null);
      await refresh();
    } catch (approveError) { setError(approveError.message || "Teacher could not be approved."); }
    finally { setSaving(false); }
  };

  const remove = async (type, id) => {
    setError("");
    try {
      if (type === "job") await removeJob(id); else await removeTeamMember(id);
      setMessage(`${type === "job" ? "Job" : "Team member"} deleted.`);
      await refresh();
    } catch (removeError) { setError(removeError.message || "Record could not be deleted."); }
  };

  const handleLeadImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Upload a CSV file exported from Excel. Native .xlsx parsing is not enabled yet.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const text = await file.text();
      const rows = parseCsvText(text);
      const imported = await importTeacherLeads(rows.length ? rows : extractLeadsFromCsv(text));
      setMessage(`${imported} teacher leads imported or updated.`);
      await refresh();
    } catch (importError) {
      setError(importError.message || "Teacher leads could not be imported.");
    } finally {
      setSaving(false);
    }
  };

  const updateLeadStatus = async (lead, status) => {
    setSaving(true);
    setError("");
    try {
      await saveTeacherLead({
        ...lead,
        status,
        contactedAt: status === "contacted" ? new Date().toISOString() : lead.contactedAt || null,
        joinedAt: status === "joined" ? new Date().toISOString() : lead.joinedAt || null,
      });
      await refresh();
    } catch (statusError) {
      setError(statusError.message || "Lead status could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  const openWhatsAppLead = (lead) => {
    const firstName = String(lead.name || "").trim().split(" ")[0] || "Teacher";
    const messageText = encodeURIComponent(leadMessage.replaceAll("{name}", firstName));
    window.open(`https://wa.me/${lead.phone}?text=${messageText}`, "_blank", "noopener,noreferrer");
  };

  const toggleLeadSelection = (leadId) => {
    setSelectedLeadIds((current) =>
      current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId]
    );
  };

  const openNextSelectedLead = () => {
    const nextLead = teacherLeads.find((lead) => selectedLeadIds.includes(lead.id) && lead.status === "pending");
    if (!nextLead) {
      setMessage("No selected pending lead is available.");
      return;
    }
    openWhatsAppLead(nextLead);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#eef5ff" }}>
      <Box sx={{ bgcolor: "#102019", color: "#fff", py: 2.5, borderBottom: "4px solid #198754" }}>
        <Container maxWidth="xl"><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
          <Box><Typography component="h1" variant="h4" fontWeight={900}>Content management</Typography><Typography sx={{ opacity: 0.75 }}>Jobs, teacher verification, and public team profiles</Typography></Box>
          <Button component={RouterLink} to="/admin" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ color: "#fff", borderColor: "#6ea884" }}>Dashboard</Button>
        </Stack></Container>
      </Box>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper elevation={0} sx={{ border: "1px solid #dce8f1", borderRadius: 1, overflow: "hidden" }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
            <Tab icon={<WorkIcon />} iconPosition="start" label={`Jobs (${jobs.length})`} />
            <Tab icon={<SchoolIcon />} iconPosition="start" label={`Teachers (${applications.length})`} />
            <Tab icon={<GroupsIcon />} iconPosition="start" label={`Expert team (${members.length})`} />
            <Tab icon={<SmartToyIcon />} iconPosition="start" label={`AI questions (${aiLogs.length})`} />
            <Tab icon={<WhatsAppIcon />} iconPosition="start" label={`Teacher leads (${teacherLeads.length})`} />
          </Tabs>
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {loading ? <CircularProgress /> : tab === 0 ? (
              <Stack spacing={2}>
                <Button onClick={() => openEditor("job", emptyJob)} variant="contained" startIcon={<AddIcon />} sx={{ alignSelf: "flex-start" }}>Add job</Button>
                {jobs.map((job) => <Paper key={job.id} variant="outlined" sx={{ p: 2, borderRadius: 1 }}><Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
                  <Box><Stack direction="row" gap={1} alignItems="center" flexWrap="wrap"><Typography variant="h6" fontWeight={900}>{job.title || "Untitled job"}</Typography><Chip size="small" label={job.status || "Open"} color={String(job.status).toLowerCase() === "closed" ? "default" : "success"} /></Stack><Typography color="text.secondary">{job.city || job.location} · {job.subjects} · Rs {Number(job.fee || 0).toLocaleString()}</Typography></Box>
                  <Stack direction="row"><Tooltip title="Edit job"><IconButton onClick={() => openEditor("job", job)}><EditIcon /></IconButton></Tooltip><Tooltip title="Delete job"><IconButton color="error" onClick={() => remove("job", job.id)}><DeleteOutlineIcon /></IconButton></Tooltip></Stack>
                </Stack></Paper>)}
              </Stack>
            ) : tab === 1 ? (
              <Stack spacing={2}>{applications.map((application) => <Paper key={application.id} variant="outlined" sx={{ p: 2, borderRadius: 1 }}><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}><Stack direction="row" spacing={1.5}><Avatar src={application.photoURL || undefined}>{application.name?.[0] || "T"}</Avatar><Box><Stack direction="row" gap={1} alignItems="center"><Typography fontWeight={900}>{application.name || "Teacher applicant"}</Typography><Chip size="small" label={application.recordState === "verified" ? "Verified" : "Pending"} color={application.recordState === "verified" ? "success" : "warning"} /></Stack><Typography color="text.secondary">{application.qualification || "Qualification missing"} · {application.subject || "Subject missing"}</Typography><Typography variant="body2">{application.city || "City missing"} · {application.experience || 0} years</Typography></Box></Stack><Button onClick={() => openEditor("teacher", application)} variant={application.recordState === "verified" ? "outlined" : "contained"} startIcon={<EditIcon />}>{application.recordState === "verified" ? "Edit profile" : "Complete and verify"}</Button></Stack></Paper>)}{!applications.length && <Alert severity="info">No teacher records found.</Alert>}</Stack>
            ) : tab === 2 ? (
              <Stack spacing={2}><Button onClick={() => openEditor("team", emptyMember)} variant="contained" startIcon={<AddIcon />} sx={{ alignSelf: "flex-start" }}>Add team member</Button>{members.map((member) => <Paper key={member.id} variant="outlined" sx={{ p: 2, borderRadius: 1 }}><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}><Stack direction="row" spacing={1.5}><Avatar src={member.photoURL || undefined}>{member.name?.[0] || "A"}</Avatar><Box><Typography fontWeight={900}>{member.name}</Typography><Typography color="text.secondary">{member.role}</Typography><Chip size="small" label={member.active ? "Public" : "Hidden"} color={member.active ? "success" : "default"} /></Box></Stack><Stack direction="row"><Tooltip title="Edit profile"><IconButton onClick={() => openEditor("team", member)}><EditIcon /></IconButton></Tooltip><Tooltip title="Delete profile"><IconButton color="error" onClick={() => remove("team", member.id)}><DeleteOutlineIcon /></IconButton></Tooltip></Stack></Stack></Paper>)}</Stack>
            ) : tab === 3 ? (
              <Stack spacing={2}>
                {aiLogs.map((log) => <Paper key={log.id} variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                      <Chip size="small" label={log.topic || "A Plus Academy"} color="primary" sx={{ color: "#fff", borderRadius: 1 }} />
                      <Typography variant="body2" color="text.secondary">{log.createdAt?.toDate?.().toLocaleString?.() || "Recent"}</Typography>
                    </Stack>
                    <Typography fontWeight={900}>{log.question}</Typography>
                    <Typography color="text.secondary">{log.answer}</Typography>
                    <Stack direction="row" gap={1} flexWrap="wrap">{(log.links || []).map((link) => <Chip key={link.url} size="small" label={link.label} sx={{ borderRadius: 1 }} />)}</Stack>
                  </Stack>
                </Paper>)}
                {!aiLogs.length && <Alert severity="info">No AI tutor questions recorded yet.</Alert>}
              </Stack>
            ) : (
              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2} alignItems={{ xs: "flex-start", md: "center" }}>
                    <Box>
                      <Typography fontWeight={900}>Teacher outreach import</Typography>
                      <Typography color="text.secondary">
                        Upload a CSV exported from Excel. Phone-only files are supported, and every valid phone number cell will be imported.
                      </Typography>
                    </Box>
                    <Button component="label" variant="contained" startIcon={<UploadFileIcon />} disabled={saving}>
                      Upload CSV
                      <input hidden type="file" accept=".csv,text/csv" onChange={handleLeadImport} />
                    </Button>
                  </Stack>
                  <Stack spacing={1.2} sx={{ mt: 2 }}>
                    <TextField
                      label="WhatsApp message template"
                      value={leadMessage}
                      onChange={(event) => setLeadMessage(event.target.value)}
                      multiline
                      minRows={3}
                      fullWidth
                      helperText="Use {name} to insert the teacher first name when available."
                    />
                    <Stack direction={{ xs: "column", sm: "row" }} gap={1} alignItems={{ xs: "stretch", sm: "center" }}>
                      <Button variant="outlined" startIcon={<WhatsAppIcon />} disabled={!selectedLeadIds.length} onClick={openNextSelectedLead}>
                        Open next selected
                      </Button>
                      <Chip label={`${selectedLeadIds.length} selected`} sx={{ borderRadius: 1 }} />
                    </Stack>
                  </Stack>
                </Paper>
                {teacherLeads.map((lead) => (
                  <Paper key={lead.id} variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
                      <Stack direction="row" spacing={1.2} sx={{ flex: 1 }}>
                        <Checkbox checked={selectedLeadIds.includes(lead.id)} onChange={() => toggleLeadSelection(lead.id)} sx={{ alignSelf: "flex-start" }} />
                        <Box>
                          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                            <Typography fontWeight={900}>{lead.name || "Teacher lead"}</Typography>
                            <Chip size="small" label={lead.status || "pending"} color={lead.status === "joined" ? "success" : lead.status === "contacted" ? "primary" : "default"} />
                          </Stack>
                          <Typography color="text.secondary">{lead.phone} {lead.city ? `· ${lead.city}` : ""} {lead.subject ? `· ${lead.subject}` : ""}</Typography>
                          {lead.notes && <Typography variant="body2" sx={{ mt: 0.8 }}>{lead.notes}</Typography>}
                        </Box>
                      </Stack>
                      <Stack direction={{ xs: "column", sm: "row" }} gap={1} alignItems={{ xs: "stretch", sm: "center" }}>
                        <Button variant="outlined" startIcon={<WhatsAppIcon />} onClick={() => openWhatsAppLead(lead)}>
                          Open WhatsApp
                        </Button>
                        <Button variant="text" onClick={() => openEditor("lead", lead)}>
                          Edit
                        </Button>
                        <TextField
                          select
                          size="small"
                          label="Status"
                          value={lead.status || "pending"}
                          onChange={(event) => updateLeadStatus(lead, event.target.value)}
                          sx={{ minWidth: 140 }}
                        >
                          {leadStatuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                        </TextField>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
                {!teacherLeads.length && <Alert severity="info">No teacher leads imported yet.</Alert>}
              </Stack>
            )}
          </Box>
        </Paper>
      </Container>

      <Dialog open={Boolean(editor)} onClose={() => setEditor(null)} fullWidth maxWidth="md">
        <DialogTitle>{editorType === "job" ? "Job details" : editorType === "team" ? "Expert team profile" : editorType === "lead" ? "Teacher lead" : editor?.recordState === "verified" ? "Edit verified teacher" : "Complete teacher profile"}</DialogTitle>
        {editor && <DialogContent dividers><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
          {editorType === "job" && <>
            {[["title","Job title"],["grade","Grade / level"],["school","School"],["subjects","Subjects"],["timing","Timing"],["fee","Monthly fee"],["location","Location"],["city","City"],["contact","Contact"],["students","Students"]].map(([field,label]) => <TextField key={field} label={label} value={editor[field] ?? ""} onChange={change(field)} required={["title","subjects","city"].includes(field)} />)}
            <TextField select label="Gender" value={editor.gender || "Both"} onChange={change("gender")}><MenuItem value="Both">Both</MenuItem><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem></TextField>
            <TextField select label="Status" value={editor.status || "Open"} onChange={change("status")}><MenuItem value="Open">Open</MenuItem><MenuItem value="Closed">Closed</MenuItem></TextField>
          </>}
          {editorType === "teacher" && <>{teacherFields.map(([field,label]) => <TextField key={field} label={label} value={editor[field] ?? ""} onChange={change(field)} />)}<TextField label="Professional biography" value={editor.bio || ""} onChange={change("bio")} multiline minRows={4} sx={{ gridColumn: "1 / -1" }} /></>}
          {editorType === "team" && <>
            <TextField label="Full name" value={editor.name} onChange={change("name")} required /><TextField label="Role / title" value={editor.role} onChange={change("role")} required />
            <TextField label="Profile image URL" value={editor.photoURL} onChange={change("photoURL")} sx={{ gridColumn: "1 / -1" }} /><TextField label="Expertise (comma separated)" value={editor.expertise} onChange={change("expertise")} sx={{ gridColumn: "1 / -1" }} />
            <TextField label="LinkedIn URL" value={editor.linkedin} onChange={change("linkedin")} /><TextField label="Public email" value={editor.email} onChange={change("email")} /><TextField label="Display order" type="number" value={editor.sortOrder} onChange={change("sortOrder")} />
            <FormControlLabel control={<Checkbox checked={Boolean(editor.active)} onChange={change("active")} />} label="Show publicly" />
            <TextField label="Profile biography" value={editor.bio} onChange={change("bio")} multiline minRows={5} sx={{ gridColumn: "1 / -1" }} />
          </>}
          {editorType === "lead" && <>
            <TextField label="Contact name" value={editor.name || ""} onChange={change("name")} />
            <TextField label="Phone" value={editor.phone || ""} onChange={change("phone")} />
            <TextField label="City" value={editor.city || ""} onChange={change("city")} />
            <TextField label="Role / subject" value={editor.subject || ""} onChange={change("subject")} />
            <TextField select label="Status" value={editor.status || "pending"} onChange={change("status")}>
              {leadStatuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </TextField>
            <TextField label="Notes" value={editor.notes || ""} onChange={change("notes")} multiline minRows={4} sx={{ gridColumn: "1 / -1" }} />
          </>}
        </Box></DialogContent>}
        <DialogActions><Button onClick={() => setEditor(null)}>Cancel</Button><Button onClick={save} disabled={saving} startIcon={saving ? <CircularProgress size={18} /> : <SaveIcon />} variant="outlined">Save</Button>{editorType === "teacher" && editor?.recordState !== "verified" && <Button onClick={() => approve(editor)} disabled={saving} startIcon={<CheckCircleIcon />} variant="contained">Save and verify</Button>}</DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentManager;
