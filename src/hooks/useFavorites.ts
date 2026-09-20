"use client";

import { useState, useEffect, useCallback } from "react";
import { ApartmentData } from "@/types";
import { mockBaseApartments, mockApartments } from "@/data/mockData";
import { showToast } from "@/utils/toast";
import { toggleWishlist, getMyWishlist } from "@/services/wishlist.service";
import { getImageUrl } from "@/utils/imageUrl";

const STORAGE_KEY = "savedApartments";
const DATA_STORAGE_KEY = "savedApartmentsData";
const EVENT_NAME = "savedApartmentsChanged";

// Global in-flight promise to prevent concurrent identical requests across multiple hook mounts
let inFlightWishlistPromise: Promise<any> | null = null;
let lastWishlistFetchTime = 0;

function getAllAvailableApartments(): ApartmentData[] {
  return [...mockBaseApartments, ...mockApartments];
}

function getStoredApartmentDataMap(): Record<string, Partial<ApartmentData>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DATA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStoredApartmentDataMap(dataMap: Record<string, Partial<ApartmentData>>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(dataMap));
  } catch {}
}

function resolveApartment(
  id: string,
  allApts: ApartmentData[],
  cachedMap: Record<string, Partial<ApartmentData>>
): ApartmentData {
  // 1. Check if we have cached live data for this apartment
  if (cachedMap[id]) {
    const c = cachedMap[id];
    return {
      id,
      title: c.title || `Apartment #${id}`,
      location: c.location || c.city || "Jerusalem",
      city: c.city || "Jerusalem",
      image: c.image || c.coverImage || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      price: c.price ?? c.pricePerShabbat ?? 2500,
      rating: c.rating || 5.0,
      reviews: c.reviews || 0,
      beds: c.beds ?? c.bedrooms ?? 3,
      baths: c.baths ?? c.bathrooms ?? 2,
      guests: c.guests ?? c.maxGuest ?? 6,
      isSwapAvailable: c.isSwapAvailable ?? true,
      verified: c.verified ?? true,
    };
  }

  // 2. Check in static/mock apartments
  const found = allApts.find((a) => a.id === id);
  if (found) return found;

  // 3. Fallback apartment object
  return {
    id,
    title: `Apartment #${id}`,
    location: "Jerusalem",
    city: "Jerusalem",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    price: 2500,
    rating: 4.8,
    reviews: 12,
    beds: 3,
    baths: 2,
    guests: 6,
    isSwapAvailable: true,
    verified: true,
  };
}

function getCleanStoredIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Ensure all entries are unique non-empty strings
    const uniqueIds = Array.from(
      new Set(
        parsed
          .map((item) => (typeof item === "string" ? item.trim() : item?.id ? String(item.id).trim() : ""))
          .filter((id) => Boolean(id) && id !== "[object Object]" && id !== "undefined" && id !== "null")
      )
    );
    return uniqueIds;
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedApartments, setSavedApartments] = useState<ApartmentData[]>([]);

  const reloadFavorites = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const cleanIds = getCleanStoredIds();
      setSavedIds(cleanIds);

      const allApts = getAllAvailableApartments();
      const cachedMap = getStoredApartmentDataMap();
      const seen = new Set<string>();
      const matched: ApartmentData[] = [];

      for (const id of cleanIds) {
        if (seen.has(id)) continue;
        seen.add(id);
        matched.push(resolveApartment(id, allApts, cachedMap));
      }

      setSavedApartments(matched);
    } catch (err) {
      console.error("Failed to parse savedApartments from localStorage", err);
    }
  }, []);

  useEffect(() => {
    reloadFavorites();

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("auth_token") || localStorage.getItem("accessToken")
        : null;

    const now = Date.now();
    // Cache backend sync for 10 seconds to avoid multi-component request flooding
    if (token && now - lastWishlistFetchTime > 10000) {
      if (!inFlightWishlistPromise) {
        lastWishlistFetchTime = now;
        inFlightWishlistPromise = getMyWishlist()
          .then((res: any) => {
            const dataArray = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.data) ? res.data.data : null));
            if (dataArray) {
              const cachedMap = getStoredApartmentDataMap();
              const apiIds: string[] = [];

              dataArray.forEach((item: any) => {
                const aptId = item?.apartmentId || item?.apartment?.id || (typeof item === "string" ? item : item?.id);
                if (aptId && typeof aptId === "string" && aptId.trim() !== "") {
                  const cleanId = aptId.trim();
                  apiIds.push(cleanId);

                  // If full apartment data is provided in wishlist response, cache it
                  if (item?.apartment && typeof item.apartment === "object") {
                    const apt = item.apartment;
                    cachedMap[cleanId] = {
                      id: cleanId,
                      title: apt.title || cachedMap[cleanId]?.title,
                      city: apt.city || cachedMap[cleanId]?.city,
                      location: apt.location || apt.neighborhood || cachedMap[cleanId]?.location,
                      image: apt.coverImage ? getImageUrl(apt.coverImage) : (apt.image || cachedMap[cleanId]?.image),
                      price: apt.pricePerShabbat ?? apt.price ?? cachedMap[cleanId]?.price,
                      beds: apt.bedrooms ?? apt.beds ?? cachedMap[cleanId]?.beds,
                      baths: apt.bathrooms ?? apt.baths ?? cachedMap[cleanId]?.baths,
                      guests: apt.maxGuest ?? apt.guests ?? cachedMap[cleanId]?.guests,
                      verified: apt.verified ?? cachedMap[cleanId]?.verified,
                    };
                  }
                }
              });

              setStoredApartmentDataMap(cachedMap);

              const currentIds = getCleanStoredIds();
              const merged = Array.from(new Set([...currentIds, ...apiIds]));
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              reloadFavorites();
            }
          })
          .catch(() => {
            // Silently maintain local storage state
          })
          .finally(() => {
            inFlightWishlistPromise = null;
          });
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener(EVENT_NAME, reloadFavorites);
      return () => window.removeEventListener(EVENT_NAME, reloadFavorites);
    }
  }, [reloadFavorites]);

  const isSaved = useCallback(
    (id: string) => {
      if (typeof window === "undefined" || !id) return false;
      const userRole = localStorage.getItem("userRole");
      if (!userRole) return false;
      return savedIds.includes(id);
    },
    [savedIds]
  );

  const toggleFavorite = useCallback(
    (apartment: {
      id: string;
      title?: string;
      image?: string;
      coverImage?: string;
      price?: number;
      pricePerShabbat?: number;
      city?: string;
      location?: string;
      beds?: number;
      bedrooms?: number;
      baths?: number;
      bathrooms?: number;
      guests?: number;
      maxGuest?: number;
    }) => {
      if (typeof window === "undefined" || !apartment?.id) return;

      const userRole = localStorage.getItem("userRole");
      if (!userRole) {
        showToast({
          title: "Login Required 🔒",
          message: "Please log in to add or remove favorites.",
          type: "unfavorite",
        });
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
      }

      const targetId = apartment.id.trim();
      const currentIds = getCleanStoredIds();
      const wasSaved = currentIds.includes(targetId);
      let newIds: string[];

      if (wasSaved) {
        newIds = currentIds.filter((id) => id !== targetId);
      } else {
        // Strict deduplication using Set
        newIds = Array.from(new Set([...currentIds, targetId]));

        // Cache rich apartment details for dropdown & offline state
        const cachedMap = getStoredApartmentDataMap();
        cachedMap[targetId] = {
          id: targetId,
          title: apartment.title || cachedMap[targetId]?.title,
          image: apartment.image || (apartment.coverImage ? getImageUrl(apartment.coverImage) : cachedMap[targetId]?.image),
          price: apartment.price ?? apartment.pricePerShabbat ?? cachedMap[targetId]?.price,
          city: apartment.city || cachedMap[targetId]?.city,
          location: apartment.location || cachedMap[targetId]?.location,
          beds: apartment.beds ?? apartment.bedrooms ?? cachedMap[targetId]?.beds,
          baths: apartment.baths ?? apartment.bathrooms ?? cachedMap[targetId]?.baths,
          guests: apartment.guests ?? apartment.maxGuest ?? cachedMap[targetId]?.guests,
        };
        setStoredApartmentDataMap(cachedMap);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      window.dispatchEvent(new Event(EVENT_NAME));

      // Call backend toggle wishlist API
      toggleWishlist({ apartmentId: targetId }).catch((err) => {
        console.warn("Wishlist toggle API sync:", err);
      });

      const displayTitle = apartment.title || "Apartment";
      showToast({
        title: !wasSaved ? "Added to Favorites ❤️" : "Removed from Favorites 🤍",
        message: !wasSaved
          ? `"${displayTitle}" saved to your favorites.`
          : `"${displayTitle}" removed from favorites.`,
        type: !wasSaved ? "favorite" : "unfavorite",
        apartmentImage: apartment.image || (apartment.coverImage ? getImageUrl(apartment.coverImage) : undefined),
      });
    },
    []
  );

  const removeFavorite = useCallback(
    (id: string, title?: string) => {
      if (typeof window === "undefined" || !id) return;

      const userRole = localStorage.getItem("userRole");
      if (!userRole) {
        showToast({
          title: "Login Required 🔒",
          message: "Please log in to manage favorites.",
          type: "unfavorite",
        });
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
      }

      const targetId = id.trim();
      const currentIds = getCleanStoredIds();
      const newIds = currentIds.filter((item) => item !== targetId);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      window.dispatchEvent(new Event(EVENT_NAME));

      // Call backend toggle wishlist API to deselect
      toggleWishlist({ apartmentId: targetId }).catch((err) => {
        console.warn("Wishlist remove API sync:", err);
      });

      showToast({
        title: "Removed from Favorites 🤍",
        message: title ? `"${title}" was removed from your favorites.` : "Apartment removed from favorites.",
        type: "unfavorite",
      });
    },
    []
  );

  return {
    savedIds,
    savedApartments,
    savedCount: savedApartments.length,
    isSaved,
    toggleFavorite,
    removeFavorite,
    reloadFavorites,
  };
}

