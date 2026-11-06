import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Boxes,
  Tv,
  Printer,
  Wind,
  Zap,
  Plus,
  AlertCircle,
  CheckCircle2,
  Wrench,
  Building2
} from "lucide-react";
import {
  OfficeAssetsTableClient,
  OfficeAssetItem
} from "@/components/office-assets/office-assets-table-client";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export const revalidate = 0;

export default async function OfficeAssetsPage() {
  let assets: OfficeAssetItem[] = [];
  let dbError = false;

  try {
    const rawAssets = await (prisma as any).officeAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
    assets = rawAssets.map((item: any) => ({
      ...item,
      purchaseDate: item.purchaseDate ? item.purchaseDate.toISOString() : null,
      warrantyExpiry: item.warrantyExpiry ? item.warrantyExpiry.toISOString() : null,
      createdAt: item.createdAt ? item.createdAt.toISOString() : null,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    }));
  } catch (err) {
    console.warn("OfficeAsset table may not be pushed yet:", err);
    dbError = true;
    assets = [];
  }

  // Stat calculations
  const totalAssets = assets.length;
  const monitorCount = assets.filter((a) => a.category?.toLowerCase().includes("monitor")).length;
  const printerCount = assets.filter((a) => a.category?.toLowerCase().includes("printer") || a.category?.toLowerCase().includes("scanner")).length;
  const acCount = assets.filter((a) => a.category?.toLowerCase().includes("ac") || a.category?.toLowerCase().includes("air conditioner")).length;
  const otherCount = totalAssets - monitorCount - printerCount - acCount;
  const repairCount = assets.filter((a) => a.status === "Under Repair").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Boxes className="h-6 w-6" />
            </div>
            Office Assets
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track and manage monitors, printers, air conditioners, power units, and physical office hardware.
          </p>
        </div>

        <Link
          href="/office-assets/new"
          prefetch={true}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Office Asset
        </Link>
      </div>

      {/* Migration Notice if DB table is not yet created */}
      {dbError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-sm">Database Table Setup</p>
            <p>
              The <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">OfficeAsset</code> table has been added to <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">prisma/schema.prisma</code>.
              To sync your MySQL database, run <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono font-bold">npx prisma db push</code> in your terminal.
            </p>
          </div>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Assets"
          value={totalAssets}
          icon={Boxes}
          accent="default"
          delay={100}
        />
        <StatCard
          title="Monitors"
          value={monitorCount}
          icon={Tv}
          accent="blue"
          delay={200}
        />
        <StatCard
          title="Printers"
          value={printerCount}
          icon={Printer}
          accent="green"
          delay={300}
        />
        <StatCard
          title="Air Conditioners"
          value={acCount}
          icon={Wind}
          accent="slate"
          delay={400}
        />
        <StatCard
          title={repairCount > 0 ? "Under Repair" : "Other Equipment"}
          value={repairCount > 0 ? repairCount : Math.max(0, otherCount)}
          icon={repairCount > 0 ? Wrench : Zap}
          accent={repairCount > 0 ? "orange" : "blue"}
          delay={500}
        />
      </div>

      {/* Assets Table Component */}
      <OfficeAssetsTableClient assets={assets} />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  accent = "default",
  delay = 0,
}: {
  title: string;
  value: number;
  icon?: React.ElementType;
  accent?: "default" | "blue" | "green" | "slate" | "orange";
  delay?: number;
}) {
  const accentStyles = {
    default: "text-primary bg-primary/10",
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-emerald-500 bg-emerald-500/10",
    slate: "text-teal-500 bg-teal-500/10",
    orange: "text-amber-500 bg-amber-500/10",
  };

  return (
    <div
      className="bg-card/70 backdrop-blur-xl border border-border/50 rounded-xl p-4 flex flex-col justify-between hover:shadow-md hover:border-border/80 transition-all animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        {Icon && (
          <div className={`p-1.5 rounded-lg ${accentStyles[accent]}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          <AnimatedCounter value={value} delay={delay + 100} duration={1200} />
        </span>
      </div>
    </div>
  );
}

