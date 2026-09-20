import { api } from "@/lib/api";
import type {
  ContactPayload,
  SendContactResponse,
  ContactListResponse,
} from "@/types/contact.types";

// ─────────────────────────────────────────────
// Contact Service
// Based on api-integration/contact.txt
// ─────────────────────────────────────────────

/** Send a contact form message (Public) */
export const sendContactMessage = (
  payload: ContactPayload
): Promise<SendContactResponse> =>
  api.post("/contact", payload).then((res) => res.data);

/** Get all contact messages (Admin only) */
export const getContactMessages = (): Promise<ContactListResponse> =>
  api.get("/contact").then((res) => res.data);
