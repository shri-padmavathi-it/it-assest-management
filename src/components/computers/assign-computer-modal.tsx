"use client";

import { useState, useEffect, useRef, TouchEvent } from "react";
import { UserPlus, X, Loader2, ChevronLeft, ChevronRight, Search, Check } from "lucide-react";
import { searchEmployees, assignComputer } from "@/app/actions";

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string | null;
}

export function AssignComputerModal({ 
  computerId, 
  currentEmployee 
}: { 
  computerId: string;
  currentEmployee: Employee | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Fetch employees when query or page changes
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchEmployees = async () => {
      setIsLoadingSearch(true);
      try {
        const result = await searchEmployees(query, page);
        setEmployees(result.employees);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsLoadingSearch(false);
      }
    };

    const debounce = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(debounce);
  }, [query, page, isOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  const handleAssign = async (employeeId: string | null) => {
    setIsPending(true);
    try {
      await assignComputer(computerId, employeeId);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to assign user.");
    } finally {
      setIsPending(false);
    }
  };

  const onTouchStart = (e: TouchEvent) => touchStartX.current = e.targetTouches[0].clientX;
  const onTouchMove = (e: TouchEvent) => touchEndX.current = e.targetTouches[0].clientX;
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50 && page < totalPages) setPage(p => p + 1); // Swipe left -> Next
    else if (distance < -50 && page > 1) setPage(p => p - 1); // Swipe right -> Prev
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
      >
        <UserPlus className="h-4 w-4" />
        {currentEmployee ? "Change User" : "Assign User"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-lg relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-6">Assign Laptop</h2>
            
            <div className="space-y-6 overflow-y-auto pr-2">
              {/* Old/Current User Display */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current User (Old)</span>
                <div className="font-medium text-lg">{currentEmployee ? currentEmployee.name : "Unassigned"}</div>
                {currentEmployee && <div className="text-sm text-muted-foreground">{currentEmployee.employeeId} • {currentEmployee.department || 'No Dept'}</div>}
              </div>

              {/* Search Box */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select New User</span>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search by name or ID..." 
                    value={query}
                    onChange={handleSearchChange}
                    className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  />
                </div>
              </div>

              {/* Paginated / Swipeable List */}
              <div className="space-y-3">
                <div 
                  className="rounded-lg border overflow-hidden relative min-h-[200px]"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  {isLoadingSearch ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : employees.length === 0 ? (
                    <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                      No employees found.
                    </div>
                  ) : (
                    <div className="divide-y">
                      {employees.map(emp => {
                        const isCurrent = currentEmployee?.id === emp.id;
                        return (
                          <div 
                            key={emp.id} 
                            onClick={() => !isCurrent && handleAssign(emp.id)}
                            className={`flex items-center justify-between p-3 transition-colors ${
                              isCurrent ? 'bg-muted/50 cursor-not-allowed opacity-50' : 'hover:bg-muted cursor-pointer'
                            }`}
                          >
                            <div>
                              <div className="font-medium text-sm">{emp.name}</div>
                              <div className="text-xs text-muted-foreground">{emp.employeeId}</div>
                            </div>
                            {isCurrent ? (
                              <span className="text-xs font-semibold">Current</span>
                            ) : (
                              <button disabled={isPending} className="text-primary hover:text-primary/80">
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Internal Pagination Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button 
                    onClick={() => setPage(p => p - 1)} 
                    disabled={page <= 1}
                    className="p-1 rounded hover:bg-muted disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-xs text-muted-foreground">Page {page} of {totalPages || 1}</span>
                  <button 
                    onClick={() => setPage(p => p + 1)} 
                    disabled={page >= totalPages}
                    className="p-1 rounded hover:bg-muted disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Unassign Button */}
              {currentEmployee && (
                <div className="pt-4 border-t">
                  <button 
                    onClick={() => handleAssign(null)}
                    disabled={isPending}
                    className="w-full rounded-md border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    {isPending ? "Processing..." : "Unassign Device"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
