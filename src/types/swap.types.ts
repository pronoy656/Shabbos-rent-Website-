export type SwapStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";

export enum PropertyType {
  APARTMENT = "APARTMENT",
  VILLA = "VILLA",
  PENTHOUSE = "PENTHOUSE",
  STUDIO = "STUDIO",
}

export enum ApartmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
  BLOCKED = "BLOCKED",
}

export enum UserRole {
  USER = "USER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface WeekendCalendar {
  id: string;
  title: string;
  date: string; // ISO-8601 string: "2026-09-25T00:00:00.000Z"
}

export interface ApartmentUser {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
}

export interface SwappableApartment {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  city: string;
  neighborhood: string;
  street1?: string | null;
  street2?: string | null;
  lat: number | null;
  lng: number | null;
  neighborhoodLat: number | null;
  neighborhoodLng: number | null;
  neighborhoodWalkingMinutes?: number | null;
  propertyType?: PropertyType;
  bedrooms: number;
  bathrooms: number;
  maxGuest: number;
  pricePerShabbat: number;
  coverImage?: string | null;
  images: string[];
  phoneNumber?: string | null;
  whatsApp?: string | null;
  phone: boolean;
  whatsapp: boolean;
  email: boolean;
  unavailable: boolean;
  receiveRequestWhenUnavailable: boolean;
  isActive: boolean;
  status?: ApartmentStatus;
  amenities?: string[];
  additionalDetails?: Record<string, any> | null;
  walkingDistanceToNeighborhood?: number | null;
  distanceKmToNeighborhood?: number | null;
  walkingDistanceToDestination?: number | null;
  distanceKmToDestination?: number | null;
  user: ApartmentUser;
}

export interface SwapPreference {
  id: string;
  apartmentId: string;
  isEnabled: boolean;
  city?: string | null;
  neighborhood?: string | null;
  rooms?: number | null;
  beds?: number | null;
  weekend?: string | null;
  whatsApp?: string | null;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
  weekendCalendar?: WeekendCalendar | null;
  apartment?: SwappableApartment;
}

export interface SwappableListingItem {
  id: string;
  apartmentId: string;
  isEnabled: boolean;
  city: string | null;
  neighborhood: string | null;
  rooms: number | null;
  beds: number | null;
  weekend: string | null;
  whatsApp: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  weekendCalendar?: WeekendCalendar | null;
  isMatch?: boolean;
  matchScore?: number;
  apartment: SwappableApartment;
}

export interface MatchedSwapsData {
  isPreferenceMatched: boolean;
  hasPreferenceSet: boolean;
  userPreference: SwapPreference;
  message?: string;
  data: SwappableListingItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  matchedProperties?: SwappableListingItem[];
  matchedMeta?: {
    page: number;
    limit: number;
    total: number;
  };
  otherProperties?: SwappableListingItem[];
  otherMeta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface MatchedSwapsResponse {
  statusCode?: number;
  success?: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: MatchedSwapsData;
}

export interface SwapRequestItem {
  id: string;
  fromAppId: string;
  toAppId: string;
  status: SwapStatus;
  weekend: string | null;
  swapCode: string;
  createdAt: string;
  updatedAt: string;
  weekendCalendar?: WeekendCalendar | null;
  fromApartment: SwappableApartment;
  toApartment: SwappableApartment;
  payments?: any[];
}

export interface MySwapsData {
  sent: SwapRequestItem[];
  received: SwapRequestItem[];
}

export interface SaveSwapPreferencePayload {
  apartmentId?: string;
  isEnabled?: boolean;
  city?: string | null;
  neighborhood?: string | null;
  rooms?: number | null;
  beds?: number | null;
  weekend?: string | null;
  whatsApp?: string | null;
  email?: string | null;
}

export interface SwapRequestPayload {
  toAppId: string;
  fromAppId?: string;
  weekend?: string; // Optional backwards compatibility
}

export interface MatchedSwapsParams {
  city?: string;
  neighborhood?: string;
  targetDestination?: string;
  searchTerm?: string;
  weekend?: string;
  rooms?: number;
  minBedrooms?: number;
  beds?: number;
  minBeds?: number;
  destLat?: number;
  destLng?: number;
  walkingMinutes?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AllSwapPreferencesParams {
  city?: string;
  neighborhood?: string;
  targetDestination?: string;
  searchTerm?: string;
  rooms?: number;
  minBedrooms?: number;
  beds?: number;
  minBeds?: number;
  weekend?: string;
  isEnabled?: boolean;
  destLat?: number;
  destLng?: number;
  walkingMinutes?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface MySwapsParams {
  type?: "all" | "sent" | "received";
  status?: SwapStatus;
  destLat?: number;
  destLng?: number;
  walkingMinutes?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdminAllSwapsParams {
  status?: SwapStatus;
  searchTerm?: string;
  city?: string;
  neighborhood?: string;
  destLat?: number;
  destLng?: number;
  walkingMinutes?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
