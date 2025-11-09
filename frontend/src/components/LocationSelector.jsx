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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("/locations");
        setLocations(res.data);
        setProvinces(Object.keys(res.data));
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selected.province) {
      const dist = Object.keys(locations[selected.province] || {});
      setDistricts(dist);
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
    }
  }, [selected.province, locations]);

  useEffect(() => {
    if (selected.province && selected.district) {
      const ths = Object.keys(
        locations[selected.province][selected.district] || {}
      );
      setTehsils(ths);
      setSelected((prev) => ({
        ...prev,
        tehsil: "",
        area1: "",
        area2: "",
        area3: "",
      }));
      setAreas([]);
    }
  }, [selected.district, selected.province, locations]);

  useEffect(() => {
    if (selected.province && selected.district && selected.tehsil) {
      const ar =
        locations[selected.province][selected.district][selected.tehsil] || [];
      setAreas(ar);
      setSelected((prev) => ({
        ...prev,
        area1: ar[0] || "",
        area2: ar[1] || "",
        area3: ar[2] || "",
      }));
    }
  }, [selected.tehsil, selected.district, selected.province, locations]);

  // Notify parent
  useEffect(() => {
    onChange({
      province: selected.province,
      district: selected.district,
      tehsil: selected.tehsil,
      area1: selected.area1,
      area2: selected.area2,
      area3: selected.area3,
    });
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
    </Box>
  );
}
