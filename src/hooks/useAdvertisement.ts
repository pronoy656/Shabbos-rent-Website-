import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdvertisements,
  getAdvertisementById,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  recordAdvertisementClick,
} from "@/services/advertisement.service";
import {
  AdvertisementSearchParams,
  CreateAdvertisementPayload,
  UpdateAdvertisementPayload,
} from "@/types/advertisement.types";

export const ADVERTISEMENT_KEY = ["advertisements"] as const;
export const advertisementDetailKey = (id: string) => ["advertisement", id] as const;

export const useAdvertisements = (params?: AdvertisementSearchParams) =>
  useQuery({
    queryKey: [...ADVERTISEMENT_KEY, params],
    queryFn: () => getAdvertisements(params),
  });

export const useAdvertisement = (id: string) =>
  useQuery({
    queryKey: advertisementDetailKey(id),
    queryFn: () => getAdvertisementById(id),
    enabled: Boolean(id),
  });

export const useCreateAdvertisement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdvertisementPayload | FormData) => createAdvertisement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADVERTISEMENT_KEY });
    },
  });
};

export const useUpdateAdvertisement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdvertisementPayload | FormData }) =>
      updateAdvertisement(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ADVERTISEMENT_KEY });
      queryClient.invalidateQueries({ queryKey: advertisementDetailKey(id) });
    },
  });
};

export const useDeleteAdvertisement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdvertisement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADVERTISEMENT_KEY });
    },
  });
};

export const useRecordAdvertisementClick = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recordAdvertisementClick(id),
    onSuccess: (_, id) => {
      // Invalidate the list so it updates the click count if visible on an admin page
      queryClient.invalidateQueries({ queryKey: ADVERTISEMENT_KEY });
      queryClient.invalidateQueries({ queryKey: advertisementDetailKey(id) });
    },
  });
};
