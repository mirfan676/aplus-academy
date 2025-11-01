import React, { useState } from "react";
import axios from "axios";

function TutorForm() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    qualification: "",
    experience: "",
    city: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Submitting...");

    try {
      const res = await axios.post(
        "https://aplus-academy.onrender.com/tutors/register",
        formData
      );

      if (res.status === 200) {
        setMessage("✅ Tutor registered successfully!");
        setFormData({
          name: "",
          subject: "",
          qualification: "",
          experience: "",
          city: "",
          phone: "",
        });
      } else {
        setMessage("⚠️ Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("❌ Error submitting form. Server might be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 card card-soft shadow-sm">
      <h4 className="text-center mb-4 text-success">Tutor Registration Form</h4>

      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          id="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Subject(s)</label>
        <input
          type="text"
          id="subject"
          className="form-control"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Qualification</label>
        <input
          type="text"
          id="qualification"
          className="form-control"
          value={formData.qualification}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Experience (Years)</label>
        <input
          type="number"
          id="experience"
          className="form-control"
          value={formData.experience}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">City</label>
        <input
          type="text"
          id="city"
          className="form-control"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contact Number</label>
        <input
          type="text"
          id="phone"
          className="form-control"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-success w-100 mt-3"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {message && (
        <div
          className={`alert text-center mt-3 ${
            message.includes("✅")
              ? "alert-success"
              : message.includes("❌")
              ? "alert-danger"
              : "alert-info"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}

export default TutorForm;
