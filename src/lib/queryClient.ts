import { QueryClient } from "@tanstack/react-query";

// ─────────────────────────────────────────────
// Global TanStack Query client configuration
// ─────────────────────────────────────────────
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 1 minute before refetching
      staleTime: 1000 * 60,
      // Retry failed requests up to 2 times
      retry: 2,
      // Refetch on window focus in production
      refetchOnWindowFocus: process.env.NODE_ENV === "production",
    },
    mutations: {
      retry: 0,
    },
  },
});
