"use client";

import { useState, useRef, TouchEvent } from "react";
import Link from "next/link";
import { Monitor, User, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { deleteComputer } from "@/app/actions";

interface ComputerItem {
  id: string;
  assetTag: string;
  computerName: string;
  status: string;
  location: string | null;
  currentEmployee: {
    id: string;
    name: string;
    employeeId: string;
  } | null;
}

interface ComputersTableClientProps {
  computers: ComputerItem[];
  query?: string;
  initialPage?: number;
  pageSize?: number;
}

export function ComputersTableClient({
  computers,
  query = "",
  initialPage = 1,
  pageSize = 10,
}: ComputersTableClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalComputers = computers.length;
  const totalPages = Math.max(1, Math.ceil(totalComputers / pageSize));

  // Ensure current page is valid
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const displayedComputers = computers.slice(startIndex, startIndex + pageSize);

  const navigateToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("page", newPage.toString());
      window.history.replaceState(null, "", url.toString());
    } catch {
      // Ignore if URL manipulation fails
    }
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      navigateToPage(safePage + 1);
    } else if (distance < -minSwipeDistance) {
      navigateToPage(safePage - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div
        className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Asset ID</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Current User</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Location</th>
                <th className="px-6 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedComputers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    {query ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <p className="text-base font-semibold text-foreground">No computers found</p>
                        <p className="text-sm text-muted-foreground">
                          No results matching &ldquo;{query}&rdquo;
                        </p>
                        <Link
                          href="/computers"
                          className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 border transition-colors"
                        >
                          Clear search
                        </Link>
                      </div>
                    ) : (
                      "No computers found."
                    )}
                  </td>
                </tr>
              ) : (
                displayedComputers.map((comp) => {
                  const isInUse = comp.status === "In Use" || Boolean(comp.currentEmployee);

                  return (
                    <tr
                      key={comp.id}
                      className={`border-b last:border-0 hover:bg-muted/50 transition-colors ${
                        isInUse ? "bg-indigo-500/[0.02] dark:bg-indigo-500/[0.04]" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-medium">
                        <Link
                          href={`/computers/${comp.id}`}
                          className="text-primary hover:underline font-semibold font-mono"
                        >
                          {comp.assetTag}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{comp.computerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {comp.status === "In Use" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 shadow-2xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                            In Use
                          </span>
                        ) : comp.status === "Available" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                            Available
                          </span>
                        ) : comp.status === "Under Repair" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                            Under Repair
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                            {comp.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {comp.currentEmployee ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 shadow-2xs">
                            <User className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                            <span>{comp.currentEmployee.name}</span>
                            {comp.currentEmployee.employeeId && (
                              <span className="text-[10px] opacity-75 font-mono px-1 py-0.2 bg-purple-500/15 rounded">
                                {comp.currentEmployee.employeeId}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60 text-xs italic flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {comp.location ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              comp.location === "In-House"
                                ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                                : comp.location === "ABB"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-muted text-muted-foreground border"
                            }`}
                          >
                            {comp.location}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60 text-xs italic">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <Link
                          href={`/computers/${comp.id}/edit`}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-500/10 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <form action={deleteComputer.bind(null, comp.id)}>
                          <button
                            type="submit"
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instant Client-Side Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pt-1 select-none">
          <div className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{startIndex + 1}</strong> to{" "}
            <strong className="text-foreground">{Math.min(startIndex + pageSize, totalComputers)}</strong> of{" "}
            <strong className="text-foreground">{totalComputers}</strong> computers
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigateToPage(safePage - 1)}
              disabled={safePage <= 1}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            {/* Numeric page pills */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Only show around current page if many pages
                if (
                  totalPages > 7 &&
                  pageNum !== 1 &&
                  pageNum !== totalPages &&
                  Math.abs(pageNum - safePage) > 1
                ) {
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return <span key={pageNum} className="px-1 text-xs text-muted-foreground">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => navigateToPage(pageNum)}
                    className={`h-7 w-7 rounded-lg text-xs font-medium transition-all ${
                      pageNum === safePage
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => navigateToPage(safePage + 1)}
              disabled={safePage >= totalPages}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

