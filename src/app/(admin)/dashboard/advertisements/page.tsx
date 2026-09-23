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
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  useAdvertisements, 
  useCreateAdvertisement, 
  useUpdateAdvertisement, 
  useDeleteAdvertisement 
} from "@/hooks/useAdvertisement";
import { Advertisement, AdvertisementPosition } from "@/types/advertisement.types";



export default function AdvertisementsPage() {
  // Ads state
  const { data: adsData, isLoading: isLoadingAds } = useAdvertisements();
  const { mutate: createAd, isPending: isCreatingAd } = useCreateAdvertisement();
  const { mutate: updateAd, isPending: isUpdatingAd } = useUpdateAdvertisement();
  const { mutate: deleteAd, isPending: isDeletingAd } = useDeleteAdvertisement();
  const advertisements = adsData?.data || [];

  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  
  // Ad Form State
  const [adCompanyName, setAdCompanyName] = useState("");
  const [adTitle, setAdTitle] = useState("");
  const [adSubtitle, setAdSubtitle] = useState("");
  const [adUrl, setAdUrl] = useState("");
  const [adPosition, setAdPosition] = useState<AdvertisementPosition>(AdvertisementPosition.HOME_MIDDLE);
  const [adIsActive, setAdIsActive] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);



  // Deletion confirmation state
  const [deleteItem, setDeleteItem] = useState<{ id: number | string; type: "ad" } | null>(null);

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
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdModal = (ad?: Advertisement) => {
    if (ad) {
      setEditingAd(ad);
      setAdCompanyName(ad.companyName);
      setAdTitle(ad.title);
      setAdSubtitle(ad.subtitle || "");
      setAdUrl(ad.url);
      setAdPosition(ad.position);
      setAdIsActive(ad.isActive);
      setSelectedImage(ad.image);
      setSelectedImageFile(null);
    } else {
      setEditingAd(null);
      setAdCompanyName("");
      setAdTitle("");
      setAdSubtitle("");
      setAdUrl("");
      setAdPosition(AdvertisementPosition.HOME_MIDDLE);
      setAdIsActive(true);
      setSelectedImage(null);
      setSelectedImageFile(null);
    }
    setIsAdModalOpen(true);
  };

  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adCompanyName.trim() || !adUrl.trim()) return;
    
    // Using multipart/form-data as per API spec
    const formData = new FormData();
    if (selectedImageFile) {
      formData.append("image", selectedImageFile);
    }
    
    const payload = {
      companyName: adCompanyName,
      title: adTitle,
      subtitle: adSubtitle,
      url: adUrl,
      position: adPosition,
      isActive: adIsActive,
    };
    
    formData.append("data", JSON.stringify(payload));
    
    if (editingAd) {
      updateAd({ id: editingAd.id, data: formData }, {
        onSuccess: (res) => {
          toast.success(res.message || "Advertisement updated successfully.");
          setIsAdModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err.message || "Failed to update advertisement");
        }
      });
    } else {
      createAd(formData, {
        onSuccess: (res) => {
          toast.success(res.message || "Advertisement created successfully.");
          setIsAdModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err.message || "Failed to create advertisement");
        }
      });
    }
  };



  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteItem) return;

    if (deleteItem.type === "ad") {
      deleteAd(deleteItem.id as string, {
        onSuccess: (res) => {
          toast.success(res.message || "The advertisement banner has been removed.");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err.message || "Failed to delete advertisement");
        }
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
        
        {/* ADVERTISEMENTS */}
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
                onClick={() => handleOpenAdModal()}
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
                  {isLoadingAds ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4c55a4] mx-auto"></div>
                      </td>
                    </tr>
                  ) : advertisements.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 text-sm font-semibold">
                        No advertisements found.
                      </td>
                    </tr>
                  ) : advertisements.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 font-extrabold text-zinc-900 dark:text-white flex items-center gap-3">
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover bg-zinc-100" />
                        )}
                        <div>
                          <div>{item.title}</div>
                          <div className="text-[10px] font-semibold text-zinc-500 uppercase">{item.companyName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{item.position}</span>
                      </td>
                      <td className="px-6 py-4">
                        {item.isActive ? (
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
                      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white text-xs">
                        {item.clicks || 0} clicks
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenAdModal(item)}
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
            
            <form onSubmit={handleSaveAd} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={adCompanyName}
                    onChange={(e) => setAdCompanyName(e.target.value)}
                    placeholder="Acme Real Estate Ltd"
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Ad Title *</label>
                  <input
                    type="text"
                    required
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder="Special Holiday Promotion"
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Subtitle</label>
                <textarea
                  rows={2}
                  value={adSubtitle}
                  onChange={(e) => setAdSubtitle(e.target.value)}
                  placeholder="Short promotional text..."
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Target URL *</label>
                <input
                  type="url"
                  required
                  value={adUrl}
                  onChange={(e) => setAdUrl(e.target.value)}
                  placeholder="https://example.com/promotion"
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Upload Ad Image Banner {editingAd ? "" : "*"}</label>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Advertisement Position</label>
                  <div className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/50 px-4 py-2.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 opacity-70">
                    <span>{AdvertisementPosition.HOME_MIDDLE}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Status</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer">
                      <span>{adIsActive ? "🟢 Active" : "🔴 Inactive"}</span>
                      <ChevronDown className="w-4 h-4 text-zinc-400 opacity-80" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[--anchor-width] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl z-50">
                      <DropdownMenuItem 
                        onClick={() => setAdIsActive(true)}
                        className="cursor-pointer rounded-lg py-2 px-3 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                      >
                        🟢 Active
                        {adIsActive && <Check className="w-4 h-4 text-emerald-600 ml-auto" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setAdIsActive(false)}
                        className="cursor-pointer rounded-lg py-2 px-3 text-xs font-bold text-zinc-600 dark:text-zinc-400"
                      >
                        🔴 Inactive
                        {!adIsActive && <Check className="w-4 h-4 text-zinc-600 ml-auto" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-6 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreatingAd || isUpdatingAd}
                  className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {(isCreatingAd || isUpdatingAd) && <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>}
                  {editingAd ? "Save Changes" : "Create Advertisement"}
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
              This action cannot be undone. This will permanently delete the selected advertisement banner.
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
