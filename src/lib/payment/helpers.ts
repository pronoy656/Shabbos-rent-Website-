import type { PaymentIntent } from "./types";

const NEDARIM_IFRAME_BASE = "https://matara.pro/nedarimplus/iframe";

/**
 * Maps each PaymentIntent type to the corresponding payment record ID.
 */
export function getPaymentRecordId(intent: PaymentIntent): string {
  if (intent.paymentType === "APARTMENT_LISTING") {
    return intent.listingPaymentId || (intent as any).apartmentId || "";
  }
  if (intent.paymentType === "SWAP_REQUEST") {
    return intent.swapPaymentId;
  }
  return intent.reportRentedPaymentId;
}

/**
 * Builds the Nedarim Plus hosted payment iframe URL.
 * URL: https://matara.pro/nedarimplus/iframe?mosad={MOSAD_ID}&Amount={AMOUNT}&ClientName={CLIENT_NAME}&Mail={EMAIL}&Phone={PHONE}&Currency=1&Param1={APARTMENT_ID}
 */
export function buildNedarimIframeUrl(intent: PaymentIntent): string {
  const apartmentOrRecordId = (intent as any).apartmentId || getPaymentRecordId(intent);
  const mosadId = intent.mosadId || process.env.NEXT_PUBLIC_NEDARIM_MOSAD_ID || "7001234";
  const amount = intent.amount || 28;
  const clientName = intent.clientName || "";
  const clientEmail = intent.clientEmail || "";
  const clientPhone = intent.clientPhone || "";

  const params = new URLSearchParams({
    mosad: String(mosadId),
    Amount: String(amount),
    ClientName: clientName,
    Mail: clientEmail,
    Phone: clientPhone,
    Currency: "1", // 1 = ILS
    Param1: String(apartmentOrRecordId || ""),
  });

  return `${NEDARIM_IFRAME_BASE}?${params.toString()}`;
}

/**
 * Extracts the transactionId from a Nedarim postMessage event payload.
 */
export function extractTransactionId(data: any): string | null {
  if (!data) return null;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      // If data is a plain string transaction ID
      if (data.length > 3 && !data.includes("{")) return data;
    }
  }
  if (typeof data !== "object") return null;

  const candidate =
    data.TransactionId ??
    data.transactionId ??
    data.ConfirmationNo ??
    data.confirmationNo ??
    data.TransId ??
    data.transId ??
    data.ConfirmationCode ??
    data.confirmationCode ??
    data.txId ??
    null;

  return candidate ? String(candidate) : null;
}

/**
 * Returns true if the postMessage origin is from matara.pro (Nedarim domain).
 */
export function isNedarimOrigin(origin: string): boolean {
  return origin === "" || origin.includes("matara.pro") || origin.includes("localhost");
}

/**
 * Formats ILS amount as a display string.
 */
export function formatILS(amount: number): string {
  return `₪${amount.toFixed(0)}`;
}
