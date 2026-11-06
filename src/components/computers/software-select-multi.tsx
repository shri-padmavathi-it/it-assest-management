"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Check, X, Plus, Package, Layers } from "lucide-react";

export interface SoftwareOption {
  id: string;
  name: string;
  vendor?: string | null;
  category?: string | null;
  credentials?: string | null;
  licenseType?: string | null;
}

interface SoftwareSelectMultiProps {
  availableSoftware: SoftwareOption[];
  initialSelectedIds?: string[];
}

export function SoftwareSelectMulti({
  availableSoftware,
  initialSelectedIds = [],
}: SoftwareSelectMultiProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [customSoftwares, setCustomSoftwares] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter software based on search
  const filteredSoftware = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return availableSoftware;
    return availableSoftware.filter((s) => {
      const matchName = s.name.toLowerCase().includes(q);
      const matchVendor = s.vendor?.toLowerCase().includes(q);
      const matchCategory = s.category?.toLowerCase().includes(q);
      return matchName || matchVendor || matchCategory;
    });
  }, [availableSoftware, searchQuery]);

  const toggleSoftware = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const removeCustomSoftware = (name: string) => {
    setCustomSoftwares((prev) => prev.filter((item) => item !== name));
  };

  const handleAddCustom = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // Check if it already matches an existing available software name
    const existing = availableSoftware.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      if (!selectedIds.includes(existing.id)) {
        setSelectedIds((prev) => [...prev, existing.id]);
      }
    } else {
      if (!customSoftwares.includes(trimmed)) {
        setCustomSoftwares((prev) => [...prev, trimmed]);
      }
    }
    setSearchQuery("");
  };

  // Find objects for selected IDs
  const selectedSoftwareObjects = useMemo(() => {
    return availableSoftware.filter((s) => selectedIds.includes(s.id));
  }, [availableSoftware, selectedIds]);

  const totalSelected = selectedIds.length + customSoftwares.length;

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* Hidden inputs for form submission */}
      {selectedIds.map((id) => (
        <input key={id} type="hidden" name="softwareAssetIds" value={id} />
      ))}
      {customSoftwares.map((name) => (
        <input key={name} type="hidden" name="newSoftwareNames" value={name} />
      ))}

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-1.5">
          <Package className="h-4 w-4 text-primary" />
          Softwares in this System
        </label>
        {totalSelected > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
            {totalSelected} {totalSelected === 1 ? "software" : "softwares"} selected
          </span>
        )}
      </div>

      {/* Selected Tags Display */}
      <div className="min-h-[44px] p-2 rounded-lg border bg-background/50 flex flex-wrap gap-1.5 items-center">
        {selectedSoftwareObjects.length === 0 && customSoftwares.length === 0 ? (
          <span className="text-xs text-muted-foreground px-2 py-1 italic">
            No software selected. Click below to choose or add installed softwares.
          </span>
        ) : (
          <>
            {selectedSoftwareObjects.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 text-primary px-2.5 py-1 text-xs font-medium shadow-2xs animate-in fade-in zoom-in-95 duration-200"
              >
                <span>{s.name}</span>
                <button
                  type="button"
                  onClick={() => toggleSoftware(s.id)}
                  className="rounded-full p-0.5 hover:bg-primary/20 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {customSoftwares.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2.5 py-1 text-xs font-medium shadow-2xs animate-in fade-in zoom-in-95 duration-200"
              >
                <span>{name} (New)</span>
                <button
                  type="button"
                  onClick={() => removeCustomSoftware(name)}
                  className="rounded-full p-0.5 hover:bg-purple-500/20 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </>
        )}
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search software (e.g. SolidWorks, AutoCAD, Office)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-24 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={handleAddCustom}
              className="absolute right-1.5 inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 border transition-colors cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          )}
        </div>

        {/* Dropdown Options List */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
            {filteredSoftware.length === 0 ? (
              <div className="p-3 text-center text-sm text-muted-foreground space-y-2">
                <p>No matching software found in the system catalog.</p>
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={handleAddCustom}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add &quot;{searchQuery.trim()}&quot; to this system
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-0.5">
                {filteredSoftware.map((software) => {
                  const isSelected = selectedIds.includes(software.id);
                  return (
                    <div
                      key={software.id}
                      onClick={() => toggleSoftware(software.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm leading-tight">
                          {software.name}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {[software.category, software.vendor, software.credentials]
                            .filter(Boolean)
                            .join(" • ") || "License Asset"}
                        </span>
                      </div>
                      <div
                        className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-input bg-background"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

