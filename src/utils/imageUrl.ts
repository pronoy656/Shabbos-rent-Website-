/**
 * Resolves full URL for backend image paths.
 * E.g., "/image/chatgpt-image-..." -> "http://10.10.26.200:5000/image/chatgpt-image-..."
 */
export function getImageUrl(
  imagePath?: string | null,
  fallback: string = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
): string {
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) {
    return fallback;
  }

  const trimmed = imagePath.trim();

  // If already a full web URL or data/blob URI
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://chaim-backend.onrender.com/api/v1";
  const backendHost =
    process.env.NEXT_PUBLIC_IMAGE_URL ||
    rawApiUrl.replace(/\/api\/v1\/?$/, "") ||
    "https://chaim-backend.onrender.com";

  const cleanHost = backendHost.replace(/\/+$/, "");
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  return `${cleanHost}${cleanPath}`;
}
