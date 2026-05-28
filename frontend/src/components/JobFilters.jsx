// JobFilters.jsx
import {
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
  Stack,
  useMediaQuery,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
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
  onReset,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  const [minFee, maxFee] = feeRange;
  const safeCities = Array.from(new Set(cities.map((c) => (c != null ? String(c) : "")))).filter(Boolean);
  const safeGrades = Array.from(new Set(grades.map((g) => (g != null ? String(g) : "")))).filter(Boolean);

  const presets = [
    [0, 8000],
    [8000, 15000],
    [15000, 25000],
    [25000, maxFee || 50000],
  ];

  const fieldSx = {
    "& .MuiInputBase-root": { borderRadius: 2, minHeight: 48 },
  };

  const filterContent = (
    <Stack spacing={2.25}>
      <Box>
        <Typography variant="h6" fontWeight={800} color="#004aad">
          Filters
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Narrow jobs by city, class, subject, and fee.
        </Typography>
      </Box>

      <FormControl fullWidth size="small">
        <InputLabel>Select City</InputLabel>
        <Select value={city} label="Select City" onChange={(e) => setCity(e.target.value)} sx={{ borderRadius: 2 }}>
          <MenuItem value="">All Cities</MenuItem>
          {safeCities.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        size="small"
        label="Search Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        sx={fieldSx}
      />

      <FormControl fullWidth size="small">
        <InputLabel>Gender</InputLabel>
        <Select value={gender} label="Gender" onChange={(e) => setGender(e.target.value)} sx={{ borderRadius: 2 }}>
          <MenuItem value="">Any</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Both">Both</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Grade</InputLabel>
        <Select value={grade} label="Grade" onChange={(e) => setGrade(e.target.value)} sx={{ borderRadius: 2 }}>
          <MenuItem value="">All Grades</MenuItem>
          {safeGrades.map((g) => (
            <MenuItem key={g} value={g}>
              {g}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "#333", fontWeight: 700 }}>
          Fee: {Number(feeValue[0]).toLocaleString()} - {Number(feeValue[1]).toLocaleString()}
        </Typography>
        <Slider
          value={feeValue}
          onChange={(e, v) => setFeeValue(v)}
          valueLabelDisplay="auto"
          min={minFee}
          max={maxFee}
        />
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 1 }}>
          {presets.map((p) => (
            <Button
              key={`${p[0]}-${p[1]}`}
              size="small"
              variant="outlined"
              onClick={() => setFeeValue(p)}
              sx={{ textTransform: "none", px: 1, minWidth: 0 }}
            >
              {p[1] === maxFee
                ? `${Number(p[0]).toLocaleString()}+`
                : `${Number(p[0]).toLocaleString()}-${Number(p[1]).toLocaleString()}`}
            </Button>
          ))}
        </Box>
      </Box>

      <Button
        onClick={onReset}
        variant="outlined"
        startIcon={<RestartAltIcon />}
        sx={{ textTransform: "none", borderRadius: 2 }}
      >
        Reset Filters
      </Button>

      {isMobile && (
        <Button
          onClick={() => setDrawerOpen(false)}
          variant="contained"
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 800 }}
        >
          Show Results
        </Button>
      )}
    </Stack>
  );

  if (!isMobile) {
    return (
      <Paper
        sx={{
          position: "sticky",
          top: 84,
          alignSelf: "flex-start",
          width: 280,
          maxHeight: "calc(100vh - 108px)",
          overflowY: "auto",
          p: 2.5,
          borderRadius: 2,
          background: "rgba(255,255,255,0.94)",
          boxShadow: "0 8px 24px rgba(5,30,80,0.08)",
          border: "1px solid rgba(0,74,173,0.08)",
        }}
      >
        {filterContent}
      </Paper>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 30,
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
          py: 1,
          background: "linear-gradient(180deg, #e8f2ff 75%, rgba(232,242,255,0))",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setDrawerOpen(true)}
          startIcon={<FilterListIcon />}
          sx={{ background: "#004aad", textTransform: "none", borderRadius: 2, px: 2.5, fontWeight: 800 }}
        >
          Filters
        </Button>
      </Box>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            maxHeight: "86vh",
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            p: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Box sx={{ width: 42, height: 4, borderRadius: 99, bgcolor: "grey.300" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <IconButton aria-label="Close filters" onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ overflowY: "auto", px: 0.5, pb: 2 }}>{filterContent}</Box>
      </Drawer>
    </>
  );
}
