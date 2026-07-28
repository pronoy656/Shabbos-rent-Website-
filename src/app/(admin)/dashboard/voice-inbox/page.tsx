"use client";

import { useState } from "react";
import { 
  Mic, 
  Search, 
  Filter, 
  Play, 
  Pause,
  Clock, 
  CheckCircle2, 
  Sparkles, 
  User,
  MessageSquare,
  AlertCircle,
  PhoneCall,
  RefreshCw,
  ChevronDown
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VoiceInboxPage() {
  const [activeMessage, setActiveMessage] = useState<string | null>("v-1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const voicemails = [
    {
      id: "v-1",
      phone: "+972 54-123-4567",
      caller: "Unknown",
      duration: "0:45",
      time: "2 mins ago",
      status: "Unread",
      assignedTo: "Me",
      transcript: "Hi, I'm trying to book the apartment in Geula for next Shabbos, but the payment link isn't working for me. Can someone please call me back? Thanks.",
      aiSummary: "Caller wants to book in Geula for next Shabbos but is experiencing issues with the payment link.",
      aiTasks: ["Call back caller", "Check payment link status"],
      notes: []
    },
    {
      id: "v-2",
      phone: "+972 50-987-6543",
      caller: "David Cohen",
      duration: "1:12",
      time: "1 hour ago",
      status: "In Progress",
      assignedTo: "Sarah",
      transcript: "Shalom, this is David Cohen. I just uploaded a new apartment in Ramat Eshkol. I need it approved as soon as possible because I have someone who wants to rent it this week. Please check it.",
      aiSummary: "Owner David Cohen uploaded a new apartment in Ramat Eshkol and requests urgent approval.",
      aiTasks: ["Review Ramat Eshkol listing", "Approve listing if valid"],
      notes: [
        { author: "Sarah", text: "Checking the photos now.", time: "45 mins ago" }
      ]
    },
    {
      id: "v-3",
      phone: "+972 52-333-4444",
      caller: "Rivka",
      duration: "0:20",
      time: "3 hours ago",
      status: "Resolved",
      assignedTo: "Me",
      transcript: "Yes, just confirming that we left the apartment. Everything was great. Left the keys on the table.",
      aiSummary: "Renter confirmed checkout and left keys on the table.",
      aiTasks: ["Mark rental as completed"],
      notes: [
        { author: "Admin (You)", text: "Marked as completed in system.", time: "1 hour ago" }
      ]
    }
  ];

  const selectedVoicemail = voicemails.find(v => v.id === activeMessage) || voicemails[0];

  return (
    <div className="space-y-6 font-sans pb-10 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Mic className="w-8 h-8 text-blue-600" /> Voice Inbox
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Real-time sync active
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-400 transition-colors">
            <Sparkles className="mr-2 h-4 w-4" /> Bulk Transcribe Unread
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Panel: List */}
        <div className="w-full lg:w-1/3 flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search transcripts, numbers..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-300 bg-zinc-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex-1 inline-flex items-center justify-between rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                  {statusFilter}
                  <ChevronDown className="h-3 w-3 ml-2" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["All Statuses", "Unread", "In Progress", "Resolved"].map(s => (
                    <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>{s}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <button className="flex-1 inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                <Filter className="mr-1.5 h-3 w-3" /> Assigned to Me
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {voicemails.map(vm => (
              <div 
                key={vm.id} 
                onClick={() => setActiveMessage(vm.id)}
                className={`p-4 border-b border-zinc-100 dark:border-zinc-800/60 cursor-pointer transition-colors ${activeMessage === vm.id ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    {vm.phone}
                    {vm.status === 'Unread' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                  </div>
                  <span className="text-xs text-zinc-500">{vm.time}</span>
                </div>
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                  {vm.caller !== 'Unknown' ? vm.caller : 'Unknown Caller'}
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {vm.transcript}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    vm.status === 'Unread' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 
                    vm.status === 'In Progress' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' : 
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
                  }`}>
                    {vm.status}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                    <User className="w-3 h-3" /> {vm.assignedTo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Detail */}
        <div className="w-full lg:w-2/3 flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-1">{selectedVoicemail.phone}</h2>
                <p className="text-sm font-medium text-zinc-500 flex items-center gap-2">
                  <User className="w-4 h-4" /> {selectedVoicemail.caller} • {selectedVoicemail.time}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-bold rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300">
                  Assign
                </button>
                <button className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Mark Resolved
                </button>
              </div>
            </div>

            {/* Audio Player */}
            <div className="flex items-center gap-4 bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 hover:bg-blue-700 transition-colors shadow-sm"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
              </button>
              <div className="flex-1">
                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-1/3"></div>
                </div>
              </div>
              <div className="text-xs font-bold text-zinc-500 w-10 text-right font-mono">
                {selectedVoicemail.duration}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
            
            {/* Transcript */}
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-500" /> Whisper AI Transcript
              </h3>
              <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 leading-relaxed text-sm">
                "{selectedVoicemail.transcript}"
              </div>
            </div>

            {/* AI Summary & Tasks */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-950/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> AI Summary
                </h4>
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  {selectedVoicemail.aiSummary}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Suggested Tasks
                </h4>
                <ul className="space-y-2">
                  {selectedVoicemail.aiTasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-900 dark:text-emerald-300">
                      <div className="w-4 h-4 rounded border border-emerald-300 dark:border-emerald-700 shrink-0 mt-0.5"></div>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Natural Language Query Mode */}
            <div className="p-4 rounded-xl border border-purple-200 bg-white shadow-sm dark:border-purple-900/30 dark:bg-zinc-950 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles className="w-24 h-24" />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">Ask AI about this caller...</h4>
              <div className="flex gap-2 relative z-10">
                <input 
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="e.g. Has this number called before?"
                  className="flex-1 rounded-lg border border-purple-200 bg-purple-50/30 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none dark:border-purple-800/50 dark:bg-purple-900/10 dark:text-white"
                />
                <button className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-bold shadow-sm hover:bg-purple-700 transition-colors">
                  Ask
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-orange-500" /> Staff Notes
              </h3>
              <div className="space-y-4 mb-4">
                {selectedVoicemail.notes.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic">No notes added yet.</p>
                ) : (
                  selectedVoicemail.notes.map((note, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-orange-700 dark:text-orange-400">{note.author.charAt(0)}</span>
                      </div>
                      <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl rounded-tl-none p-3 border border-zinc-100 dark:border-zinc-800">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-bold text-xs text-zinc-900 dark:text-white">{note.author}</span>
                          <span className="text-[10px] text-zinc-500">{note.time}</span>
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{note.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Type a note..."
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
                <button className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-bold shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 transition-colors">
                  Add
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
