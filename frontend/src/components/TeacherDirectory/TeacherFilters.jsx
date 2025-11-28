import {
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function TeacherFilters({
  selectedCity,
  setSelectedCity,
  selectedSubject,
  setSelectedSubject,
  cities,
  subjects,
}) {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: "22px",
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>City</InputLabel>
            <Select
              value={selectedCity}
              label="City"
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <MenuItem value="">All Cities</MenuItem>
              {cities.map((city, i) => (
                <MenuItem key={i} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              label="Subject"
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <MenuItem value="">All Subjects</MenuItem>
              {subjects.map((sub, i) => (
                <MenuItem key={i} value={sub}>
                  {sub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}
