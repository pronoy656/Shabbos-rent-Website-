"use client";

import { useState } from "react";
import { 
  Phone,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  ArrowRight,
  Settings,
  PhoneCall,
  PhoneOff,
  UserPlus
} from "lucide-react";

export default function UploadHotlinePage() {
  const [activeTab, setActiveTab] = useState("schedule");

  const schedule = [
    { day: "Sunday", shifts: [{ time: "09:00 - 14:00", staff: "Sarah" }, { time: "14:00 - 18:00", staff: "Yossi" }] },
    { day: "Monday", shifts: [{ time: "09:00 - 14:00", staff: "Rivka" }, { time: "14:00 - 18:00", staff: "Yossi" }] },
    { day: "Tuesday", shifts: [{ time: "09:00 - 14:00", staff: "Sarah" }, { time: "14:00 - 18:00", staff: "Rivka" }] },
    { day: "Wednesday", shifts: [{ time: "09:00 - 14:00", staff: "Yossi" }, { time: "14:00 - 18:00", staff: "Sarah" }] },
    { day: "Thursday", shifts: [{ time: "09:00 - 14:00", staff: "Sarah" }, { time: "14:00 - 18:00", staff: "Yossi" }] },
    { day: "Friday", shifts: [{ time: "09:00 - 13:00", staff: "Rivka" }] },
  ];

  const missedCalls = [
    { time: "Today, 10:45", number: "+972 50-123-4567", status: "Returned by Sarah", returned: true },
    { time: "Yesterday, 16:30", number: "+972 54-987-6543", status: "Not returned yet", returned: false },
    { time: "Yesterday, 14:15", number: "+972 52-555-6666", status: "Not returned yet", returned: false },
  ];

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Phone className="w-8 h-8 text-green-600" /> Upload Hotline
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage staff schedules, routing, and missed calls for the apartment upload line.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
           <div className="flex items-center gap-2 px-3 py-1">
              <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Hotline is Active</span>
           </div>
           <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700"></div>
           <div className="px-3 py-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Current shift: <span className="font-bold text-zinc-900 dark:text-white">Sarah</span>
           </div>
        </div>
      </div>

      <div className="flex space-x-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 p-1 w-fit border border-zinc-200 dark:border-zinc-800">
         {[
            { id: "schedule", label: "Weekly Schedule", icon: Calendar },
            { id: "missed", label: "Missed Calls", icon: PhoneOff },
            { id: "routing", label: "Call Routing Rules", icon: Settings },
         ].map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`
                  flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all
                  ${activeTab === tab.id 
                     ? "bg-white dark:bg-zinc-800 text-green-600 shadow-sm border border-zinc-200 dark:border-zinc-700" 
                     : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 border border-transparent"}
               `}
            >
               <tab.icon className="w-4 h-4" /> {tab.label}
               {tab.id === 'missed' && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">2</span>}
            </button>
         ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         
         {/* Main Content Area based on tabs */}
         <div className="lg:col-span-2 space-y-6">
            
            {activeTab === "schedule" && (
               <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                  <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                     <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Weekly Coverage</h2>
                     <button className="text-sm font-bold text-green-600 flex items-center gap-1 hover:text-green-700">
                        <UserPlus className="w-4 h-4" /> Add Shift
                     </button>
                  </div>
                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                     {schedule.map((day, i) => (
                        <div key={i} className="p-5 flex flex-col md:flex-row md:items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                           <div className="w-32 font-bold text-zinc-900 dark:text-white">{day.day}</div>
                           <div className="flex-1 grid gap-3 sm:grid-cols-2">
                              {day.shifts.map((shift, j) => (
                                 <div key={j} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 shadow-sm">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold flex items-center justify-center text-xs">
                                          {shift.staff.charAt(0)}
                                       </div>
                                       <div>
                                          <div className="text-sm font-bold text-zinc-900 dark:text-white">{shift.staff}</div>
                                          <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                             <Clock className="w-3 h-3" /> {shift.time}
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === "missed" && (
               <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                  <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                     <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Missed Calls Log</h2>
                     <p className="text-sm text-zinc-500">Calls not answered by any staff member in the routing chain.</p>
                  </div>
                  <table className="w-full text-left text-sm">
                     <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                           <th className="px-5 py-3">Time</th>
                           <th className="px-5 py-3">Phone Number</th>
                           <th className="px-5 py-3">Status</th>
                           <th className="px-5 py-3 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {missedCalls.map((call, i) => (
                           <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                              <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{call.time}</td>
                              <td className="px-5 py-4 font-bold text-zinc-900 dark:text-white">{call.number}</td>
                              <td className="px-5 py-4">
                                 {call.returned ? (
                                    <span className="inline-flex px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold dark:bg-emerald-900/30 dark:text-emerald-400">
                                       {call.status}
                                    </span>
                                 ) : (
                                    <span className="inline-flex px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold dark:bg-red-900/30 dark:text-red-400">
                                       {call.status}
                                    </span>
                                 )}
                              </td>
                              <td className="px-5 py-4 text-right">
                                 {!call.returned && (
                                    <button className="text-xs font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-3 py-1.5 rounded-lg shadow-sm">
                                       Mark Returned
                                    </button>
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {activeTab === "routing" && (
               <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Escalation Rules</h2>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-4 p-4 rounded-xl border border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-950/20">
                        <div className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center font-black text-green-800 dark:text-green-200">1</div>
                        <div className="flex-1">
                           <div className="font-bold text-green-900 dark:text-green-300">Primary Shift Worker</div>
                           <div className="text-sm text-green-700 dark:text-green-400/80">Rings for 20 seconds</div>
                        </div>
                     </div>
                     
                     <div className="flex justify-center -my-2">
                        <ArrowRight className="w-5 h-5 text-zinc-300 dark:text-zinc-600 rotate-90" />
                     </div>
                     
                     <div className="flex items-center gap-4 p-4 rounded-xl border border-orange-200 bg-orange-50/50 dark:border-orange-900/30 dark:bg-orange-950/20">
                        <div className="w-8 h-8 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center font-black text-orange-800 dark:text-orange-200">2</div>
                        <div className="flex-1">
                           <div className="font-bold text-orange-900 dark:text-orange-300">Fallback Worker (Yossi)</div>
                           <div className="text-sm text-orange-700 dark:text-orange-400/80">Rings for 15 seconds</div>
                        </div>
                        <button className="text-xs font-bold text-orange-600 underline">Change</button>
                     </div>

                     <div className="flex justify-center -my-2">
                        <ArrowRight className="w-5 h-5 text-zinc-300 dark:text-zinc-600 rotate-90" />
                     </div>
                     
                     <div className="flex items-center gap-4 p-4 rounded-xl border border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/20">
                        <div className="w-8 h-8 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center font-black text-red-800 dark:text-red-200">3</div>
                        <div className="flex-1">
                           <div className="font-bold text-red-900 dark:text-red-300">Voicemail Inbox</div>
                           <div className="text-sm text-red-700 dark:text-red-400/80">Caller is prompted to leave a message</div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
               <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-green-500" /> Today's Stats
               </h3>
               <div className="space-y-4">
                  <div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-500">Total Calls</span>
                        <span className="font-bold text-zinc-900 dark:text-white">42</span>
                     </div>
                     <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-500">Answered by Primary</span>
                        <span className="font-bold text-zinc-900 dark:text-white">28</span>
                     </div>
                     <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-500">Escalated to Fallback</span>
                        <span className="font-bold text-zinc-900 dark:text-white">10</span>
                     </div>
                     <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-500">Went to Voicemail</span>
                        <span className="font-bold text-red-600 dark:text-red-400">4</span>
                     </div>
                     <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '11%' }}></div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/50 shadow-sm dark:border-blue-900/30 dark:bg-blue-950/20 p-6 text-center">
               <AlertTriangle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
               <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Coverage Alert</h3>
               <p className="text-sm text-blue-700 dark:text-blue-400/80 mb-4">
                  There is no primary staff member assigned for Friday afternoon (13:00 - 18:00).
               </p>
               <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-sm transition-colors">
                  Assign Staff Now
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
