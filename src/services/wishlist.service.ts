import { api } from "@/lib/api";
import type {
  WishlistResponse,
  ToggleWishlistPayload,
  ToggleWishlistResponse,
} from "@/types/wishlist.types";

// ─────────────────────────────────────────────
// Wishlist Service
// Based on api-integration/wishlist.txt
// ─────────────────────────────────────────────

/** Retrieve the current authenticated user's wishlist */
export const getMyWishlist = (): Promise<WishlistResponse> =>
  api.get("/wishlist/my-wishlist").then((res) => res.data);

/** Toggle an apartment in the user's wishlist (adds if absent, removes if present) */
export const toggleWishlist = (
  payload: ToggleWishlistPayload
): Promise<ToggleWishlistResponse> =>
  api.post("/wishlist/toggle", payload).then((res) => res.data);
