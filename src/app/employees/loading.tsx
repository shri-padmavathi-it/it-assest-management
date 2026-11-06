import { Plus, RefreshCw, Search, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EmployeesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 select-none">
      {/* Top Header with Real Elements */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">Manage employees and view their assigned assets.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Real styled search placeholder */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              disabled
              placeholder="Search employee, ID, dept..."
              className="w-full rounded-md border bg-background/50 pl-9 pr-4 py-2 text-sm opacity-80 cursor-default"
            />
          </div>

          {/* Real Sync from EMS button appearance */}
          <button
            disabled
            className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground opacity-80 cursor-default shadow-xs"
          >
            <RefreshCw className="h-4 w-4" />
            Sync from EMS
          </button>

          {/* Real Add Employee button link */}
          <Link
            href="/employees/new"
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Table with Real Columns & Shimmering Rows */}
      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden relative min-h-[380px]">
        {/* Animated Table Top Progress Bar */}
        <div className="relative h-[2.5px] w-full overflow-hidden bg-muted/40">
          <div className="h-full bg-gradient-to-r from-blue-500 via-primary to-indigo-500 animate-table-loader" />
        </div>

        {/* Centered Loading Badge Animation */}
        <div className="absolute inset-0 top-[45px] bg-background/30 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10">
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card/95 border border-primary/25 shadow-2xl shadow-primary/10 text-foreground animate-in fade-in zoom-in-95 duration-200">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-5 w-5 rounded-full bg-primary/25 animate-ping opacity-75" />
              <Loader2 className="h-5 w-5 animate-spin text-primary relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground/90 tracking-wide">Loading employees...</span>
              <span className="text-[10px] text-muted-foreground">Fetching records from database</span>
            </div>
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Employee ID</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Department</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Assigned Computers</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    <div className="h-4 w-16 rounded skeleton-shimmer animate-pulse font-mono" />
                  </td>
                  <td className="px-6 py-4 space-y-1.5">
                    <div className="h-4 w-36 rounded skeleton-shimmer animate-pulse" />
                    <div className="h-3 w-48 rounded skeleton-shimmer animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 rounded skeleton-shimmer animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-24 rounded-md skeleton-shimmer animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-16 rounded-full skeleton-shimmer animate-pulse" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-muted-foreground/40 text-xs italic">—</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls Skeleton */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="h-4 w-28 rounded skeleton-shimmer animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 rounded-md skeleton-shimmer animate-pulse" />
          <div className="h-8 w-20 rounded-md skeleton-shimmer animate-pulse" />
        </div>
      </div>
    </div>
  );
}
