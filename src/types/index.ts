import { LucideIcon } from "lucide-react";

export type OwnerStatus = "available" | "pending" | "unavailable";
export type PublicAvailabilityStatus = "available" | "unavailable_upcoming" | "unavailable";

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
  ownerStatus?: OwnerStatus;
  availabilityStatus?: PublicAvailabilityStatus;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
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
