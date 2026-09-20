import { ApartmentData } from "@/types";

export type ReportedRental = {
  id: string;
  week: string;
  weekId: string;
  parshat: string;
  amount: number;
  status: "Paid" | "Pending";
  reportedAt: string;
};

export const baseApartments: ApartmentData[] = [
  {
    id: "1",
    title: "Luxury Penthouse with Kosher Kitchen",
    location: "Rehavia, Jerusalem",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    price: 3500,
    rating: 4.9,
    reviews: 124,
    beds: 4,
    baths: 3,
    guests: 8,
    isSwapAvailable: true,
    verified: true,
  },
  {
    id: "2",
    title: "Cozy Family Apartment near Kotel",
    location: "Jewish Quarter, Jerusalem",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e5088e756?w=800&q=80",
    price: 1800,
    rating: 4.7,
    reviews: 89,
    beds: 3,
    baths: 2,
    guests: 6,
    isSwapAvailable: false,
    verified: true,
  },
  {
    id: "3",
    title: "Modern Villa with Private Garden",
    location: "Baka, Jerusalem",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    price: 5200,
    rating: 5.0,
    reviews: 42,
    beds: 5,
    baths: 4,
    guests: 10,
    isSwapAvailable: true,
    verified: false,
  },
];

export const mockApartments: ApartmentData[] = Array.from({ length: 3 }).flatMap((_, i) => 
  baseApartments.map(apt => ({
    ...apt,
    id: `${apt.id}-${i}`,
  }))
);

export const telAvivApartments: ApartmentData[] = [
  { id: "ta-1", title: "Luxury Penthouse near Beach", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", price: 4000, rating: 4.9, reviews: 120, beds: 3, baths: 2, guests: 6, isSwapAvailable: true, verified: true },
  { id: "ta-2", title: "Modern Studio in City Center", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", price: 2500, rating: 4.8, reviews: 85, beds: 1, baths: 1, guests: 2, isSwapAvailable: false, verified: true },
  { id: "ta-3", title: "Spacious Family Apartment", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", price: 3200, rating: 4.7, reviews: 65, beds: 4, baths: 2, guests: 8, isSwapAvailable: true, verified: false },
  { id: "ta-4", title: "Boutique Apartment with Sea View", location: "Tel Aviv, Israel", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80", price: 3800, rating: 5.0, reviews: 200, beds: 2, baths: 1, guests: 4, isSwapAvailable: true, verified: true },
];

export const jerusalemApartments: ApartmentData[] = [
  { id: "jr-1", title: "Historic Stone House in Old City", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80", price: 4500, rating: 4.9, reviews: 150, beds: 4, baths: 3, guests: 10, isSwapAvailable: false, verified: true },
  { id: "jr-2", title: "Cozy Apartment near Mahane Yehuda", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", price: 2800, rating: 4.6, reviews: 90, beds: 2, baths: 1, guests: 5, isSwapAvailable: true, verified: false },
  { id: "jr-3", title: "Elegant Residence with Panoramic View", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", price: 5000, rating: 4.8, reviews: 110, beds: 5, baths: 4, guests: 12, isSwapAvailable: true, verified: true },
  { id: "jr-4", title: "Modern Duplex in Rehavia", location: "Jerusalem, Israel", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80", price: 3600, rating: 4.7, reviews: 75, beds: 3, baths: 2, guests: 6, isSwapAvailable: false, verified: true },
];

export const tzfatApartments: ApartmentData[] = [
  { id: "tz-1", title: "Artistic Villa with Mountain Views", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", price: 3000, rating: 4.9, reviews: 105, beds: 4, baths: 2, guests: 8, isSwapAvailable: true, verified: true },
  { id: "tz-2", title: "Charming Old City Guest House", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", price: 2200, rating: 4.8, reviews: 60, beds: 2, baths: 1, guests: 4, isSwapAvailable: true, verified: false },
  { id: "tz-3", title: "Modern Cabin near the Forest", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80", price: 2800, rating: 4.7, reviews: 45, beds: 3, baths: 2, guests: 6, isSwapAvailable: false, verified: true },
  { id: "tz-4", title: "Spacious Retreat with Galilee Views", location: "Tzfat, Israel", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", price: 3500, rating: 5.0, reviews: 130, beds: 5, baths: 3, guests: 10, isSwapAvailable: true, verified: true },
];

export const allPossibleApartments = [...mockApartments, ...telAvivApartments, ...jerusalemApartments, ...tzfatApartments];

export const SHABBATOT = [
  { id: "devarim", name: "Devarim", date: "17/7" },
  { id: "vaetchanan", name: "Vaetchanan", date: "24/7" },
  { id: "eikev", name: "Eikev", date: "31/7" },
  { id: "reeh", name: "Re'eh", date: "07/8" },
  { id: "shoftim", name: "Shoftim", date: "14/8" },
  { id: "ki-teitzei", name: "Ki Teitzei", date: "21/8" },
  { id: "ki-tavo", name: "Ki Tavo", date: "28/8" },
  { id: "nitzavim-vayelech", name: "Nitzavim-Vayelech", date: "04/9" },
  { id: "rosh-hashana", name: "Rosh Hashana", date: "11/9" },
  { id: "haazinu", name: "Ha'azinu", date: "18/9" },
  { id: "sukkot", name: "Sukkot", date: "25/9" },
  { id: "vzot-haberachah", name: "V'Zot HaBerachah", date: "02/10" },
  { id: "bereshit", name: "Bereshit", date: "09/10" },
  { id: "noach", name: "Noach", date: "16/10" },
  { id: "lech-lecha", name: "Lech-Lecha", date: "23/10" },
  { id: "vayeira", name: "Vayeira", date: "30/10" },
  { id: "chayei-sara", name: "Chayei Sara", date: "06/11" },
  { id: "toldot", name: "Toldot", date: "13/11" },
  { id: "vayetzei", name: "Vayetzei", date: "20/11" },
  { id: "vayishlach", name: "Vayishlach", date: "27/11" },
  { id: "vayeshev", name: "Vayeshev", date: "04/12" },
  { id: "miketz", name: "Miketz", date: "11/12" },
  { id: "vayigash", name: "Vayigash", date: "18/12" },
  { id: "vayechi", name: "Vayechi", date: "25/12" }
];

export const mockRenterBookings = [
  {
    id: "b-1",
    refCode: "SR-8492",
    apartmentId: "1",
    title: "Luxury Penthouse with Kosher Kitchen",
    location: "Rehavia, Jerusalem",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    dateRange: "Oct 13 - 15, 2024",
    hostName: "Moshe & Chaim Estates",
    hostPhone: "+972 54-123-4567",
    hostEmail: "owner@rehavia-estates.com",
    totalPrice: 3500,
    status: "Upcoming",
  },
  {
    id: "b-2",
    refCode: "SR-7210",
    apartmentId: "2",
    title: "Cozy Family Apartment near Kotel",
    location: "Jewish Quarter, Jerusalem",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e5088e756?w=800&q=80",
    dateRange: "Sep 27 - 29, 2024",
    hostName: "Sarah Cohen",
    hostPhone: "+972 50-987-6543",
    hostEmail: "sarah@kotelrentals.com",
    totalPrice: 1800,
    status: "Completed",
  },
  {
    id: "b-3",
    refCode: "SR-6190",
    apartmentId: "3",
    title: "Modern Villa with Private Garden",
    location: "Baka, Jerusalem",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    dateRange: "Aug 15 - 18, 2024",
    hostName: "David Levi",
    hostPhone: "+972 52-444-5555",
    hostEmail: "david@bakavillas.com",
    totalPrice: 5200,
    status: "Completed",
  },
];
