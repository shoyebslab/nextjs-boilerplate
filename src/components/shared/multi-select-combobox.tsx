"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export interface MultiSelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface MultiSelectComboboxProps<T = string | number> {
  items: MultiSelectOption<T>[];
  value?: T[];
  onValueChange?: (values: T[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  maxBadgesShown?: number;
  className?: string;
  popoverWidth?: string;
}

export function MultiSelectCombobox<T extends string | number>({
  items = [],
  value = [],
  onValueChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  disabled = false,
  loading = false,
  maxBadgesShown = 4,
  className = "w-full",
  popoverWidth = "w-[var(--radix-popover-trigger-width)]",
}: MultiSelectComboboxProps<T>) {
  const [open, setOpen] = useState(false);

  const handleSelect = (itemValue: T) => {
    if (!value.includes(itemValue)) {
      onValueChange?.([...value, itemValue]);
    } else {
      onValueChange?.(value.filter((v) => v !== itemValue));
    }
  };

  const handleRemove = (e: React.MouseEvent, itemValue: T) => {
    e.stopPropagation();
    onValueChange?.(value.filter((v) => v !== itemValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.([]);
  };

  const selectedItems = items.filter((item) => value.includes(item.value));
  const hiddenCount = selectedItems.length - maxBadgesShown;

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
            "justify-between font-normal text-left min-h-9 h-auto py-1.5 px-3 bg-background",
            className
          )}
        >
          <div className="flex flex-wrap gap-1.5 items-center max-w-[calc(100%-2rem)]">
            {selectedItems.length > 0 ? (
              <>
                {selectedItems.slice(0, maxBadgesShown).map((item) => (
                  <Badge
                    key={String(item.value)}
                    variant="secondary"
                    className="gap-1 px-1.5 py-0 text-xs font-normal"
                  >
                    <span className="truncate max-w-[120px]">{item.label}</span>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={(e) => handleRemove(e, item.value)}
                      className="rounded-full hover:bg-muted-foreground/20 p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {item.label}</span>
                    </button>
                  </Badge>
                ))}

                {hiddenCount > 0 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    +{hiddenCount} more
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {selectedItems.length > 0 && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClearAll}
                className="rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Clear all"
              >
                <X className="h-3.5 w-3.5" />
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
                    const isSelected = value.includes(item.value);
                    return (
                      <CommandItem
                        key={String(item.value)}
                        value={item.label}
                        disabled={item.disabled}
                        onSelect={() => handleSelect(item.value)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className="h-3 w-3 text-current" />
                        </div>
                        <span className="truncate">{item.label}</span>
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

export default MultiSelectCombobox;
