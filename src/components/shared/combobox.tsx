"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

export interface ComboboxItem<T = string | number> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps<T = string | number> {
  items: ComboboxItem<T>[];
  value?: T | null;
  onValueChange?: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
  className?: string;
  popoverWidth?: string;
}

export function Combobox<T extends string | number>({
  items = [],
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled = false,
  loading = false,
  clearable = false,
  className = "w-full",
  popoverWidth = "w-[var(--radix-popover-trigger-width)]",
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedItem = items.find(
    (item) => String(item.value) === String(value)
  );

  const handleSelect = (itemValue: T) => {
    onValueChange?.(itemValue);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.("" as unknown as T);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between font-normal text-left h-9 px-3 bg-background",
            !selectedItem && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate block max-w-full">
            {selectedItem ? selectedItem.label : placeholder}
          </span>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {clearable && selectedItem && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn("p-0 z-50", popoverWidth)} align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            {loading ? (
              <div className="space-y-2 p-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => {
                    const isSelected = String(item.value) === String(value);
                    return (
                      <CommandItem
                        key={String(item.value)}
                        value={item.label}
                        disabled={item.disabled}
                        onSelect={() => handleSelect(item.value)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Check
                            className={cn(
                              "h-4 w-4 shrink-0 text-primary",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.description && (
                          <span className="text-[10px] text-muted-foreground ml-2">
                            {item.description}
                          </span>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Combobox;
