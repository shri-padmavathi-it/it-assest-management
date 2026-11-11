"use client";

import { useState, useEffect } from "react";
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
  Network,
  Wrench,
  Gauge,
  Sliders,
  Check
} from "lucide-react";
import { createOfficeAsset, editOfficeAsset } from "@/app/actions";
import { OfficeAssetItem } from "./office-assets-table-client";

interface OfficeAssetFormProps {
  initialData?: OfficeAssetItem;
  initialCategory?: string;
  isEdit?: boolean;
}

const CATEGORIES = [
  { label: "Monitor", icon: Tv, desc: "Displays & Screens" },
  { label: "Printer", icon: Printer, desc: "Laser & Inkjet Printers" },
  { label: "Air Conditioner", icon: Wind, desc: "Cooling & AC Units" },
  { label: "UPS / Power", icon: Zap, desc: "UPS & Inverters" },
  { label: "Other Equipment", icon: Boxes, desc: "Appliances & Hardware" },
];

const STATUS_OPTIONS = [
  { label: "Available", desc: "Ready for deployment / Active" },
  { label: "In Use", desc: "Currently deployed in room / desk" },
  { label: "Under Repair", desc: "Undergoing servicing or maintenance" },
  { label: "Retired", desc: "Decommissioned or disposed" },
];

export function OfficeAssetForm({ initialData, initialCategory, isEdit = false }: OfficeAssetFormProps) {
  // Category state
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialData?.category || initialCategory || "Monitor"
  );

  // Status & Location
  const [selectedStatus, setSelectedStatus] = useState<string>(
    initialData?.status || "Available"
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(
    initialData?.location || "In-House SPC"
  );

  // Parse existing specs from notes if editing
  const existingNotes = initialData?.notes || "";
  const specsMatch = existingNotes.match(/\[SPECS_JSON:(.*?)\]\n?/);
  let parsedExistingSpecs: Record<string, any> = {};
  let userCleanNotes = existingNotes;
  if (specsMatch) {
    try {
      parsedExistingSpecs = JSON.parse(specsMatch[1]);
      userCleanNotes = existingNotes.replace(specsMatch[0], "").trim();
    } catch {
      // ignore
    }
  }

  // --- Dynamic Category-Specific States ---
  // Monitor Specs
  const [screenSize, setScreenSize] = useState<string>(parsedExistingSpecs.screenSize || "27\"");
  const [resolution, setResolution] = useState<string>(parsedExistingSpecs.resolution || "1080p Full HD");
  const [selectedPorts, setSelectedPorts] = useState<string[]>(
    parsedExistingSpecs.displayPorts ? parsedExistingSpecs.displayPorts.split(", ") : ["HDMI", "DisplayPort"]
  );

  // Printer Specs
  const [tonerModel, setTonerModel] = useState<string>(parsedExistingSpecs.tonerModel || "");
  const [printType, setPrintType] = useState<string>(parsedExistingSpecs.printType || "Monochrome Laser");
  const [connectionType, setConnectionType] = useState<string>(parsedExistingSpecs.connectionType || "Network LAN");
  const [printerIp, setPrinterIp] = useState<string>(parsedExistingSpecs.printerIp || "");

  // Air Conditioner Specs
  const [tonnage, setTonnage] = useState<string>(parsedExistingSpecs.tonnage || "1.5 Ton");
  const [acType, setAcType] = useState<string>(parsedExistingSpecs.acType || "Split AC");
  const [roomArea, setRoomArea] = useState<string>(parsedExistingSpecs.roomArea || "");
  const [lastServiceDate, setLastServiceDate] = useState<string>(parsedExistingSpecs.lastServiceDate || "");
  const [nextServiceDate, setNextServiceDate] = useState<string>(parsedExistingSpecs.nextServiceDate || "");

  // UPS Specs
  const [upsCapacity, setUpsCapacity] = useState<string>(parsedExistingSpecs.upsCapacity || "1 kVA");
  const [batteryCount, setBatteryCount] = useState<string>(parsedExistingSpecs.batteryCount || "");
  const [batteryReplacedDate, setBatteryReplacedDate] = useState<string>(parsedExistingSpecs.batteryReplacedDate || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update tag prefix suggestion when category changes (only if adding new and tag is empty)
  const getTagPlaceholder = (cat: string) => {
    if (cat.includes("Monitor")) return "e.g. OA-MON-001";
    if (cat.includes("Printer")) return "e.g. OA-PRN-001";
    if (cat.includes("Air") || cat.includes("AC")) return "e.g. OA-AC-001";
    if (cat.includes("UPS") || cat.includes("Power")) return "e.g. OA-UPS-001";
    return "e.g. OA-EQP-001";
  };

  const getNamePlaceholder = (cat: string) => {
    if (cat.includes("Monitor")) return "e.g. Dell 27-inch 4K UltraSharp";
    if (cat.includes("Printer")) return "e.g. HP LaserJet Pro MFP 4103";
    if (cat.includes("Air") || cat.includes("AC")) return "e.g. Daikin 1.5 Ton Inverter AC";
    if (cat.includes("UPS") || cat.includes("Power")) return "e.g. APC Smart-UPS 1500VA";
    return "e.g. Meeting Room Projector";
  };

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

  // Compile active specs JSON for submission
  const getCurrentSpecsJson = () => {
    let payload: Record<string, any> = {};
    if (selectedCategory === "Monitor") {
      payload = {
        screenSize,
        resolution,
        displayPorts: selectedPorts.join(", "),
      };
    } else if (selectedCategory === "Printer") {
      payload = {
        tonerModel,
        printType,
        connectionType,
        printerIp,
      };
    } else if (selectedCategory === "Air Conditioner") {
      payload = {
        tonnage,
        acType,
        roomArea,
        lastServiceDate,
        nextServiceDate,
      };
    } else if (selectedCategory === "UPS / Power") {
      payload = {
        upsCapacity,
        batteryCount,
        batteryReplacedDate,
      };
    }
    return JSON.stringify(payload);
  };

  const togglePort = (port: string) => {
    setSelectedPorts((prev) =>
      prev.includes(port) ? prev.filter((p) => p !== port) : [...prev, port]
    );
  };

  return (
    <form
      action={async (formData) => {
        setIsSubmitting(true);
        // Inject current dynamic specs
        formData.set("specs", getCurrentSpecsJson());
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

      {/* 1. Category Selector */}
      <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-5 shadow-xs space-y-3">
        <label className="text-xs font-semibold text-foreground flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          Choose Asset Category *
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

      {/* 2. Core General Details */}
      <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2.5 flex items-center gap-2">
          <Boxes className="h-3.5 w-3.5 text-primary" />
          General Identification
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
              placeholder={getTagPlaceholder(selectedCategory)}
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
            />
          </div>

          {/* Name */}
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
              placeholder={getNamePlaceholder(selectedCategory)}
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
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
              placeholder={
                selectedCategory === "Monitor"
                  ? "e.g. Dell, LG, Samsung, HP"
                  : selectedCategory === "Printer"
                  ? "e.g. HP, Canon, Epson, Brother"
                  : selectedCategory === "Air Conditioner"
                  ? "e.g. Daikin, Voltas, Blue Star, Carrier"
                  : "e.g. APC, Numeric, Sony"
              }
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
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
              placeholder="e.g. U2723QE, LaserJet 4103, FTKF50"
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC CATEGORY-SPECIFIC DETAILS */}

      {/* --- MONITOR SPECIFIC FIELDS --- */}
      {selectedCategory === "Monitor" && (
        <div className="bg-card/70 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 border-b border-border/50 pb-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Tv className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">Monitor Display Specifications</h3>
              <p className="text-[11px] text-muted-foreground">Screen size, resolution, and connectivity ports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Screen Size */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Screen Size
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {['22"', '24"', '27"', '32"', '34" Ultrawide'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setScreenSize(size)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      screenSize === size
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-muted/40 border-border/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={screenSize}
                onChange={(e) => setScreenSize(e.target.value)}
                placeholder="Or enter custom size (e.g. 29 inch)"
                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {/* Resolution */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Screen Resolution
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-2xs"
              >
                <option value="1080p Full HD (1920x1080)">1080p Full HD (1920x1080)</option>
                <option value="2K QHD (2560x1440)">2K QHD (2560x1440)</option>
                <option value="4K UHD (3840x2160)">4K UHD (3840x2160)</option>
                <option value="Ultrawide UWQHD (3440x1440)">Ultrawide UWQHD (3440x1440)</option>
                <option value="Standard HD (1366x768)">Standard HD (1366x768)</option>
              </select>
            </div>

            {/* Display Ports (Multi-select) */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Supported Video Ports (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {["HDMI", "DisplayPort (DP)", "USB-C / Thunderbolt", "VGA", "DVI"].map((port) => {
                  const isChecked = selectedPorts.includes(port);
                  return (
                    <button
                      key={port}
                      type="button"
                      onClick={() => togglePort(port)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                          : "bg-muted/30 border-border/60 text-muted-foreground hover:bg-muted/60"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                          isChecked ? "bg-blue-500 border-blue-500 text-white" : "border-muted-foreground/40"
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span>{port}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PRINTER SPECIFIC FIELDS --- */}
      {selectedCategory === "Printer" && (
        <div className="bg-card/70 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 border-b border-border/50 pb-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
              <Printer className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">Printer, Toner & Network Configuration</h3>
              <p className="text-[11px] text-muted-foreground">Toner cartridge model, print type, and network IP</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Toner Model */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Toner / Ink Cartridge Model
              </label>
              <input
                type="text"
                value={tonerModel}
                onChange={(e) => setTonerModel(e.target.value)}
                placeholder="e.g. HP 12A, Canon 057, HP 76A, Epson 003"
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40 shadow-2xs font-mono"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Easily find which cartridge to reorder.</p>
            </div>

            {/* Print Type */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Printer Technology / Capability
              </label>
              <select
                value={printType}
                onChange={(e) => setPrintType(e.target.value)}
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40 shadow-2xs"
              >
                <option value="Monochrome Laser (B&W)">Monochrome Laser (B&W)</option>
                <option value="Color Laser">Color Laser</option>
                <option value="Multi-Function (Print, Scan, Copy)">Multi-Function MFP (Print, Scan, Copy)</option>
                <option value="Ink Tank / Color Inkjet">Ink Tank / Color Inkjet</option>
                <option value="Barcode / Label Printer">Barcode / Label Printer</option>
              </select>
            </div>

            {/* Connection Type */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Connection Method
              </label>
              <select
                value={connectionType}
                onChange={(e) => setConnectionType(e.target.value)}
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40 shadow-2xs"
              >
                <option value="Network LAN (Ethernet)">Network LAN (Ethernet Cable)</option>
                <option value="Wi-Fi Wireless">Wi-Fi Wireless</option>
                <option value="USB Direct to PC">USB Direct to Single PC</option>
              </select>
            </div>

            {/* Printer IP Address */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Printer IP Address (LAN)
              </label>
              <input
                type="text"
                value={printerIp}
                onChange={(e) => setPrinterIp(e.target.value)}
                placeholder="e.g. 192.168.1.150"
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40 shadow-2xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- AIR CONDITIONER SPECIFIC FIELDS --- */}
      {selectedCategory === "Air Conditioner" && (
        <div className="bg-card/70 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 border-b border-border/50 pb-2.5">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-500">
              <Wind className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">Air Conditioner Capacity & Maintenance</h3>
              <p className="text-[11px] text-muted-foreground">Tonnage, unit mount type, and service due dates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tonnage / Capacity */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Cooling Capacity / Tonnage
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {["1.0 Ton", "1.5 Ton", "2.0 Ton", "3.0 Ton", "5.0 Ton"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTonnage(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      tonnage === t
                        ? "bg-teal-500 text-white border-teal-500"
                        : "bg-muted/40 border-border/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={tonnage}
                onChange={(e) => setTonnage(e.target.value)}
                placeholder="Or enter custom capacity (e.g. 2.5 Ton)"
                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
            </div>

            {/* AC Unit Type */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                AC Unit Mounting Style
              </label>
              <select
                value={acType}
                onChange={(e) => setAcType(e.target.value)}
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/40 shadow-2xs"
              >
                <option value="Split AC (Wall Mounted)">Split AC (Wall Mounted)</option>
                <option value="Cassette AC (Ceiling Mounted)">Cassette AC (Ceiling Mounted)</option>
                <option value="Tower / Standing AC">Tower / Standing AC</option>
                <option value="Window AC">Window AC</option>
                <option value="Centralized Duct Unit">Centralized Duct Unit</option>
              </select>
            </div>

            {/* Room / Floor Area */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Installed Room / Zone
              </label>
              <input
                type="text"
                value={roomArea}
                onChange={(e) => setRoomArea(e.target.value)}
                placeholder="e.g. Server Room, Conference Room 1, Accounts Dept"
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/40 shadow-2xs"
              />
            </div>

            {/* Next Service Due Date */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-teal-500" />
                Next Service / AMC Due Date
              </label>
              <input
                type="date"
                value={nextServiceDate}
                onChange={(e) => setNextServiceDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/40 shadow-2xs"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Helps schedule quarterly filter & gas maintenance.</p>
            </div>
          </div>
        </div>
      )}

      {/* --- UPS / POWER SPECIFIC FIELDS --- */}
      {selectedCategory === "UPS / Power" && (
        <div className="bg-card/70 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 border-b border-border/50 pb-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">UPS & Battery Backup Details</h3>
              <p className="text-[11px] text-muted-foreground">Power rating, battery count, and replacement cycle</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* UPS Capacity */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Capacity Rating
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {["600 VA", "1 kVA", "2 kVA", "3 kVA", "5 kVA", "10 kVA+"].map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setUpsCapacity(cap)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      upsCapacity === cap
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-muted/40 border-border/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>

            {/* Battery Setup */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Battery Setup / Count
              </label>
              <input
                type="text"
                value={batteryCount}
                onChange={(e) => setBatteryCount(e.target.value)}
                placeholder="e.g. 2x 12V 7Ah Internal, 4x 12V 42Ah External"
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-2xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Deployment, Location & Custody */}
      <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2.5 flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          Location & Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Office Facility / Location
            </label>
            <input
              type="text"
              name="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder="e.g. In-House SPC, ABB, Server Room"
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
            />
            {/* Quick Location Pills */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-muted-foreground">Quick:</span>
              {["In-House SPC", "ABB", "Server Room", "Conference Room"].map((loc) => (
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
              Operational Status
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

          {/* Assigned Custodian (only for personal/desk equipment) */}
          {selectedCategory !== "Air Conditioner" && (
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Assigned User / Desk (Optional)
              </label>
              <input
                type="text"
                name="assignedTo"
                defaultValue={initialData?.assignedTo || ""}
                placeholder="e.g. John Doe, Desk 4, Accounts"
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
              />
            </div>
          )}

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
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* 5. Dates & Extra Notes */}
      <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2.5 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          Warranty & Notes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
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
              className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs"
            />
          </div>
        </div>

        {/* Freeform Notes */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            Additional Notes
          </label>
          <textarea
            name="notes"
            rows={2}
            defaultValue={userCleanNotes}
            placeholder="Add any extra vendor contact, invoice numbers, service remarks..."
            className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-y shadow-2xs"
          />
        </div>
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
