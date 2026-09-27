/**
 * Resolves full URL for backend image paths.
 * E.g., "/image/chatgpt-image-..." -> "http://10.10.26.200:5000/image/chatgpt-image-..."
 */
export function getImageUrl(
  imagePath?: any,
  fallback: string = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
): string {
  if (!imagePath) {
    return fallback;
  }

  let rawString = "";
  if (typeof imagePath === "string") {
    rawString = imagePath.trim();
  } else if (typeof imagePath === "object") {
    rawString =
      imagePath.url ||
      imagePath.path ||
      imagePath.src ||
      imagePath.image ||
      imagePath.imageUrl ||
      "";
    if (typeof rawString === "string") {
      rawString = rawString.trim();
    }
  }

  if (!rawString) {
    return fallback;
  }

  // If already a full web URL or data/blob URI
  if (
    rawString.startsWith("http://") ||
    rawString.startsWith("https://") ||
    rawString.startsWith("data:") ||
    rawString.startsWith("blob:")
  ) {
    return rawString;
  }

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://10.10.26.200:8000/api/v1";
  const backendHost =
    process.env.NEXT_PUBLIC_IMAGE_URL ||
    rawApiUrl.replace(/\/api\/v1\/?$/, "") ||
    "http://10.10.26.200:8000";

  const cleanHost = backendHost.replace(/\/+$/, "");

  // Normalize Windows backslashes to forward slashes
  const normalizedPath = rawString.replace(/\\/g, "/");
  const cleanPath = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;

  return `${cleanHost}${cleanPath}`;
}
