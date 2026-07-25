export interface Coordinates {
  lat: number;
  lng: number;
}

// Known landmarks and neighborhood coordinates for lookup
const KNOWN_LANDMARKS: Record<string, Coordinates> = {
  "great synagogue": { lat: 31.7766, lng: 35.2173 },
  "kotel": { lat: 31.7767, lng: 35.2345 },
  "western wall": { lat: 31.7767, lng: 35.2345 },
  "rehavia": { lat: 31.7725, lng: 35.2136 },
  "geula": { lat: 31.7878, lng: 35.2170 },
  "meah shearim": { lat: 31.7890, lng: 35.2210 },
  "nachlaot": { lat: 31.7821, lng: 35.2120 },
  "baka": { lat: 31.7580, lng: 35.2215 },
  "talbiya": { lat: 31.7690, lng: 35.2175 },
  "german colony": { lat: 31.7630, lng: 35.2200 },
  "jewish quarter": { lat: 31.7750, lng: 35.2310 },
  "city center": { lat: 31.7810, lng: 35.2200 },
  "tzfat": { lat: 32.9646, lng: 35.4960 },
  "tel aviv": { lat: 32.0853, lng: 34.7818 },
};

export function getCoordinatesForAddress(address: string): Coordinates {
  if (!address || !address.trim()) {
    return { lat: 31.7725, lng: 35.2136 };
  }
  
  const query = address.toLowerCase().trim();
  for (const [key, coords] of Object.entries(KNOWN_LANDMARKS)) {
    if (query.includes(key)) {
      return coords;
    }
  }

  // Deterministic fallback based on text hash for arbitrary custom addresses
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = (hash << 5) - hash + query.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 500) / 100000) - 0.0025;
  const lngOffset = ((Math.abs(hash >> 2) % 500) / 100000) - 0.0025;

  return {
    lat: 31.7725 + latOffset,
    lng: 35.2136 + lngOffset,
  };
}

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function calculateWalkingMinutes(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const distanceKm = calculateDistanceKm(lat1, lon1, lat2, lon2);
  // Average walking speed ~ 4.8 km/h => 1 km takes 12.5 mins
  return Math.max(2, Math.round(distanceKm * 12.5));
}
