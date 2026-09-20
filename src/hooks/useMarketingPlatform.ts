import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMarketingPlatform,
  getMarketingPlatforms,
  getMarketingPlatformById,
  updateMarketingPlatform,
  deleteMarketingPlatform,
  getActiveMarketingPlatforms,
} from "@/services/marketingPlatform.service";
import { queryClient } from "@/lib/queryClient";
import type {
  CreateMarketingPlatformPayload,
  UpdateMarketingPlatformPayload,
} from "@/types/marketingPlatform.types";

// ─────────────────────────────────────────────
// Marketing Platform Hooks
// ─────────────────────────────────────────────

/** Get active marketing platforms (used for Signup dropdown) */
export const useActiveMarketingPlatforms = () =>
  useQuery({
    queryKey: ["marketing-platforms", "active"],
    queryFn: getActiveMarketingPlatforms,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 1,
  });

/** Get marketing platforms list for admin */
export const useMarketingPlatforms = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) =>
  useQuery({
    queryKey: ["marketing-platforms", params],
    queryFn: () => getMarketingPlatforms(params),
  });

/** Get single marketing platform by ID */
export const useMarketingPlatform = (id: string) =>
  useQuery({
    queryKey: ["marketing-platform", id],
    queryFn: () => getMarketingPlatformById(id),
    enabled: !!id,
  });

/** Create marketing platform */
export const useCreateMarketingPlatform = () =>
  useMutation({
    mutationFn: (payload: CreateMarketingPlatformPayload) =>
      createMarketingPlatform(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-platforms"] });
    },
  });

/** Update marketing platform */
export const useUpdateMarketingPlatform = () =>
  useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMarketingPlatformPayload;
    }) => updateMarketingPlatform(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-platforms"] });
    },
  });

/** Delete marketing platform */
export const useDeleteMarketingPlatform = () =>
  useMutation({
    mutationFn: (id: string) => deleteMarketingPlatform(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-platforms"] });
    },
  });
