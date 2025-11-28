import { Grid, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function TeacherFilters({
  selectedCity,
  setSelectedCity,
  selectedSubject,
  setSelectedSubject,
  cities,
  subjects
}) {
  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: "22px", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(12px)" }}>
      <Grid container spacing={2} justifyContent="center">
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select City</InputLabel>
            <Select value={selectedCity} label="Select City" onChange={(e) => setSelectedCity(e.target.value)}>
              <MenuItem value=""><em>All Cities</em></MenuItem>
              {cities.map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Subject</InputLabel>
            <Select value={selectedSubject} label="Select Subject" onChange={(e) => setSelectedSubject(e.target.value)}>
              <MenuItem value=""><em>All Subjects</em></MenuItem>
              {subjects.map((sub, i) => <MenuItem key={i} value={sub}>{sub}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

      </Grid>
    </Paper>
  );
}
