// ─────────────────────────────────────────────
// Contact Types
// Based on api-integration/contact.txt
// ─────────────────────────────────────────────

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SendContactResponse {
  success: boolean;
  message: string;
  data: ContactMessage;
}

export interface ContactListResponse {
  success: boolean;
  message: string;
  data: ContactMessage[];
}
