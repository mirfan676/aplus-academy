import React, { useState, useEffect } from "react";

export default function LocationSelector({ onChange }) {
  const [locationData, setLocationData] = useState({});
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Fetch locations.json from backend on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/locations`);
        const data = await res.json();
        setLocationData(data);
      } catch (err) {
        console.error("Failed to fetch locations.json", err);
      }
    };
    fetchLocations();
  }, []);

  // Notify parent about changes
  useEffect(() => {
    onChange({
      province,
      district,
      city,
      area,
      latitude,
      longitude,
      Area1: area || city || "",
      Area2: "",
      Area3: "",
    });
  }, [province, district, city, area, latitude, longitude]);

  // Detect location via browser geolocation or fallback to IP
  const detectLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(6));
          setLongitude(pos.coords.longitude.toFixed(6));
        },
        async () => {
          try {
            const res = await fetch("https://ipapi.co/json/");
            const data = await res.json();
            setLatitude(data.latitude?.toFixed(6) || "");
            setLongitude(data.longitude?.toFixed(6) || "");
            setProvince(data.region || "");
            setDistrict(data.city || "");
            setCity(data.city || "");
          } catch (err) {
            console.error("IP fallback failed", err);
          }
        }
      );
    }
  };

  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      {/* Province */}
      <label>Province</label>
      <select
        value={province}
        onChange={(e) => {
          setProvince(e.target.value);
          setDistrict("");
          setCity("");
        }}
        className="w-full border rounded-md p-2"
      >
        <option value="">Select Province</option>
        {Object.keys(locationData).map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* District */}
      {province && (
        <>
          <label style={{ marginTop: 8 }}>District</label>
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setCity("");
            }}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select District</option>
            {Object.keys(locationData[province] || {}).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </>
      )}

      {/* City / Major Area */}
      {district && (
        <>
          <label style={{ marginTop: 8 }}>City / Major Area</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select City</option>
            {(locationData[province]?.[district] || []).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </>
      )}

      {/* Exact Area */}
      <label style={{ marginTop: 8 }}>Exact Area</label>
      <input
        type="text"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder="e.g. Model Town Block C"
        className="w-full border rounded-md p-2"
      />

      {/* Detect Location Button */}
      <button
        type="button"
        onClick={detectLocation}
        style={{
          marginTop: 10,
          backgroundColor: "#56ab2f",
          color: "white",
          padding: "8px 12px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Detect My Location
      </button>

      {/* Coordinates Display */}
      {latitude && longitude && (
        <p style={{ marginTop: 6, fontSize: 13 }}>
          📍 Coordinates: {latitude}, {longitude}
        </p>
      )}
    </div>
  );
}
