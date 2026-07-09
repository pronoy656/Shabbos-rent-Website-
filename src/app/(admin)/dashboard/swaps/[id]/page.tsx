"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, BedDouble, Bath, Users, CheckCircle2, ArrowRightLeft, User, Phone, Mail } from "lucide-react";

export default function SwapDetailsPage({ params }: { params: { id: string } }) {
  // In a real application, we would fetch data based on params.id
  // Here we use mock data representing a detailed view of a swap.
  const swap = {
    id: params.id || "SWP-1042",
    status: "Pending",
    date: "Aug 15 - Aug 20, 2026",
    initiator: {
      owner: {
        name: "David Cohen",
        phone: "+972 50-123-4567",
        email: "david.c@example.com",
        avatar: "https://i.pravatar.cc/150?u=david"
      },
      apartment: {
        title: "Modern Jerusalem Flat with Balcony",
        code: "APT-104",
        location: "Rehavia, Jerusalem",
        address: "12 Aza Street, Apt 4, Jerusalem",
        beds: 3,
        baths: 2,
        guests: 6,
        mainImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop",
        thumbnails: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1de2d96674?q=80&w=500&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=500&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=500&auto=format&fit=crop"
        ],
        amenities: ["Kosher Kitchen", "Shabbos Elevator", "Balcony", "Wifi"]
      }
    },
    recipient: {
      owner: {
        name: "Sarah Levy",
        phone: "+972 54-987-6543",
        email: "sarah.l@example.com",
        avatar: "https://i.pravatar.cc/150?u=sarah"
      },
      apartment: {
        title: "Luxury Tel Aviv Condo near Beach",
        code: "APT-882",
        location: "Neve Tzedek, Tel Aviv",
        address: "45 Shabazi St, Tel Aviv-Yafo",
        beds: 4,
        baths: 3,
        guests: 8,
        mainImage: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2000&auto=format&fit=crop",
        thumbnails: [
          "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=500&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=500&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=500&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=500&auto=format&fit=crop"
        ],
        amenities: ["Sea View", "Private Pool", "Kosher Kitchen", "Air Conditioning", "Parking"]
      }
    }
  };

  const [activeInitiatorImg, setActiveInitiatorImg] = useState(swap.initiator.apartment.mainImage);
  const [activeRecipientImg, setActiveRecipientImg] = useState(swap.recipient.apartment.mainImage);

  return (
    <div className="space-y-6 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/swaps" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Swaps
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{swap.id}</h1>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                {swap.status}
              </span>
            </div>
            <p className="text-zinc-900 dark:text-white font-bold text-lg">{swap.date}</p>
          </div>
        </div>
      </div>

      {/* 50/50 Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pt-4">
        
        {/* Left Side: Initiator */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              {swap.initiator.owner.name}&apos;s Apartment
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">This is the apartment being offered for the swap.</p>
          </div>

          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeInitiatorImg} alt="Main" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {swap.initiator.apartment.thumbnails.map((thumb, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveInitiatorImg(thumb)}
                  className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeInitiatorImg === thumb ? 'border-blue-500 shadow-md scale-105' : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 opacity-80 hover:opacity-100'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Apartment Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">{swap.initiator.apartment.title}</h3>
                <span className="shrink-0 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-bold px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  {swap.initiator.apartment.code}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mt-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                <span>{swap.initiator.apartment.address}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-100 dark:border-zinc-800/60">
                <BedDouble className="h-5 w-5 text-zinc-400" />
                <span className="font-bold text-zinc-900 dark:text-white">{swap.initiator.apartment.beds} Beds</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-100 dark:border-zinc-800/60">
                <Bath className="h-5 w-5 text-zinc-400" />
                <span className="font-bold text-zinc-900 dark:text-white">{swap.initiator.apartment.baths} Baths</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-100 dark:border-zinc-800/60">
                <Users className="h-5 w-5 text-zinc-400" />
                <span className="font-bold text-zinc-900 dark:text-white">Max {swap.initiator.apartment.guests}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 uppercase tracking-wider">Amenities Included</h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                {swap.initiator.apartment.amenities.map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Details Profile Card */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={swap.initiator.owner.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-white dark:border-zinc-800 shadow-md object-cover" />
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white text-lg">{swap.initiator.owner.name}</h4>
                <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {swap.initiator.owner.phone}</span>
                  <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {swap.initiator.owner.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Desktop Separator line hidden on mobile, or just visual spacing. Grid handles it. */}


        {/* Right Side: Recipient */}
        <div className="space-y-8">

          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              {swap.recipient.owner.name}&apos;s Apartment
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">This is the apartment being requested for the swap.</p>
          </div>

          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative">
              {/* Subtle connecting line/arrow for visual flair on large screens */}
              <div className="hidden lg:flex absolute lg:-left-[1rem] xl:-left-[1.5rem] -translate-x-1/2 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 ring-8 ring-zinc-50 dark:ring-black z-10">
                 <ArrowRightLeft className="h-5 w-5" />
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeRecipientImg} alt="Main" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {swap.recipient.apartment.thumbnails.map((thumb, idx) => (
                <button
                  key={idx} 
                  onClick={() => setActiveRecipientImg(thumb)}
                  className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeRecipientImg === thumb ? 'border-blue-500 shadow-md scale-105' : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 opacity-80 hover:opacity-100'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Apartment Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">{swap.recipient.apartment.title}</h3>
                <span className="shrink-0 bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 font-bold px-3 py-1 rounded-lg border border-purple-100 dark:border-purple-800/30">
                  {swap.recipient.apartment.code}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mt-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                <span>{swap.recipient.apartment.address}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-100 dark:border-zinc-800/60">
                <BedDouble className="h-5 w-5 text-zinc-400" />
                <span className="font-bold text-zinc-900 dark:text-white">{swap.recipient.apartment.beds} Beds</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-100 dark:border-zinc-800/60">
                <Bath className="h-5 w-5 text-zinc-400" />
                <span className="font-bold text-zinc-900 dark:text-white">{swap.recipient.apartment.baths} Baths</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-100 dark:border-zinc-800/60">
                <Users className="h-5 w-5 text-zinc-400" />
                <span className="font-bold text-zinc-900 dark:text-white">Max {swap.recipient.apartment.guests}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 uppercase tracking-wider">Amenities Included</h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                {swap.recipient.apartment.amenities.map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Details Profile Card */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={swap.recipient.owner.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-white dark:border-zinc-800 shadow-md object-cover" />
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white text-lg">{swap.recipient.owner.name}</h4>
                <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {swap.recipient.owner.phone}</span>
                  <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {swap.recipient.owner.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
