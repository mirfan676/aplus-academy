// src/components/JobFilters.jsx
import React, { useEffect, useState } from "react";
import { Slider } from "@mui/material";

export default function JobFilters({
  cities,
  subjects,
  grades,
  onFilterChange,
}) {
  const [city, setCity] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [gender, setGender] = useState("");
  const [feeValue, setFeeValue] = useState([2000, 25000]);

  useEffect(() => {
    onFilterChange({
      city,
      subject,
      grade,
      gender,
      feeValue,
    });
  }, [city, subject, grade, gender, feeValue]);

  const reset = () => {
    setCity("");
    setSubject("");
    setGrade("");
    setGender("");
    setFeeValue([2000, 25000]);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          className="border p-2 rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">Select City</option>
          {cities.map((c, i) => (
            <option key={i}>{c}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="">Select Grade</option>
          {grades.map((g, i) => (
            <option key={i}>{g}</option>
          ))}
        </select>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          className="border p-2 rounded"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Gender Requirement</option>
          <option value="Male">Male Only</option>
          <option value="Female">Female Only</option>
        </select>

        <div className="col-span-2">
          <label className="font-medium">
            Fee Range: {feeValue[0]} – {feeValue[1]}
          </label>
          <Slider
            value={feeValue}
            onChange={(e, newVal) => setFeeValue(newVal)}
            min={2000}
            max={50000}
            step={500}
          />
        </div>
      </div>

      <button
        onClick={reset}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Reset Filters
      </button>
    </div>
  );
}
