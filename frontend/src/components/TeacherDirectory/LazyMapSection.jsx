// LazyMapSection.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";

// Subject color mapping
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
  default: "#FF5722", // fallback
};

/**
 * Creates a stylish teacher marker with optional initials
 * @param {string} color Marker color
 * @param {string} initials Letters to display inside marker
 */
const createTeacherIcon = (color = "#004aad", initials = "") =>
  new L.DivIcon({
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: white;
        text-transform: uppercase;
      ">
        ${initials}
      </div>
    `,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

/**
 * Props:
 * - userLocation: [lat, lng]
 * - filtered: array of tutors { id, name, lat, lng, city, subjects }
 */
const LazyMapSection = ({ userLocation = [31.5204, 74.3587], filtered = [] }) => {
  // collect valid coordinates
  const points = filtered
    .map((t) => {
      const lat = Number(t.lat);
      const lng = Number(t.lng);
      if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
      return null;
    })
    .filter(Boolean);

  return (
    <MapContainer
      center={userLocation}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(map) => {
        try {
          if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            bounds.extend(userLocation);
            map.fitBounds(bounds.pad(0.18));
          } else {
            map.setView(userLocation, 12);
          }
        } catch {
          map.setView(userLocation, 12);
        }
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* circle around user */}
      <Circle
        center={userLocation}
        radius={20000}
        pathOptions={{
          color: "#0d6efd",
          fillColor: "#0d6efd",
          fillOpacity: 0.08,
        }}
      />

      {/* user marker */}
      <Marker position={userLocation} icon={createTeacherIcon("#0d6efd", "U")}>
        <Popup>You are here</Popup>
      </Marker>

      {/* teacher markers */}
      {filtered.slice(0, 200).map((t) => {
        const lat = Number(t.lat);
        const lng = Number(t.lng);
        if (isNaN(lat) || isNaN(lng)) return null;

        const firstSubject = Array.isArray(t.subjects) ? t.subjects[0] : "";
        const initials = t.name
          ? t.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
          : "?";

        // pick color based on subject
        const color = subjectColors[firstSubject] || subjectColors.default;

        return (
          <Marker
            key={t.id ?? `${lat}-${lng}`}
            position={[lat, lng]}
            icon={createTeacherIcon(color, initials)}
          >
            <Popup>
              <div style={{ fontWeight: 700 }}>{t.name}</div>
              <div style={{ fontSize: 12 }}>{firstSubject}</div>
              <div style={{ fontSize: 12, color: "#333" }}>{t.city}</div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LazyMapSection;
