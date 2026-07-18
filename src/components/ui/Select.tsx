import React, { SelectHTMLAttributes, forwardRef } from "react";
import { LucideIcon, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  options: SelectOption[];
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, icon: Icon, options, fullWidth = true, className = "", ...props }, ref) => {
    return (
      <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
        {label && (
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <select
            ref={ref}
            className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-10 py-3 bg-zinc-50 dark:bg-zinc-800 border ${
              error ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
            } rounded-xl focus:ring-2 focus:ring-[#4c55a4] outline-none transition-all appearance-none text-zinc-900 dark:text-white ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select };
