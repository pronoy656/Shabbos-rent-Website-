import { api } from "@/lib/api";
import type { ContactPayload, ContactResponse } from "@/types/contact.types";

// ─────────────────────────────────────────────
// Contact Service
// ─────────────────────────────────────────────

/** Send a contact form message */
export const sendContactMessage = (payload: ContactPayload): Promise<ContactResponse> =>
  api.post("/contact", payload).then((res) => res.data);
