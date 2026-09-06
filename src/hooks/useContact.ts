import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "@/services/contact.service";
import type { ContactPayload } from "@/types/contact.types";

// ─────────────────────────────────────────────
// Contact Hook
// ─────────────────────────────────────────────

export const useContactForm = () =>
  useMutation({
    mutationFn: (payload: ContactPayload) => sendContactMessage(payload),
  });
