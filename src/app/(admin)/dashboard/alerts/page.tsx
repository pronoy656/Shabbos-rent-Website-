"use client";

import { useState } from "react";
import { 
  ShieldAlert, CheckCircle, Info, AlertTriangle, Plus, Trash2, Edit, X, Megaphone, ChevronDown, Check
} from "lucide-react";
import { 
  useAlerts, 
  useCreateAlert, 
  useUpdateAlert, 
  useDeleteAlert 
} from "@/hooks/useAlert";
import { AlertType, TargetRole, Alert } from "@/types/alert.types";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/utils/toast";

const getAlertIcon = (type: string) => {
  switch (type) {
    case AlertType.INFO:
      return Info;
    case AlertType.WARNING:
      return AlertTriangle;
    case AlertType.SUCCESS:
      return CheckCircle;
    case AlertType.URGENT:
      return ShieldAlert;
    default:
      return Info;
  }
};

const getAlertBg = (type: string) => {
  switch (type) {
    case AlertType.INFO:
      return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
    case AlertType.WARNING:
      return "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400";
    case AlertType.SUCCESS:
      return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400";
    case AlertType.URGENT:
      return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400";
  }
};

export default function AlertsPage() {
  const { data: alertsData, isLoading } = useAlerts();
  const { mutate: createAlert, isPending: isCreating } = useCreateAlert();
  const { mutate: updateAlert, isPending: isUpdating } = useUpdateAlert();
  const { mutate: deleteAlert, isPending: isDeleting } = useDeleteAlert();
  
  const alerts = alertsData?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AlertType>(AlertType.INFO);
  const [targetRole, setTargetRole] = useState<TargetRole | "ALL">("ALL");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleOpenModal = (alert?: Alert) => {
    if (alert) {
      setEditingAlert(alert);
      setTitle(alert.title);
      setMessage(alert.message);
      setType(alert.type);
      setTargetRole(alert.targetRole || "ALL");
      setLink(alert.link || "");
      setIsActive(alert.isActive);
    } else {
      setEditingAlert(null);
      setTitle("");
      setMessage("");
      setType(AlertType.INFO);
      setTargetRole("ALL");
      setLink("");
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const payload = {
      title,
      message,
      type,
      targetRole: targetRole === "ALL" ? null : targetRole,
      link: link || null,
      isActive,
    };

    if (editingAlert) {
      updateAlert({ id: editingAlert.id, data: payload }, {
        onSuccess: () => {
          showToast({ title: "Alert Updated", message: "System alert was updated successfully.", type: "info" });
          setIsModalOpen(false);
        }
      });
    } else {
      createAlert(payload, {
        onSuccess: () => {
          showToast({ title: "Alert Broadcasted", message: "System alert has been broadcasted to users.", type: "info" });
          setIsModalOpen(false);
        }
      });
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteAlert(deleteId, {
        onSuccess: () => {
          showToast({ title: "Alert Deleted", message: "System alert removed.", type: "info" });
          setDeleteId(null);
        }
      });
    }
  };

  return (
    <div className="font-sans space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Alerts & Notifications</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Broadcast system updates, maintenance notices, and announcements to users.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#4c55a4] px-4 py-2 text-xs font-bold text-white shadow-md transition-all cursor-pointer hover:bg-[#3d4484] active:scale-95"
        >
          <Megaphone className="h-4 w-4" />
          <span>Broadcast New Alert</span>
        </button>
      </div>
      
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4c55a4] mx-auto mb-4"></div>
            Loading alerts history...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
            No system alerts found. Broadcast your first alert to users.
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div key={alert.id} className={`flex items-start gap-4 rounded-xl border ${alert.isActive ? "border-zinc-200 dark:border-zinc-800" : "border-zinc-200 dark:border-zinc-800 opacity-60"} bg-white p-5 shadow-sm dark:bg-zinc-900 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getAlertBg(alert.type)}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{alert.title}</h3>
                      {!alert.isActive && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full dark:bg-zinc-800">Inactive</span>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full dark:bg-blue-900/40 dark:text-blue-400">
                        {alert.targetRole ? `Role: ${alert.targetRole}` : "ALL USERS"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                      </span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenModal(alert)} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(alert.id)} className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{alert.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#4c55a4]" />
                {editingAlert ? "Edit Alert" : "Broadcast New Alert"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Alert Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="System Maintenance"
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Alert Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Details of the alert..."
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Optional Action Link</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/announcements/maintenance"
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Alert Type</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer">
                      <span>{type}</span>
                      <ChevronDown className="w-4 h-4 text-zinc-400 opacity-80" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[--anchor-width] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl z-50">
                      {Object.values(AlertType).map((t) => (
                        <DropdownMenuItem key={t} onClick={() => setType(t as AlertType)} className="cursor-pointer rounded-lg py-2 px-3 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          {t}
                          {type === t && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Target Audience</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer">
                      <span>{targetRole}</span>
                      <ChevronDown className="w-4 h-4 text-zinc-400 opacity-80" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[--anchor-width] rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl z-50">
                      <DropdownMenuItem onClick={() => setTargetRole("ALL")} className="cursor-pointer rounded-lg py-2 px-3 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        ALL USERS
                        {targetRole === "ALL" && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                      </DropdownMenuItem>
                      {Object.values(TargetRole).map((r) => (
                        <DropdownMenuItem key={r} onClick={() => setTargetRole(r as TargetRole)} className="cursor-pointer rounded-lg py-2 px-3 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          {r}
                          {targetRole === r && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="pt-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                   <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Active Alert (visible to users)</span>
                 </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2.5 bg-[#4c55a4] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer hover:bg-[#3d4484] disabled:opacity-50 flex items-center gap-2"
                >
                  {(isCreating || isUpdating) && <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>}
                  {editingAlert ? "Save Changes" : "Broadcast Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 text-center p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Are you sure?</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              This action cannot be undone. This will permanently delete the system alert.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 text-xs font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl transition-colors dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
