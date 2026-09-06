// ─────────────────────────────────────────────
// Listing Types
// ─────────────────────────────────────────────

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  city: string;
  neighborhood?: string;
  coverImage?: string;
  galleryImages?: string[];
  amenities: string[];
  phones: string[];
  email?: string;
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  isAvailable: boolean;
  acceptRequestsWhenUnavailable: boolean;
  status: "pending" | "approved" | "rejected";
  subscriptionActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingPayload {
  title?: string;
  description?: string;
  city?: string;
  neighborhood?: string;
  amenities: string[];
  phones: string[];
  email?: string;
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  isAvailable: boolean;
  acceptRequestsWhenUnavailable: boolean;
  rentFrequency?: string;
}

export type UpdateListingPayload = Partial<CreateListingPayload>;
