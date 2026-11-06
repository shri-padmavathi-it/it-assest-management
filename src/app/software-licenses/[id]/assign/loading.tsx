import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AssignSoftwareLoading() {
  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200 pb-12 select-none">
      {/* Top Header */}
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-full border bg-muted/40 text-muted-foreground">
          <ArrowLeft className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="h-8 w-56 rounded skeleton-shimmer animate-pulse" />
          <div className="h-4 w-72 rounded skeleton-shimmer animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Status Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <h3 className="font-semibold border-b pb-2 text-sm uppercase text-muted-foreground tracking-wider">
              License Status
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="h-4 w-28 rounded skeleton-shimmer animate-pulse" />
                <div className="h-8 w-16 rounded skeleton-shimmer animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="h-4 w-20 rounded skeleton-shimmer animate-pulse" />
                <div className="h-7 w-12 rounded skeleton-shimmer animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="h-4 w-36 rounded skeleton-shimmer animate-pulse" />
                <div className="h-3 w-48 rounded skeleton-shimmer animate-pulse" />
              </div>
              <div className="h-10 w-full rounded-md skeleton-shimmer animate-pulse" />
            </div>
            <div className="pt-4 border-t border-border">
              <div className="h-11 w-full rounded-md skeleton-shimmer animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
