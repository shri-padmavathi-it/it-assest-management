"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Printer, 
  Wind, 
  Boxes, 
  Zap, 
  Tv, 
  ArrowLeft, 
  Save, 
  Tag, 
  Building2, 
  Calendar, 
  FileText, 
  UserCheck,
  ChevronDown,
  ChevronUp,
  Sliders
} from "lucide-react";
import { createOfficeAsset, editOfficeAsset } from "@/app/actions";
import { OfficeAssetItem } from "./office-assets-table-client";

interface OfficeAssetFormProps {
  initialData?: OfficeAssetItem;
  initialCategory?: string;
  isEdit?: boolean;
}

const CATEGORIES = [
  { label: "Monitor", icon: Tv, desc: "Displays, screen setups" },
  { label: "Printer", icon: Printer, desc: "Printers, scanners" },
  { label: "Air Conditioner", icon: Wind, desc: "Split AC, tower AC" },
  { label: "UPS / Power", icon: Zap, desc: "Batteries, inverters" },
  { label: "Other Equipment", icon: Boxes, desc: "Appliances, projectors" },
];

const STATUS_OPTIONS = [
  { label: "Available", desc: "Ready for deployment / Unassigned" },
  { label: "In Use", desc: "Currently deployed in room / desk" },
  { label: "Under Repair", desc: "Undergoing servicing or maintenance" },
  { label: "Retired", desc: "Decommissioned or disposed" },
];

export function OfficeAssetForm({ initialData, initialCategory, isEdit = false }: OfficeAssetFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialData?.category || initialCategory || "Monitor"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    initialData?.status || "Available"
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(
    initialData?.location || "In-House SPC"
  );
  const [showAdvanced, setShowAdvanced] = useState<boolean>(
    Boolean(
      isEdit ||
      initialData?.brand ||
      initialData?.model ||
      initialData?.serialNumber ||
      initialData?.assignedTo ||
      initialData?.purchaseDate ||
      initialData?.warrantyExpiry ||
      initialData?.notes
    )
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDateForInput = (date: string | Date | null | undefined) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  return (
    <form
      action={async (formData) => {
        setIsSubmitting(true);
        if (isEdit) {
          await editOfficeAsset(formData);
        } else {
          await createOfficeAsset(formData);
        }
      }}
      className="space-y-6 max-w-3xl"
    >
      {isEdit && initialData?.id && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

      {/* Category Selector Card */}
      <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-5 shadow-xs space-y-3">
        <label className="text-xs font-semibold text-foreground flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          Asset Category *
        </label>

        <input type="hidden" name="category" value={selectedCategory} />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setSelectedCategory(cat.label)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary"
                    : "bg-muted/30 border-border/50 hover:bg-muted/60 text-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{cat.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                    {cat.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Details Card */}
      <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xs space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2.5">
          General Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Asset Tag */}
          <div>
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
              <span>Asset Tag / ID</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="assetTag"
              required
              defaultValue={initialData?.assetTag || ""}
              placeholder="e.g. OA-MON-001, OA-PRN-001, OA-AC-001"
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
            />
          </div>

          {/* Item Name */}
          <div>
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
              <span>Item / Asset Name</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={initialData?.name || ""}
              placeholder="e.g. Dell 27-inch 4K Monitor, Daikin 1.5T AC"
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Office Location
            </label>
            <input
              type="text"
              name="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder="e.g. In-House SPC, ABB, Conference Room"
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
            />
            {/* Quick Location Pills */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-muted-foreground">Quick:</span>
              {["In-House SPC", "ABB", "Server Room", "Meeting Room"].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setSelectedLocation(loc)}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Status
            </label>
            <select
              name="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label} — {opt.desc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced / Optional Specifications (Toggleable) */}
      <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-5 shadow-xs">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="flex items-center justify-between w-full text-left text-xs font-bold text-foreground cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            <span>Additional Specifications & Custody (Optional)</span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-5 space-y-4 pt-4 border-t border-border/50 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Brand */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  name="brand"
                  defaultValue={initialData?.brand || ""}
                  placeholder="e.g. Dell, HP, Daikin, Blue Star, Epson"
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              {/* Model */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Model Number / Series
                </label>
                <input
                  type="text"
                  name="model"
                  defaultValue={initialData?.model || ""}
                  placeholder="e.g. UltraSharp U2723QE, LaserJet 4003dn"
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              {/* Serial Number */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Serial Number (S/N)
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  defaultValue={initialData?.serialNumber || ""}
                  placeholder="e.g. CN-08X23V-12963"
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              {/* Assigned To */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Assigned To (User / Desk)
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  defaultValue={initialData?.assignedTo || ""}
                  placeholder="e.g. John Doe, Reception, Desk 5"
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              {/* Purchase Date */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  defaultValue={formatDateForInput(initialData?.purchaseDate)}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              {/* Warranty Expiry */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Warranty / AMC Expiry
                </label>
                <input
                  type="date"
                  name="warrantyExpiry"
                  defaultValue={formatDateForInput(initialData?.warrantyExpiry)}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Notes & Specifications
              </label>
              <textarea
                name="notes"
                rows={2}
                defaultValue={initialData?.notes || ""}
                placeholder="Add details like resolution, toner cartridge number, BTU rating, service contacts..."
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-y"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1">
        <Link
          href="/office-assets"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 disabled:opacity-60 transition-all cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {isSubmitting
            ? "Saving Asset..."
            : isEdit
            ? "Update Office Asset"
            : "Save Office Asset"}
        </button>
      </div>
    </form>
  );
}
