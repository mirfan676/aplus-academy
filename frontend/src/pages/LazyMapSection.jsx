import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

const LazyMapSection = ({ userLocation, filtered, personIcon }) => (
  <MapContainer
    center={userLocation}
    zoom={12}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Circle
      center={userLocation}
      radius={20000}
      pathOptions={{
        color: "#0d6efd",
        fillColor: "#0d6efd",
        fillOpacity: 0.1,
      }}
    />
    <Marker position={userLocation} icon={personIcon}>
      <Popup>You are here</Popup>
    </Marker>
    {filtered.slice(0, 20).map((t) => (
      <Marker key={t.id} position={[t.lat, t.lng]} icon={personIcon}>
        <Popup>
          <strong>{t.name}</strong>
          <br />
          {t.subject}
          <br />
          {t.city}
        </Popup>
      </Marker>
    ))}
  </MapContainer>
);

export default LazyMapSection;
