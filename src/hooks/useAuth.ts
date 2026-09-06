import { useMutation, useQuery } from "@tanstack/react-query";
import { login, logout, getMe, adminLogin } from "@/services/auth.service";
import { queryClient } from "@/lib/queryClient";
import type { LoginPayload } from "@/types/auth.types";

// ─────────────────────────────────────────────
// Auth Hooks
// ─────────────────────────────────────────────

/** Get the currently authenticated user */
export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

/** Login mutation */
export const useLogin = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

/** Admin login mutation */
export const useAdminLogin = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) => adminLogin(payload),
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

/** Logout mutation */
export const useLogout = () =>
  useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      queryClient.clear();
    },
  });
