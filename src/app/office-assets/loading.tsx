import { Boxes } from "lucide-react";

export default function OfficeAssetsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Animated Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-primary/20 overflow-hidden pointer-events-none">
        <div className="h-full bg-primary animate-table-loader rounded-r-full shadow-sm shadow-primary/50" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-7 w-48 bg-muted/60 animate-pulse rounded-lg" />
          <div className="h-4 w-72 bg-muted/40 animate-pulse rounded-lg mt-2" />
        </div>
        <div className="h-9 w-36 bg-muted/60 animate-pulse rounded-xl" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-24 bg-card/50 border border-border/40 rounded-xl p-4 flex flex-col justify-between"
          >
            <div className="h-3 w-20 bg-muted/50 animate-pulse rounded" />
            <div className="h-6 w-12 bg-muted/70 animate-pulse rounded" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border/60 bg-card/60 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-64 bg-muted/50 animate-pulse rounded-lg" />
          <div className="h-8 w-48 bg-muted/50 animate-pulse rounded-lg" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 bg-muted/30 animate-pulse rounded-lg w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

