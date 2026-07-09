import MainNavbar from "@/components/layout/MainNavbar";
import FilterSidebar from "@/components/search/FilterSidebar";
import ApartmentCard, { ApartmentData } from "@/components/search/ApartmentCard";
import { SlidersHorizontal, Search } from "lucide-react";

// Mock Data for Apartments
const apartments: ApartmentData[] = [
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
  {
    id: "4",
    title: "Charming Studio in the City Center",
    location: "Nachlaot, Jerusalem",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    price: 900,
    rating: 4.5,
    reviews: 210,
    beds: 1,
    baths: 1,
    guests: 2,
    isSwapAvailable: false,
    verified: true,
  },
  {
    id: "5",
    title: "Spacious Duplex near Great Synagogue",
    location: "Talbiya, Jerusalem",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80",
    price: 2900,
    rating: 4.8,
    reviews: 65,
    beds: 4,
    baths: 2,
    guests: 8,
    isSwapAvailable: true,
    verified: true,
  },
  {
    id: "6",
    title: "Boutique Apartment with Balcony",
    location: "German Colony, Jerusalem",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    price: 2100,
    rating: 4.6,
    reviews: 112,
    beds: 2,
    baths: 1,
    guests: 4,
    isSwapAvailable: false,
    verified: false,
  },
];

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <MainNavbar />
      
      {/* Search Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pt-8 pb-8 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">Search Results</h1>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-4">Over 2,400 places to stay in Jerusalem for Shabbos</p>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-zinc-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search by keywords, locations, or apartment names..."
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#4c55a4] transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors md:hidden">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Sort by:</span>
                <select className="bg-transparent text-sm font-bold text-zinc-900 dark:text-white focus:outline-none cursor-pointer">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar (Filters) */}
          <div className="hidden lg:block lg:col-span-3">
            <FilterSidebar />
          </div>

          {/* Right Main Area (Apartment Cards) */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {apartments.map((apt) => (
                <ApartmentCard key={apt.id} apartment={apt} />
              ))}
            </div>
            
            {/* Pagination / Load More */}
            <div className="mt-12 flex justify-center">
              <button className="px-8 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm transition-colors">
                Load More Apartments
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
