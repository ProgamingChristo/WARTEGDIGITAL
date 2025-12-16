import axios from "axios";
import type { AxiosInstance } from "axios";

const axiosKaryawan: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
});

/* ================= REQUEST ================= */
axiosKaryawan.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenKaryawan");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosKaryawan;
