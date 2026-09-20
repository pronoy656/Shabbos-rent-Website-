import { useMutation, useQuery } from "@tanstack/react-query";
import { sendContactMessage, getContactMessages } from "@/services/contact.service";
import type {
  ContactPayload,
  SendContactResponse,
  ContactListResponse,
} from "@/types/contact.types";

export const CONTACT_QUERY_KEY = ["contact-messages"];

// ─────────────────────────────────────────────
// Contact Hooks
// ─────────────────────────────────────────────

/** Mutation hook to submit the public contact form */
export const useContactForm = () =>
  useMutation<SendContactResponse, Error, ContactPayload>({
    mutationFn: (payload: ContactPayload) => sendContactMessage(payload),
  });

/** Query hook for Admin to fetch all contact messages */
export const useContactMessages = () => {
  const isAuth =
    typeof window !== "undefined" &&
    Boolean(
      localStorage.getItem("auth_token") || localStorage.getItem("accessToken")
    );

  return useQuery<ContactListResponse>({
    queryKey: CONTACT_QUERY_KEY,
    queryFn: getContactMessages,
    enabled: isAuth,
    staleTime: 2 * 60 * 1000,
  });
};
