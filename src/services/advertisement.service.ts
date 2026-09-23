import { api } from "@/lib/api";
import {
  AdvertisementListResponse,
  AdvertisementResponse,
  AdvertisementSearchParams,
  CreateAdvertisementPayload,
  UpdateAdvertisementPayload,
} from "@/types/advertisement.types";

export const getAdvertisements = async (
  params?: AdvertisementSearchParams
): Promise<AdvertisementListResponse> => {
  const res = await api.get<AdvertisementListResponse>("/advertisement", { params });
  return res.data;
};

export const getAdvertisementById = async (
  id: string
): Promise<AdvertisementResponse> => {
  const res = await api.get<AdvertisementResponse>(`/advertisement/${id}`);
  return res.data;
};

export const createAdvertisement = async (
  data: CreateAdvertisementPayload | FormData
): Promise<AdvertisementResponse> => {
  const res = await api.post<AdvertisementResponse>("/advertisement", data);
  return res.data;
};

export const updateAdvertisement = async (
  id: string,
  data: UpdateAdvertisementPayload | FormData
): Promise<AdvertisementResponse> => {
  const res = await api.patch<AdvertisementResponse>(`/advertisement/${id}`, data);
  return res.data;
};

export const deleteAdvertisement = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete<{ success: boolean; message: string }>(
    `/advertisement/${id}`
  );
  return res.data;
};

export const recordAdvertisementClick = async (
  id: string
): Promise<{ success: boolean; message: string; data: { id: string; clicks: number } }> => {
  const res = await api.post<{ success: boolean; message: string; data: { id: string; clicks: number } }>(
    `/advertisement/${id}/click`
  );
  return res.data;
};
