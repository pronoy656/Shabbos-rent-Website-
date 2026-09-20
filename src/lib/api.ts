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
      const token = localStorage.getItem("auth_token") || localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────
// Handles 401 (unauthorized) globally — cleans auth session unless it's a login attempt
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const isAuthRoute =
          window.location.pathname.includes("/login") ||
          window.location.pathname.includes("/signup");
        if (!isAuthRoute) {
          const keysToRemove = [
            "auth_token",
            "accessToken",
            "refreshToken",
            "userRole",
            "authUser",
            "userEmail",
            "userPhone",
            "noEmail",
            "hasUserListing",
            "savedApartments",
          ];
          keysToRemove.forEach((k) => {
            try {
              localStorage.removeItem(k);
            } catch {}
          });
          try {
            sessionStorage.clear();
          } catch {}
          const cookiesToClear = [
            "auth_token",
            "accessToken",
            "refreshToken",
            "userRole",
            "authUser",
          ];
          cookiesToClear.forEach((name) => {
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax`;
          });
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

