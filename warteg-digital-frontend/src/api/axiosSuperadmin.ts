import axios from "axios";

const axiosSuperadmin = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
});

axiosSuperadmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenSuperadmin");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosSuperadmin;
