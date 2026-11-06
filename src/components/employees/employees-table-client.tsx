"use client";

import { useState, useRef, TouchEvent } from "react";
import Link from "next/link";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { deleteEmployee } from "@/app/actions";
import { EditEmployeeModal } from "@/components/employees/edit-employee-modal";

interface EmployeeItem {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string | null;
  designation: string | null;
  location: string | null;
  status: string;
  computers: Array<{ id: string; assetTag: string }>;
}

interface EmployeesTableClientProps {
  employees: EmployeeItem[];
  query?: string;
  initialPage?: number;
  pageSize?: number;
}

export function EmployeesTableClient({
  employees,
  query = "",
  initialPage = 1,
  pageSize = 10,
}: EmployeesTableClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalEmployees = employees.length;
  const totalPages = Math.max(1, Math.ceil(totalEmployees / pageSize));

  // Ensure current page is valid
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const displayedEmployees = employees.slice(startIndex, startIndex + pageSize);

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
                <th className="px-6 py-3 font-semibold text-muted-foreground">Employee ID</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Department</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Assigned Computers</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    {query ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <p className="text-base font-semibold text-foreground">No employees found</p>
                        <p className="text-sm text-muted-foreground">
                          No results matching &ldquo;{query}&rdquo;
                        </p>
                        <Link
                          href="/employees"
                          className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 border transition-colors"
                        >
                          Clear search
                        </Link>
                      </div>
                    ) : (
                      "No employees found."
                    )}
                  </td>
                </tr>
              ) : (
                displayedEmployees.map((emp) => {
                  const isManual = emp.location === "Manual" || emp.designation === "Manual";

                  return (
                    <tr key={emp.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span>{emp.employeeId}</span>
                          {isManual && (
                            <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-1.5 py-0.2 rounded font-medium">
                              Manual
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{emp.name}</div>
                        <div className="text-xs text-muted-foreground">{emp.email}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{emp.department || "—"}</td>
                      <td className="px-6 py-4">
                        {emp.computers.length > 0 ? (
                          <div className="flex gap-1 flex-wrap">
                            {emp.computers.map((c) => (
                              <Link
                                key={c.id}
                                href={`/computers/${c.id}`}
                                className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                              >
                                {c.assetTag}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/60 text-xs italic">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            emp.status === "Active"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isManual ? (
                          <div className="flex justify-end gap-2">
                            <EditEmployeeModal employee={emp} />
                            <form action={deleteEmployee.bind(null, emp.id)}>
                              <button
                                type="submit"
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40 text-xs italic">—</span>
                        )}
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
            <strong className="text-foreground">{Math.min(startIndex + pageSize, totalEmployees)}</strong> of{" "}
            <strong className="text-foreground">{totalEmployees}</strong> employees
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

