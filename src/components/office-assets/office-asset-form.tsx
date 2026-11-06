"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Monitor, 
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
  UserCheck 
} from "lucide-react";
import { createOfficeAsset, editOfficeAsset } from "@/app/actions";
import { OfficeAssetItem } from "./office-assets-table-client";

interface OfficeAssetFormProps {
  initialData?: OfficeAssetItem;
  isEdit?: boolean;
}

const CATEGORIES = [
  { label: "Monitor", icon: Tv, description: "Displays, Screen monitors, Dual-monitor setups" },
  { label: "Printer", icon: Printer, description: "Laser, Inkjet, Multifunction, Scanners" },
  { label: "Air Conditioner", icon: Wind, description: "Split AC, Cassette, Tower units" },
  { label: "UPS / Power", icon: Zap, description: "Inverters, Backup Batteries, Surge Protectors" },
  { label: "Other Equipment", icon: Boxes, description: "Projectors, Shredders, Appliances" },
];

const STATUS_OPTIONS = [
  { label: "Available", desc: "Ready for deployment / Unassigned" },
  { label: "In Use", desc: "Currently deployed to user / room" },
  { label: "Under Repair", desc: "Undergoing maintenance or servicing" },
  { label: "Retired", desc: "Decommissioned or disposed" },
];

export function OfficeAssetForm({ initialData, isEdit = false }: OfficeAssetFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialData?.category || "Monitor"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    initialData?.status || "Available"
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(
    initialData?.location || "In-House SPC"
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
      className="space-y-6 max-w-4xl"
    >
      {isEdit && initialData?.id && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

      {/* Header card with category picker */}
      <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            Asset Category *
          </label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select the type of physical office asset you are registering.
          </p>
        </div>

        <input type="hidden" name="category" value={selectedCategory} />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
                    : "bg-muted/40 border-border/60 hover:bg-muted/70 text-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{cat.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                    {cat.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Asset Details */}
      <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2 border-b border-border/50 pb-3">
          <Boxes className="h-4 w-4 text-primary" />
          Identification & Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="e.g. OA-MON-001, OA-PRN-002, OA-AC-001"
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            <p className="text-[10px] text-muted-foreground mt-1">Unique barcode or sticker tag identifier.</p>
          </div>

          {/* Asset Name */}
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
              placeholder="e.g. Dell 27-inch 4K Monitor, HP LaserJet Pro MFP"
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Brand / Manufacturer
            </label>
            <input
              type="text"
              name="brand"
              defaultValue={initialData?.brand || ""}
              placeholder="e.g. Dell, HP, LG, Daikin, Blue Star, Epson"
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
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
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
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
              placeholder="e.g. CN-08X23V-12963-87A"
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>

          {/* Status Picker */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Operational Status
            </label>
            <select
              name="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
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

      {/* Deployment & Assignment */}
      <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2 border-b border-border/50 pb-3">
          <Building2 className="h-4 w-4 text-primary" />
          Location & Custody
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Office Location / Floor
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="e.g. In-House SPC, ABB, Conference Room"
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>
            {/* Quick Location Pills */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-muted-foreground">Quick set:</span>
              {["In-House SPC", "ABB", "Server Room", "Meeting Room"].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setSelectedLocation(loc)}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Assigned To (User / Desk / Department)
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                name="assignedTo"
                defaultValue={initialData?.assignedTo || ""}
                placeholder="e.g. John Doe, Engineering Desk 4, Reception"
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Leave empty if asset is unassigned in inventory.</p>
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
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
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
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
        </div>

        {/* Notes & Specs */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            Notes & Maintenance Details
          </label>
          <textarea
            name="notes"
            rows={3}
            defaultValue={initialData?.notes || ""}
            placeholder="Add details like resolution, HDMI/DP ports, toner cartridges, BTU capacity, service contracts, vendor contacts..."
            className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-y"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
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

