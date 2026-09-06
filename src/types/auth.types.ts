// ─────────────────────────────────────────────
// Auth Types
// Shapes will be confirmed when real API docs are available
// ─────────────────────────────────────────────

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email?: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "owner" | "renter" | "admin";
  createdAt: string;
}

export interface UserProfile extends User {
  rentFrequency?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}
