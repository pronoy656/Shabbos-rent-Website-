import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getListings,
  getListingById,
  getMyListings,
  createListing,
  updateListing,
  deleteListing,
} from "@/services/listing.service";
import { queryClient } from "@/lib/queryClient";
import type { CreateListingPayload, UpdateListingPayload } from "@/types/listing.types";

// ─────────────────────────────────────────────
// Listing Hooks
// ─────────────────────────────────────────────

export const useListings = () =>
  useQuery({ queryKey: ["listings"], queryFn: getListings });

export const useListingById = (id: string) =>
  useQuery({ queryKey: ["listings", id], queryFn: () => getListingById(id), enabled: !!id });

export const useMyListings = () =>
  useQuery({ queryKey: ["listings", "my"], queryFn: getMyListings });

export const useCreateListing = () =>
  useMutation({
    mutationFn: (payload: CreateListingPayload) => createListing(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listings"] }),
  });

export const useUpdateListing = (id: string) =>
  useMutation({
    mutationFn: (payload: UpdateListingPayload) => updateListing(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listings"] }),
  });

export const useDeleteListing = () =>
  useMutation({
    mutationFn: (id: string) => deleteListing(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listings"] }),
  });
