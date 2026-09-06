import axios from "axios";

// ─────────────────────────────────────────────
// Axios instance — base URL comes from .env.local
// NEXT_PUBLIC_API_URL will be set when credentials are available
// ─────────────────────────────────────────────
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ─── Request Interceptor ──────────────────────
// Automatically attaches the auth token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────
// Handles 401 (unauthorized) globally — redirects to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        // Redirect to login — update path if needed
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
