'use client';

import React, { useState, useEffect } from 'react';
import { Phone, ChevronDown, Check } from 'lucide-react';
import {
  COUNTRY_CODES,
  CountryCodeOption,
  normalizePhoneNumber,
  parsePhoneNumber,
  formatPhoneNumber,
} from '@/utils/phoneUtils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export interface PhoneInputProps {
  value?: string;
  onChange: (normalizedValue: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  error?: string;
  showIcon?: boolean;
  showPreview?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  id,
  name,
  error,
  showIcon = true,
  showPreview = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeOption>(COUNTRY_CODES[0]);
  const [nationalNumber, setNationalNumber] = useState('');

  // Sync internal state when external value changes
  useEffect(() => {
    if (value) {
      const parsed = parsePhoneNumber(value);
      const matched = COUNTRY_CODES.find((c) => c.code === parsed.countryCode) || COUNTRY_CODES[0];
      setSelectedCountry(matched);
      setNationalNumber(parsed.nationalNumber);
    } else if (value === '') {
      setNationalNumber('');
    }
  }, [value]);

  const handleCountrySelect = (code: '972' | '1') => {
    const found = COUNTRY_CODES.find((c) => c.code === code) || COUNTRY_CODES[0];
    setSelectedCountry(found);

    const normalized = normalizePhoneNumber(nationalNumber, found.code);
    onChange(normalized);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setNationalNumber(raw);

    const normalized = normalizePhoneNumber(raw, selectedCountry.code);
    onChange(normalized);
  };

  const normalizedCurrent = normalizePhoneNumber(nationalNumber, selectedCountry.code);
  const formattedPreview = normalizedCurrent ? formatPhoneNumber(normalizedCurrent) : '';

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-zinc-900 dark:text-zinc-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 focus-within:border-[#4c55a4] focus-within:ring-4 focus-within:ring-[#4c55a4]/10 dark:focus-within:ring-[#4c55a4]/20 transition-all shadow-sm overflow-hidden">
        {showIcon && (
          <div className="pl-3.5 text-zinc-400 flex items-center justify-center shrink-0 pointer-events-none">
            <Phone className="h-4 w-4" />
          </div>
        )}

        {/* Country Code Dropdown via Shadcn DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            disabled={disabled}
            className="flex items-center gap-1.5 shrink-0 border-r border-zinc-200 dark:border-zinc-800 px-3 py-3 bg-zinc-50/80 dark:bg-zinc-900/80 rounded-l-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none whitespace-nowrap"
          >
            <span className="text-base leading-none shrink-0">{selectedCountry.flag}</span>
            <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300 shrink-0">
              {selectedCountry.prefix}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1.5 shadow-xl z-50">
            {COUNTRY_CODES.map((country) => {
              const isSelected = selectedCountry.code === country.code;
              return (
                <DropdownMenuItem
                  key={country.code}
                  onClick={() => handleCountrySelect(country.code)}
                  className={`px-3 py-2.5 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#4c55a4] text-white'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{country.flag}</span>
                    <span>{country.label} ({country.prefix})</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* National Number Input */}
        <input
          id={id}
          name={name}
          type="tel"
          value={nationalNumber}
          onChange={handleInputChange}
          placeholder={placeholder || selectedCountry.samplePlaceholder}
          required={required}
          disabled={disabled}
          className="min-w-0 flex-1 w-full bg-transparent py-3 px-3.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}

      {showPreview && formattedPreview && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Normalized:</span> {formattedPreview} ({normalizedCurrent})
        </p>
      )}
    </div>
  );
};
