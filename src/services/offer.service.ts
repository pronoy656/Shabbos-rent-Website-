import { api } from "@/lib/api";
import type {
  ICreateOfferPayload,
  IUpdateOfferStatusPayload,
  IMyOffersResponse,
  IOffer,
  IApiResponse,
} from "@/types/apartment.types";

const BASE_URL = "/offer";

export const submitOffer = async (payload: ICreateOfferPayload): Promise<IOffer> => {
  const res = await api.post<IApiResponse<IOffer>>(`${BASE_URL}/`, payload);
  return res.data.data;
};

export const getMyOffers = async (): Promise<IMyOffersResponse> => {
  const res = await api.get<IApiResponse<IMyOffersResponse>>(`${BASE_URL}/my-offers`);
  return res.data.data;
};

export const updateOfferStatus = async (
  id: string,
  payload: IUpdateOfferStatusPayload
): Promise<IOffer> => {
  const res = await api.patch<IApiResponse<IOffer>>(`${BASE_URL}/status/${id}`, payload);
  return res.data.data;
};
