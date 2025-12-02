import { useEffect, useState } from "react";
import { fetchJobs } from "../api";
import JobCard from "../components/JobCard";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cityFilter, setCityFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  // -----------------------------
  // Load Jobs From API
  // -----------------------------
  useEffect(() => {
    fetchJobs()
      .then((data) => {
        setJobs(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // -----------------------------
  // Generate City Filter Options
  // -----------------------------
  const cityOptions = Array.from(
    new Set(
      jobs
        .map((j) => j.City || j.city || "")
        .filter((city) => city && city.trim() !== "")
    )
  );

  // -----------------------------
  // Filter Jobs
  // -----------------------------
  const filteredJobs = jobs.filter((job) => {
    const jobCity = (job.City || job.city || "").toLowerCase();
    const jobSubjects = (job.Subjects || job.Subject || "").toLowerCase();

    return (
      (cityFilter ? jobCity.includes(cityFilter.toLowerCase()) : true) &&
      (subjectFilter
        ? jobSubjects.includes(subjectFilter.toLowerCase())
        : true)
    );
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Latest Home Tutor Jobs</h1>

      {/* ---------------- Filters ---------------- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          className="border px-3 py-2 rounded"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">Filter by City</option>
          {cityOptions.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        <input
          className="border px-3 py-2 rounded"
          type="text"
          placeholder="Filter by Subject"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        />
      </div>

      {/* ---------------- Loading State ---------------- */}
      {loading && <p className="text-center text-lg">Loading jobs...</p>}

      {/* ---------------- Empty State ---------------- */}
      {!loading && filteredJobs.length === 0 && (
        <p className="text-center text-gray-600">No jobs found.</p>
      )}

      {/* ---------------- Job Cards ---------------- */}
      <div className="grid gap-5 md:grid-cols-2">
        {filteredJobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Jobs;
