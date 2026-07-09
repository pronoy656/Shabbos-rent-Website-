"use client";

import { useState } from "react";
import { 
  Search, 
  Download, 
  ChevronDown, 
  Plus, 
  Edit, 
  Trash2,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function NewsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDelete = () => {
    setDeleteConfirmationId(null);
    setToastMessage("Item successfully deleted.");
    setTimeout(() => setToastMessage(null), 3000);
  };

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
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const announcements = [
    {
      id: 1,
      title: "Eid Weekend Update",
      status: "Published",
      publishDate: "2026-09-01",
      pinned: true,
    },
    {
      id: 2,
      title: "New City Added",
      status: "Scheduled",
      publishDate: "2026-09-05",
      pinned: false,
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">News & Announcements</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage homepage announcements
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                placeholder="Search announcement"
              />
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center justify-between w-[120px] rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800">
                <span>Select...</span>
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Announcement
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold">
              <tr>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Title</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Status</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Publish Date</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Pinned</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {announcements.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                    {item.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      item.status === "Published"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                    {item.publishDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      item.pinned
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}>
                      {item.pinned ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Edit className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmationId(item.id)}
                        className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
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

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 mt-10 mb-10">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Announcement Details</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-900 dark:text-white">Title</label>
                <input
                  type="text"
                  placeholder="Eid Weekend Update"
                  className="block w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-900 dark:text-white">Content</label>
                <textarea
                  rows={4}
                  placeholder="Write the announcement content..."
                  className="block w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-900 dark:text-white">Upload Image</label>
                <label 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 min-h-[240px] transition-colors cursor-pointer overflow-hidden ${
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
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">Drag & drop an image here</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">or click to browse</p>
                      <div className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        Choose Image
                      </div>
                    </>
                  )}
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-white">Starting Date</label>
                  <input
                    type="date"
                    className="block w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900 dark:text-white">Expiration Date</label>
                  <input
                    type="date"
                    className="block w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">Pin to top of homepage</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">Publish immediately</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50/50 dark:bg-zinc-900 rounded-b-xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                Save Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 text-center">
            <div className="pt-8 pb-6 px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                Are you sure?
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                This action cannot be undone. This will permanently delete the item.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => setDeleteConfirmationId(null)}
                className="flex-1 px-4 py-2 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
