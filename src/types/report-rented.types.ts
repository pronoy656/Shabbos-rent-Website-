// ─── Enums ────────────────────────────────────────────────────────────────────
export type ReportType = "RENT" | "SWAP";
export type PaymentMethod = "NEDARIM_PLUS" | "CARD";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

// ─── Populated Entity Sub-Types ───────────────────────────────────────────────
export interface IReportApartmentUser {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  profileImage?: string | null;
}

export interface IReportApartmentSummary {
  id: string;
  propertyId: string | null;
  title: string;
  city: string;
  coverImage: string | null;
  user?: IReportApartmentUser;
}

export interface IReportRentedPayment {
  id: string;
  reportRentedId: string;
  apartmentId: string;
  payerId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  transactionId: string | null;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IReportRentedItem {
  id: string;
  apartmentId: string;
  targetApartmentId: string | null;
  reportType: ReportType;
  weekend: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  apartment: IReportApartmentSummary;
  targetApartment: IReportApartmentSummary | null;
  payment: IReportRentedPayment | null;
  counterpartPayment?: IReportRentedPayment | null; // For SWAP reports
}

// ─── Request Payloads ─────────────────────────────────────────────────────────

// POST /create-intent
export interface ICreateReportRentedIntentPayload {
  apartmentId?: string;       // Optional if user has 1 listing; required if multiple
  reportType?: ReportType;    // "RENT" | "SWAP" (Default: "RENT")
  targetApartmentId?: string; // Required when reportType is "SWAP" (UUID or "apart-001")
  weekend?: string;           // Single weekend ISO date string e.g. "2026-09-26"
  weekends?: string[];        // Multiple weekends array e.g. ["2026-09-26", "2026-10-03"] (RENT only)
}

// POST /:id/pay
export interface IPaySingleReportRentedPayload {
  paymentMethod: PaymentMethod; // "NEDARIM_PLUS" | "CARD"
  transactionId?: string;       // Required for NEDARIM_PLUS verification
}

// POST /pay-all
export interface IPayAllReportRentedDuesPayload {
  paymentMethod: PaymentMethod; // "NEDARIM_PLUS" | "CARD"
  transactionId?: string;       // Required for NEDARIM_PLUS verification
  reportRentedIds?: string[];   // Optional: if omitted, pays all unpaid dues
}

// ─── Response Interfaces ──────────────────────────────────────────────────────

export interface IReportRentedIntentResponse {
  reportRentedId: string;
  paymentId: string;
  reportType: ReportType;
  weekend?: string;
  targetApartment: {
    id: string;
    propertyId: string | null;
    title: string;
    city: string;
  } | null;
  amount: number;             // Usually 50 ILS
  currency: string;           // "ILS"
  paymentStatus: PaymentStatus;
  mosadId: string;
  paymentType: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

export interface IReportRentedStats {
  totalReports: number;
  totalPendingCount: number;
  totalPendingAmount: number;
  totalPaidCount: number;
  totalPaidAmount: number;
  rentReportsCount: number;
  swapReportsCount: number;
  feePerReport: number;
}

export interface IReportRentedDuesSummary {
  totalDueAmount: number;
  unpaidCount: number;
  reportRentedIds: string[];
  reports: IReportRentedItem[];
  feePerReport: number;
  mosadId: string;
}

export interface IPayReportRentedResult {
  success: boolean;
  message: string;
  reportRentedId?: string;
  reportRentedIds?: string[];
  transactionId?: string;
  paidAt: string;
  amount?: number;
  paidCount?: number;
  totalPaidAmount?: number;
  paymentMethod: PaymentMethod;
}

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
