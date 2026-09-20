// ─────────────────────────────────────────────
// Apartment & Availability Types
// Based on api-integration/integrationguide.txt specifications
// ─────────────────────────────────────────────

export type PropertyType =
  | "APARTMENT"
  | "VILLA"
  | "PENTHOUSE"
  | "STUDIO"
  | "DUPLEX"
  | "TRIPLEX"
  | "COTTAGE"
  | "GARDEN_APARTMENT"
  | "TOWNHOUSE"
  | string;

export type ContactMethod = "PHONE" | "WHATSAPP" | "BOTH";

export type ListingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "SUSPENDED"
  | "BLOCKED"
  | string;

export interface ApartmentSearchParams {
  searchTerm?: string;
  city?: string;
  neighborhood?: string;
  targetDestination?: string;
  destination?: string;
  shulAddress?: string;
  destLat?: number;
  destLng?: number;
  walkingMinutes?: number | string;
  walkingTime?: number | string;
  maxWalkingMinutes?: number | string;
  propertyType?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  rooms?: number;
  bathrooms?: number;
  maxGuest?: number;
  guests?: number;
  seats?: number;
  guestCount?: number;
  weekendId?: string;
  weekend?: string;
  date?: string;
  amenities?: string | string[];
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "pricePerShabbat" | "bedrooms" | "maxGuest" | "title" | string;
  sortOrder?: "asc" | "desc";
  status?: string;
  type?: string;
}

export interface UpcomingAvailability {
  isAvailableNextWeekend?: boolean;
  isAvailableSecondWeekend?: boolean;
  availabilityMessage?: string;
  canNotify?: boolean;
  canMakeOffer?: boolean;
}

export interface ApartmentUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  profileImage?: string;
}

export interface ApartmentAvailabilityWeekend {
  id: string;
  title: string;
  date: string;
}

export interface ApartmentAvailabilityItem {
  id: string;
  weekendId: string;
  isSpecial?: boolean;
  specialPrice?: number | null;
  weekend?: ApartmentAvailabilityWeekend;
}

export interface ApartmentMarker {
  id: string;
  propertyId: string;
  title: string;
  lat: number;
  lng: number;
  city: string;
  neighborhood: string;
  street1?: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  maxGuest: number;
  pricePerShabbat: number;
  coverImage?: string;
}

export interface ApartmentItem {
  id: string;
  propertyId?: string;
  title: string;
  description?: string;
  city: string;
  neighborhood: string;
  street1?: string;
  street2?: string;
  lat?: number;
  lng?: number;
  neighborhoodLat?: number;
  neighborhoodLng?: number;
  neighborhoodWalkingMinutes?: number;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  maxGuest: number;
  pricePerShabbat: number;
  yomTovPrice?: number;
  specialShabbatPrice?: number;
  amenities: string[];
  coverImage?: string;
  images?: string[];
  phoneNumber?: string;
  whatsApp?: string;
  howToContact?: ContactMethod;
  status?: ListingStatus;
  averageRating?: number;
  totalReviews?: number;
  walkingDistanceToNeighborhood?: number;
  walkingDistanceToDestination?: number;
  upcomingAvailability?: UpcomingAvailability;
  user?: ApartmentUser;
  marker?: ApartmentMarker;
  isListingActive?: boolean;
  isActive?: boolean;
  inactiveNote?: string | null;
  unavailable?: boolean;
  receiveRequestWhenUnavailable?: boolean;
  isListingExpired?: boolean;
  daysRemaining?: number;
  createdAt?: string;
  updatedAt?: string;
  availabilities?: ApartmentAvailabilityItem[];
  swapPreference?: {
    id: string;
    isEnabled: boolean;
    weekend: string;
  };
}

export interface ApartmentPaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApartmentsResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  meta: ApartmentPaginationMeta;
  markers?: ApartmentMarker[];
  data: ApartmentItem[];
}

export interface SingleApartmentResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  data: ApartmentItem;
}

export interface BulkSetAvailabilityPayload {
  apartmentId: string;
  weekendIds: string[];
}

export interface SpecialPricePayload {
  apartmentId: string;
  weekendId: string;
  isSpecial: boolean;
  specialPrice: number;
}

// ─────────────────────────────────────────────
// Popular Cities & View History Types
// ─────────────────────────────────────────────

export interface IPopularCity {
  city: string;
  viewCount: number;      // Total clicks/views across apartments in this city
  apartmentCount: number; // Total available/active apartments in this city
  image: string | null;   // Representative cover image
}

export interface IRecentlyViewedApartment {
  id: string;
  propertyId?: string | null;
  userId?: string;
  title: string;
  description?: string | null;
  city: string;
  neighborhood: string;
  street1?: string | null;
  street2?: string | null;
  lat?: number | null;
  lng?: number | null;
  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  maxGuest?: number;
  pricePerShabbat?: number;
  amenities?: string[];
  coverImage?: string | null;
  images?: string[];
  phoneNumber?: string | null;
  whatsApp?: string | null;
  phone?: boolean;
  whatsapp?: boolean;
  email?: boolean;
  isActive?: boolean;
  status?: ListingStatus;
  viewedAt?: string;
  averageRating?: number;
  totalReviews?: number;
  upcomingAvailability?: {
    isAvailableNextWeekend?: boolean;
    isAvailableSecondWeekend?: boolean;
    isAvailableNextTwoWeekends?: boolean;
    availabilityMessage?: string;
    canNotify?: boolean;
    canMakeOffer?: boolean;
    nextWeekend?: {
      id: string;
      title: string;
      date: string;
      isAvailable: boolean;
    } | null;
    followingWeekend?: {
      id: string;
      title: string;
      date: string;
      isAvailable: boolean;
    } | null;
  };
  user?: {
    id: string;
    username: string;
    email?: string | null;
    phone?: string | null;
    profileImage?: string | null;
  };
}

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
  data: T;
}

// ─────────────────────────────────────────────
// Grouped Apartments By Cities
// ─────────────────────────────────────────────

export interface IApartmentCard {
  id: string;
  propertyId?: string | null;
  userId?: string;
  title: string;
  description?: string | null;
  city: string;
  neighborhood: string;
  street1?: string | null;
  street2?: string | null;
  lat?: number | null;
  lng?: number | null;
  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  maxGuest?: number;
  pricePerShabbat?: number;
  amenities?: string[];
  coverImage?: string | null;
  images?: string[];
  phoneNumber?: string | null;
  whatsApp?: string | null;
  phone?: boolean;
  whatsapp?: boolean;
  email?: boolean;
  isActive?: boolean;
  status?: ListingStatus;
  averageRating?: number;
  totalReviews?: number;
  isWishlisted?: boolean;
  viewedAt?: string;
  upcomingAvailability?: {
    isAvailableNextWeekend?: boolean;
    isAvailableSecondWeekend?: boolean;
    isAvailableNextTwoWeekends?: boolean;
    availabilityMessage?: string;
    canNotify?: boolean;
    canMakeOffer?: boolean;
    nextWeekend?: {
      id: string;
      title: string;
      date: string;
      isAvailable: boolean;
    } | null;
    followingWeekend?: {
      id: string;
      title: string;
      date: string;
      isAvailable: boolean;
    } | null;
  };
  user?: {
    id: string;
    username: string;
    email?: string | null;
    phone?: string | null;
    profileImage?: string | null;
  };
}

export interface ICityApartmentGroup {
  city: string;
  totalApartments: number;
  apartments: IApartmentCard[];
}


// ---------------------------------------------
// Offers, Interested & Notify Requests Types
// ---------------------------------------------

export enum OfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface ICreateOfferPayload {
  apartmentId: string;
  offerPrice: number;
  shabbosId?: string;
  message?: string;
}

export interface IUpdateOfferStatusPayload {
  status: OfferStatus;
}

export interface IOffer {
  id: string;
  apartmentId: string;
  ownerId: string;
  shabbosId: string | null;
  originalPrice: number;
  offerPrice: number;
  message: string | null;
  status: OfferStatus;
  createdAt: string;
  apartment: {
    id: string;
    title: string;
    city: string;
    neighborhood: string;
    coverImage: string | null;
  };
}

export interface IMyOffersResponse {
  sent: IOffer[];
  received: IOffer[];
}

export interface ICreateInterestedRequestPayload {
  apartmentId: string;
}

export interface IInterestedRequest {
  id: string;
  userId: string;
  ownerId: string;
  apartmentId: string;
  createdAt: string;
  apartment: {
    id: string;
    title: string;
    city: string;
    neighborhood: string;
    coverImage: string | null;
  };
  owner?: {
    id: string;
    username: string;
    email: string | null;
    phone: string | null;
  };
  user?: {
    id: string;
    username: string;
    email: string | null;
    phone: string | null;
  };
}

export interface IMyInterestedRequestsResponse {
  sent: IInterestedRequest[];
  received: IInterestedRequest[];
}

export interface ICreateNotifyRequestPayload {
  apartmentId: string;
}

export interface INotifyRequest {
  id: string;
  userId: string;
  ownerId: string;
  apartmentId: string;
  createdAt: string;
  apartment: {
    id: string;
    title: string;
    city: string;
    neighborhood: string;
    coverImage: string | null;
  };
  owner?: {
    id: string;
    username: string;
    email: string | null;
    phone: string | null;
  };
  user?: {
    id: string;
    username: string;
    email: string | null;
    phone: string | null;
  };
}

export interface IMyNotifyRequestsResponse {
  sent: INotifyRequest[];
  received: INotifyRequest[];
}

export interface IUpdateApartmentStatusPayload {
  isActive?: boolean;
  inactiveNote?: string;
  unavailable?: boolean;
  receiveRequestWhenUnavailable?: boolean;
}
