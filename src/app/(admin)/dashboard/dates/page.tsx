"use client";

import { useState } from "react";
import { 
  Plus, 
  Edit, 
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

export default function WeekendsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDelete = () => {
    setDeleteConfirmationId(null);
    setToastMessage("Date successfully deleted.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const weekends = [
    {
      id: 1,
      date: "2026-09-12",
      displayName: "Shabbos Ki Tavo",
      note: "Special family weekend",
      ownersUsing: 48,
    },
    {
      id: 2,
      date: "2026-09-19",
      displayName: "Shabbos Nitzavim",
      note: "Before holiday",
      ownersUsing: 32,
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Weekends & Available Dates</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Create the dates owners can select for availability
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Weekend
        </button>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold">
              <tr>
                <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">Date</th>
                <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">Display Name</th>
                <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">Note</th>
                <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">Owners Using</th>
                <th className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {weekends.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                    {item.displayName}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                    {item.note}
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                    {item.ownersUsing}
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
          <div className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 mt-10 mb-10">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Weekend / Date Details</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-900 dark:text-white">Date (Saturday date)</label>
                <input
                  type="date"
                  className="block w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-900 dark:text-white">Display Name</label>
                <input
                  type="text"
                  placeholder="Shabbos Ki Tavo"
                  className="block w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-900 dark:text-white">Note (shown to owners)</label>
                <textarea
                  rows={3}
                  placeholder="Available for the holiday weekend"
                  className="block w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white resize-none"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">Special Event / Holiday</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50/50 dark:bg-zinc-900 rounded-b-xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors">
                Save Weekend
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
                This action cannot be undone. This will permanently delete the date.
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
