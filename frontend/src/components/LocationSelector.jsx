import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, CircularProgress } from "@mui/material";
import axios from "axios";

export default function LocationSelector({ onChange }) {
  const [locations, setLocations] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [areas, setAreas] = useState([]);

  const [selected, setSelected] = useState({
    province: "",
    district: "",
    tehsil: "",
    area1: "",
    area2: "",
    area3: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("/locations");
        setLocations(res.data.Punjab || {}); // Load only Punjab for now
        setProvinces(Object.keys(res.data.Punjab || {}));
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Update districts when province changes
  useEffect(() => {
    if (selected.province && locations[selected.province]) {
      const dist = Object.keys(locations[selected.province]);
      setDistricts(dist);
    } else setDistricts([]);

    setSelected((prev) => ({
      ...prev,
      district: "",
      tehsil: "",
      area1: "",
      area2: "",
      area3: "",
    }));
    setTehsils([]);
    setAreas([]);
  }, [selected.province, locations]);

  // Update tehsils when district changes
  useEffect(() => {
    if (selected.province && selected.district) {
      const ths = Object.keys(
        locations[selected.province][selected.district] || {}
      );
      setTehsils(ths);
    } else setTehsils([]);

    setSelected((prev) => ({
      ...prev,
      tehsil: "",
      area1: "",
      area2: "",
      area3: "",
    }));
    setAreas([]);
  }, [selected.district, selected.province, locations]);

  // Update areas when tehsil changes
  useEffect(() => {
    if (selected.province && selected.district && selected.tehsil) {
      const ar =
        locations[selected.province][selected.district][selected.tehsil] || [];
      setAreas(ar);
      setSelected((prev) => ({
        ...prev,
        area1: ar[0] || "",
        area2: ar[1] || ar[0] || "",
        area3: ar[2] || ar[0] || "",
      }));
    } else setAreas([]);
  }, [selected.tehsil, selected.district, selected.province, locations]);

  // Notify parent of selection changes
  useEffect(() => {
    onChange({ ...selected });
  }, [selected, onChange]);

  if (loading) return <CircularProgress />;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        select
        label="Province"
        value={selected.province}
        onChange={(e) => setSelected({ ...selected, province: e.target.value })}
        fullWidth
      >
        {provinces.map((p) => (
          <MenuItem key={p} value={p}>
            {p}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="District"
        value={selected.district}
        onChange={(e) => setSelected({ ...selected, district: e.target.value })}
        fullWidth
        disabled={!selected.province}
      >
        {districts.map((d) => (
          <MenuItem key={d} value={d}>
            {d}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Tehsil"
        value={selected.tehsil}
        onChange={(e) => setSelected({ ...selected, tehsil: e.target.value })}
        fullWidth
        disabled={!selected.district}
      >
        {tehsils.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Area 1"
        value={selected.area1}
        onChange={(e) => setSelected({ ...selected, area1: e.target.value })}
        fullWidth
        disabled={!areas.length}
      >
        {areas.map((a, idx) => (
          <MenuItem key={idx} value={a}>
            {a}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Area 2"
        value={selected.area2}
        onChange={(e) => setSelected({ ...selected, area2: e.target.value })}
        fullWidth
        disabled={!areas.length}
      >
        {areas.map((a, idx) => (
          <MenuItem key={idx} value={a}>
            {a}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Area 3"
        value={selected.area3}
        onChange={(e) => setSelected({ ...selected, area3: e.target.value })}
        fullWidth
        disabled={!areas.length}
      >
        {areas.map((a, idx) => (
          <MenuItem key={idx} value={a}>
            {a}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
