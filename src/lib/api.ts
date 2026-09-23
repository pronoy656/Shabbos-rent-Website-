import axios from "axios";

// ─────────────────────────────────────────────
// Axios instance — base URL comes from environment or production default
// Ensures '/api/v1' is always included even if misconfigured in hosting dashboard
// ─────────────────────────────────────────────
export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  let base = envUrl || "https://chaim-backend.onrender.com/api/v1";

  // Remove trailing slashes
  base = base.replace(/\/+$/, "");

  // Ensure /api/v1 suffix is present
  if (!base.endsWith("/api/v1")) {
    base = `${base}/api/v1`;
  }

  return base;
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// ─── Request Interceptor ──────────────────────
// Automatically attaches the auth token to every request and handles FormData
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
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

