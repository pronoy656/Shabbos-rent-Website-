import { ToastItem } from "@/components/ui/ToastContainer";

export type ShowToastOptions = Omit<ToastItem, "id">;

/**
 * Global utility function to dispatch toast notifications across the application.
 */
export function showToast(options: ShowToastOptions) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("showToast", {
        detail: options,
      })
    );
  }
}
