import React, { useState } from "react";

const TutorForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    qualification: "",
    experience: "",
    city: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/tutors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
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
        setMessage(`❌ Error: ${data.detail || "Failed to register"}`);
      }
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <section id="register" className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card p-4 shadow rounded">
              <h4 className="mb-3 text-center text-success">
                Tutor Registration Form
              </h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Subject(s)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Qualification</label>
                  <input
                    type="text"
                    className="form-control"
                    id="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success w-100 mt-3">
                  Submit
                </button>
              </form>

              {message && (
                <div className="mt-3 text-center fw-semibold">{message}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorForm;
