import { QueryClient } from "@tanstack/react-query";

// ─────────────────────────────────────────────
// Global TanStack Query client configuration
// ─────────────────────────────────────────────
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data fresh for 3 minutes to avoid redundant network round-trips
      staleTime: 1000 * 60 * 3,
      // Retain cached data in memory for 15 minutes for instant page back/forth navigation
      gcTime: 1000 * 60 * 15,
      // Fast single retry to avoid long hanging requests
      retry: 1,
      // Disable aggressive refetching on window focus to keep UI ultra responsive
      refetchOnWindowFocus: false,
      // Keep background update when reconnecting network
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
