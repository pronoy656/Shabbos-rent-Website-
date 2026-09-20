import { LucideIcon } from "lucide-react";

export type OwnerStatus = "available" | "pending" | "unavailable";
export type PublicAvailabilityStatus = "available" | "unavailable_upcoming" | "unavailable";

export interface ApartmentData {
  id: string;
  propertyId?: string;
  userId?: string;
  title: string;
  description?: string;
  location?: string;
  image?: string;
  coverImage?: string;
  images?: string[];
  price?: number;
  pricePerShabbat?: number;
  yomTovPrice?: number;
  specialShabbatPrice?: number;
  rating?: number;
  averageRating?: number;
  reviews?: number | any[];
  totalReviews?: number;
  beds?: number;
  bedrooms?: number;
  baths?: number;
  bathrooms?: number;
  guests?: number;
  maxGuest?: number;
  propertyType?: string;
  isSwapAvailable?: boolean;
  verified?: boolean;
  isAvailable?: boolean;
  acceptRequestsWhenUnavailable?: boolean;
  ownerStatus?: OwnerStatus;
  availabilityStatus?: PublicAvailabilityStatus;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  phoneNumber?: string;
  whatsApp?: string;
  howToContact?: string;
  status?: string;
  amenities?: string[];
  lat?: number;
  lng?: number;
  address?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  street1?: string;
  street2?: string;
  houseNumber?: string;
  user?: any;
  marker?: any;
  availabilities?: any[];
  upcomingAvailability?: any;
  walkingDistanceToNeighborhood?: number | null;
  createdAt?: string;
  updatedAt?: string;
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
