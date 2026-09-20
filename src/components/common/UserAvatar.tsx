"use client";

import React, { useState, useEffect } from "react";
import { getImageUrl } from "@/utils/imageUrl";
import { getUserInitials, getAvatarGradient } from "@/utils/userUtils";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  fallbackClassName?: string;
  imageClassName?: string;
  alt?: string;
  defaultInitials?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
  "2xl": "w-24 h-24 text-3xl",
};

export default function UserAvatar({
  src,
  name,
  email,
  size = "sm",
  className = "",
  fallbackClassName = "",
  imageClassName = "",
  alt,
  defaultInitials = "U",
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const resolvedUrl = src ? getImageUrl(src, "") : "";

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const initials = getUserInitials(name, email, defaultInitials);
  const gradientClass = getAvatarGradient(name || email || defaultInitials);
  const sizeClass = sizeClasses[size] || sizeClasses.sm;

  const hasValidImage = Boolean(resolvedUrl && !imageError);

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden select-none border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs ${sizeClass} ${className}`}
    >
      {hasValidImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedUrl}
          alt={alt || name || email || "User Avatar"}
          className={`w-full h-full object-cover ${imageClassName}`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-extrabold tracking-wider ${gradientClass} ${fallbackClassName}`}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
