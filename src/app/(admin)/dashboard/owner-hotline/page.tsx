"use client";

import { useState } from "react";
import { 
  Headphones,
  MessageSquare,
  Search,
  Bot,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Smartphone,
  ChevronRight,
  Filter
} from "lucide-react";

export default function OwnerHotlinePage() {
  const [activeChat, setActiveChat] = useState("chat-1");

  const chats = [
    {
      id: "chat-1",
      owner: "David Cohen",
      phone: "+972 50-987-6543",
      status: "Active",
      handledBy: "Bot",
      lastMessage: "I need to change the price for next week.",
      time: "2 mins ago",
      messages: [
        { sender: "owner", text: "Hi, I need to change the price for my apartment for next week.", time: "10:14 AM" },
        { sender: "bot", text: "Hello David! I can help with that. Which apartment are you referring to? (Reply with the ID or address)", time: "10:14 AM" },
        { sender: "owner", text: "The one in Ramat Eshkol, ID A-1204.", time: "10:15 AM" },
        { sender: "bot", text: "Got it. The current price is ₪1200. What would you like the new price to be for next Shabbos?", time: "10:15 AM" },
        { sender: "owner", text: "Change it to ₪1000 please.", time: "10:16 AM" },
      ]
    },
    {
      id: "chat-2",
      owner: "Sarah Klein",
      phone: "+972 53-222-1111",
      status: "Needs Human",
      handledBy: "Unassigned",
      lastMessage: "The automated system isn't understanding me.",
      time: "15 mins ago",
      messages: [
        { sender: "owner", text: "I have a complex question about taxes.", time: "09:50 AM" },
        { sender: "bot", text: "I can help with basic billing questions. For tax documents, please check the Finance tab.", time: "09:50 AM" },
        { sender: "owner", text: "No, I need to know if the ₪28 fee includes VAT.", time: "09:51 AM" },
        { sender: "bot", text: "The annual listing fee is ₪28. You can pay via credit card.", time: "09:51 AM" },
        { sender: "owner", text: "The automated system isn't understanding me. I need a human.", time: "09:52 AM" },
      ]
    },
    {
      id: "chat-3",
      owner: "Moshe",
      phone: "+1 212-555-0198",
      status: "Resolved",
      handledBy: "Admin (Yossi)",
      lastMessage: "Thank you for the help.",
      time: "1 hour ago",
      messages: [
        { sender: "owner", text: "My photos are upside down on the website.", time: "08:10 AM" },
        { sender: "admin", text: "Hi Moshe, I'm taking a look at your listing now.", time: "08:15 AM" },
        { sender: "admin", text: "I've rotated the photos and saved the changes. It should look correct now.", time: "08:18 AM" },
        { sender: "owner", text: "Looks great now. Thank you for the help.", time: "08:20 AM" },
      ]
    }
  ];

  const selectedChat = chats.find(c => c.id === activeChat) || chats[0];

  return (
    <div className="space-y-6 font-sans pb-10 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Headphones className="w-8 h-8 text-orange-500" /> Owner Hotline & WhatsApp
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Live monitoring of WhatsApp interactions between owners and the AI Bot / Admins.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
           <div className="text-center px-2">
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">95%</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Bot Deflection</div>
           </div>
           <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800"></div>
           <div className="text-center px-2">
              <div className="text-xl font-black text-blue-600 dark:text-blue-400">&lt; 1m</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Avg Response</div>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Panel: Chat List */}
        <div className="w-full lg:w-1/3 flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between mb-2">
               <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-500" /> WhatsApp Sessions
               </h3>
               <button className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                  <Filter className="w-4 h-4" />
               </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search owners or numbers..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-300 bg-white text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat.id)}
                className={`p-4 cursor-pointer transition-colors ${activeChat === chat.id ? 'bg-orange-50/50 dark:bg-orange-900/10 border-l-4 border-l-orange-500' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-zinc-900 dark:text-white text-sm">{chat.owner}</div>
                  <span className="text-[10px] text-zinc-500">{chat.time}</span>
                </div>
                <div className="text-xs font-mono text-zinc-500 mb-2">{chat.phone}</div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 mb-3">
                  {chat.lastMessage}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    chat.status === 'Needs Human' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 
                    chat.status === 'Active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 
                    'bg-zinc-100 text-zinc-700 dark:bg-zinc-800'
                  }`}>
                    {chat.status === 'Needs Human' && <AlertCircle className="w-3 h-3" />}
                    {chat.status}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                    {chat.handledBy === 'Bot' ? <Bot className="w-3 h-3 text-purple-500" /> : <User className="w-3 h-3" />} 
                    {chat.handledBy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Live Chat */}
        <div className="w-full lg:w-2/3 flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden relative bg-[#e5ddd5] dark:bg-[#0b141a]">
          
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900 flex justify-between items-center z-10 shadow-sm">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  <User className="w-5 h-5 text-zinc-500" />
               </div>
               <div>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white">{selectedChat.owner}</h2>
                  <p className="text-xs font-mono text-zinc-500">{selectedChat.phone}</p>
               </div>
            </div>
            <div className="flex gap-2">
               {selectedChat.status === 'Needs Human' && (
                  <button className="px-4 py-2 text-xs font-bold rounded-lg bg-orange-500 text-white shadow-sm hover:bg-orange-600 transition-colors animate-pulse">
                     Take Over Chat
                  </button>
               )}
               {selectedChat.status !== 'Needs Human' && (
                  <button className="px-4 py-2 text-xs font-bold rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900">
                     Join as Admin
                  </button>
               )}
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar relative z-10" style={{ backgroundImage: "url('https://i.ibb.co/3mThcXc/chat-bg.png')", backgroundSize: "cover", backgroundAttachment: "fixed" }}>
            <div className="flex justify-center mb-6">
               <span className="px-3 py-1 bg-white/80 dark:bg-zinc-800/80 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-400 shadow-sm backdrop-blur-sm">
                  Today
               </span>
            </div>

            {selectedChat.messages.map((msg, i) => {
               const isOwner = msg.sender === 'owner';
               const isBot = msg.sender === 'bot';
               
               return (
                  <div key={i} className={`flex ${isOwner ? 'justify-start' : 'justify-end'}`}>
                     <div className={`
                        max-w-[75%] rounded-xl px-4 py-2 shadow-sm relative
                        ${isOwner 
                           ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tl-none border border-zinc-200/50 dark:border-zinc-700/50' 
                           : 'bg-[#dcf8c6] dark:bg-[#005c4b] text-zinc-900 dark:text-white rounded-tr-none'
                        }
                     `}>
                        {!isOwner && (
                           <div className="text-[10px] font-bold mb-1 flex items-center gap-1 opacity-70">
                              {isBot ? <><Bot className="w-3 h-3" /> AI Assistant</> : <><User className="w-3 h-3" /> Admin</>}
                           </div>
                        )}
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div className="text-[10px] text-right mt-1 opacity-60 font-medium">
                           {msg.time}
                        </div>
                     </div>
                  </div>
               );
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#f0f2f5] dark:bg-[#202c33] z-10 flex gap-2">
             <input 
               type="text"
               disabled={selectedChat.status !== 'Resolved' && selectedChat.handledBy !== 'Admin (Yossi)' && selectedChat.status !== 'Needs Human'}
               placeholder={selectedChat.handledBy === 'Bot' ? "Take over chat to reply..." : "Type a message..."}
               className="flex-1 rounded-full border-none bg-white px-5 py-3 text-sm focus:ring-0 outline-none dark:bg-[#2a3942] dark:text-white disabled:opacity-50"
             />
             <button 
               disabled={selectedChat.handledBy === 'Bot'}
               className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50 disabled:bg-zinc-400"
             >
                <ChevronRight className="w-6 h-6 ml-1" />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
