// ─────────────────────────────────────────────
// Auth Types
// Based on api-integration/auth.txt specifications
// ─────────────────────────────────────────────

export interface RegisterPayload {
  username: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
  marketingPlatformId?: string;
  role?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

export interface LoginPayload {
  identifier: string; // Email or Phone number (e.g. admin@gmail.com, Anar2@example.com, 0501112233)
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER" | "OWNER" | "RENTER" | string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
  isDeleted?: boolean;
  isVerified?: boolean;
  otp?: string | null;
  otpExpiry?: string | null;
  marketingPlatformId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

export interface ForgotPasswordPayload {
  email?: string;
  identifier?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
    email?: string;
  };
}

export interface VerifyOtpPayload {
  email?: string;
  identifier?: string;
  otp: number | string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
    resetToken?: string;
  };
}

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
  };
}

export interface ResetPasswordPayload {
  newPassword: string;
  confirmNewPassword: string;
  token?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
  };
}

export interface UserProfile extends AuthUser {
  rentFrequency?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}
