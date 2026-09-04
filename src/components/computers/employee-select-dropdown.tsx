"use client";

import { useState, useEffect, useRef, TouchEvent } from "react";
import { Loader2, ChevronLeft, ChevronRight, Search, Check, ChevronDown } from "lucide-react";
import { searchEmployees } from "@/app/actions";

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string | null;
}

export function EmployeeSelectDropdown({ 
  initialEmployeeId, 
  initialEmployeeName,
  inputName = "currentEmployeeId",
  valueType = "id"
}: { 
  initialEmployeeId?: string | null, 
  initialEmployeeName?: string | null,
  inputName?: string,
  valueType?: "id" | "name"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  
  const [selectedId, setSelectedId] = useState<string | null>(initialEmployeeId || null);
  const [selectedName, setSelectedName] = useState<string | null>(initialEmployeeName || null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch employees
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
    setPage(1);
  };

  const selectEmployee = (id: string | null, name: string | null) => {
    setSelectedId(id);
    setSelectedName(name);
    setIsOpen(false);
  };

  const onTouchStart = (e: TouchEvent) => touchStartX.current = e.targetTouches[0].clientX;
  const onTouchMove = (e: TouchEvent) => touchEndX.current = e.targetTouches[0].clientX;
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50 && page < totalPages) setPage(p => p + 1); // Swipe left
    else if (distance < -50 && page > 1) setPage(p => p - 1); // Swipe right
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Hidden input for the actual form submission */}
      <input type="hidden" name={inputName} value={(valueType === "id" ? selectedId : selectedName) || ""} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <span className={selectedName ? "text-foreground" : "text-muted-foreground"}>
          {selectedName ? selectedName : "-- Unassigned --"}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-card text-card-foreground shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                autoFocus
                placeholder="Search employee..." 
                value={query}
                onChange={handleSearchChange}
                className="w-full rounded-sm bg-muted/50 pl-8 pr-3 py-1.5 text-sm focus:outline-none" 
              />
            </div>
          </div>
          
          <div 
            className="overflow-hidden min-h-[180px] relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className={`py-1 transition-opacity ${isLoadingSearch ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <button
                type="button"
                onClick={() => selectEmployee(null, null)}
                className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-muted ${!selectedId ? 'bg-muted/50 font-medium' : ''}`}
              >
                -- Unassigned --
                {!selectedId && <Check className="h-4 w-4 text-primary" />}
              </button>
              
              {employees.length === 0 && !isLoadingSearch ? (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No employees found.
                </div>
              ) : (
                employees.map(emp => {
                  const isSelected = selectedId === emp.id;
                  const isOldUser = initialEmployeeId === emp.id;
                  return (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => selectEmployee(emp.id, emp.name)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-muted text-left ${isSelected ? 'bg-muted/50 font-medium' : ''}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          {emp.name}
                          {isOldUser && <span className="text-[10px] uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold tracking-wider">Old User</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">{emp.employeeId} • {emp.department || 'No Dept'}</div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  )
                })
              )}
            </div>

            {isLoadingSearch && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-2 border-t bg-muted/30">
            <button 
              type="button"
              onClick={() => setPage(p => p - 1)} 
              disabled={page <= 1}
              className="p-1 rounded hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground font-medium">Page {page} of {totalPages || 1}</span>
            <button 
              type="button"
              onClick={() => setPage(p => p + 1)} 
              disabled={page >= totalPages}
              className="p-1 rounded hover:bg-muted disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
