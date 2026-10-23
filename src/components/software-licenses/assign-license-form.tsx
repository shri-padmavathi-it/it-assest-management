"use client";

import { useState, useTransition } from "react";
import { Monitor, User, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { assignSoftwareAsset } from "@/app/actions";

interface ComputerOptionItem {
  id: string;
  computerName: string;
  assetTag: string;
  brand?: string | null;
  model?: string | null;
  currentEmployeeName?: string | null;
}

interface EmployeeOptionItem {
  id: string;
  name: string;
  employeeId: string;
  department?: string | null;
  designation?: string | null;
  email?: string | null;
}

interface AssignLicenseFormProps {
  softwareAssetId: string;
  computers: ComputerOptionItem[];
  employees: EmployeeOptionItem[];
}

export function AssignLicenseForm({
  softwareAssetId,
  computers,
  employees,
}: AssignLicenseFormProps) {
  const [selectedComputerId, setSelectedComputerId] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Prepare computer options
  const computerOptions: SearchableSelectOption[] = computers.map((c) => ({
    value: c.id,
    label: `${c.computerName} (${c.assetTag})`,
    badge: c.assetTag,
    subLabel: [
      c.brand,
      c.model,
      c.currentEmployeeName ? `Assigned to: ${c.currentEmployeeName}` : "Unassigned"
    ]
      .filter(Boolean)
      .join(" • "),
    searchTerms: `${c.computerName} ${c.assetTag} ${c.brand || ""} ${c.model || ""} ${c.currentEmployeeName || ""}`,
  }));

  // Prepare employee options
  const employeeOptions: SearchableSelectOption[] = employees.map((e) => ({
    value: e.id,
    label: `${e.name} (${e.employeeId})`,
    badge: e.employeeId,
    subLabel: [e.department, e.designation, e.email].filter(Boolean).join(" • "),
    searchTerms: `${e.name} ${e.employeeId} ${e.department || ""} ${e.designation || ""} ${e.email || ""}`,
  }));

  const handleSubmit = (formData: FormData) => {
    const compId = (formData.get("computerId") as string) || selectedComputerId;
    const empId = (formData.get("employeeId") as string) || selectedEmployeeId;

    if (!compId && !empId) {
      setValidationError("Please select either a Computer or an Employee to assign this license.");
      return;
    }

    setValidationError(null);
    startTransition(async () => {
      try {
        await assignSoftwareAsset(formData);
      } catch (err: any) {
        // Next.js redirect() throws a NEXT_REDIRECT error which is expected on redirect
        if (err?.message?.includes("NEXT_REDIRECT")) {
          return;
        }
        setValidationError(err?.message || "Failed to assign license. Please try again.");
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6"
    >
      <input type="hidden" name="softwareAssetId" value={softwareAssetId} />

      <div className="space-y-5">
        <div className="bg-blue-500/10 text-blue-700 dark:text-blue-400 p-4 rounded-lg text-sm flex gap-3">
          <span className="shrink-0 font-bold">Note:</span>
          <p>
            You can assign this license to either a <strong>Computer</strong> OR an <strong>Employee</strong>, depending on the license type (e.g. per-device vs per-user).
          </p>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Assign to Computer */}
        <div className="grid gap-2">
          <label htmlFor="computerId" className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" /> Assign to Computer
            </span>
            <span className="text-xs text-muted-foreground">Search by name, asset tag, or model</span>
          </label>
          <SearchableSelect
            id="computerId"
            name="computerId"
            value={selectedComputerId}
            onChange={(val) => {
              setSelectedComputerId(val);
              if (validationError) setValidationError(null);
            }}
            options={computerOptions}
            emptyOptionLabel="-- Do not assign to computer --"
            searchPlaceholder="Type computer name, asset tag (e.g. SPC LT-013), model..."
            icon={<Monitor className="h-4 w-4" />}
          />
        </div>

        {/* - OR - Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative bg-card px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            OR
          </div>
        </div>

        {/* Assign to Employee */}
        <div className="grid gap-2">
          <label htmlFor="employeeId" className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Assign to Employee
            </span>
            <span className="text-xs text-muted-foreground">Search by name, ID, or department</span>
          </label>
          <SearchableSelect
            id="employeeId"
            name="employeeId"
            value={selectedEmployeeId}
            onChange={(val) => {
              setSelectedEmployeeId(val);
              if (validationError) setValidationError(null);
            }}
            options={employeeOptions}
            emptyOptionLabel="-- Do not assign to employee --"
            searchPlaceholder="Type employee name, ID, or department..."
            icon={<User className="h-4 w-4" />}
          />
        </div>

        {/* Info notice if both are selected */}
        {selectedComputerId && selectedEmployeeId && (
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Both Computer and Employee are selected. This installation will be associated with both.</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Confirming Assignment...</span>
            </>
          ) : (
            <span>Confirm Assignment</span>
          )}
        </button>
      </div>
    </form>
  );
}
