export enum AdvertisementPosition {
  HOME_TOP = "HOME_TOP",
  HOME_MIDDLE = "HOME_MIDDLE",
  SIDEBAR = "SIDEBAR",
  FOOTER = "FOOTER",
}

export interface Advertisement {
  id: string;
  companyName: string;
  title: string;
  subtitle?: string;
  image: string;
  url: string;
  position: AdvertisementPosition;
  isActive: boolean;
  clicks: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdvertisementListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Advertisement[];
}

export interface AdvertisementResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Advertisement;
}

export interface CreateAdvertisementPayload {
  companyName: string;
  title: string;
  subtitle?: string;
  url: string;
  position: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateAdvertisementPayload {
  companyName?: string;
  title?: string;
  subtitle?: string;
  url?: string;
  position?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface AdvertisementSearchParams {
  position?: string;
  isActive?: boolean;
}
