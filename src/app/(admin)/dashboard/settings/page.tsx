"use client";

import { useState, useEffect, useRef } from "react";
import { Gift, User, Camera, Mail, Lock, CheckCircle2 } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { useMe } from "@/hooks/useAuth";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "promotion">("profile");
  
  // Promotion State
  const [isFirstYearFreeActive, setIsFirstYearFreeActive] = useState(false);

  // Profile State
  const { data: meUser } = useMe();
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [localUser, setLocalUser] = useState<any>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isFirstYearFreeActive");
      if (saved !== null) {
        setIsFirstYearFreeActive(saved === "true");
      }
      
      const stored = localStorage.getItem("authUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocalUser(parsed);
        setEmail(parsed.email || "");
      }
    }
  }, []);

  useEffect(() => {
    if (meUser) {
      setEmail(meUser.email || "");
    }
  }, [meUser]);

  const toggleFirstYearFree = () => {
    const newVal = !isFirstYearFreeActive;
    setIsFirstYearFreeActive(newVal);
    localStorage.setItem("isFirstYearFreeActive", String(newVal));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    
    try {
      const { updateMe } = await import("@/services/user.service");
      const { changePassword } = await import("@/services/auth.service");

      // 1. Update Profile (Email and Image)
      let hasChanges = false;
      const formData = new FormData();

      if (email && email !== currentUser?.email) {
        formData.append("email", email);
        hasChanges = true;
      }
      if (imageFile) {
        formData.append("image", imageFile);
        hasChanges = true;
      }

      if (hasChanges) {
        const response = await updateMe(formData);
        const updatedUser = { ...localUser, email };
        if (response?.data?.profileImage) {
          updatedUser.profileImage = response.data.profileImage;
        }
        setLocalUser(updatedUser);
        localStorage.setItem("authUser", JSON.stringify(updatedUser));
      }

      // 2. Change Password
      if (oldPassword && password && password === confirmPassword) {
        await changePassword({ oldPassword, newPassword: password });
      }

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const currentUser = meUser || localUser;
  const adminDisplayName = currentUser?.username || "Admin";

  return (
    <div className="font-sans space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white capitalize">Settings Management</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your admin profile and system-wide promotions.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-100/80 dark:bg-zinc-800/50 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-700/50 w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === "profile" ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"}`}
        >
          <User className="w-4 h-4" />
          Edit Profile
        </button>
        <button 
          onClick={() => setActiveTab("promotion")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === "promotion" ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"}`}
        >
          <Gift className="w-4 h-4" />
          Promotion
        </button>
      </div>
      
      {activeTab === "profile" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Profile Settings</h2>
            
            {profileSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 font-semibold text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-8 max-w-xl">
              
              {/* Profile Image */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <UserAvatar
                    src={imagePreview || currentUser?.profileImage}
                    name={adminDisplayName}
                    email={email}
                    size="2xl"
                    className="border-4 border-zinc-50 dark:border-zinc-950 shadow-md w-24 h-24"
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white">Profile Photo</h3>
                  <p className="text-sm text-zinc-500 mb-2">Upload a new photo to change your avatar.</p>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    Change photo
                  </button>
                </div>
              </div>

              {/* Email & Password Fields */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Current Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-zinc-400" />
                        </div>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-zinc-400" />
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-zinc-400" />
                        </div>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-70 flex items-center justify-center min-w-[140px]"
                >
                  {isSubmittingProfile ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === "promotion" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 max-w-2xl">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-500" /> Promotions & Offers
            </h2>
            
            <div className="flex items-center justify-between p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl">
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white">First Year Free Promotion</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  If enabled, new owners will get their first year subscription (normally ₪28) for free.
                </p>
              </div>
              <button
                onClick={toggleFirstYearFree}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isFirstYearFreeActive ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isFirstYearFreeActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
