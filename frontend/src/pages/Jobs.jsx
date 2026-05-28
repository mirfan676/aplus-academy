// src/pages/Jobs.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { fetchJobs } from "../api";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import { Container, Box, Typography, Chip, Stack } from "@mui/material";
import useSEO from "../hooks/useSEO";

export default function Jobs() {
  useSEO({
    title: "Latest Home Tutor Jobs - A Plus Home Tutors Pakistan",
    description:
      "Browse verified home tuition and online tutor jobs across Pakistan with A Plus Home Tutors.",
    canonical: "https://www.aplusacademy.pk/jobs",
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [city, setCity] = useState("");
  const [subject, setSubject] = useState("");
  const [gender, setGender] = useState("");
  const [grade, setGrade] = useState("");
  const [feeValue, setFeeValue] = useState([0, 50000]);
  const [feeRange, setFeeRange] = useState([0, 50000]);

  // Infinite scroll
  const PAGE_SIZE = 8;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef(null);

  // Fetch jobs
  useEffect(() => {
    setLoading(true);
    fetchJobs()
      .then((res) => {
        const data = res?.jobs ?? res ?? [];
        setJobs(Array.isArray(data) ? data : []);

        // Compute fee range
        const fees = (data || [])
          .map((j) => {
            const f = Number(j.fee ?? j.Fee ?? j.Fees);
            return isNaN(f) ? 0 : f;
          })
          .filter(Boolean);
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

  // Derive filter options (safe string conversion)
  const cityOptions = Array.from(
    new Set(
      jobs
        .map((j) => String(j.city ?? j.City ?? "").trim())
        .filter(Boolean)
    )
  );

  const gradeOptions = Array.from(
    new Set(
      jobs
        .map((j) => String(j.grade ?? j.Grade ?? j.Class ?? "").trim())
        .filter(Boolean)
    )
  );

  // Apply filters (tolerant to any type)
  const filtered = jobs.filter((job) => {
    const jobCity = String(job.city ?? job.City ?? "").toLowerCase();
    const jobSubjects = String(job.subjects ?? job.Subjects ?? job.Subject ?? "").toLowerCase();
    const jobGender = String(job.gender ?? job.Gender ?? "Both").toLowerCase();
    const jobGrade = String(job.grade ?? job.Grade ?? job.Class ?? "").toLowerCase();

    let jobFee = Number(job.fee ?? job.Fee ?? job.Fees);
    if (isNaN(jobFee)) jobFee = 0;

    if (city && jobCity && !jobCity.includes(city.toLowerCase())) return false;
    if (subject && jobSubjects && !jobSubjects.includes(subject.toLowerCase())) return false;
    if (gender && gender !== "Both" && jobGender && !jobGender.includes(gender.toLowerCase())) return false;
    if (grade && jobGrade && !jobGrade.includes(grade.toLowerCase())) return false;
    if (jobFee < feeValue[0] || jobFee > feeValue[1]) return false;

    return true;
  });

  // Visible jobs slice for infinite scroll
  const visibleJobs = filtered.slice(0, Math.min(visibleCount, filtered.length));

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [city, subject, gender, grade, feeValue]);

  // Intersection observer for infinite scroll
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
    if (filtered.length > PAGE_SIZE) {
      const option = { root: null, rootMargin: "200px", threshold: 0.1 };
      const observer = new IntersectionObserver(handleObserver, option);
      if (loaderRef.current) observer.observe(loaderRef.current);
      return () => observer.disconnect();
    }
  }, [handleObserver, filtered.length]);

  const onReset = () => {
    setCity("");
    setSubject("");
    setGender("");
    setGrade("");
    setFeeValue(feeRange);
  };

  // Active filter chips
  const activeFilters = [
    city && { label: `City: ${city}`, key: "city", clear: () => setCity("") },
    subject && { label: `Subject: ${subject}`, key: "subject", clear: () => setSubject("") },
    gender && { label: `Gender: ${gender}`, key: "gender", clear: () => setGender("") },
    grade && { label: `Grade: ${grade}`, key: "grade", clear: () => setGrade("") },
    (feeValue[0] !== feeRange[0] || feeValue[1] !== feeRange[1]) && {
      label: `Fee: ${feeValue[0].toLocaleString()} - ${feeValue[1].toLocaleString()}`,
      key: "fee",
      clear: () => setFeeValue(feeRange),
    },
  ].filter(Boolean);

  return (
    <Box sx={{ background: "#e8f2ff", py: 6, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl">
        <Typography
          component="h1"
          variant="h4"
          align="center"
          fontWeight={700}
          sx={{ mb: 2, color: "#004aad" }}
        >
          Latest Home Tutor Jobs
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 4, color: "#333" }}
        >
          Browse verified home tuition jobs and connect with parents looking for qualified tutors.
        </Typography>

        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            alignItems: "flex-start",
            gap: { md: 3 },
          }}
        >
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

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {activeFilters.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {activeFilters.map((f) => (
                    <Chip
                      key={f.key}
                      label={f.label}
                      onDelete={f.clear}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {loading && <Typography align="center">Loading jobs...</Typography>}
            {!loading && filtered.length === 0 && (
              <Typography align="center" sx={{ mt: 4, color: "gray" }}>
                No jobs found.
              </Typography>
            )}

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(2, minmax(0, 1fr))",
                  xl: "repeat(3, minmax(0, 1fr))",
                },
                alignItems: "stretch",
              }}
            >
              {visibleJobs.map((job, i) => (
                <JobCard key={i} job={job} />
              ))}
            </Box>

            <div ref={loaderRef} style={{ height: 1 }} />

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
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
