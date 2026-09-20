"use client";

import { useEffect, useRef, useState } from "react";
import { ApartmentData } from "@/types";
import { ApartmentMarker } from "@/types/apartment.types";
import { getImageUrl } from "@/utils/imageUrl";
import { loadGoogleMaps } from "@/utils/googleMapsLoader";
import { Loader2 } from "lucide-react";

interface ApartmentMapProps {
  apartments?: ApartmentData[];
  markers?: ApartmentMarker[];
  defaultCity?: string;
  className?: string;
  height?: string;
}

// City coordinates fallback
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  jerusalem: { lat: 31.7767, lng: 35.2345 },
  "tel aviv": { lat: 32.0853, lng: 34.7818 },
  "bnei brak": { lat: 32.0849, lng: 34.8352 },
  beit_shemesh: { lat: 31.747, lng: 34.9881 },
  "beit shemesh": { lat: 31.747, lng: 34.9881 },
  safed: { lat: 32.9646, lng: 35.496 },
  tzfat: { lat: 32.9646, lng: 35.496 },
  netanya: { lat: 32.3215, lng: 34.8532 },
  haifa: { lat: 32.794, lng: 34.9896 },
  tiberias: { lat: 32.7922, lng: 35.5312 },
  ashdod: { lat: 31.8044, lng: 34.6553 },
};

export default function ApartmentMap({
  apartments = [],
  markers = [],
  defaultCity = "Jerusalem",
  className = "",
  height = "420px",
}: ApartmentMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const activeInfoWindowRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Combine markers from both props
  const allMapItems = [...markers];
  apartments.forEach((apt) => {
    const lat = apt.marker?.lat ?? apt.lat;
    const lng = apt.marker?.lng ?? apt.lng;
    if (lat && lng && !allMapItems.some((m) => m.id === apt.id || m.propertyId === apt.propertyId)) {
      allMapItems.push({
        id: apt.id,
        propertyId: apt.propertyId || apt.id,
        title: apt.title,
        lat,
        lng,
        city: apt.city || defaultCity,
        neighborhood: apt.neighborhood || "",
        street1: apt.street1 || apt.street || "",
        propertyType: apt.propertyType || "APARTMENT",
        bedrooms: apt.bedrooms ?? apt.beds ?? 0,
        bathrooms: apt.bathrooms ?? apt.baths ?? 0,
        maxGuest: apt.maxGuest ?? apt.guests ?? 0,
        pricePerShabbat: apt.pricePerShabbat ?? apt.price ?? 0,
        coverImage: apt.coverImage || apt.image || (apt.images && apt.images[0]),
      });
    }
  });

  useEffect(() => {
    let isCancelled = false;

    async function initGoogleMap() {
      if (!mapContainerRef.current) return;

      try {
        setIsLoading(true);
        const googleMaps = await loadGoogleMaps();
        if (isCancelled || !mapContainerRef.current) return;

        const normCity = (defaultCity || "Jerusalem").toLowerCase().trim();
        const defaultCenter = CITY_COORDINATES[normCity] || CITY_COORDINATES["jerusalem"];

        // Initialize Google Map instance if not created
        if (!mapInstanceRef.current) {
          const map = new googleMaps.Map(mapContainerRef.current, {
            center: defaultCenter,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            gestureHandling: "cooperative",
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "transit",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }],
              },
            ],
          });

          // Close active InfoWindow when map is clicked
          map.addListener("click", () => {
            if (activeInfoWindowRef.current) {
              activeInfoWindowRef.current.close();
              activeInfoWindowRef.current = null;
            }
          });

          mapInstanceRef.current = map;
        }

        const map = mapInstanceRef.current;

        // Clear existing markers
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        // Custom SVG Home Pin icon
        const homePinSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="38" height="46" viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 0C8.50659 0 0 8.50659 0 19C0 29.5 14.5 42.5 18.15 45.45C18.65 45.85 19.35 45.85 19.85 45.45C23.5 42.5 38 29.5 38 19C38 8.50659 29.4934 0 19 0Z" fill="#4c55a4"/>
            <circle cx="19" cy="18" r="14" fill="#ffffff"/>
            <path d="M19 11L12 16.6V23.5C12 24.05 12.45 24.5 13 24.5H16.5V19.5H21.5V24.5H25C25.55 24.5 26 24.05 26 23.5V16.6L19 11Z" fill="#4c55a4"/>
          </svg>
        `)}`;

        const bounds = new googleMaps.LatLngBounds();
        let validMarkerCount = 0;

        allMapItems.forEach((item) => {
          if (typeof item.lat !== "number" || typeof item.lng !== "number" || isNaN(item.lat) || isNaN(item.lng)) {
            return;
          }

          const position = { lat: item.lat, lng: item.lng };
          bounds.extend(position);
          validMarkerCount++;

          const marker = new googleMaps.Marker({
            position,
            map,
            title: item.title || "Apartment",
            icon: {
              url: homePinSvg,
              scaledSize: new googleMaps.Size(38, 46),
              anchor: new googleMaps.Point(19, 46),
            },
          });

          // Popup Content (Apartment Preview Card)
          const imgSrc = item.coverImage ? getImageUrl(item.coverImage) : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80";
          const aptUrl = `/apartments/${item.id || item.propertyId}`;
          const bedrooms = item.bedrooms || 0;
          const bathrooms = item.bathrooms || 0;
          const guests = item.maxGuest || 0;

          const popupContent = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 236px; border-radius: 16px; overflow: hidden; background: #ffffff; margin: 0; padding: 0;">
              <div style="width: 100%; height: 130px; background: #f4f4f5; position: relative; overflow: hidden; border-radius: 14px 14px 0 0;">
                <img src="${imgSrc}" alt="${item.title || 'Apartment'}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80'" />
                ${item.pricePerShabbat ? `
                  <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(24, 24, 27, 0.85); backdrop-filter: blur(6px); color: #ffffff; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);">
                    ₪${item.pricePerShabbat} <span style="font-size: 9px; font-weight: 500; opacity: 0.85;">/ Shabbat</span>
                  </div>
                ` : ''}
                ${item.propertyType ? `
                  <div style="position: absolute; top: 8px; left: 8px; background: rgba(76, 85, 164, 0.9); backdrop-filter: blur(4px); color: #ffffff; font-weight: 800; font-size: 9px; padding: 2px 7px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${item.propertyType}
                  </div>
                ` : ''}
              </div>
              <div style="padding: 12px 12px 10px;">
                <h4 style="margin: 0 0 4px; font-size: 13px; font-weight: 800; color: #18181b; line-height: 1.35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${item.title || "Apartment Listing"}
                </h4>
                <p style="margin: 0 0 10px; font-size: 11px; color: #71717a; display: flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4c55a4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600;">
                    ${item.neighborhood ? `${item.neighborhood}, ` : ""}${item.city || "Jerusalem"}
                  </span>
                </p>

                <!-- Specs Pills (Beds, Baths, Guests) -->
                <div style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap; margin-bottom: 12px;">
                  ${bedrooms > 0 ? `
                    <span style="display: inline-flex; align-items: center; gap: 4px; background: #f4f4f6; color: #3f3f46; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; border: 1px solid #e4e4e7;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4c55a4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
                      ${bedrooms} ${bedrooms === 1 ? 'Bed' : 'Beds'}
                    </span>
                  ` : ''}
                  ${bathrooms > 0 ? `
                    <span style="display: inline-flex; align-items: center; gap: 4px; background: #f4f4f6; color: #3f3f46; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; border: 1px solid #e4e4e7;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4c55a4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.68 3 4 3.68 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><path d="M10 5 8 7"/><path d="M2 12h20"/></svg>
                      ${bathrooms} ${bathrooms === 1 ? 'Bath' : 'Baths'}
                    </span>
                  ` : ''}
                  ${guests > 0 ? `
                    <span style="display: inline-flex; align-items: center; gap: 4px; background: #f4f4f6; color: #3f3f46; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; border: 1px solid #e4e4e7;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4c55a4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      ${guests} Guests
                    </span>
                  ` : ''}
                </div>

                <!-- View Details Action Button -->
                <a href="${aptUrl}" style="
                  display: block;
                  width: 100%;
                  box-sizing: border-box;
                  text-align: center;
                  padding: 8px 12px;
                  background: linear-gradient(135deg, #4c55a4 0%, #3b4382 100%);
                  color: #ffffff;
                  font-size: 11px;
                  font-weight: 800;
                  text-decoration: none;
                  border-radius: 9px;
                  box-shadow: 0 4px 10px rgba(76, 85, 164, 0.28);
                  letter-spacing: 0.2px;
                ">
                  View Details &rarr;
                </a>
              </div>
            </div>
          `;

          const infoWindow = new googleMaps.InfoWindow({
            content: popupContent,
          });

          marker.addListener("click", () => {
            if (activeInfoWindowRef.current) {
              activeInfoWindowRef.current.close();
            }
            infoWindow.open(map, marker);
            activeInfoWindowRef.current = infoWindow;
          });

          markersRef.current.push(marker);
        });

        // Fit bounds or center city
        if (validMarkerCount > 1) {
          map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
        } else if (validMarkerCount === 1) {
          const single = allMapItems.find((i) => typeof i.lat === "number" && typeof i.lng === "number");
          if (single) {
            map.setCenter({ lat: single.lat, lng: single.lng });
            map.setZoom(14);
          }
        } else {
          map.setCenter(defaultCenter);
          map.setZoom(13);
        }

        setIsLoading(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.error("Google Maps load error:", err);
          setLoadError(err.message || "Failed to load Google Maps");
          setIsLoading(false);
        }
      }
    }

    initGoogleMap();

    return () => {
      isCancelled = true;
    };
  }, [allMapItems.length, defaultCity]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm bg-zinc-100 dark:bg-zinc-900 ${className}`}
      style={{ height }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-xs flex items-center justify-center gap-3 text-zinc-500 font-bold text-sm">
          <Loader2 className="w-6 h-6 animate-spin text-[#4c55a4]" />
          <span>Loading Google Map...</span>
        </div>
      )}

      {/* Error Overlay */}
      {loadError && !isLoading && (
        <div className="absolute inset-0 z-10 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center p-6 text-center text-zinc-500">
          <div>
            <p className="font-bold text-zinc-700 dark:text-zinc-300 mb-1">Map Loading Unavailable</p>
            <p className="text-xs text-zinc-400">{loadError}</p>
          </div>
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Badge showing Google Map count */}
      <div className="absolute top-3 right-3 z-[10] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{allMapItems.length} Google Map Locations</span>
      </div>
    </div>
  );
}
