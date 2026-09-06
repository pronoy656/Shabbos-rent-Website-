import { useMutation, useQuery } from "@tanstack/react-query";
import { getSettings, updateSettings } from "@/services/admin.service";
import { queryClient } from "@/lib/queryClient";
import type { UpdateSettingsPayload } from "@/types/admin.types";

// ─────────────────────────────────────────────
// Admin Hooks
// ─────────────────────────────────────────────

export const useAdminSettings = () =>
  useQuery({ queryKey: ["admin", "settings"], queryFn: getSettings });

export const useUpdateAdminSettings = () =>
  useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => updateSettings(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
