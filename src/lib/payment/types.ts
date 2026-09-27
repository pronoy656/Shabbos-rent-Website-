export type PaymentType =
  | "APARTMENT_LISTING"
  | "SWAP_REQUEST"
  | "REPORT_RENTED";

export interface ListingPaymentIntent {
  mosadId: string;
  amount: number;
  currency: string;
  paymentType: "APARTMENT_LISTING";
  listingPaymentId: string;
  apartmentId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  validityDuration?: string;
}

export interface SwapPaymentIntent {
  mosadId: string;
  amount: number;
  currency: string;
  paymentType: "SWAP_REQUEST";
  swapPaymentId: string;
  swapId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

export interface ReportRentedPaymentIntent {
  mosadId: string;
  amount: number;
  currency: string;
  paymentType: "REPORT_RENTED";
  reportRentedPaymentId: string;
  reportRentedId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

export type PaymentIntent =
  | ListingPaymentIntent
  | SwapPaymentIntent
  | ReportRentedPaymentIntent;

export interface VerifyPayload {
  transactionId: string;
  paymentType: PaymentType;
  paymentRecordId: string;
  apartmentId?: string;
  swapId?: string;
  reportRentedId?: string;
}

export interface VerifyResult {
  success: boolean;
  message: string;
  transactionId?: string;
  apartmentId?: string;
  swapId?: string;
  reportRentedId?: string;
  paidAt?: string;
  expiresAt?: string;
}

export interface ListingStatus {
  isPaid: boolean;
  isExpired: boolean;
  isActive: boolean;
  daysRemaining: number | null;
  expiresAt: string | null;
  paidAt: string | null;
}

export interface ListingFeeStatus {
  standardFee: number;
  isOnSale: boolean;
  effectiveFee: number;
  currency: string;
}

export interface FreeActivationResponse {
  success: boolean;
  message: string;
  apartmentId: string;
  expiresAt: string;
}
