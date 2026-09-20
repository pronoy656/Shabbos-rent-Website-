"use client";

import { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  Edit3,
  Phone,
  MapPin,
  Clock,
  Eye,
  Lock,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMe } from "@/hooks/useAuth";
import UserAvatar from "@/components/common/UserAvatar";
import EditProfileModal from "@/components/settings/EditProfileModal";
import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import { toast } from "sonner";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [settingsSubTab, setSettingsSubTab] = useState<"profile" | "security">("profile");

  // User Profile Data
  const { data: meUser } = useMe();
  const [localAuthUser, setLocalAuthUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("authUser");
      if (stored) {
        setLocalAuthUser(JSON.parse(stored));
      }
    } catch {}
  }, [meUser]);

  const currentProfileUser = meUser || localAuthUser;
  const profileDisplayName = currentProfileUser?.username || "";
  const profileDisplayEmail = currentProfileUser?.email || "";
  const profileDisplayPhone = currentProfileUser?.phone || "";
  const profileDisplayLocation = currentProfileUser?.location || "";

  // Modals
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Visibility Card
  const [isApartmentVisible, setIsApartmentVisible] = useState(true);
  const [isHideReasonModalOpen, setIsHideReasonModalOpen] = useState(false);
  const [hideReason, setHideReason] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVisibility = localStorage.getItem("isApartmentVisible");
      if (savedVisibility !== null) {
        setIsApartmentVisible(savedVisibility === "true");
      }
    }
  }, []);

  const handleToggleVisibility = (newVal: boolean) => {
    if (!newVal) {
      setIsHideReasonModalOpen(true);
    } else {
      setIsApartmentVisible(true);
      localStorage.setItem("isApartmentVisible", "true");
      toast.success("Apartment listing is now visible to guests.");
    }
  };

  const handleConfirmHide = () => {
    setIsApartmentVisible(false);
    localStorage.setItem("isApartmentVisible", "false");
    setIsHideReasonModalOpen(false);
    toast.success("Apartment listing has been hidden.");
  };

  const settingsTabs = [
    { id: "profile" as const, label: "Profile Information", icon: User },
    { id: "security" as const, label: "Security & Password", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {t("dashboard.nav.settings") || "Settings & Preferences"}
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your personal account details, listing visibility, and login security.
        </p>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-100/80 dark:bg-zinc-800/50 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-700/50 w-fit shadow-xs">
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSettingsSubTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
              settingsSubTab === tab.id
                ? "bg-white dark:bg-zinc-900 text-[#4c55a4] dark:text-indigo-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab Content */}
      {settingsSubTab === "profile" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Profile Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-zinc-100 dark:border-zinc-800 shadow-sm">
                <UserAvatar
                  src={currentProfileUser?.profileImage}
                  name={profileDisplayName || "User"}
                  email={profileDisplayEmail}
                  size="2xl"
                  className="w-full h-full text-3xl"
                />
              </div>

              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                  {profileDisplayName || "User"}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-2 text-sm">
                  {profileDisplayEmail || "No email provided"}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-zinc-400 font-medium">
                  <Clock className="w-4 h-4" /> Member since{" "}
                  {currentProfileUser?.createdAt
                    ? new Date(currentProfileUser.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "July 2024"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 block">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-medium text-sm">
                  <Phone className="w-4 h-4 text-zinc-400" />{" "}
                  {profileDisplayPhone || "Not provided"}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 block">
                  Location
                </label>
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-medium text-sm">
                  <MapPin className="w-4 h-4 text-zinc-400" />{" "}
                  {profileDisplayLocation || "Not provided"}
                </div>
              </div>
            </div>
          </div>

          {/* Visibility Toggle Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col shadow-sm w-full gap-4">
            <div className="flex items-start justify-between w-full">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                    Apartment Visibility:{" "}
                    <span className={isApartmentVisible ? "text-emerald-600" : "text-zinc-500"}>
                      {isApartmentVisible ? "Visible" : "Hidden"}
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
                    Temporarily hide your apartment from public guest searches if you are doing renovations or not hosting for a period.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleVisibility(!isApartmentVisible)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  isApartmentVisible ? "bg-[#4c55a4]" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isApartmentVisible ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab Content */}
      {settingsSubTab === "security" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Account Password & Credentials
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Keep your account secure with a strong password. You can change your password at any time.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-6 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-bold text-sm transition-colors shadow-sm cursor-pointer"
            >
              Change Password
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={{
          name: currentProfileUser?.username || "",
          email: currentProfileUser?.email || "",
          phone: currentProfileUser?.phone || "",
          location: currentProfileUser?.location || "",
          profileImage: currentProfileUser?.profileImage || null,
        }}
        onSave={(data) => {
          const updated = {
            ...currentProfileUser,
            ...(data.name !== undefined && { username: data.name }),
            ...(data.phone !== undefined && { phone: data.phone }),
            ...(data.email !== undefined && { email: data.email }),
            ...(data.location !== undefined && { location: data.location }),
            ...(data.profileImage !== undefined && { profileImage: data.profileImage }),
          };
          setLocalAuthUser(updated);
          try {
            localStorage.setItem("authUser", JSON.stringify(updated));
            window.dispatchEvent(new Event("storage"));
          } catch {}
          toast.success("Profile updated successfully");
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Hide Reason Modal */}
      {isHideReasonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsHideReasonModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Hide Apartment Listing?
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Your apartment will not appear in guest search results until re-enabled.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Reason (Optional)
              </label>
              <select
                value={hideReason}
                onChange={(e) => setHideReason(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4c55a4]"
              >
                <option value="">Select reason...</option>
                <option value="renovation">Renovations or Maintenance</option>
                <option value="family">Using for personal family stays</option>
                <option value="longterm">Rented long-term</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsHideReasonModalOpen(false)}
                className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmHide}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-sm"
              >
                Hide Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
