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
        position: "sticky",
        top: 60,
        zIndex: 50,
        p: 3,
        mb: 4,
        borderRadius: "22px",
        background: "rgba(255,255,255,0.70)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
      }}
    >
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%", mx: "auto" }}
      >
        {/* CITY */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FormControl
            fullWidth
            sx={{
              width: {
                xs: "120px",
                sm: "80%",
                md: "320px", // fixed width desktop
              },
            }}
          >
            <InputLabel>Select City</InputLabel>
            <Select
              value={selectedCity}
              label="Select City"
              onChange={(e) => setSelectedCity(e.target.value)}
              sx={{
                height: "52px",
                borderRadius: "14px",
                fontSize: "16px",
              }}
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

        {/* SUBJECT */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FormControl
            fullWidth
            sx={{
              width: {
                xs: "120px",
                sm: "80%",
                md: "320px", // fixed width desktop
              },
            }}
          >
            <InputLabel>Select Subject</InputLabel>
            <Select
              value={selectedSubject}
              label="Select Subject"
              onChange={(e) => setSelectedSubject(e.target.value)}
              sx={{
                height: "52px",
                borderRadius: "14px",
                fontSize: "16px",
              }}
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
