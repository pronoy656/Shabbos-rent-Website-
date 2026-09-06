import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfile, updateProfile, saveRentFrequency } from "@/services/user.service";
import { queryClient } from "@/lib/queryClient";
import type { UpdateProfilePayload } from "@/types/auth.types";

// ─────────────────────────────────────────────
// User Hooks
// ─────────────────────────────────────────────

export const useProfile = () =>
  useQuery({ queryKey: ["profile"], queryFn: getProfile });

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

export const useSaveRentFrequency = () =>
  useMutation({
    mutationFn: (frequency: string) => saveRentFrequency(frequency),
  });
