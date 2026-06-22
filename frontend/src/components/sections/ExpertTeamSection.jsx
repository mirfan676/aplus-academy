import { useEffect, useState } from "react";
import {
  Avatar, Box, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton,
  Paper, Stack, Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { fetchTeamMembers } from "../../services/adminContent";

const ExpertTeamSection = () => {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchTeamMembers()
      .then((records) => setMembers(records.filter((member) => member.active).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))))
      .catch(() => setMembers([]));
  }, []);

  return (
    <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2} sx={{ mb: 3 }}>
        <Box><Typography component="h2" variant="h4" color="primary" fontWeight={900}>Our Expert Team</Typography><Typography color="text.secondary" sx={{ mt: 1, maxWidth: 720 }}>Meet the academic and operational specialists who support students, families, and tutors across A Plus Academy.</Typography></Box>
        <Chip icon={<PersonSearchIcon />} label={`${members.length} team profiles`} sx={{ alignSelf: { xs: "flex-start", md: "center" }, borderRadius: 1 }} />
      </Stack>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 2.5 }}>
        {members.map((member) => <Paper key={member.id} elevation={0} sx={{ p: 2.5, border: "1px solid #dce8f1", borderRadius: 1, transition: "transform 180ms ease, box-shadow 180ms ease", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 14px 30px rgba(16,32,25,0.1)" } }}>
          <Stack direction="row" spacing={2} alignItems="center"><Avatar src={member.photoURL || undefined} alt={member.name} sx={{ width: 68, height: 68 }}>{member.name?.[0] || "A"}</Avatar><Box minWidth={0}><Typography variant="h6" fontWeight={900}>{member.name}</Typography><Typography color="primary.main" fontWeight={700}>{member.role}</Typography></Box></Stack>
          <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{member.bio}</Typography>
          <Stack direction="row" gap={0.7} flexWrap="wrap" sx={{ my: 2 }}>{(member.expertise || []).slice(0, 3).map((item) => <Chip key={item} label={item} size="small" sx={{ borderRadius: 1 }} />)}</Stack>
          <Button onClick={() => setSelected(member)} variant="outlined" fullWidth>View profile</Button>
        </Paper>)}
      </Box>
      {!members.length && <Paper elevation={0} sx={{ p: 3, border: "1px solid #dce8f1", borderRadius: 1 }}><Typography fontWeight={800}>Team profiles are being prepared.</Typography><Typography color="text.secondary">Published expert profiles will appear here.</Typography></Paper>}
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        {selected && <><DialogTitle><Stack direction="row" justifyContent="space-between" alignItems="center"><span>{selected.name}</span><IconButton onClick={() => setSelected(null)} aria-label="Close team profile"><CloseIcon /></IconButton></Stack></DialogTitle><DialogContent dividers><Stack alignItems="center" textAlign="center" spacing={2}><Avatar src={selected.photoURL || undefined} alt={selected.name} sx={{ width: 112, height: 112 }}>{selected.name?.[0]}</Avatar><Box><Typography variant="h5" fontWeight={900}>{selected.name}</Typography><Typography color="primary.main" fontWeight={800}>{selected.role}</Typography></Box><Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>{selected.bio}</Typography><Stack direction="row" gap={0.8} justifyContent="center" flexWrap="wrap">{(selected.expertise || []).map((item) => <Chip key={item} label={item} size="small" />)}</Stack><Stack direction="row" spacing={1}>{selected.linkedin && <Button component="a" href={selected.linkedin} target="_blank" rel="noreferrer" startIcon={<LinkedInIcon />}>LinkedIn</Button>}{selected.email && <Button component="a" href={`mailto:${selected.email}`} startIcon={<MailOutlineIcon />}>Email</Button>}</Stack></Stack></DialogContent></>}
      </Dialog>
    </Box>
  );
};

export default ExpertTeamSection;
