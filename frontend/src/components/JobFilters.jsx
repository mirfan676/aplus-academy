// JobFilters.jsx
import {
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  Slider,
  Button
} from "@mui/material";

export default function JobFilters({
  city,
  setCity,
  subject,
  setSubject,
  gender,
  setGender,
  grade,
  setGrade,
  cities = [],
  grades = [],
  feeRange = [0, 50000],
  feeValue = [0, 50000],
  setFeeValue,
  onReset
}) {
  const [minFee, maxFee] = feeRange;

  const presets = [
    [0, 5000],
    [5000, 8000],
    [8000, 12000],
    [12000, 20000],
    [20000, maxFee || 50000]
  ];

  return (
    <Paper
      sx={{
        position: "sticky",
        top: 60,
        zIndex: 50,
        p: 3,
        mb: 4,
        borderRadius: "22px",
        background: "rgba(255,255,255,0.90)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
      }}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {/* City */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Select City</InputLabel>
            <Select
              value={city}
              label="Select City"
              onChange={(e) => setCity(e.target.value)}
              sx={{ height: "52px", borderRadius: "14px" }}
            >
              <MenuItem value="">All Cities</MenuItem>
              {cities.map((c, i) => (
                <MenuItem key={i} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Subject (text search) */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ "& .MuiInputBase-root": { height: "52px", borderRadius: "14px" } }}
          />
        </Grid>

        {/* Gender */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              value={gender}
              label="Gender"
              onChange={(e) => setGender(e.target.value)}
              sx={{ height: "52px", borderRadius: "14px" }}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Both">Both</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Grade */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Grade</InputLabel>
            <Select
              value={grade}
              label="Grade"
              onChange={(e) => setGrade(e.target.value)}
              sx={{ height: "52px", borderRadius: "14px" }}
            >
              <MenuItem value="">All Grades</MenuItem>
              {grades.map((g, i) => (
                <MenuItem key={i} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Fee slider */}
        <Grid item xs={12} md={12}>
          <Box sx={{ px: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: "#333", fontWeight: 600 }}>
              Fee Range: {feeValue[0].toLocaleString()} — {feeValue[1].toLocaleString()}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box sx={{ flex: 1 }}>
                <Slider
                  value={feeValue}
                  onChange={(e, v) => setFeeValue(v)}
                  valueLabelDisplay="auto"
                  min={minFee}
                  max={maxFee}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                {presets.map((p, i) => (
                  <Button
                    key={i}
                    size="small"
                    variant="outlined"
                    onClick={() => setFeeValue(p)}
                    sx={{ textTransform: "none" }}
                  >
                    {p[0].toLocaleString()} - {p[1] === maxFee ? `${p[0].toLocaleString()}+` : p[1].toLocaleString()}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Reset */}
        <Grid item xs={12} md={12} sx={{ textAlign: "right" }}>
          <Button onClick={onReset} variant="contained" sx={{ background: "#004aad" }}>
            Reset Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
