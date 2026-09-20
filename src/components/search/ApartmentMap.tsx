"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ApartmentData } from "@/types";
import { ApartmentMarker } from "@/types/apartment.types";
import { getImageUrl } from "@/utils/imageUrl";
import "leaflet/dist/leaflet.css";

interface ApartmentMapProps {
  apartments?: ApartmentData[];
  markers?: ApartmentMarker[];
  defaultCity?: string;
  className?: string;
  height?: string;
}

// City coordinates fallback
const CITY_COORDINATES: Record<string, [number, number]> = {
  jerusalem: [31.7767, 35.2345],
  "tel aviv": [32.0853, 34.7818],
  "bnei brak": [32.0849, 34.8352],
  beit_shemesh: [31.747, 34.9881],
  "beit shemesh": [31.747, 34.9881],
  safed: [32.9646, 35.496],
  tzfat: [32.9646, 35.496],
  netanya: [32.3215, 34.8532],
  haifa: [32.794, 34.9896],
  tiberias: [32.7922, 35.5312],
  ashdod: [31.8044, 34.6553],
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
  const markersLayerGroupRef = useRef<any>(null);
  const [selectedApt, setSelectedApt] = useState<any | null>(null);

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
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      const L = (await import("leaflet")).default;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const normCity = (defaultCity || "Jerusalem").toLowerCase().trim();
      const defaultCenter = CITY_COORDINATES[normCity] || CITY_COORDINATES["jerusalem"];

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 13,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        // Add OpenStreetMap Free Tile Layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
        markersLayerGroupRef.current = markersLayer;
      }

      const map = mapInstanceRef.current;
      const markersLayer = markersLayerGroupRef.current;

      if (!map || !markersLayer) return;

      // Clear existing markers
      markersLayer.clearLayers();

      const validLatLngs: [number, number][] = [];

      allMapItems.forEach((item) => {
        if (typeof item.lat !== "number" || typeof item.lng !== "number" || isNaN(item.lat) || isNaN(item.lng)) {
          return;
        }

        validLatLngs.push([item.lat, item.lng]);

        // Custom Map Pin with Home Icon
        const homePinHtml = `
          <div style="
            position: relative;
            width: 38px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            filter: drop-shadow(0 4px 8px rgba(76, 85, 164, 0.4));
          " onmouseover="this.style.transform='scale(1.22) translateY(-4px)';" onmouseout="this.style.transform='scale(1) translateY(0)';" title="${item.title || 'Apartment'}">
            <svg width="38" height="46" viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 0C8.50659 0 0 8.50659 0 19C0 29.5 14.5 42.5 18.15 45.45C18.65 45.85 19.35 45.85 19.85 45.45C23.5 42.5 38 29.5 38 19C38 8.50659 29.4934 0 19 0Z" fill="#4c55a4"/>
              <circle cx="19" cy="18" r="14" fill="#ffffff"/>
              <!-- House / Home Icon -->
              <path d="M19 11L12 16.6V23.5C12 24.05 12.45 24.5 13 24.5H16.5V19.5H21.5V24.5H25C25.55 24.5 26 24.05 26 23.5V16.6L19 11Z" fill="#4c55a4"/>
            </svg>
          </div>
        `;

        const customIcon = L.divIcon({
          className: "custom-map-home-pin",
          html: homePinHtml,
          iconSize: [38, 46],
          iconAnchor: [19, 46],
          popupAnchor: [0, -44],
        });

        const marker = L.marker([item.lat, item.lng], { icon: customIcon });

        // Popup Content (Apartment Preview Card with Image, Name, Price, and View Details Button)
        const imgSrc = item.coverImage ? getImageUrl(item.coverImage) : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80";
        const aptUrl = `/apartments/${item.id || item.propertyId}`;
        const bedrooms = item.bedrooms || 0;
        const bathrooms = item.bathrooms || 0;
        const guests = item.maxGuest || 0;

        const popupContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 236px; border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 12px 28px rgba(0,0,0,0.12); margin: 0; padding: 0; border: 1px solid #e4e4e7;">
            <div style="width: 100%; height: 130px; background: #f4f4f5; position: relative; overflow: hidden;">
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

              <!-- Specs Pills (Beds, Baths, Guests) with Crisp Vector Icons -->
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
                transition: transform 0.15s ease, box-shadow 0.15s ease;
                letter-spacing: 0.2px;
              " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 14px rgba(76, 85, 164, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 10px rgba(76, 85, 164, 0.28)';">
                View Details &rarr;
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 260, className: "custom-leaflet-popup", autoPanPadding: [20, 20] });
        markersLayer.addLayer(marker);
      });

      // Fit bounds if markers exist, otherwise center on city
      if (validLatLngs.length > 1) {
        map.fitBounds(validLatLngs, { padding: [40, 40], maxZoom: 15 });
      } else if (validLatLngs.length === 1) {
        map.setView(validLatLngs[0], 14);
      } else {
        map.setView(defaultCenter, 13);
      }

      // Trigger resize update in case container was hidden/expanded
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    }

    initLeaflet();

    return () => {
      // Don't necessarily destroy to prevent flicker, but cleanup if needed
    };
  }, [allMapItems.length, defaultCity]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm ${className}`}
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {/* Badge showing Free OpenStreetMap notice & count */}
      <div className="absolute top-3 right-3 z-[400] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{allMapItems.length} Map Locations</span>
      </div>
    </div>
  );
}
