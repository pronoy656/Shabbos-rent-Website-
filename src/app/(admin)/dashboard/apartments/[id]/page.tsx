"use client";

import { use, useState } from "react";
import { 
  Edit, 
  Ban, 
  User, 
  Image as ImageIcon, 
  Calendar, 
  X, 
  Check, 
  BellRing, 
  DollarSign, 
  Trash2,
  Home,
  BedDouble,
  MapPin,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

export default function ApartmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const apartmentId = resolvedParams.id;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [availability, setAvailability] = useState([
    { id: 1, weekend: "Ki Tavo", status: "Available" },
    { id: 2, weekend: "Rosh Hashanah", status: "Unavailable" },
  ]);
  const [availabilityModal, setAvailabilityModal] = useState<{ open: boolean, type: 'Enable' | 'Disable', id: number | null }>({ open: false, type: 'Disable', id: null });

  const handleDelete = () => {
    setDeleteModalOpen(false);
    setToastMessage("Listing successfully deleted.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSuspend = () => {
    setSuspendModalOpen(false);
    setIsSuspended(true);
    setToastMessage("Apartment suspended.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAvailabilityAction = () => {
    setAvailability(prev => prev.map(item => {
      if (item.id === availabilityModal.id) {
         return { ...item, status: availabilityModal.type === 'Enable' ? 'Available' : 'Unavailable' }
      }
      return item;
    }));
    setToastMessage(`Successfully ${availabilityModal.type.toLowerCase()}d availability.`);
    setTimeout(() => setToastMessage(null), 3000);
    setAvailabilityModal({ open: false, type: 'Disable', id: null });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Apartment {apartmentId}
            </h1>
            {isSuspended ? (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">
                Suspended
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Active
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Jerusalem Family Apartment • Geula
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Edit className="mr-2 h-4 w-4" />
            Edit Listing
          </button>
          {!isSuspended && (
            <button 
              onClick={() => setSuspendModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50"
            >
              <Ban className="mr-2 h-4 w-4" />
              Suspend
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Apartment Information */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-5 py-4">
            <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
              <Home className="h-4 w-4 text-blue-500" />
              Apartment Information
            </div>
            <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
              <Edit className="mr-1.5 h-3 w-3" />
              Edit
            </button>
          </div>
          <div className="p-5">
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
                <dt className="text-zinc-500 dark:text-zinc-400">City</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">Jerusalem</dd>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
                <dt className="text-zinc-500 dark:text-zinc-400">Neighborhood</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">Geula</dd>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
                <dt className="text-zinc-500 dark:text-zinc-400">Rooms</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">4</dd>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
                <dt className="text-zinc-500 dark:text-zinc-400">Beds</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">8</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Price</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">₪650</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Owner Information */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden h-fit">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-5 py-4">
            <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
              <User className="h-4 w-4 text-purple-500" />
              Owner Information
            </div>
            <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
              View Owner
            </button>
          </div>
          <div className="p-5">
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
                <dt className="text-zinc-500 dark:text-zinc-400">Name</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">David Cohen</dd>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
                <dt className="text-zinc-500 dark:text-zinc-400">Phone</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">+972-50-123-4567</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Total Earnings</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">₪1,250</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <ImageIcon className="h-4 w-4 text-orange-500" />
            Photos
          </div>
          <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
            <Edit className="mr-1.5 h-3 w-3" />
            Manage Photos
          </button>
        </div>
        <div className="p-5">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <ImageIcon className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <Calendar className="h-4 w-4 text-blue-500" />
            Availability
          </div>
          <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
            <Edit className="mr-1.5 h-3 w-3" />
            Edit Availability
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold">
              <tr>
                <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Weekend</th>
                <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Status</th>
                <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {availability.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-5 py-4 font-bold text-zinc-900 dark:text-white">{item.weekend}</td>
                  <td className="px-5 py-4">
                    {item.status === "Available" ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">
                        Unavailable
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {item.status === "Available" ? (
                      <button 
                        onClick={() => setAvailabilityModal({ open: true, type: 'Disable', id: item.id })}
                        className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <X className="mr-1.5 h-3 w-3" />
                        Disable
                      </button>
                    ) : (
                      <button 
                        onClick={() => setAvailabilityModal({ open: true, type: 'Enable', id: item.id })}
                        className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-colors"
                      >
                        <Check className="mr-1.5 h-3 w-3" />
                        Enable
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rental History */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <FileText className="h-4 w-4 text-emerald-500" />
            Rental History
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold">
              <tr>
                <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Date</th>
                <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Renter</th>
                <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Fee</th>
                <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="px-5 py-4 font-bold text-zinc-900 dark:text-white">Sep 12</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">Levi</td>
                <td className="px-5 py-4 font-medium text-zinc-900 dark:text-white">₪50</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    Paid
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="px-5 py-4 font-bold text-zinc-900 dark:text-white">Aug 15</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">Yitzhak</td>
                <td className="px-5 py-4 font-medium text-zinc-900 dark:text-white">₪50</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2 pb-8">
        <button className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-100 dark:border-orange-900/30 dark:bg-orange-950/30 dark:text-orange-400 dark:hover:bg-orange-900/50 transition-colors">
          <BellRing className="mr-2 h-4 w-4" />
          Send Availability Reminder
        </button>
        <button className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-colors">
          <DollarSign className="mr-2 h-4 w-4" />
          Request ₪50 Payment
        </button>
        <button 
          onClick={() => setDeleteModalOpen(true)}
          className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors ml-auto sm:ml-0"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Listing
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
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
                This action cannot be undone. This will permanently delete the listing.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => setDeleteModalOpen(false)}
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

      {/* Suspend Confirmation Modal */}
      {suspendModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 text-center">
            <div className="pt-8 pb-6 px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
                <Ban className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                Suspend Apartment?
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Are you sure you want to suspend this apartment? It will no longer be visible to users.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => setSuspendModalOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSuspend}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 rounded-lg transition-colors shadow-sm"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Availability Action Modal */}
      {availabilityModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 text-center">
            <div className="pt-8 pb-6 px-6">
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 ${availabilityModal.type === 'Enable' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <AlertTriangle className={`h-6 w-6 ${availabilityModal.type === 'Enable' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                {availabilityModal.type} Availability?
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Are you sure you want to {availabilityModal.type.toLowerCase()} this weekend's availability?
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => setAvailabilityModal({ open: false, type: 'Disable', id: null })}
                className="flex-1 px-4 py-2 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAvailabilityAction}
                className={`flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm ${availabilityModal.type === 'Enable' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
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
