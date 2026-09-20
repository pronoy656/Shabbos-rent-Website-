import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { submitOffer, getMyOffers, updateOfferStatus } from "@/services/offer.service";
import type { ICreateOfferPayload, IUpdateOfferStatusPayload } from "@/types/apartment.types";

export const OFFERS_KEY = ["my-offers"] as const;

export const useMyOffers = () =>
  useQuery({
    queryKey: OFFERS_KEY,
    queryFn: getMyOffers,
  });

export const useSubmitOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateOfferPayload) => submitOffer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFERS_KEY });
    },
  });
};

export const useUpdateOfferStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateOfferStatusPayload }) =>
      updateOfferStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFERS_KEY });
    },
  });
};
