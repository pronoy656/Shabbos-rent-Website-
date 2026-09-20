// ─────────────────────────────────────────────
// Wishlist Types
// Based on api-integration/wishlist.txt
// ─────────────────────────────────────────────

export interface WishlistItem {
  id: string;
  userId?: string;
  apartmentId: string;
  apartment?: {
    id: string;
    title: string;
    location?: string;
    city?: string;
    image?: string;
    price?: number;
    rating?: number;
    reviews?: number;
    beds?: number;
    baths?: number;
    guests?: number;
    isSwapAvailable?: boolean;
    verified?: boolean;
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  data: WishlistItem[] | any[];
}

export interface ToggleWishlistPayload {
  apartmentId: string;
}

export interface ToggleWishlistResponse {
  success: boolean;
  message: string;
  data?: any;
}
