import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Map city names to coordinates (add more cities as needed)
const cityCoordinates = {
  "Lahore": [31.5204, 74.3587],
  "Karor Lal Esan": [30.6353, 70.9353],
  "Islamabad": [33.6844, 73.0479],
  "Karachi": [24.8607, 67.0011],
  "Rawalpindi": [33.5651, 73.0169],
  "Multan": [30.1575, 71.5249],
  "Faisalabad": [31.4504, 73.1350],
  "GFDGFD": [31.5, 74.0], // Example placeholder
  // add all other cities from your dataset
};

const TeacherDirectory = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios
      .get("https://aplus-academy.onrender.com/tutors")
      .then((res) => {
        const mapped = res.data.map((t) => ({
          name: t["Full Name"],
          subject: t["Subject(s)"],
          qualification: t["Qualification"],
          experience: t["Experience (Years)"],
          city: t["City"],
          phone: t["Contact Number"],
        }));
        setTeachers(mapped);
        setFiltered(mapped);
      })
      .catch((err) => console.error("Error loading teachers:", err));
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      teachers.filter(
        (t) =>
          t.name?.toLowerCase().includes(s) ||
          String(t.subject)?.toLowerCase().includes(s) ||
          t.city?.toLowerCase().includes(s)
      )
    );
  }, [search, teachers]);

  // Leaflet default icon fix
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
            <div key={index} className="card mb-3 shadow-sm border-0 p-3">
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
            center={[31.5204, 74.3587]} // default Lahore
            zoom={6}
            style={{ height: "80vh", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />

            {filtered.map((t, i) => {
              const coords = cityCoordinates[t.city] || [31.5204, 74.3587]; // fallback
              return (
                <Marker key={i} position={coords}>
                  <Popup>
                    <b>{t.name}</b> <br />
                    {t.subject} <br />
                    {t.city}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default TeacherDirectory;
