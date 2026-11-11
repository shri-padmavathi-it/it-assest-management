import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Boxes, 
  Tv, 
  Printer, 
  Wind, 
  Zap, 
  Building2, 
  Building, 
  Calendar, 
  UserCheck, 
  Tag, 
  FileText,
  Wrench,
  Network,
  Layers
} from "lucide-react";
import { deleteOfficeAsset } from "@/app/actions";
import { EditOfficeAssetModal } from "@/components/office-assets/edit-office-asset-modal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OfficeAssetDetailPage({ params }: PageProps) {
  const { id } = await params;

  let asset: any = null;
  try {
    asset = await (prisma as any).officeAsset.findUnique({
      where: { id },
    });
  } catch (err) {
    console.warn("Error fetching office asset:", err);
  }

  if (!asset) {
    notFound();
  }

  // Parse custom dynamic specs from notes
  let specs: Record<string, any> = {};
  let cleanNotes = asset.notes || "";
  if (asset.notes) {
    const match = asset.notes.match(/\[SPECS_JSON:(.*?)\]\n?/);
    if (match) {
      try {
        specs = JSON.parse(match[1]);
        cleanNotes = asset.notes.replace(match[0], "").trim();
      } catch {
        // ignore
      }
    }
  }

  const getCategoryIcon = (category: string) => {
    const c = category?.toLowerCase() || "";
    if (c.includes("monitor")) return <Tv className="h-6 w-6 text-blue-500" />;
    if (c.includes("printer") || c.includes("scanner")) return <Printer className="h-6 w-6 text-purple-500" />;
    if (c.includes("ac") || c.includes("air")) return <Wind className="h-6 w-6 text-teal-500" />;
    if (c.includes("ups") || c.includes("power")) return <Zap className="h-6 w-6 text-amber-500" />;
    return <Boxes className="h-6 w-6 text-primary" />;
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isMonitor = asset.category?.toLowerCase().includes("monitor");
  const isPrinter = asset.category?.toLowerCase().includes("printer");
  const isAC = asset.category?.toLowerCase().includes("ac") || asset.category?.toLowerCase().includes("air");
  const isUPS = asset.category?.toLowerCase().includes("ups") || asset.category?.toLowerCase().includes("power");

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300 pb-12 select-none">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/office-assets"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                {asset.assetTag}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                  asset.status === "Available"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : asset.status === "In Use"
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                    : asset.status === "Under Repair"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                }`}
              >
                {asset.status}
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground mt-1">
              {asset.name}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <EditOfficeAssetModal
            asset={{
              ...asset,
              purchaseDate: asset.purchaseDate ? asset.purchaseDate.toISOString() : null,
              warrantyExpiry: asset.warrantyExpiry ? asset.warrantyExpiry.toISOString() : null,
              createdAt: asset.createdAt ? asset.createdAt.toISOString() : null,
              updatedAt: asset.updatedAt ? asset.updatedAt.toISOString() : null,
            }}
            trigger={
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all cursor-pointer">
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </span>
            }
          />

          <form action={deleteOfficeAsset.bind(null, asset.id)}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </form>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Specifications */}
        <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border/50">
            <div className="p-2.5 rounded-xl bg-muted/60">
              {getCategoryIcon(asset.category)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Hardware Specifications</h2>
              <p className="text-xs text-muted-foreground">{asset.category}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-border/30">
              <span className="text-muted-foreground">Asset Tag:</span>
              <span className="font-mono font-semibold text-foreground">{asset.assetTag}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/30">
              <span className="text-muted-foreground">Manufacturer / Brand:</span>
              <span className="font-semibold text-foreground">{asset.brand || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/30">
              <span className="text-muted-foreground">Model Number:</span>
              <span className="font-medium text-foreground">{asset.model || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/30">
              <span className="text-muted-foreground">Serial Number:</span>
              <span className="font-mono text-foreground">{asset.serialNumber || "—"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-semibold text-primary">{asset.category}</span>
            </div>
          </div>
        </div>

        {/* Location & Assignment */}
        <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border/50">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Location & Custody</h2>
              <p className="text-xs text-muted-foreground">Current deployment details</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-border/30">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-semibold text-foreground">
                {asset.location ? (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      asset.location.toLowerCase().includes("in-house") ||
                      asset.location.toUpperCase().includes("spc")
                        ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                        : asset.location.toUpperCase().includes("abb")
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground border"
                    }`}
                  >
                    {asset.location}
                  </span>
                ) : (
                  "—"
                )}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-border/30">
              <span className="text-muted-foreground">Assigned To:</span>
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                {asset.assignedTo ? (
                  <>
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    {asset.assignedTo}
                  </>
                ) : (
                  <span className="text-muted-foreground/60 italic font-normal">Unassigned</span>
                )}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-border/30">
              <span className="text-muted-foreground">Purchase Date:</span>
              <span className="text-foreground">{formatDate(asset.purchaseDate)}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Warranty / AMC Expiry:</span>
              <span className="text-foreground">{formatDate(asset.warrantyExpiry)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC CATEGORY-SPECIFIC DETAILS CARD */}
      {Object.keys(specs).length > 0 && (
        <div className="bg-card/70 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
            <Layers className="h-4 w-4 text-primary" />
            {isMonitor
              ? "Display & Screen Specifications"
              : isPrinter
              ? "Printer, Cartridge & Network Configuration"
              : isAC
              ? "Cooling & Maintenance Record"
              : isUPS
              ? "Power & Battery Configuration"
              : "Category Specifics"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Monitor Specs */}
            {specs.screenSize && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-muted-foreground text-[11px] block">Screen Size</span>
                <span className="font-semibold text-foreground text-sm mt-0.5 block">{specs.screenSize}</span>
              </div>
            )}
            {specs.resolution && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-muted-foreground text-[11px] block">Resolution</span>
                <span className="font-semibold text-foreground text-sm mt-0.5 block">{specs.resolution}</span>
              </div>
            )}
            {specs.displayPorts && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40 sm:col-span-2 md:col-span-1">
                <span className="text-muted-foreground text-[11px] block">Video Ports</span>
                <span className="font-semibold text-foreground text-xs mt-0.5 block">{specs.displayPorts}</span>
              </div>
            )}

            {/* Printer Specs */}
            {specs.tonerModel && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-purple-600 dark:text-purple-400 text-[11px] font-medium block">Toner / Cartridge Model</span>
                <span className="font-mono font-bold text-foreground text-sm mt-0.5 block">{specs.tonerModel}</span>
              </div>
            )}
            {specs.printType && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-muted-foreground text-[11px] block">Print Capability</span>
                <span className="font-semibold text-foreground text-sm mt-0.5 block">{specs.printType}</span>
              </div>
            )}
            {specs.printerIp && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-muted-foreground text-[11px] block">Printer IP Address</span>
                <span className="font-mono font-semibold text-foreground text-sm mt-0.5 block">{specs.printerIp}</span>
              </div>
            )}
            {specs.connectionType && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-muted-foreground text-[11px] block">Connection Method</span>
                <span className="font-semibold text-foreground text-sm mt-0.5 block">{specs.connectionType}</span>
              </div>
            )}

            {/* Air Conditioner Specs */}
            {specs.tonnage && (
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <span className="text-teal-600 dark:text-teal-400 text-[11px] font-medium block">Cooling Capacity</span>
                <span className="font-bold text-foreground text-sm mt-0.5 block">{specs.tonnage}</span>
              </div>
            )}
            {specs.acType && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-muted-foreground text-[11px] block">Mounting Style</span>
                <span className="font-semibold text-foreground text-sm mt-0.5 block">{specs.acType}</span>
              </div>
            )}
            {specs.roomArea && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-muted-foreground text-[11px] block">Installed Zone / Room</span>
                <span className="font-semibold text-foreground text-sm mt-0.5 block">{specs.roomArea}</span>
              </div>
            )}
            {specs.nextServiceDate && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-600 dark:text-amber-400 text-[11px] font-semibold flex items-center gap-1">
                  <Wrench className="h-3 w-3" />
                  Next Service Due Date
                </span>
                <span className="font-bold text-foreground text-sm mt-0.5 block">{formatDate(specs.nextServiceDate)}</span>
              </div>
            )}

            {/* UPS Specs */}
            {specs.upsCapacity && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-600 dark:text-amber-400 text-[11px] font-medium block">Power Capacity</span>
                <span className="font-bold text-foreground text-sm mt-0.5 block">{specs.upsCapacity}</span>
              </div>
            )}
            {specs.batteryCount && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-muted-foreground text-[11px] block">Battery Configuration</span>
                <span className="font-semibold text-foreground text-sm mt-0.5 block">{specs.batteryCount}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes & Maintenance Details */}
      {cleanNotes && (
        <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
            <FileText className="h-4 w-4 text-primary" />
            Notes & Maintenance Records
          </h2>
          <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {cleanNotes}
          </p>
        </div>
      )}
    </div>
  );
}
