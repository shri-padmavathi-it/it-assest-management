"use client";

import { useState } from "react";
import { 
  Edit2, 
  X, 
  Save, 
  Loader2, 
  Tv, 
  Printer, 
  Wind, 
  Zap, 
  Boxes, 
  Check, 
  Tag, 
  Building2, 
  Wrench, 
  Calendar, 
  FileText 
} from "lucide-react";
import { editOfficeAsset } from "@/app/actions";
import { OfficeAssetItem } from "./office-assets-table-client";

interface EditOfficeAssetModalProps {
  asset: OfficeAssetItem;
  trigger?: React.ReactNode;
}

const CATEGORIES = [
  { label: "Monitor", icon: Tv },
  { label: "Printer", icon: Printer },
  { label: "Air Conditioner", icon: Wind },
  { label: "UPS / Power", icon: Zap },
  { label: "Other Equipment", icon: Boxes },
];

const STATUS_OPTIONS = [
  { label: "Available", desc: "Active / Ready" },
  { label: "In Use", desc: "Deployed to desk / room" },
  { label: "Under Repair", desc: "Maintenance / Servicing" },
  { label: "Retired", desc: "Decommissioned" },
];

export function EditOfficeAssetModal({ asset, trigger }: EditOfficeAssetModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Parse existing specs from notes
  const existingNotes = asset.notes || "";
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

  const [category, setCategory] = useState<string>(asset.category || "Monitor");
  const [status, setStatus] = useState<string>(asset.status || "Available");
  const [location, setLocation] = useState<string>(asset.location || "In-House SPC");

  // Dynamic specs
  const [screenSize, setScreenSize] = useState<string>(parsedExistingSpecs.screenSize || "27\"");
  const [resolution, setResolution] = useState<string>(parsedExistingSpecs.resolution || "1080p Full HD");
  const [selectedPorts, setSelectedPorts] = useState<string[]>(
    parsedExistingSpecs.displayPorts ? parsedExistingSpecs.displayPorts.split(", ") : ["HDMI", "DisplayPort"]
  );

  const [tonerModel, setTonerModel] = useState<string>(parsedExistingSpecs.tonerModel || "");
  const [printType, setPrintType] = useState<string>(parsedExistingSpecs.printType || "Monochrome Laser");
  const [connectionType, setConnectionType] = useState<string>(parsedExistingSpecs.connectionType || "Network LAN");
  const [printerIp, setPrinterIp] = useState<string>(parsedExistingSpecs.printerIp || "");

  const [tonnage, setTonnage] = useState<string>(parsedExistingSpecs.tonnage || "1.5 Ton");
  const [acType, setAcType] = useState<string>(parsedExistingSpecs.acType || "Split AC");
  const [roomArea, setRoomArea] = useState<string>(parsedExistingSpecs.roomArea || "");
  const [nextServiceDate, setNextServiceDate] = useState<string>(parsedExistingSpecs.nextServiceDate || "");

  const [upsCapacity, setUpsCapacity] = useState<string>(parsedExistingSpecs.upsCapacity || "1 kVA");
  const [batteryCount, setBatteryCount] = useState<string>(parsedExistingSpecs.batteryCount || "");

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

  const getCurrentSpecsJson = () => {
    let payload: Record<string, any> = {};
    if (category === "Monitor") {
      payload = { screenSize, resolution, displayPorts: selectedPorts.join(", ") };
    } else if (category === "Printer") {
      payload = { tonerModel, printType, connectionType, printerIp };
    } else if (category === "Air Conditioner") {
      payload = { tonnage, acType, roomArea, nextServiceDate };
    } else if (category === "UPS / Power") {
      payload = { upsCapacity, batteryCount };
    }
    return JSON.stringify(payload);
  };

  const togglePort = (port: string) => {
    setSelectedPorts((prev) =>
      prev.includes(port) ? prev.filter((p) => p !== port) : [...prev, port]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("specs", getCurrentSpecsJson());
      await editOfficeAsset(formData);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to edit office asset:", err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {/* Quick Edit Trigger Button */}
      {trigger ? (
        <span onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
          title="Edit Office Asset"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      )}

      {/* Instant Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border/60 bg-card text-card-foreground shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                  <Edit2 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground leading-none">
                    Edit Office Asset
                  </h2>
                  <span className="text-xs text-muted-foreground font-mono mt-1 block">
                    {asset.assetTag} &bull; {asset.name}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <input type="hidden" name="id" value={asset.id} />
              <input type="hidden" name="category" value={category} />

              {/* Category Quick Chips */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.label;
                    return (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => setCategory(cat.label)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                            : "bg-muted/40 border-border/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* General Core Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Asset Tag / ID *
                  </label>
                  <input
                    type="text"
                    name="assetTag"
                    required
                    defaultValue={asset.assetTag}
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={asset.name}
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    defaultValue={asset.brand || ""}
                    placeholder="e.g. Dell, HP, Daikin"
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    defaultValue={asset.model || ""}
                    placeholder="e.g. U2723QE, LaserJet 4103"
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
              </div>

              {/* Dynamic Category Specifications Section */}
              {category === "Monitor" && (
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Tv className="h-3.5 w-3.5" />
                    Monitor Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Screen Size</label>
                      <input
                        type="text"
                        value={screenSize}
                        onChange={(e) => setScreenSize(e.target.value)}
                        placeholder='e.g. 24", 27"'
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Resolution</label>
                      <input
                        type="text"
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="e.g. 1080p FHD, 4K UHD"
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Display Ports</label>
                      <div className="flex flex-wrap gap-1.5">
                        {["HDMI", "DisplayPort", "USB-C", "VGA"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => togglePort(p)}
                            className={`px-2 py-0.5 rounded-lg text-xs font-medium border cursor-pointer ${
                              selectedPorts.includes(p)
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-background text-muted-foreground border-border/60"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {category === "Printer" && (
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-3">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <Printer className="h-3.5 w-3.5" />
                    Printer Configuration
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Toner Cartridge Model</label>
                      <input
                        type="text"
                        value={tonerModel}
                        onChange={(e) => setTonerModel(e.target.value)}
                        placeholder="e.g. HP 12A, Canon 057"
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Printer IP Address</label>
                      <input
                        type="text"
                        value={printerIp}
                        onChange={(e) => setPrinterIp(e.target.value)}
                        placeholder="e.g. 192.168.1.180"
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === "Air Conditioner" && (
                <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20 space-y-3">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <Wind className="h-3.5 w-3.5" />
                    AC Cooling & Service
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Tonnage</label>
                      <input
                        type="text"
                        value={tonnage}
                        onChange={(e) => setTonnage(e.target.value)}
                        placeholder="e.g. 1.5 Ton, 2.0 Ton"
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Next Service Due Date</label>
                      <input
                        type="date"
                        value={nextServiceDate}
                        onChange={(e) => setNextServiceDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Location & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. In-House SPC, ABB"
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {["In-House SPC", "ABB", "Server Room"].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setLocation(loc)}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Status
                  </label>
                  <select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label} — {opt.desc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Assigned Custodian (User / Desk)
                  </label>
                  <input
                    type="text"
                    name="assignedTo"
                    defaultValue={asset.assignedTo || ""}
                    placeholder="e.g. Rajesh M, Desk 12"
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Serial Number (S/N)
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    defaultValue={asset.serialNumber || ""}
                    placeholder="e.g. CN-08X23V-12963"
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    defaultValue={formatDateForInput(asset.purchaseDate)}
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Warranty / AMC Expiry
                  </label>
                  <input
                    type="date"
                    name="warrantyExpiry"
                    defaultValue={formatDateForInput(asset.warrantyExpiry)}
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Extra Notes */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={userCleanNotes}
                  placeholder="Extra remarks or service contacts..."
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs resize-y"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 disabled:opacity-60 transition-all cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
