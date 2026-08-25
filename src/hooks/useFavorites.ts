"use client";

import { useState, useEffect, useCallback } from "react";
import { ApartmentData } from "@/types";
import { mockBaseApartments, mockApartments } from "@/data/mockData";
import { showToast } from "@/utils/toast";

const STORAGE_KEY = "savedApartments";
const EVENT_NAME = "savedApartmentsChanged";

function getAllAvailableApartments(): ApartmentData[] {
  return [...mockBaseApartments, ...mockApartments];
}

function resolveApartment(id: string, allApts: ApartmentData[]): ApartmentData {
  const found = allApts.find((a) => a.id === id);
  if (found) return found;

  if (id === "dummy") {
    return {
      id: "dummy",
      title: "Bright luxury apartment in city center",
      location: "City Center, Jerusalem",
      city: "Jerusalem",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      price: 1500,
      rating: 5.0,
      reviews: 0,
      beds: 4,
      baths: 2,
      guests: 8,
      isSwapAvailable: true,
      verified: false,
    };
  }

  return {
    id,
    title: `Saved Apartment #${id}`,
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

export function useFavorites() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedApartments, setSavedApartments] = useState<ApartmentData[]>([]);

  const reloadFavorites = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const ids: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setSavedIds(ids);

      const allApts = getAllAvailableApartments();
      const seen = new Set<string>();
      const matched: ApartmentData[] = [];

      for (const id of ids) {
        if (seen.has(id)) continue;
        seen.add(id);
        matched.push(resolveApartment(id, allApts));
      }

      setSavedApartments(matched);
    } catch (err) {
      console.error("Failed to parse savedApartments from localStorage", err);
    }
  }, []);

  useEffect(() => {
    reloadFavorites();

    if (typeof window !== "undefined") {
      window.addEventListener(EVENT_NAME, reloadFavorites);
      return () => window.removeEventListener(EVENT_NAME, reloadFavorites);
    }
  }, [reloadFavorites]);

  const isSaved = useCallback(
    (id: string) => {
      if (typeof window === "undefined") return false;
      const userRole = localStorage.getItem("userRole");
      if (!userRole) return false;
      return savedIds.includes(id);
    },
    [savedIds]
  );

  const toggleFavorite = useCallback(
    (apartment: { id: string; title: string; image: string }) => {
      if (typeof window === "undefined") return;

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

      const currentIds: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const wasSaved = currentIds.includes(apartment.id);
      let newIds: string[];

      if (wasSaved) {
        newIds = currentIds.filter((id) => id !== apartment.id);
      } else {
        newIds = [...currentIds, apartment.id];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      window.dispatchEvent(new Event(EVENT_NAME));

      showToast({
        title: !wasSaved ? "Added to Favorites ❤️" : "Removed from Favorites 🤍",
        message: !wasSaved
          ? `"${apartment.title}" saved to your favorites.`
          : `"${apartment.title}" removed from favorites.`,
        type: !wasSaved ? "favorite" : "unfavorite",
        apartmentImage: apartment.image,
      });
    },
    []
  );

  const removeFavorite = useCallback(
    (id: string, title?: string) => {
      if (typeof window === "undefined") return;

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

      const currentIds: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const newIds = currentIds.filter((item) => item !== id);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      window.dispatchEvent(new Event(EVENT_NAME));

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
