import axios from "axios";

const axiosDapur = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
});

axiosDapur.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenDapur");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosDapur;
