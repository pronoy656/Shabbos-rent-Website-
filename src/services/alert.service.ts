import { api } from "@/lib/api";
import {
  AlertListResponse,
  AlertResponse,
  AlertSearchParams,
  CreateAlertPayload,
  UpdateAlertPayload,
} from "@/types/alert.types";

export const getAlerts = async (
  params?: AlertSearchParams
): Promise<AlertListResponse> => {
  const res = await api.get<AlertListResponse>("/alert", { params });
  return res.data;
};

export const getMyAlerts = async (): Promise<AlertListResponse> => {
  const res = await api.get<AlertListResponse>("/alert/my-alerts");
  return res.data;
};

export const markAllAlertsAsRead = async (): Promise<{ success: boolean; message: string; count: number }> => {
  const res = await api.patch<{ success: boolean; message: string; count: number }>("/alert/mark-all-read");
  return res.data;
};

export const createAlert = async (
  data: CreateAlertPayload
): Promise<AlertResponse> => {
  const res = await api.post<AlertResponse>("/alert", data);
  return res.data;
};

export const updateAlert = async (
  id: string,
  data: UpdateAlertPayload
): Promise<AlertResponse> => {
  const res = await api.patch<AlertResponse>(`/alert/${id}`, data);
  return res.data;
};

export const deleteAlert = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete<{ success: boolean; message: string }>(
    `/alert/${id}`
  );
  return res.data;
};
