import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // <-- use the live backend from env
});

export default api;
