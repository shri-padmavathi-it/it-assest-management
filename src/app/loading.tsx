import { Monitor, Key, Users, Package, AlertTriangle, PowerOff, Building2, Building, Loader2 } from "lucide-react";

export default function DashboardLoading() {
  const computerCards = [
    { title: "Total", icon: Monitor, accent: "text-foreground/70 bg-primary/10" },
    { title: "In-House", icon: Building2, accent: "text-blue-500 bg-blue-500/10" },
    { title: "ABB", icon: Building, accent: "text-emerald-500 bg-emerald-500/10" },
    { title: "Not In Use", icon: PowerOff, accent: "text-slate-500 bg-slate-500/10" },
    { title: "Under Repair", icon: AlertTriangle, accent: "text-orange-500 bg-orange-500/10" },
    { title: "Retired", icon: AlertTriangle, accent: "text-red-500 bg-red-500/10" },
  ];

  const softwareCards = [
    { title: "Total Assets", icon: Package, accent: "text-foreground/70 bg-primary/10" },
    { title: "In Use", icon: Users, accent: "text-blue-500 bg-blue-500/10" },
    { title: "Available", icon: Key, accent: "text-emerald-500 bg-emerald-500/10" },
    { title: "Expiring Soon", icon: AlertTriangle, accent: "text-orange-500 bg-orange-500/10" },
    { title: "Expired", icon: AlertTriangle, accent: "text-red-500 bg-red-500/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 select-none relative">
      {/* Animated Top Progress Bar */}
      <div className="relative h-[2.5px] -mt-2 -mx-4 sm:-mx-8 overflow-hidden bg-muted/40">
        <div className="h-full bg-gradient-to-r from-blue-500 via-primary to-indigo-500 animate-table-loader" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1 text-sm">Overview of your IT assets and licenses.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card/95 border border-primary/25 shadow-md shadow-primary/10 text-foreground">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-4 w-4 rounded-full bg-primary/25 animate-ping opacity-75" />
            <Loader2 className="h-4 w-4 animate-spin text-primary relative z-10" />
          </div>
          <span className="text-xs font-semibold text-foreground/90">Updating dashboard...</span>
        </div>
      </div>

      {/* Computers Section */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/80">
          <Monitor className="h-5 w-5 text-primary" />
          Computers
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {computerCards.map((card, i) => (
            <div
              key={i}
              className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-xl p-5 flex flex-col justify-between h-[120px]"
            >
              <div className="flex items-center justify-between">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{card.title}</h3>
                <div className={`p-2 rounded-lg ${card.accent}`}>
                  <card.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <div className="h-8 w-14 rounded skeleton-shimmer animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Software & Licenses Section */}
      <div className="space-y-5 pt-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/80">
          <Package className="h-5 w-5 text-primary" />
          Software & Licenses
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {softwareCards.map((card, i) => (
            <div
              key={i}
              className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-xl p-5 flex flex-col justify-between h-[120px]"
            >
              <div className="flex items-center justify-between">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{card.title}</h3>
                <div className={`p-2 rounded-lg ${card.accent}`}>
                  <card.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <div className="h-8 w-14 rounded skeleton-shimmer animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
