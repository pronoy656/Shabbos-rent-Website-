import { api } from "@/lib/api";
import type { UserProfile, UpdateProfilePayload } from "@/types/auth.types";

// ─────────────────────────────────────────────
// User Service
// ─────────────────────────────────────────────

/** Get current user's profile */
export const getProfile = (): Promise<UserProfile> =>
  api.get("/user/profile").then((res) => res.data);

/** Update user profile */
export const updateProfile = (payload: UpdateProfilePayload): Promise<UserProfile> =>
  api.put("/user/profile", payload).then((res) => res.data);

/** Save the one-time "rent frequency" answer to the user account */
export const saveRentFrequency = (frequency: string): Promise<void> =>
  api.post("/user/rent-frequency", { frequency }).then((res) => res.data);
