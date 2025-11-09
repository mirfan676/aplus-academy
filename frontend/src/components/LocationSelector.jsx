import React, { useState, useEffect } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import axios from "axios";

export default function LocationSelector({ onChange }) {
  const [locations, setLocations] = useState({});
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [area, setArea] = useState("");

  const [districtsList, setDistrictsList] = useState([]);
  const [tehsilsList, setTehsilsList] = useState([]);
  const [areasList, setAreasList] = useState([]);

  // Load locations.json from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("https://aplus-academy.onrender.com/locations");
        setLocations(res.data);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };
    fetchLocations();
  }, []);

  // Update districts when province changes
  useEffect(() => {
    if (province) {
      const districts = Object.keys(locations[province] || {});
      setDistrictsList(districts);
      setDistrict("");
      setTehsil("");
      setArea("");
      setTehsilsList([]);
      setAreasList([]);
      onChange({ province, district: "", tehsil: "", cityArea: "", latitude: "", longitude: "" });
    }
  }, [province, locations]);

  // Update tehsils when district changes
  useEffect(() => {
    if (province && district) {
      const tehsils = Object.keys(locations[province][district] || {});
      setTehsilsList(tehsils);
      setTehsil("");
      setArea("");
      setAreasList([]);
      onChange({ province, district, tehsil: "", cityArea: "", latitude: "", longitude: "" });
    }
  }, [district, province, locations]);

  // Update areas when tehsil changes
  useEffect(() => {
    if (province && district && tehsil) {
      const areas = locations[province][district][tehsil] || [];
      setAreasList(areas);
      setArea("");
      onChange({ province, district, tehsil, cityArea: "", latitude: "", longitude: "" });
    }
  }, [tehsil, district, province, locations]);

  // Update selected area
  useEffect(() => {
    if (province && district && tehsil && area) {
      onChange({ province, district, tehsil, cityArea: area, latitude: "", longitude: "" });
    }
  }, [area, tehsil, district, province, onChange]);

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
      {/* Province */}
      <TextField
        select
        label="Province"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
        fullWidth
      >
        {Object.keys(locations).map((prov) => (
          <MenuItem key={prov} value={prov}>
            {prov}
          </MenuItem>
        ))}
      </TextField>

      {/* District */}
      <TextField
        select
        label="District"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        fullWidth
        disabled={!districtsList.length}
      >
        {districtsList.map((dist) => (
          <MenuItem key={dist} value={dist}>
            {dist}
          </MenuItem>
        ))}
      </TextField>

      {/* Tehsil */}
      <TextField
        select
        label="Tehsil"
        value={tehsil}
        onChange={(e) => setTehsil(e.target.value)}
        fullWidth
        disabled={!tehsilsList.length}
      >
        {tehsilsList.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>

      {/* Area */}
      <TextField
        select
        label="Area"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        fullWidth
        disabled={!areasList.length}
      >
        {areasList.map((a) => (
          <MenuItem key={a} value={a}>
            {a}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
