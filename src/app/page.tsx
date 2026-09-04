import { prisma } from "@/lib/prisma";
import { Monitor, Key, Users, Package, AlertTriangle, PowerOff, CheckCircle2 } from "lucide-react";

export default async function Dashboard() {
  // Fetch stats from DB
  const totalComputers = await prisma.computer.count();
  const computersInUse = await prisma.computer.count({ where: { status: "In Use" } });
  const computersAvailable = await prisma.computer.count({ where: { status: "Available" } });
  const computersNotInUse = await prisma.computer.count({ where: { status: "Not In Use" } });
  const computersUnderRepair = await prisma.computer.count({ where: { status: "Under Repair" } });
  const computersRetired = await prisma.computer.count({ where: { status: "Retired" } });

  const totalSoftwareAssets = await prisma.softwareAsset.count();
  const assignedAssets = await prisma.softwareAsset.count({ where: { status: "In Use" } });
  const availableAssets = await prisma.softwareAsset.count({ where: { status: "Available" } });
  
  // Calculate expiring soon (less than 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const expiringSoonAssets = await prisma.softwareAsset.count({
    where: {
      expiryDate: {
        lte: thirtyDaysFromNow,
        gt: new Date()
      },
      neverExpires: false
    }
  });
  
  const expiredAssets = await prisma.softwareAsset.count({
    where: {
      expiryDate: {
        lte: new Date()
      },
      neverExpires: false
    }
  });

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
          <StatCard title="In Use" value={computersInUse} delay={200} icon={CheckCircle2} accent="blue" />
          <StatCard title="Available" value={computersAvailable} delay={300} icon={CheckCircle2} accent="green" />
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
        <span className="text-3xl font-bold tracking-tight text-foreground/90">{value}</span>
      </div>
    </div>
  )
}
