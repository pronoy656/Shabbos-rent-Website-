"use client";

import React from "react";
import { LucideIcon, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface CustomSelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
}

export function CustomSelect({
  icon: Icon,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = "",
  menuClassName = "",
}: CustomSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn("relative w-full", disabled && "pointer-events-none")}>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          className={cn(
            "w-full relative flex items-center justify-between border rounded-xl h-[48px] px-3.5 focus:outline-none transition-all text-left",
            disabled
              ? "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 cursor-not-allowed text-zinc-400 dark:text-zinc-600"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer focus:ring-2 focus:ring-[#4c55a4]",
            className
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {Icon && (
              <div className="flex items-center pointer-events-none shrink-0">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    disabled ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400 dark:text-zinc-500"
                  )}
                />
              </div>
            )}
            <span
              className={cn(
                "truncate text-sm font-medium",
                disabled
                  ? "text-zinc-400 dark:text-zinc-600"
                  : value
                  ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                  : "text-zinc-400 dark:text-zinc-500 font-normal"
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <div className="flex items-center pointer-events-none shrink-0 ml-2">
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                disabled ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400 dark:text-zinc-500"
              )}
            />
          </div>
        </DropdownMenuTrigger>

        {!disabled && (
          <DropdownMenuContent
            align="start"
            className={cn(
              "w-(--anchor-width) min-w-[200px] max-h-[300px] overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-xl z-50",
              menuClassName
            )}
          >
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <DropdownMenuItem
                  key={option.value}
                  className={cn(
                    "cursor-pointer rounded-lg text-sm px-3 py-2.5 flex items-center justify-between transition-colors outline-none",
                    isSelected
                      ? "font-bold bg-[#4c55a4]/10 dark:bg-[#4c55a4]/20 text-[#4c55a4] dark:text-indigo-400"
                      : "font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                  onClick={() => onChange(option.value)}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 ml-2 shrink-0 text-[#4c55a4] dark:text-indigo-400" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
