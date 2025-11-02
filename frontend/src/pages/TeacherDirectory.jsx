import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const TeacherDirectory = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    // Fetch teacher list from your API (you’ll set up a /tutors endpoint later)
    axios
      .get("https://aplus-academy.onrender.com/tutors")
      .then((res) => {
        setTeachers(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Error loading teachers:", err));
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      teachers.filter(
        (t) =>
          t.name.toLowerCase().includes(s) ||
          t.subject.toLowerCase().includes(s) ||
          t.city.toLowerCase().includes(s)
      )
    );
  }, [search, teachers]);

  // Default map icon fix
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Left Column - List */}
        <div className="col-md-6 col-lg-7">
          <h3 className="text-success mb-3">Our Registered Tutors</h3>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by name, subject, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filtered.length === 0 && (
            <div className="alert alert-warning">No tutors found.</div>
          )}

          {filtered.map((tutor, index) => (
            <div
              key={index}
              className="card mb-3 shadow-sm border-0 p-3"
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="text-success">{tutor.name}</h5>
                  <p className="mb-1">
                    <strong>Subject:</strong> {tutor.subject}
                  </p>
                  <p className="mb-1">
                    <strong>City:</strong> {tutor.city}
                  </p>
                  <p className="mb-1">
                    <strong>Experience:</strong> {tutor.experience} years
                  </p>
                  <p className="mb-1">
                    <strong>Qualification:</strong> {tutor.qualification}
                  </p>
                  <p className="mb-0 text-muted">
                    <i className="bi bi-telephone"></i> {tutor.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Map */}
        <div className="col-md-6 col-lg-5 mt-4 mt-md-0">
          <MapContainer
            center={[31.5204, 74.3587]} // Lahore default
            zoom={6}
            style={{ height: "80vh", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />

            {filtered.map((t, i) => (
              <Marker
                key={i}
                position={[
                  // fake coordinates per city (replace with real if available)
                  31.5204 + Math.random() * 0.5,
                  74.3587 + Math.random() * 0.5,
                ]}
              >
                <Popup>
                  <b>{t.name}</b> <br />
                  {t.subject} <br />
                  {t.city}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default TeacherDirectory;
