"use client";

import React, { useState, useRef, useEffect, useId, useMemo } from "react";
import { Search, ChevronDown, Check, X, Ban } from "lucide-react";

export interface SearchableSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  badge?: string;
  searchTerms?: string;
}

export interface SearchableSelectProps {
  id?: string;
  name: string;
  options: SearchableSelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyOptionLabel?: string;
  searchPlaceholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function SearchableSelect({
  id: propId,
  name,
  options,
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "Select an option...",
  emptyOptionLabel = "-- None --",
  searchPlaceholder = "Type to search...",
  icon,
  disabled = false,
  required = false,
  className = "",
}: SearchableSelectProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  // Uncontrolled vs Controlled state
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const selectedValue = isControlled ? controlledValue : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Find currently selected option
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === selectedValue),
    [options, selectedValue]
  );

  // Filter options based on search query (multi-word match)
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const terms = searchQuery.toLowerCase().trim().split(/\s+/);
    return options.filter((opt) => {
      const haystack = `${opt.label} ${opt.subLabel || ""} ${opt.badge || ""} ${opt.searchTerms || ""}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [options, searchQuery]);

  // Handle closing when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 30);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Auto scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedEl = listRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      ) as HTMLElement | null;
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (val: string) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSelect("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    // List count includes the empty/unassign option if visible
    const totalItems = filteredOptions.length + 1; // index 0 is empty option, 1..N are filteredOptions

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex === 0) {
        handleSelect("");
      } else if (highlightedIndex > 0 && highlightedIndex - 1 < filteredOptions.length) {
        handleSelect(filteredOptions[highlightedIndex - 1].value);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef} onKeyDown={handleKeyDown}>
      {/* Hidden input to ensure standard form submission works */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={selectedValue}
        required={required}
      />

      {/* Trigger Control */}
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-left shadow-xs transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        } ${
          isOpen ? "ring-2 ring-primary/40 border-primary" : ""
        }`}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0 flex-1">
          {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
          {selectedOption ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-medium text-foreground truncate">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground font-mono">
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground truncate">
              {emptyOptionLabel || placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {selectedValue ? (
            <button
              type="button"
              onClick={handleClear}
              title="Clear selection"
              className="p-1 hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-foreground" : "opacity-60"
            }`}
          />
        </div>
      </div>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-lg border border-border bg-popover text-popover-foreground shadow-xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          {/* Search Header */}
          <div className="p-2 border-b border-border bg-muted/20">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-input bg-background pl-8 pr-8 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {/* Meta indicator */}
            <div className="flex items-center justify-between px-1 pt-1.5 text-[11px] text-muted-foreground">
              <span>{filteredOptions.length} of {options.length} options</span>
              {searchQuery && <span>Press Esc to close</span>}
            </div>
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            role="listbox"
            className="max-h-64 overflow-y-auto p-1 divide-y divide-border/30"
          >
            {/* Unassigned / Empty Option */}
            <button
              type="button"
              data-index="0"
              onClick={() => handleSelect("")}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm rounded-md text-left transition-colors ${
                highlightedIndex === 0 ? "bg-accent text-accent-foreground" : "hover:bg-muted/70"
              } ${!selectedValue ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
            >
              <div className="flex items-center gap-2">
                <Ban className="h-3.5 w-3.5 opacity-60 shrink-0" />
                <span>{emptyOptionLabel}</span>
              </div>
              {!selectedValue && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>

            {/* Filtered items */}
            {filteredOptions.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <p className="font-medium">No results found</p>
                <p className="text-xs mt-1 text-muted-foreground/80">
                  No matching options for &ldquo;{searchQuery}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-xs text-primary hover:underline font-medium"
                >
                  Clear search query
                </button>
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = selectedValue === opt.value;
                const itemIndex = idx + 1; // 0 is emptyOption
                const isHighlighted = highlightedIndex === itemIndex;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    data-index={itemIndex}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-sm rounded-md text-left transition-colors ${
                      isHighlighted ? "bg-accent text-accent-foreground" : "hover:bg-muted/70"
                    } ${isSelected ? "bg-primary/10 font-medium" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`truncate ${isSelected ? "text-primary font-semibold" : "text-foreground"}`}>
                          {opt.label}
                        </span>
                        {opt.badge && (
                          <span className="shrink-0 text-[10px] px-1.5 py-0.2 rounded font-mono uppercase bg-muted text-muted-foreground font-semibold">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.subLabel && (
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {opt.subLabel}
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
