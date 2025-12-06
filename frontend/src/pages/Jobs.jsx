// Jobs.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { fetchJobs } from "../api";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import { Container, Box, Typography } from "@mui/material";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [city, setCity] = useState("");
  const [subject, setSubject] = useState("");
  const [gender, setGender] = useState("");
  const [grade, setGrade] = useState("");
  const [feeValue, setFeeValue] = useState([0, 50000]);
  const [feeRange, setFeeRange] = useState([0, 50000]);

  // infinite scroll
  const PAGE_SIZE = 8;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef(null);

  // fetch jobs
  useEffect(() => {
    setLoading(true);
    fetchJobs()
      .then((res) => {
        // support both structures: { jobs: [...] } or [...]
        const data = res?.jobs ?? res ?? [];
        setJobs(Array.isArray(data) ? data : []);
        // compute fee range
        const fees = (data || [])
          .map((j) => Number(j.Fee || j.fee || j.Fees || 0))
          .filter((n) => !!n);
        const min = fees.length ? Math.min(...fees) : 0;
        const max = fees.length ? Math.max(...fees) : 50000;
        setFeeRange([Math.max(0, min), Math.max(max, min)]);
        setFeeValue([Math.max(0, min), Math.max(max, min)]);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs", err);
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // derive options
  const cityOptions = Array.from(new Set(jobs.map((j) => (j.City || j.city || "").trim()).filter(Boolean)));
  const gradeOptions = Array.from(new Set(jobs.map((j) => (j.Grade || j.grade || j.Class || "").trim()).filter(Boolean)));

  // apply filters
  const filtered = jobs.filter((job) => {
    const jobCity = (job.City || job.city || "").toLowerCase();
    const jobSubjects = (job.Subjects || job.subjects || job.Subject || "").toLowerCase();
    const jobGender = (job.Gender || job.gender || "").toLowerCase();
    const jobGrade = (job.Grade || job.grade || job.Class || "").toLowerCase();
    const jobFee = Number(job.Fee || job.fee || job.Fees || 0) || 0;

    if (city && !jobCity.includes(city.toLowerCase())) return false;
    if (subject && !jobSubjects.includes(subject.toLowerCase())) return false;
    if (gender && gender !== "" && gender !== "Both" && !jobGender.includes(gender.toLowerCase())) return false;
    if (grade && !jobGrade.includes(grade.toLowerCase())) return false;
    if (jobFee < feeValue[0] || jobFee > feeValue[1]) return false;
    return true;
  });

  // visible slice for infinite loading
  const visibleJobs = filtered.slice(0, visibleCount);

  // reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [city, subject, gender, grade, feeValue]);

  // intersection observer to load more
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && visibleCount < filtered.length) {
        setVisibleCount((v) => Math.min(filtered.length, v + PAGE_SIZE));
      }
    },
    [visibleCount, filtered.length]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: "200px", threshold: 0.1 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const onReset = () => {
    setCity("");
    setSubject("");
    setGender("");
    setGrade("");
    setFeeValue(feeRange);
  };

  return (
    <Box sx={{ background: "#e8f2ff", py: 6, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" fontWeight={700} sx={{ mb: 4, color: "#004aad" }}>
          Latest Home Tutor Jobs
        </Typography>

        <JobFilters
          city={city}
          setCity={setCity}
          subject={subject}
          setSubject={setSubject}
          gender={gender}
          setGender={setGender}
          grade={grade}
          setGrade={setGrade}
          cities={cityOptions}
          grades={gradeOptions}
          feeRange={feeRange}
          feeValue={feeValue}
          setFeeValue={setFeeValue}
          onReset={onReset}
        />

        {/* Loading or no items */}
        {loading && <Typography align="center">Loading jobs...</Typography>}
        {!loading && filtered.length === 0 && (
          <Typography align="center" sx={{ mt: 4, color: "gray" }}>
            No jobs found.
          </Typography>
        )}

        {/* Job list */}
        <Box sx={{ display: "grid", gap: 3 }}>
          {visibleJobs.map((job, i) => (
            <JobCard key={i} job={job} />
          ))}
        </Box>

        {/* loader sentinel */}
        <div ref={loaderRef} style={{ height: 1 }} />

        {/* small status */}
        {!loading && visibleJobs.length < filtered.length && (
          <Typography align="center" sx={{ mt: 2, color: "#555" }}>
            Loading more...
          </Typography>
        )}

        {!loading && visibleJobs.length >= filtered.length && filtered.length > 0 && (
          <Typography align="center" sx={{ mt: 2, color: "#555" }}>
            You've reached the end.
          </Typography>
        )}
      </Container>
    </Box>
  );
}
