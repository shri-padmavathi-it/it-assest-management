import { Plus, Search, Loader2, Key, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function SoftwareLicensesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 select-none">
      {/* Top Header with Real Elements */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-3xl font-bold tracking-tight">Softwares</h2>
            <span className="h-5 w-16 rounded-full skeleton-shimmer animate-pulse" />
          </div>
          <p className="text-muted-foreground mt-1">Manage software licenses and recurring subscriptions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Real styled search placeholder */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              disabled
              placeholder="Search software..."
              className="w-full rounded-md border bg-background/50 pl-9 pr-4 py-2 text-sm opacity-80 cursor-default"
            />
          </div>

          {/* Real Add Software button link */}
          <Link
            href="/software-licenses/new"
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Add Software
          </Link>
        </div>
      </div>

      {/* Table with Real Columns & Shimmering Rows */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden relative min-h-[380px]">
        {/* Animated Table Top Progress Bar */}
        <div className="relative h-[2.5px] w-full overflow-hidden bg-muted/40">
          <div className="h-full bg-gradient-to-r from-blue-500 via-primary to-indigo-500 animate-table-loader" />
        </div>

        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase bg-muted/40 border-b">
              <tr>
                <th className="px-5 py-3.5">Software</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">License Type</th>
                <th className="px-4 py-3.5">License Start</th>
                <th className="px-4 py-3.5">License End</th>
                <th className="px-5 py-3.5">Assigned To</th>
                <th className="px-4 py-3.5 text-center">Installs</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 space-y-1">
                    <div className="h-4 w-44 rounded skeleton-shimmer animate-pulse font-semibold" />
                    <div className="h-3 w-24 rounded skeleton-shimmer animate-pulse" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 w-24 rounded-full skeleton-shimmer animate-pulse" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-28 rounded skeleton-shimmer animate-pulse font-mono" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-20 rounded skeleton-shimmer animate-pulse" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 w-24 rounded-full skeleton-shimmer animate-pulse" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-5 w-28 rounded-md skeleton-shimmer animate-pulse" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="h-4 w-10 rounded skeleton-shimmer animate-pulse mx-auto" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-6 w-6 rounded skeleton-shimmer animate-pulse" />
                      <div className="h-6 w-6 rounded skeleton-shimmer animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
