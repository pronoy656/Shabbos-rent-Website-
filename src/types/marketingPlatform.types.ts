// ─────────────────────────────────────────────
// Marketing Platform Types
// Based on api-integration/marketing-platform.txt specifications
// ─────────────────────────────────────────────

export interface MarketingPlatform {
  id: string;
  title: string;
  platform: string;
  status: "ACTIVE" | "INACTIVE" | string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    users: number;
  };
}

export interface CreateMarketingPlatformPayload {
  title: string;
  platform: string;
  status: "ACTIVE" | "INACTIVE" | string;
}

export interface UpdateMarketingPlatformPayload {
  title?: string;
  platform?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
}

export interface MarketingPlatformResponse {
  success: boolean;
  message: string;
  data: MarketingPlatform;
}

export interface MarketingPlatformPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface MarketingPlatformListResponse {
  success: boolean;
  message: string;
  meta: MarketingPlatformPaginationMeta;
  data: MarketingPlatform[];
}

export interface ActiveMarketingPlatformsResponse {
  success: boolean;
  message: string;
  data: MarketingPlatform[];
}
