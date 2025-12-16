import axios from "axios";

const axiosKasir = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
});

axiosKasir.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenKasir");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosKasir;
