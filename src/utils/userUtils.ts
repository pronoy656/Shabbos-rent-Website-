/**
 * Extracts 1-2 character uppercase initials from name/username or email.
 * E.g.
 * - "John Doe" -> "JD"
 * - "Admin" -> "AD"
 * - "Moshe" -> "MO"
 * - "anar" -> "AN"
 * - "a" -> "A"
 * - "admin@shabbosrent.com" -> "AD"
 */
export function getUserInitials(
  name?: string | null,
  email?: string | null,
  defaultInitials: string = "U"
): string {
  const cleanName = (name || "").trim();
  if (cleanName) {
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const first = parts[0][0] || "";
      const second = parts[1][0] || "";
      return (first + second).toUpperCase();
    }
    if (cleanName.length >= 2) {
      return cleanName.slice(0, 2).toUpperCase();
    }
    return cleanName.slice(0, 1).toUpperCase();
  }

  const cleanEmail = (email || "").trim();
  if (cleanEmail) {
    const userPart = cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    if (userPart.length >= 2) {
      return userPart.slice(0, 2).toUpperCase();
    }
    if (userPart.length === 1) {
      return userPart.toUpperCase();
    }
  }

  return defaultInitials.toUpperCase();
}

/**
 * Generates a deterministic pleasant background gradient based on name/email
 */
export function getAvatarGradient(seed?: string | null): string {
  const gradients = [
    "bg-gradient-to-br from-blue-600 to-indigo-700 text-white",
    "bg-gradient-to-br from-indigo-600 to-purple-700 text-white",
    "bg-gradient-to-br from-purple-600 to-pink-600 text-white",
    "bg-gradient-to-br from-teal-600 to-emerald-700 text-white",
    "bg-gradient-to-br from-blue-500 to-cyan-600 text-white",
    "bg-gradient-to-br from-violet-600 to-indigo-600 text-white",
  ];

  if (!seed) return gradients[0];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}
