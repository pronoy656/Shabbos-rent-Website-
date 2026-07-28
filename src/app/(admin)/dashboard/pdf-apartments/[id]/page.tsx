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
  CheckCircle2,
  Phone,
  MessageSquare,
  Activity,
  ShieldCheck,
  Clock,
  Eye,
  Settings,
  Plus
} from "lucide-react";

export default function ApartmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const apartmentId = resolvedParams.id;
  
  const [activeTab, setActiveTab] = useState("listing");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Toggles State
  const [toggles, setToggles] = useState({
    available: true,
    familyFriendly: true,
    whatsappEnabled: true,
    isActive: true,
    isAdminApproved: true
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    setToastMessage(`Setting updated successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const tabs = [
    { id: "listing", name: "Listing", icon: Home },
    { id: "owner", name: "Owner & Sub", icon: User },
    { id: "availability", name: "Availability", icon: Calendar },
    { id: "rentals", name: "Rentals", icon: FileText },
    { id: "notes", name: "Notes", icon: MessageSquare },
    { id: "activity", name: "Activity", icon: Activity },
    { id: "system", name: "System", icon: Settings },
  ];

  return (
    <div className="space-y-6 font-sans pb-20">
      {/* Top Header & Quick Toggles */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                Apartment {apartmentId}
              </h1>
              {!toggles.isActive ? (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                  Suspended
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Active
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Luxury Penthouse in Jerusalem • Geula
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">
              <Eye className="mr-2 h-4 w-4" />
              View Public Page
            </button>
            <button className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors">
              <Edit className="mr-2 h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
          {[
            { key: 'available', label: 'Available to Rent', color: 'bg-emerald-500' },
            { key: 'familyFriendly', label: 'Family Friendly', color: 'bg-blue-500' },
            { key: 'whatsappEnabled', label: 'WhatsApp Enabled', color: 'bg-green-500' },
            { key: 'isActive', label: 'Listing Active', color: 'bg-indigo-500' },
            { key: 'isAdminApproved', label: 'Admin Approved', color: 'bg-purple-500' },
          ].map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
              <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{toggle.label}</span>
              <button 
                onClick={() => handleToggle(toggle.key as keyof typeof toggles)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${toggles[toggle.key as keyof typeof toggles] ? toggle.color : 'bg-zinc-200 dark:bg-zinc-700'}`}
              >
                <span className="sr-only">Toggle {toggle.label}</span>
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${toggles[toggle.key as keyof typeof toggles] ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto hide-scrollbar">
        <nav className="-mb-px flex space-x-6 px-2" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-semibold text-sm transition-colors
                  ${isActive 
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}
                `}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}`} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        
        {/* 1. Listing Tab */}
        {activeTab === "listing" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Listing Title</label>
                    <input type="text" defaultValue="Luxury Penthouse in Jerusalem" className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">City</label>
                    <select className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white">
                      <option>Jerusalem</option>
                      <option>Tel Aviv</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Neighborhood</label>
                    <input type="text" defaultValue="Geula" className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Full Address</label>
                    <input type="text" defaultValue="123 Jaffa Road, Apt 4B" className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Floor</label>
                    <input type="number" defaultValue={4} className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Price (₪ per weekend)</label>
                    <input type="number" defaultValue={1200} className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Capacity & Description</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Total Rooms</label>
                    <input type="number" defaultValue={5} className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Total Beds</label>
                    <input type="number" defaultValue={8} className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
                  <textarea rows={5} defaultValue="Beautiful apartment in the heart of Jerusalem. Fully equipped for Shabbos." className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Image Gallery</h3>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">Manage</button>
                </div>
                <div className="space-y-3">
                  <div className="aspect-video rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <ImageIcon className="w-8 h-8 text-zinc-400 mb-2" />
                    <span className="text-xs font-medium text-zinc-500">Upload Cover Image</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(i => (
                       <div key={i} className="aspect-square rounded-md bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center relative group">
                         <ImageIcon className="w-4 h-4 text-zinc-400" />
                         <button className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Owner & Subscription Tab */}
        {activeTab === "owner" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" /> Owner Information
                </h3>
                <button className="text-sm font-semibold text-blue-600 dark:text-blue-400">View Full Profile</button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
                  <span className="text-sm text-zinc-500">Full Name</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">David Cohen</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
                  <span className="text-sm text-zinc-500">Phone Number</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">+972 54-123-4567</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
                  <span className="text-sm text-zinc-500">Email Address</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">david.cohen@example.com</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
                  <span className="text-sm text-zinc-500">Preferred Language</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">Hebrew</span>
                </div>
                <div className="flex justify-between pt-2">
                  <button className="flex-1 mr-2 inline-flex justify-center items-center gap-2 rounded-lg bg-green-50 text-green-700 px-4 py-2 text-sm font-bold hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </button>
                  <button className="flex-1 ml-2 inline-flex justify-center items-center gap-2 rounded-lg bg-blue-50 text-blue-700 px-4 py-2 text-sm font-bold hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
                    <Phone className="w-4 h-4" /> Call
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm dark:border-emerald-900/30 dark:bg-emerald-950/10 p-6 flex flex-col">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Annual Subscription
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Status of the ₪28 annual listing fee.</p>
              
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-2xl font-black text-emerald-700 dark:text-emerald-500 mb-1">Active</h4>
                <p className="text-sm font-medium text-emerald-600/70 dark:text-emerald-400/70">Valid until Aug 2027</p>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-white border border-zinc-200 text-zinc-700 px-4 py-2 text-sm font-bold hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300">
                  View Receipt
                </button>
                <button className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-bold hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
                  Renew Manually
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Availability Tab */}
        {activeTab === "availability" && (
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Upcoming Shabbos Availability</h3>
               <button className="text-sm font-semibold text-blue-600 dark:text-blue-400">Bulk Update</button>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-semibold">
                     <tr>
                        <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Date / Parsha</th>
                        <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Status</th>
                        <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                     {[
                        { date: "Aug 14-15", parsha: "Re'eh", status: "Available" },
                        { date: "Aug 21-22", parsha: "Shoftim", status: "Booked" },
                        { date: "Aug 28-29", parsha: "Ki Teitzei", status: "Unavailable" },
                     ].map((item, i) => (
                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                           <td className="px-5 py-4">
                              <div className="font-bold text-zinc-900 dark:text-white">{item.parsha}</div>
                              <div className="text-xs text-zinc-500 mt-0.5">{item.date}</div>
                           </td>
                           <td className="px-5 py-4">
                              {item.status === "Available" && <span className="inline-flex px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold dark:bg-emerald-900/30 dark:text-emerald-400">Available</span>}
                              {item.status === "Booked" && <span className="inline-flex px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/30 dark:text-blue-400">Booked</span>}
                              {item.status === "Unavailable" && <span className="inline-flex px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold dark:bg-red-900/30 dark:text-red-400">Unavailable</span>}
                           </td>
                           <td className="px-5 py-4 text-right">
                              <button className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-1.5">
                                 Toggle
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* 4. Rentals Tab */}
        {activeTab === "rentals" && (
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Rental History</h3>
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white font-semibold">
                     <tr>
                        <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Report ID</th>
                        <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Date</th>
                        <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Renter</th>
                        <th className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">Fee Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                     {[
                        { id: "R-8402", date: "Jul 10-11 (Pinchas)", renter: "Y. Levy", status: "Paid" },
                        { id: "R-8291", date: "Jun 26-27 (Korach)", renter: "M. Klein", status: "Paid" },
                     ].map((item, i) => (
                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                           <td className="px-5 py-4 font-mono text-xs text-zinc-500">{item.id}</td>
                           <td className="px-5 py-4 font-medium text-zinc-900 dark:text-white">{item.date}</td>
                           <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">{item.renter}</td>
                           <td className="px-5 py-4">
                              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                 {item.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* 5. Notes Tab */}
        {activeTab === "notes" && (
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Internal Staff Notes</h3>
            
            <div className="mb-8">
               <textarea 
                  rows={3} 
                  placeholder="Add a new note about this apartment or owner..." 
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white mb-3"
               />
               <div className="flex justify-end">
                  <button className="inline-flex items-center justify-center rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-bold shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 transition-colors">
                     <Plus className="w-4 h-4 mr-1.5" /> Add Note
                  </button>
               </div>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
               {[
                  { author: "Admin (You)", time: "Yesterday, 14:30", content: "Owner called, asked to lower the price to ₪1000 for next month." },
                  { author: "Sarah (Worker)", time: "Aug 1, 10:15", content: "Verified photos and activated listing." },
               ].map((note, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                     <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                        <User className="w-4 h-4" />
                     </div>
                     <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between mb-2">
                           <span className="font-bold text-sm text-zinc-900 dark:text-white">{note.author}</span>
                           <span className="text-xs font-medium text-zinc-500">{note.time}</span>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{note.content}</p>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        )}

        {/* 6. Activity Tab */}
        {activeTab === "activity" && (
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
             <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Communication Activity</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800/60 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                     <Phone className="w-4 h-4 text-indigo-500" /> Calls Today
                  </div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-white">12</div>
               </div>
               <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800/60 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                     <MessageSquare className="w-4 h-4 text-emerald-500" /> WhatsApp (Week)
                  </div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-white">45</div>
               </div>
               <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800/60 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                     <AlertTriangle className="w-4 h-4 text-red-500" /> Missed Calls
                  </div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-white">3</div>
               </div>
             </div>
          </div>
        )}

        {/* 7. System Tab */}
        {activeTab === "system" && (
          <div className="grid gap-6 md:grid-cols-2">
             <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
               <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">System Details</h3>
               <div className="space-y-3">
                  <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-2">
                     <span className="text-sm text-zinc-500">Record ID</span>
                     <span className="text-sm font-mono text-zinc-900 dark:text-white">{apartmentId}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-2">
                     <span className="text-sm text-zinc-500">Created At</span>
                     <span className="text-sm font-mono text-zinc-900 dark:text-white">2026-05-12 14:30:00</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-2">
                     <span className="text-sm text-zinc-500">Total Views</span>
                     <span className="text-sm font-mono text-zinc-900 dark:text-white">1,452</span>
                  </div>
                  <div className="flex justify-between pb-2">
                     <span className="text-sm text-zinc-500">Total Contacts</span>
                     <span className="text-sm font-mono text-zinc-900 dark:text-white">89</span>
                  </div>
               </div>
             </div>
             
             <div className="rounded-xl border border-red-200 bg-red-50/50 shadow-sm dark:border-red-900/30 dark:bg-red-950/20 p-6">
               <h3 className="text-lg font-bold text-red-700 dark:text-red-500 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Danger Zone
               </h3>
               <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6">
                  Irreversible actions for this apartment listing. Please be certain before proceeding.
               </p>
               <button className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-red-600 text-white px-4 py-2.5 text-sm font-bold shadow-sm hover:bg-red-700 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete Apartment Permanently
               </button>
             </div>
          </div>
        )}
      </div>

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
