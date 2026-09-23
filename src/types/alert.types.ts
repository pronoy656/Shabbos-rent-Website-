export enum AlertType {
  INFO = "INFO",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  URGENT = "URGENT",
}

export enum TargetRole {
  USER = "USER",
  AMBASSADOR = "AMBASSADOR",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: AlertType;
  targetRole: TargetRole | null;
  targetUserId: string | null;
  link: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AlertListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Alert[];
}

export interface AlertResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Alert;
}

export interface CreateAlertPayload {
  title: string;
  message: string;
  type: string;
  targetRole?: string | null;
  targetUserId?: string | null;
  link?: string | null;
  isActive?: boolean;
}

export interface UpdateAlertPayload {
  title?: string;
  message?: string;
  type?: string;
  targetRole?: string | null;
  targetUserId?: string | null;
  link?: string | null;
  isActive?: boolean;
}

export interface AlertSearchParams {
  type?: string;
  targetRole?: string;
  isActive?: boolean;
}
