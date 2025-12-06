// src/pages/Jobs.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import JobFilters from "../components/JobFilters";
import JobCard from "../components/JobCard";
import { fetchJobs } from "../api";

const PAGE_SIZE = 12;

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cities, setCities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  // Fetch jobs
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();

        setJobs(data);

        // Prepare filter metadata
        setCities([...new Set(data.map((j) => j.city || "").filter(Boolean))]);
        setSubjects([
          ...new Set(
            data
              .map((j) => (j.subjects || j.Subject || "").split(","))
              .flat()
              .map((s) => s.trim())
              .filter(Boolean)
          ),
        ]);
        setGrades([
          ...new Set(
            data
              .map((j) => j.grade || j.Grade || j.Class || "")
              .filter(Boolean)
          ),
        ]);

        setFiltered(data);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + PAGE_SIZE);
      }
    });

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, []);

  // Apply filters
  const onFilterChange = useCallback((filters) => {
    let result = [...jobs];

    if (filters.city) {
      result = result.filter(
        (j) => (j.city || "").toLowerCase() === filters.city.toLowerCase()
      );
    }

    if (filters.subject) {
      result = result.filter((j) =>
        (j.subjects || j.Subject || "")
          .toLowerCase()
          .includes(filters.subject.toLowerCase())
      );
    }

    if (filters.grade) {
      result = result.filter((j) =>
        (j.grade || j.Grade || "")
          .toLowerCase()
          .includes(filters.grade.toLowerCase())
      );
    }

    if (filters.gender) {
      result = result.filter(
        (j) =>
          (j.genderRequirement || "").toLowerCase() ===
          filters.gender.toLowerCase()
      );
    }

    // Fee range
    result = result.filter((j) => {
      const fee = Number(j.fee || j.Fee || 0);
      return fee >= filters.feeValue[0] && fee <= filters.feeValue[1];
    });

    setVisibleCount(PAGE_SIZE);
    setFiltered(result);
  }, [jobs]);

  if (loading) return <div className="p-6 text-center">Loading jobs…</div>;

  return (
    <div className="container mx-auto p-4">
      <JobFilters
        cities={cities}
        subjects={subjects}
        grades={grades}
        onFilterChange={onFilterChange}
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {filtered.slice(0, visibleCount).map((job, idx) => (
          <JobCard key={idx} job={job} />
        ))}
      </div>

      <div ref={bottomRef} className="h-12"></div>
    </div>
  );
}
