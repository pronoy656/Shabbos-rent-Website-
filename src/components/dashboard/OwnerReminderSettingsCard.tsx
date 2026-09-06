'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  Calendar,
  PhoneCall,
  Mail,
  Smartphone,
  CheckCircle2,
  Save,
  Send,
  AlertCircle,
  Volume2,
  X,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  OwnerReminderConfig,
  DayOfWeek,
  ReminderDeliveryMethod,
  ReminderTriggerResult,
} from '@/types/ownerReminder';
import {
  getOwnerReminder,
  saveOwnerReminder,
  triggerTestReminder,
} from '@/services/ownerReminderService';
import { PhoneInput } from '@/components/common/PhoneInput';
import { formatPhoneNumber } from '@/utils/phoneUtils';
import { showToast } from '@/utils/toast';

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TIME_OPTIONS = [
  { value: '09:00', label: '09:00 AM (Morning)' },
  { value: '10:00', label: '10:00 AM (Mid-Morning)' },
  { value: '12:00', label: '12:00 PM (Noon)' },
  { value: '14:00', label: '02:00 PM (Afternoon)' },
  { value: '17:00', label: '05:00 PM (Late Afternoon)' },
  { value: '18:00', label: '06:00 PM (Evening)' },
  { value: '20:00', label: '08:00 PM (Night)' },
];

export interface OwnerReminderSettingsCardProps {
  ownerId?: string;
  defaultEmail?: string;
  defaultPhone?: string;
}

export const OwnerReminderSettingsCard: React.FC<OwnerReminderSettingsCardProps> = ({
  ownerId = 'current-owner-001',
  defaultEmail = 'owner@shabbosrent.com',
  defaultPhone = '972501234567',
}) => {
  const [config, setConfig] = useState<OwnerReminderConfig | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [testResult, setTestResult] = useState<ReminderTriggerResult | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);

  useEffect(() => {
    const loaded = getOwnerReminder(ownerId);
    if (!loaded.email) loaded.email = defaultEmail;
    if (!loaded.phone) loaded.phone = defaultPhone;
    setConfig(loaded);
  }, [ownerId, defaultEmail, defaultPhone]);

  if (!config) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = saveOwnerReminder(config, ownerId);
    setConfig(updated);
    setIsSaved(true);
    showToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your personal reminder settings have been saved successfully!',
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestReminder = () => {
    const result = triggerTestReminder(config);
    setTestResult(result);
    setShowTestModal(true);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-sm transition-all relative overflow-hidden">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center text-[#4c55a4] dark:text-indigo-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                Personal Availability Reminders
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                Self-Service
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Set your own schedule to get reminded to mark your apartment available for Shabbat.
            </p>
          </div>
        </div>

        {/* Enable / Disable Toggle Switch */}
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 self-start sm:self-auto">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 pl-2">
            {config.enabled ? 'Reminders Active' : 'Reminders Paused'}
          </span>
          <button
            type="button"
            onClick={() => {
              const updated = { ...config, enabled: !config.enabled };
              setConfig(updated);
              saveOwnerReminder(updated, ownerId);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4c55a4] focus:ring-offset-2 ${
              config.enabled ? 'bg-[#4c55a4]' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="mt-6 space-y-6">
        {/* Step 1: Day of Week Selection */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#4c55a4]" /> 1. Select Reminder Day
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {DAYS.map((day) => {
              const isSelected = config.dayOfWeek === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setConfig({ ...config, dayOfWeek: day })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all text-center ${
                    isSelected
                      ? 'bg-[#4c55a4] text-white border-[#4c55a4] shadow-md shadow-[#4c55a4]/20 scale-[1.02]'
                      : 'bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Time Selection & Delivery Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Picker */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4c55a4]" /> 2. Select Time
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger type="button" className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#4c55a4] outline-none transition-all cursor-pointer">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  {TIME_OPTIONS.find((t) => t.value === config.time)?.label || config.time}
                </span>
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1.5 shadow-xl z-50">
                {TIME_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setConfig({ ...config, time: opt.value })}
                    className={`px-3 py-2.5 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                      config.time === opt.value
                        ? 'bg-[#4c55a4] text-white'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {config.time === opt.value && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Delivery Method Selection */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2.5 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#4c55a4]" /> 3. Delivery Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'phone', label: 'Phone Call', icon: PhoneCall },
                { id: 'email', label: 'Email', icon: Mail },
                { id: 'both', label: 'Both', icon: Smartphone },
              ].map((method) => {
                const isSelected = config.deliveryMethod === method.id;
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      setConfig({ ...config, deliveryMethod: method.id as ReminderDeliveryMethod })
                    }
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Contact Details (Phone & Email) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {(config.deliveryMethod === 'phone' || config.deliveryMethod === 'both') && (
            <div>
              <PhoneInput
                label="Reminder Phone Number"
                required
                value={config.phone}
                onChange={(val) => setConfig({ ...config, phone: val })}
              />
            </div>
          )}

          {(config.deliveryMethod === 'email' || config.deliveryMethod === 'both') && (
            <div>
              <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-1.5">
                Reminder Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={config.email}
                  onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  placeholder="owner@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm outline-none focus:border-[#4c55a4] focus:ring-4 focus:ring-[#4c55a4]/10 dark:focus:ring-[#4c55a4]/20 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {config.lastTriggeredAt
                ? `Last triggered: ${new Date(config.lastTriggeredAt).toLocaleString()}`
                : 'No reminders sent yet'}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Test Button */}
            <button
              type="button"
              onClick={handleTestReminder}
              className="w-full sm:w-auto px-4 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-indigo-500" /> Test Reminder Now
            </button>

            {/* Save Settings Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#4c55a4] hover:bg-[#3d4484] text-white rounded-xl font-extrabold text-xs transition-all shadow-md shadow-[#4c55a4]/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4 text-white" /> Save Reminder Settings
            </button>
          </div>
        </div>
      </form>

      {/* Simulated Live Reminder Test Modal */}
      {showTestModal && testResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowTestModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                  Live Test Reminder Triggered
                </h3>
                <p className="text-xs text-zinc-500">Self-Service Simulation</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3 mb-5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <span>Method: {testResult.deliveryMethod.toUpperCase()}</span>
                <span className="text-emerald-600 font-extrabold">{testResult.timestamp}</span>
              </div>

              {(testResult.deliveryMethod === 'phone' || testResult.deliveryMethod === 'both') && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                  <p className="text-xs font-extrabold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" /> Voice Call to {testResult.recipientPhone}
                  </p>
                  <p className="text-xs text-indigo-950 dark:text-indigo-200 italic mt-1 leading-relaxed">
                    "Shalom! This is your Shabos Rent personal reminder. Is your apartment available for this Shabbat? Log in to your dashboard to set availability."
                  </p>
                </div>
              )}

              {(testResult.deliveryMethod === 'email' || testResult.deliveryMethod === 'both') && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-xl border border-purple-100 dark:border-purple-900/50">
                  <p className="text-xs font-extrabold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email to {testResult.recipientEmail}
                  </p>
                  <p className="text-xs text-purple-950 dark:text-purple-200 mt-1">
                    Subject: <strong>Shabbat Availability Reminder - Shabos Rent</strong>
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowTestModal(false)}
              className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-extrabold text-xs transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              Close Test Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
