import { prisma } from "@/lib/prisma";
import { 
  Monitor, 
  Key, 
  Users, 
  Package, 
  AlertTriangle, 
  PowerOff, 
  Building2, 
  Building,
  Boxes,
  Tv,
  Printer,
  Wind,
  Wrench
} from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const revalidate = 60;

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const now = new Date();

  // Optimized single-roundtrip query: fetch lightweight fields in parallel
  // This replaces 16 roundtrips across the network with just 1 parallel roundtrip!
  const [computers, softwares, officeAssets] = await Promise.all([
    prisma.computer.findMany({
      select: { location: true, status: true },
    }),
    prisma.softwareAsset.findMany({
      select: { status: true, expiryDate: true, neverExpires: true },
    }),
    (prisma as any).officeAsset
      ? (prisma as any).officeAsset
          .findMany({
            select: { category: true, status: true },
          })
          .catch(() => [])
      : Promise.resolve([]),
  ]);

  // In-memory aggregation for Computers (0ms)
  const totalComputers = computers.length;
  let computersInHouse = 0;
  let computersABB = 0;
  let computersNotInUse = 0;
  let computersUnderRepair = 0;
  let computersRetired = 0;

  for (const c of computers) {
    const loc = (c.location || "").toLowerCase();
    if (loc.includes("in-house") || loc.includes("in house") || loc.includes("spc")) {
      computersInHouse++;
    } else if (loc.includes("abb")) {
      computersABB++;
    }

    if (c.status === "Not In Use") computersNotInUse++;
    else if (c.status === "Under Repair") computersUnderRepair++;
    else if (c.status === "Retired") computersRetired++;
  }

  // In-memory aggregation for Softwares (0ms)
  const totalSoftwareAssets = softwares.length;
  let assignedAssets = 0;
  let availableAssets = 0;
  let expiringSoonAssets = 0;
  let expiredAssets = 0;

  for (const s of softwares) {
    if (s.status === "In Use") assignedAssets++;
    else if (s.status === "Available") availableAssets++;

    if (!s.neverExpires && s.expiryDate) {
      const exp = new Date(s.expiryDate);
      if (exp <= now) {
        expiredAssets++;
      } else if (exp <= thirtyDaysFromNow) {
        expiringSoonAssets++;
      }
    }
  }

  // In-memory aggregation for Office Assets (0ms)
  const totalOfficeAssets = Array.isArray(officeAssets) ? officeAssets.length : 0;
  let officeMonitors = 0;
  let officePrinters = 0;
  let officeACs = 0;
  let officeRepair = 0;

  if (Array.isArray(officeAssets)) {
    for (const oa of officeAssets) {
      const cat = (oa.category || "").toLowerCase();
      if (cat.includes("monitor")) officeMonitors++;
      else if (cat.includes("printer") || cat.includes("scanner")) officePrinters++;
      else if (cat.includes("ac") || cat.includes("air")) officeACs++;

      if (oa.status === "Under Repair") officeRepair++;
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 select-none">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1 text-sm">Overview of your IT assets and licenses.</p>
      </div>

      {/* Computers Section */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/80">
          <Monitor className="h-5 w-5 text-primary" />
          Computers
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard title="Total" value={totalComputers} delay={100} icon={Monitor} accent="default" />
          <StatCard title="In-House" value={computersInHouse} delay={200} icon={Building2} accent="blue" />
          <StatCard title="ABB" value={computersABB} delay={300} icon={Building} accent="green" />
          <StatCard title="Not In Use" value={computersNotInUse} delay={400} icon={PowerOff} accent="slate" />
          <StatCard title="Under Repair" value={computersUnderRepair} delay={500} icon={AlertTriangle} accent="orange" />
          <StatCard title="Retired" value={computersRetired} delay={600} icon={AlertTriangle} accent="red" />
        </div>
      </div>

      {/* Software & Licenses Section */}
      <div className="space-y-5 pt-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/80">
          <Package className="h-5 w-5 text-primary" />
          Software & Licenses
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Assets" value={totalSoftwareAssets} delay={150} icon={Package} accent="default" />
          <StatCard title="In Use" value={assignedAssets} delay={250} icon={Users} accent="blue" />
          <StatCard title="Available" value={availableAssets} delay={350} icon={Key} accent="green" />
          <StatCard title="Expiring Soon" value={expiringSoonAssets} delay={450} icon={AlertTriangle} accent="orange" />
          <StatCard title="Expired" value={expiredAssets} delay={550} icon={AlertTriangle} accent="red" />
        </div>
      </div>

      {/* Office Assets Section */}
      <div className="space-y-5 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/80">
            <Boxes className="h-5 w-5 text-primary" />
            Office Assets
          </h3>
          <Link
            href="/office-assets"
            prefetch={true}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View all office assets &rarr;
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Assets" value={totalOfficeAssets} delay={200} icon={Boxes} accent="default" />
          <StatCard title="Monitors" value={officeMonitors} delay={300} icon={Tv} accent="blue" />
          <StatCard title="Printers" value={officePrinters} delay={400} icon={Printer} accent="green" />
          <StatCard title="Air Conditioners" value={officeACs} delay={500} icon={Wind} accent="slate" />
          <StatCard title="Under Repair" value={officeRepair} delay={600} icon={Wrench} accent="orange" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  delay = 0,
  icon: Icon,
  accent = "default"
}: {
  title: string;
  value: number;
  delay?: number;
  icon?: React.ElementType;
  accent?: "default" | "blue" | "green" | "slate" | "orange" | "red"
}) {

  const accentStyles = {
    default: "text-foreground/70 bg-primary/10",
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-emerald-500 bg-emerald-500/10",
    slate: "text-slate-500 bg-slate-500/10",
    orange: "text-orange-500 bg-orange-500/10",
    red: "text-red-500 bg-red-500/10",
  }

  return (
    <div
      className="group relative overflow-hidden select-none bg-card/60 backdrop-blur-xl border border-border/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 hover:border-border/80 hover:bg-card/80 animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
      style={{ animationDelay: `${delay}ms`, animationDuration: '700ms' }}
    >
      <div className="flex items-center justify-between">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors">{title}</h3>
        {Icon && (
          <div className={`p-2 rounded-lg transition-colors ${accentStyles[accent]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-foreground/90">
          <AnimatedCounter value={value} delay={delay + 100} duration={1600} />
        </span>
      </div>
    </div>
  )
}
