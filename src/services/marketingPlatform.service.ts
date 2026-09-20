import { api } from "@/lib/api";
import type {
  MarketingPlatform,
  CreateMarketingPlatformPayload,
  UpdateMarketingPlatformPayload,
  MarketingPlatformResponse,
  MarketingPlatformListResponse,
  ActiveMarketingPlatformsResponse,
} from "@/types/marketingPlatform.types";

// ─────────────────────────────────────────────
// Marketing Platform Service
// Based on api-integration/marketing-platform.txt
// ─────────────────────────────────────────────

/** Create a marketing platform (Admin) */
export const createMarketingPlatform = (
  payload: CreateMarketingPlatformPayload
): Promise<MarketingPlatformResponse> =>
  api.post("/marketing-platform", payload).then((res) => res.data);

/** Get marketing platform by ID */
export const getMarketingPlatformById = (
  id: string
): Promise<MarketingPlatformResponse> =>
  api.get(`/marketing-platform/${id}`).then((res) => res.data);

/** Get all marketing platforms with optional pagination & status filter (Admin / Public) */
export const getMarketingPlatforms = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<MarketingPlatformListResponse> =>
  api
    .get("/marketing-platform", {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        ...(params?.status && params.status !== "ALL" ? { status: params.status } : {}),
      },
    })
    .then((res) => res.data);

/** Update a marketing platform (Admin) */
export const updateMarketingPlatform = (
  id: string,
  payload: UpdateMarketingPlatformPayload
): Promise<MarketingPlatformResponse> =>
  api.patch(`/marketing-platform/${id}`, payload).then((res) => res.data);

/** Delete a marketing platform (Admin) */
export const deleteMarketingPlatform = (
  id: string
): Promise<MarketingPlatformResponse> =>
  api.delete(`/marketing-platform/${id}`).then((res) => res.data);

/** Get active marketing platforms (for Signup dropdown) */
export const getActiveMarketingPlatforms = (): Promise<ActiveMarketingPlatformsResponse> =>
  api.get("/marketing-platform/active").then((res) => res.data);
