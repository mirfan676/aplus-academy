import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://aplus-academy.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Named export
export const fetchJobs = async () => {
  const response = await api.get("/jobs"); 
  return response.data;
};

export default api;
