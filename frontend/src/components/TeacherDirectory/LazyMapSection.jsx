// LazyMapSection.jsx
import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// -----------------------------
// Subject color mapping
// -----------------------------
const subjectColors = {
  Mathematics: "#1E88E5",
  Physics: "#43A047",
  Chemistry: "#F4511E",
  Biology: "#8E24AA",
  English: "#FDD835",
  "Computer Science": "#3949AB",
  Statistics: "#FB8C00",
  Botany: "#4CAF50",
  Zoology: "#E53935",
  default: "#FF5722",
};

// -----------------------------
// Custom marker
// -----------------------------
const createTeacherIcon = (color = "#004aad", initials = "") =>
  new L.DivIcon({
    html: `
      <div style="
        background:${color};
        width:32px;
        height:32px;
        border-radius:50%;
        border:2px solid white;
        box-shadow:0 0 6px rgba(0,0,0,0.3);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:13px;
        font-weight:700;
        color:white;
      ">
        ${initials}
      </div>
    `,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

// -----------------------------
// Auto-fit bounds
// -----------------------------
function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    map.fitBounds(L.latLngBounds(points).pad(0.18));
  }, [points, map]);

  return null;
}

const LazyMapSection = ({
  userLocation = [31.5204, 74.3587],
  filtered = [],
}) => {
  // ✅ CORRECT LOCATION READ
  const teacherPoints = filtered
    .map((t) => {
      const lat = Number(t.location?.lat);
      const lng = Number(t.location?.lng);
      return Number.isFinite(lat) && Number.isFinite(lng)
        ? [lat, lng]
        : null;
    })
    .filter(Boolean);

  const allPoints = [userLocation, ...teacherPoints];

  return (
    <MapContainer
      center={userLocation}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User radius */}
      <Circle
        center={userLocation}
        radius={20000}
        pathOptions={{
          color: "#0d6efd",
          fillColor: "#0d6efd",
          fillOpacity: 0.08,
        }}
      />

      {/* User marker */}
      <Marker
        position={userLocation}
        icon={createTeacherIcon("#0d6efd", "U")}
      >
        <Popup>You are here</Popup>
      </Marker>

      {/* ✅ TEACHER MARKERS */}
      {filtered.map((t) => {
        const lat = Number(t.location?.lat);
        const lng = Number(t.location?.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

        const initials = t.name
          ? t.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
          : "?";

        const firstSubject = Array.isArray(t.subjects)
          ? t.subjects[0]
          : "";

        const color =
          subjectColors[firstSubject] || subjectColors.default;

        return (
          <Marker
            key={t.id}
            position={[lat, lng]}
            icon={createTeacherIcon(color, initials)}
          >
            <Popup>
              <div style={{ fontWeight: 700 }}>{t.name}</div>
              {firstSubject && (
                <div style={{ fontSize: 12 }}>{firstSubject}</div>
              )}
              <div style={{ fontSize: 12 }}>{t.city}</div>
            </Popup>
          </Marker>
        );
      })}

      <FitBounds points={allPoints} />
    </MapContainer>
  );
};

export default LazyMapSection;
