import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type {
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  RegisterResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  AuthUser,
} from "@/types/auth.types";

// ─────────────────────────────────────────────
// Auth Service
// Based on api-integration/auth.txt
// ─────────────────────────────────────────────

/** Helper to save auth tokens in both localStorage and cookies */
export const saveAuthSession = (data: {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser;
}) => {
  if (typeof window === "undefined") return;

  // Clear query cache to prevent stale data from previous user
  try {
    queryClient.clear();
  } catch {}

  const { accessToken, refreshToken, user } = data;
  const role =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" ? "admin" : "user";

  // Local Storage
  localStorage.setItem("auth_token", accessToken);
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("userRole", role);
  if (user) localStorage.setItem("authUser", JSON.stringify(user));

  // Cookies for Next.js Middleware and SSR
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  document.cookie = `auth_token=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `accessToken=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  if (refreshToken) {
    document.cookie = `refreshToken=${encodeURIComponent(refreshToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
  document.cookie = `userRole=${encodeURIComponent(role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  if (user) {
    document.cookie = `authUser=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }

  try {
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("savedApartmentsChanged"));
  } catch {}
};

/** Synchronously clear all auth tokens, roles, and cookies immediately */
export const clearAuthSession = () => {
  if (typeof window === "undefined") return;

  // Clear TanStack Query Cache
  try {
    queryClient.clear();
    sessionStorage.removeItem("hasSeenWelcomeGuide");
  } catch {}

  // List of user-specific keys to remove
  const userKeysToRemove = [
    "auth_token",
    "accessToken",
    "refreshToken",
    "userRole",
    "authUser",
    "userEmail",
    "userPhone",
    "noEmail",
    "hasUserListing",
    "termsAccepted",
    "termsAcceptedAt",
    "emailOptIn",
    "emailOptInAt",
    "referralSource",
    "emailBookings",
    "emailPromos",
    "emailNewsletter",
    "selectedShabbatot",
    "specialShabbatot",
    "isApartmentVisible",
    "createdListingDate",
    "phoneCommState",
    "notify_me_requests",
    "apartment_offers",
    "reported_rentals",
    "user_booking_history",
  ];
  
  userKeysToRemove.forEach((key) => localStorage.removeItem(key));

  // Clear cookies
  document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "userRole=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "authUser=; path=/; max-age=0; SameSite=Lax";

  try {
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("savedApartmentsChanged"));
  } catch {}
};

/** Login with identifier (email/phone) + password — used by Admin, Owner, and Renter */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", payload);
  const data = res.data;
  if (data?.data?.accessToken) {
    saveAuthSession({
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      user: data.data.user,
    });
  }
  return data;
};

/** Register new user (Renter / Owner) */
export const register = (payload: RegisterPayload): Promise<RegisterResponse> =>
  api.post("/auth/register", payload).then((res) => res.data);

/** Send OTP for password recovery */
export const forgotPassword = (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> =>
  api.post("/auth/forgot-password", payload).then((res) => res.data);

/** Verify OTP sent to user email */
export const verifyOtp = (
  payload: VerifyOtpPayload
): Promise<VerifyOtpResponse> =>
  api.post("/auth/verify-otp", payload).then((res) => res.data);

/** Change Password (Logged in users) */
export const changePassword = (
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> =>
  api.post("/auth/change-password", payload).then((res) => res.data);

/** Reset Password (via email token) */
export const resetPassword = (
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  // If token is in the payload body, you can pass it, or you can configure headers if required.
  // The backend accepts it in the body based on the guide (`token` field).
  return api.post("/auth/reset-password", payload).then((res) => res.data);
};

/** Logout current user — immediately wipes tokens & cookies and calls backend */
export const logout = async (): Promise<void> => {
  clearAuthSession();
  try {
    await api.post("/auth/logout");
  } catch {
    // Ignore network / unreachable backend error on logout
  }
};

/** Get currently authenticated user */
export const getMe = async (): Promise<AuthUser> => {
  const res = await api.get("/auth/me");
  const user: AuthUser = res.data?.data || res.data;
  if (user && typeof window !== "undefined") {
    try {
      localStorage.setItem("authUser", JSON.stringify(user));
      if (user.role) {
        const role =
          user.role === "SUPER_ADMIN" || user.role === "ADMIN" ? "admin" : "user";
        localStorage.setItem("userRole", role);
      }
    } catch {}
  }
  return user;
};
