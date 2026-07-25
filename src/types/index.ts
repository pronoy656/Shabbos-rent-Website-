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
  amenities?: string[];
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
