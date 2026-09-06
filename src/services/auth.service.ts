import { api } from "@/lib/api";
import type { LoginPayload, RegisterPayload, AuthResponse, User } from "@/types/auth.types";

// ─────────────────────────────────────────────
// Auth Service
// All endpoints will be filled in when API credentials are provided
// ─────────────────────────────────────────────

/** Login with email + password */
export const login = (payload: LoginPayload): Promise<AuthResponse> =>
  api.post("/auth/login", payload).then((res) => res.data);

/** Register new user */
export const register = (payload: RegisterPayload): Promise<AuthResponse> =>
  api.post("/auth/register", payload).then((res) => res.data);

/** Logout current user */
export const logout = (): Promise<void> =>
  api.post("/auth/logout").then((res) => res.data);

/** Get currently authenticated user */
export const getMe = (): Promise<User> =>
  api.get("/auth/me").then((res) => res.data);

/** Admin login */
export const adminLogin = (payload: LoginPayload): Promise<AuthResponse> =>
  api.post("/auth/admin/login", payload).then((res) => res.data);
