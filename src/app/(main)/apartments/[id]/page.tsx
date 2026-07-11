import MainNavbar from "@/components/layout/MainNavbar";
import { MapPin, BedDouble, Bath, Users, Star, ArrowRightLeft, ShieldCheck, CalendarCheck } from "lucide-react";

export default function ApartmentDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <MainNavbar />
      
      {/* Title Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <div className="flex items-center gap-2 mb-2">
                 <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-md border border-blue-200 dark:border-blue-800/50">
                   Apartment #{id}
                 </span>
                 <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-xs rounded-md border border-green-200 dark:border-green-800/50 flex items-center gap-1">
                   <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
                 </span>
               </div>
               <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white mb-2">
                 Beautiful Apartment in Jerusalem
               </h1>
               <div className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                 <div className="flex items-center gap-1.5 hover:underline cursor-pointer">
                   <MapPin className="w-4 h-4" />
                   Rehavia, Jerusalem
                 </div>
                 <div className="flex items-center gap-1.5">
                   <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                   <span className="text-zinc-900 dark:text-white font-bold">4.9</span> (45 reviews)
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
                {/* Main Image */}
                <div className="w-full h-[400px] md:h-[500px] bg-zinc-200 dark:bg-zinc-800 rounded-3xl overflow-hidden relative group">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img 
                     src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80" 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                     alt="Apartment Interior" 
                   />
                </div>

                {/* Details Section */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">About this home</h2>
                    
                    <div className="flex flex-wrap items-center gap-6 py-6 border-y border-zinc-100 dark:border-zinc-800 mb-6">
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                        <BedDouble className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        4 Beds
                      </div>
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                        <Bath className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        3 Baths
                      </div>
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Up to 8 Guests
                      </div>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                       Experience the perfect Shabbos in this beautifully appointed apartment. Centrally located with easy access to shuls and kosher dining. The apartment features a fully equipped kosher kitchen with double sinks, a spacious dining area that comfortably seats your whole family, and comfortable beds with premium linens.
                    </p>
                </div>
            </div>
            
            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-1">
               <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 sticky top-28 shadow-xl shadow-zinc-200/20 dark:shadow-none">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full font-bold text-xs border border-blue-100 dark:border-blue-800/50 mb-6 uppercase tracking-wider">
                     <ArrowRightLeft className="w-3.5 h-3.5" /> Swap Eligible
                  </div>
                  
                  <div className="flex items-end gap-2 mb-8">
                    <span className="text-4xl font-black text-zinc-900 dark:text-white">₪0</span>
                    <span className="text-zinc-500 font-medium mb-1">/ weekend</span>
                  </div>
                  
                  <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 mb-4 flex justify-center items-center gap-2 text-lg">
                     <CalendarCheck className="w-5 h-5" />
                     Request a Swap
                  </button>
                  <button className="w-full py-3.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold transition-all">
                     Contact Host
                  </button>
                  
                  <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      You won't be charged yet.
                    </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
