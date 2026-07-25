import { LucideIcon } from "lucide-react";

export interface ApartmentData {
  id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  beds: number;
  baths: number;
  guests: number;
  isSwapAvailable: boolean;
  verified: boolean;
  isAvailable?: boolean;
  acceptRequestsWhenUnavailable?: boolean;
  amenities?: string[];
  lat?: number;
  lng?: number;
  address?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  houseNumber?: string;
}

export interface Amenity {
  icon: LucideIcon;
  label: string;
}

export interface AvailableDate {
  id: number;
  date: string;
  day: string;
  reason: string;
}
