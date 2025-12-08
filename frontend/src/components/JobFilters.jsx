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
  Button,
  Drawer,
  IconButton,
  useMediaQuery
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  const [minFee, maxFee] = feeRange;

  const presets = [
    [0, 5000],
    [5000, 8000],
    [8000, 12000],
    [12000, 20000],
    [20000, maxFee || 50000]
  ];

  // Make options safe: convert any value to string
  const safeCities = Array.from(new Set(cities.map(c => c != null ? String(c) : ""))).filter(Boolean);
  const safeGrades = Array.from(new Set(grades.map(g => g != null ? String(g) : ""))).filter(Boolean);

  const filterContent = (
    <Box sx={{ p: 3, width: "100%", maxWidth: 960, mx: "auto" }}>
      {isMobile && (
        <Box sx={{ textAlign: "right" }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Grid container spacing={2} justifyContent="center">
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: isMobile ? "center" : "space-between"
          }}
        >
          {/* CITY */}
          <FormControl sx={{ flex: isMobile ? "1 1 100%" : "1 1 22%", minWidth: 150 }}>
            <InputLabel>Select City</InputLabel>
            <Select
              value={city}
              label="Select City"
              onChange={(e) => setCity(e.target.value)}
              sx={{ height: "52px", borderRadius: "14px" }}
            >
              <MenuItem value="">All Cities</MenuItem>
              {safeCities.map((c, i) => (
                <MenuItem key={i} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* SUBJECT */}
          <TextField
            label="Search Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{
              flex: isMobile ? "1 1 100%" : "1 1 22%",
              minWidth: 150,
              "& .MuiInputBase-root": { height: "52px", borderRadius: "14px" },
            }}
          />

          {/* GENDER */}
          <FormControl sx={{ flex: isMobile ? "1 1 100%" : "1 1 22%", minWidth: 150 }}>
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

          {/* GRADE */}
          <FormControl sx={{ flex: isMobile ? "1 1 100%" : "1 1 22%", minWidth: 150 }}>
            <InputLabel>Grade</InputLabel>
            <Select
              value={grade}
              label="Grade"
              onChange={(e) => setGrade(e.target.value)}
              sx={{ height: "52px", borderRadius: "14px" }}
            >
              <MenuItem value="">All Grades</MenuItem>
              {safeGrades.map((g, i) => (
                <MenuItem key={i} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Fee Slider */}
        <Grid item xs={12}>
          <Box sx={{ width: "100%", maxWidth: 480, mx: "auto" }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: "#333", fontWeight: 600 }}>
              Fee Range: {Number(feeValue[0]).toLocaleString()} — {Number(feeValue[1]).toLocaleString()}
            </Typography>
            <Slider
              value={feeValue}
              onChange={(e, v) => setFeeValue(v)}
              valueLabelDisplay="auto"
              min={minFee}
              max={maxFee}
            />
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {presets.map((p, i) => (
                <Button
                  key={i}
                  size="small"
                  variant="outlined"
                  onClick={() => setFeeValue(p)}
                  sx={{ textTransform: "none" }}
                >
                  {Number(p[0]).toLocaleString()} - {p[1] === maxFee ? `${Number(p[0]).toLocaleString()}+` : Number(p[1]).toLocaleString()}
                </Button>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* RESET BUTTON */}
        <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
          <Button onClick={onReset} variant="contained" sx={{ background: "#004aad", px: 4 }}>
            Reset Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <>
      {/* MOBILE FILTER BUTTON */}
      {isMobile && (
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setDrawerOpen(true)}
            startIcon={<FilterListIcon />}
            sx={{ background: "#004aad", textTransform: "none", borderRadius: "12px", px: 3 }}
          >
            Filters
          </Button>
        </Box>
      )}

      {/* DESKTOP FILTER BAR */}
      {!isMobile && (
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
          {filterContent}
        </Paper>
      )}

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { borderTopLeftRadius: "22px", borderTopRightRadius: "22px", p: 2 } }}
      >
        {filterContent}
      </Drawer>
    </>
  );
}
