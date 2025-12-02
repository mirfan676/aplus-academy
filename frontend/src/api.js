import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// -------------------
// FETCH JOBS
// -------------------
export const fetchJobs = async () => {
  try {
    const res = await api.get("/jobs");
    return res.data.jobs || [];
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return [];
  }
};

export default api;
