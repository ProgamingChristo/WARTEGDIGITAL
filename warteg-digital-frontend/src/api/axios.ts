// src/api/axios.ts
import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  withCredentials: true,
});

/* ======================================================
   REQUEST INTERCEPTOR
   - Admin token HANYA untuk /admin/*
   - Customer token untuk endpoint lain
====================================================== */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const adminToken = localStorage.getItem("tokenAdmin");
    const customerToken = localStorage.getItem("token");

    const isAdminRequest = config.url?.startsWith("/admin");

    let token: string | null = null;

    if (isAdminRequest) {
      token = adminToken;
    } else {
      token = customerToken;
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers) {
      delete config.headers.Authorization;
    }

    return config;
  },
  (err: AxiosError) => Promise.reject(err)
);

/* ======================================================
   RESPONSE INTERCEPTOR
   - Refresh hanya untuk CUSTOMER
   - Admin 401 → logout langsung
====================================================== */
let isRefreshing = false;
let failedQueue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  failedQueue.forEach((cb) => cb(token));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest =
      err.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (err.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(err);
    }

    const isAdminRequest = originalRequest.url?.startsWith("/admin");
    const adminToken = localStorage.getItem("tokenAdmin");

    /* ================= ADMIN ================= */
    if (isAdminRequest && adminToken) {
      localStorage.removeItem("tokenAdmin");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminRole");

      window.location.href = "/admin/login";
      return Promise.reject(err);
    }

    /* ================= CUSTOMER ================= */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push((token) => {
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          } else {
            reject(err);
          }
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        "/auth/refresh",
        {},
        {
          baseURL: api.defaults.baseURL,
          withCredentials: true,
        }
      );

      const { accessToken } = data;
      localStorage.setItem("token", accessToken);
      processQueue(accessToken);

      return api(originalRequest);
    } catch {
      localStorage.removeItem("token");
      processQueue(null);
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
