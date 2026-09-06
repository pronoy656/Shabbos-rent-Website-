// ─────────────────────────────────────────────
// Contact Types
// ─────────────────────────────────────────────

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}
