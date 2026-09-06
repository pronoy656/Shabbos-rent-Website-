import { api } from "@/lib/api";
import type { Listing, CreateListingPayload, UpdateListingPayload } from "@/types/listing.types";

// ─────────────────────────────────────────────
// Listing Service
// All endpoints will be filled in when API credentials are provided
// ─────────────────────────────────────────────

/** Get all apartment listings */
export const getListings = (): Promise<Listing[]> =>
  api.get("/listings").then((res) => res.data);

/** Get a single listing by ID */
export const getListingById = (id: string): Promise<Listing> =>
  api.get(`/listings/${id}`).then((res) => res.data);

/** Get listings belonging to the authenticated owner */
export const getMyListings = (): Promise<Listing[]> =>
  api.get("/listings/my").then((res) => res.data);

/** Create a new listing */
export const createListing = (payload: CreateListingPayload): Promise<Listing> =>
  api.post("/listings", payload).then((res) => res.data);

/** Update an existing listing */
export const updateListing = (id: string, payload: UpdateListingPayload): Promise<Listing> =>
  api.put(`/listings/${id}`, payload).then((res) => res.data);

/** Delete a listing */
export const deleteListing = (id: string): Promise<void> =>
  api.delete(`/listings/${id}`).then((res) => res.data);
