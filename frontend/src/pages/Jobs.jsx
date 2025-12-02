import { useEffect, useState } from "react";
import { fetchJobs } from "../api";
import JobCard from "../components/JobCard";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [city, setCity] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    fetchJobs().then(setJobs);
  }, []);

  const filteredJobs = jobs.filter(job => {
    return (
      (city ? job.city?.toLowerCase().includes(city.toLowerCase()) : true) &&
      (subject ? job.subjects?.toLowerCase().includes(subject.toLowerCase()) : true)
    );
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Latest Jobs</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select value={city} onChange={e => setCity(e.target.value)}>
          <option value="">Filter by City</option>
          <option>Lahore</option>
          <option>Islamabad</option>
          <option>Karachi</option>
          <option>Multan</option>
        </select>

        <input
          type="text"
          placeholder="Filter by subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
      </div>

      {/* Job Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Jobs;
