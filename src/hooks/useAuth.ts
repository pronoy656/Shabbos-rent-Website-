import { useMutation, useQuery } from "@tanstack/react-query";
import {
  login,
  register,
  logout,
  getMe,
  forgotPassword,
  verifyOtp,
  changePassword,
  saveAuthSession,
  clearAuthSession,
} from "@/services/auth.service";
import { queryClient } from "@/lib/queryClient";
import type {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  VerifyOtpPayload,
  ChangePasswordPayload,
} from "@/types/auth.types";

// ─────────────────────────────────────────────
// Auth Hooks
// ─────────────────────────────────────────────

/** Get the currently authenticated user */
export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled:
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem("auth_token") || localStorage.getItem("accessToken")),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

/** Login mutation (used for all roles: Super Admin, Admin, Owner, Renter) */
export const useLogin = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      queryClient.clear();
      if (data?.data?.accessToken) {
        saveAuthSession({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          user: data.data.user,
        });
      }
      queryClient.invalidateQueries();
    },
  });

/** Register mutation */
export const useRegister = () =>
  useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (data) => {
      if (data?.data) {
        localStorage.setItem("authUser", JSON.stringify(data.data));
      }
    },
  });

/** Forgot Password mutation */
export const useForgotPassword = () =>
  useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  });

/** Verify OTP mutation */
export const useVerifyOtp = () =>
  useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtp(payload),
  });

/** Change / Reset Password mutation */
export const useChangePassword = () =>
  useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });

/** Logout mutation */
export const useLogout = () =>
  useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuthSession();
      queryClient.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
    onError: () => {
      clearAuthSession();
      queryClient.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  });
