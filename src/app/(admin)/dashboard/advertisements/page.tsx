"use client";

import { useState } from "react";
import { 
  Search, 
  ChevronDown, 
  Plus, 
  Edit, 
  Trash2,
  Image as ImageIcon,
  X,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Globe,
  Tag,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/utils/toast";

interface AdvertisementItem {
  id: number;
  title: string;
  cities: string;
  status: "Active" | "Inactive";
  clicks: number;
}

interface PlatformItem {
  id: number;
  name: string;
  category: "Social Media" | "Video & Content" | "Print Media" | "Broadcast & Voice" | "Community & Word of Mouth" | "Search & Other";
  status: "Active" | "Inactive";
  signupsTracked: number;
}

const initialAds: AdvertisementItem[] = [
  {
    id: 1,
    title: "Jerusalem Kosher Bistro Ad",
    cities: "Jerusalem",
    status: "Active",
    clicks: 124,
  },
  {
    id: 2,
    title: "Tel Aviv Seaside Cafe Deal",
    cities: "Tel Aviv",
    status: "Active",
    clicks: 89,
  },
  {
    id: 3,
    title: "Tzfat Heritage Judaica Store",
    cities: "Tzfat",
    status: "Active",
    clicks: 45,
  },
];

const initialPlatforms: PlatformItem[] = [
  { id: 1, name: "Facebook / Social Media", category: "Social Media", status: "Active", signupsTracked: 142 },
  { id: 2, name: "YouTube", category: "Video & Content", status: "Active", signupsTracked: 98 },
  { id: 3, name: "Instagram", category: "Social Media", status: "Active", signupsTracked: 115 },
  { id: 4, name: "Twitter / X", category: "Social Media", status: "Active", signupsTracked: 34 },
  { id: 5, name: "Newspaper / Print Ad", category: "Print Media", status: "Active", signupsTracked: 62 },
  { id: 6, name: "Radio / Voice Hotline", category: "Broadcast & Voice", status: "Active", signupsTracked: 87 },
  { id: 7, name: "Friend / Word of Mouth", category: "Community & Word of Mouth", status: "Active", signupsTracked: 210 },
  { id: 8, name: "Synagogue / Community Bulletin", category: "Community & Word of Mouth", status: "Active", signupsTracked: 76 },
  { id: 9, name: "Google Search / Other", category: "Search & Other", status: "Active", signupsTracked: 130 },
];

export default function AdvertisementsPage() {
  const [activePageTab, setActivePageTab] = useState<"ads" | "platforms">("ads");

  // Ads state
  const [advertisements, setAdvertisements] = useState<AdvertisementItem[]>(initialAds);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Platforms state
  const [platforms, setPlatforms] = useState<PlatformItem[]>(initialPlatforms);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<PlatformItem | null>(null);
  const [platformName, setPlatformName] = useState("");
  const [platformCategory, setPlatformCategory] = useState<PlatformItem["category"]>("Social Media");
  const [platformStatus, setPlatformStatus] = useState<"Active" | "Inactive">("Active");

  // Deletion confirmation state
  const [deleteItem, setDeleteItem] = useState<{ id: number; type: "ad" | "platform" } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleImageChange(e.target.files[0]);
    }
  };

  const handleImageChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Platform Modal
  const handleOpenPlatformModal = (platform?: PlatformItem) => {
    if (platform) {
      setEditingPlatform(platform);
      setPlatformName(platform.name);
      setPlatformCategory(platform.category);
      setPlatformStatus(platform.status);
    } else {
      setEditingPlatform(null);
      setPlatformName("");
      setPlatformCategory("Social Media");
      setPlatformStatus("Active");
    }
    setIsPlatformModalOpen(true);
  };

  // Save Platform
  const handleSavePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformName.trim()) return;

    if (editingPlatform) {
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === editingPlatform.id
            ? { ...p, name: platformName, category: platformCategory, status: platformStatus }
            : p
        )
      );
      showToast({
        title: "Platform Updated! 🟢",
        message: `Advertisement platform "${platformName}" successfully updated.`,
        type: "info",
      });
    } else {
      const newPlatform: PlatformItem = {
        id: Date.now(),
        name: platformName,
        category: platformCategory,
        status: platformStatus,
        signupsTracked: 0,
      };
      setPlatforms((prev) => [...prev, newPlatform]);
      showToast({
        title: "Platform Added! 🎉",
        message: `New platform "${platformName}" added for user signup tracking.`,
        type: "info",
      });
    }

    setIsPlatformModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteItem) return;

    if (deleteItem.type === "ad") {
      setAdvertisements((prev) => prev.filter((a) => a.id !== deleteItem.id));
      showToast({
        title: "Advertisement Deleted",
        message: "The advertisement banner has been removed.",
        type: "info",
      });
    } else {
      setPlatforms((prev) => prev.filter((p) => p.id !== deleteItem.id));
      showToast({
        title: "Platform Deleted",
        message: "The advertisement referral platform has been deleted.",
        type: "info",
      });
    }

    setDeleteItem(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Advertisements & Marketing Platforms</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage city-based advertisement banners and marketing referral source platforms.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        
        {/* Top Navigation Tabs */}
        <div className="flex p-2 bg-zinc-100/80 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 gap-2">
          <button
            onClick={() => setActivePageTab("ads")}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activePageTab === "ads"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Advertisements
          </button>
          
          <button
            onClick={() => setActivePageTab("platforms")}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activePageTab === "platforms"
                ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Advertisement Platforms (Referral Sources)</span>
          </button>
        </div>

        {/* TAB 1: CITY-BASED ADVERTISEMENTS */}
        {activePageTab === "ads" && (
          <div>
            {/* Action / Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="relative w-full sm:max-w-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search advertisement..."
                  className="block w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white transition-colors"
                />
              </div>

              <button 
                onClick={() => setIsAdModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Add Advertisement Banner</span>
              </button>
            </div>

            {/* Ads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-800/40 text-zinc-900 dark:text-white font-bold text-xs">
                  <tr>
                    <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Ad Title</th>
                    <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Assigned Cities</th>
                    <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Status</th>
                    <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Clicks Tracked</th>
                    <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {advertisements.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 font-extrabold text-zinc-900 dark:text-white">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {item.cities}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white text-xs">
                        {item.clicks} clicks
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setIsAdModalOpen(true)}
                            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                          >
                            <Edit className="mr-1.5 h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button 
                            onClick={() => setDeleteItem({ id: item.id, type: "ad" })}
                            className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ADVERTISEMENT PLATFORMS (REFERRAL SOURCES) */}
        {activePageTab === "platforms" && (
          <div>
            {/* Header & Add Button Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                  Referral Source & Advertisement Platforms List
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  These platforms appear as dropdown options during Renter & Owner account registration.
                </p>
              </div>

              <button
                onClick={() => handleOpenPlatformModal()}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Add Platform</span>
              </button>
            </div>

            {/* Platforms Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-800/40 text-zinc-900 dark:text-white font-bold text-xs">
                  <tr>
                    <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Platform Name</th>
                    <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Channel Category</th>
                    <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Status</th>
                    <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">Signups Tracked</th>
                    <th className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {platforms.map((platform) => (
                    <tr key={platform.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                      {/* Name */}
                      <td className="px-6 py-4 font-extrabold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span>{platform.name}</span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          <Tag className="w-3 h-3 text-zinc-400" />
                          {platform.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {platform.status === "Active" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Signups Tracked */}
                      <td className="px-6 py-4 font-extrabold text-zinc-900 dark:text-white text-xs">
                        {platform.signupsTracked} users
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenPlatformModal(platform)}
                            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                          >
                            <Edit className="mr-1.5 h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteItem({ id: platform.id, type: "platform" })}
                            className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD / EDIT ADVERTISEMENT BANNER */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Advertisement Details</h2>
              <button 
                onClick={() => setIsAdModalOpen(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Ad Title</label>
                <input
                  type="text"
                  placeholder="Jerusalem Kosher Bistro Ad"
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short promotional text..."
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Upload Ad Image Banner</label>
                <label 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 min-h-[200px] transition-colors cursor-pointer overflow-hidden ${
                    dragActive 
                      ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-500/10" 
                      : "border-zinc-300 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
                  
                  {selectedImage ? (
                    <div className="absolute inset-0 w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium text-sm flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" /> Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className={`mb-3 h-8 w-8 transition-colors ${dragActive ? "text-blue-500" : "text-zinc-400"}`} />
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Upload advertisement banner</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Recommended size: 1200 × 400</p>
                      <div className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        <Upload className="mr-1.5 h-3 w-3" />
                        Choose Image
                      </div>
                    </>
                  )}
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Assign to Cities</label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer">
                    <span>Jerusalem</span>
                    <ChevronDown className="w-4 h-4 text-zinc-400 opacity-80" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[--anchor-width] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl z-50">
                    {["Jerusalem", "Tel Aviv", "Bnei Brak", "Tzfat"].map((city) => (
                      <DropdownMenuItem key={city} className="cursor-pointer rounded-lg py-2 px-3 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {city}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 p-6 bg-zinc-50/50 dark:bg-zinc-900 rounded-b-3xl">
              <button 
                onClick={() => setIsAdModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsAdModalOpen(false);
                  showToast({ title: "Ad Saved!", message: "Advertisement banner saved successfully.", type: "info" });
                }}
                className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Save Advertisement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT ADVERTISEMENT PLATFORM */}
      {isPlatformModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
              <div>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  {editingPlatform ? "Edit Advertisement Platform" : "Add Advertisement Platform"}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Configure referral platform options for user signup tracking.
                </p>
              </div>

              <button
                onClick={() => setIsPlatformModalOpen(false)}
                className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlatform} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Platform / Referral Source Name *
                </label>
                <input
                  type="text"
                  required
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder="e.g. TikTok, Podcast Ad, Radio"
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Channel Category Shadcn Dropdown */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Channel Category
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <span>{platformCategory}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-400 opacity-80" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[--anchor-width] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl z-50">
                    {[
                      "Social Media",
                      "Video & Content",
                      "Print Media",
                      "Broadcast & Voice",
                      "Community & Word of Mouth",
                      "Search & Other",
                    ].map((cat) => (
                      <DropdownMenuItem
                        key={cat}
                        onClick={() => setPlatformCategory(cat as PlatformItem["category"])}
                        className="flex items-center justify-between cursor-pointer rounded-lg py-2 px-3 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                      >
                        <span>{cat}</span>
                        {platformCategory === cat && <Check className="w-4 h-4 text-blue-600" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Status Shadcn Dropdown */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Status
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <span>{platformStatus === "Active" ? "🟢 Active (Visible on Signup)" : "🔴 Inactive (Hidden)"}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-400 opacity-80" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[--anchor-width] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl z-50">
                    <DropdownMenuItem
                      onClick={() => setPlatformStatus("Active")}
                      className="flex items-center justify-between cursor-pointer rounded-lg py-2 px-3 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                    >
                      <span>🟢 Active (Visible on Signup)</span>
                      {platformStatus === "Active" && <Check className="w-4 h-4 text-emerald-600" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPlatformStatus("Inactive")}
                      className="flex items-center justify-between cursor-pointer rounded-lg py-2 px-3 text-xs font-bold text-zinc-600 dark:text-zinc-400"
                    >
                      <span>🔴 Inactive (Hidden)</span>
                      {platformStatus === "Inactive" && <Check className="w-4 h-4 text-zinc-600" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsPlatformModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
                >
                  {editingPlatform ? "Save Platform Changes" : "Add Platform"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 text-center p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
              Are you sure?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              This action cannot be undone. This will permanently delete the selected {deleteItem.type === "ad" ? "advertisement banner" : "marketing platform"}.
            </p>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setDeleteItem(null)}
                className="flex-1 px-4 py-2 text-xs font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
