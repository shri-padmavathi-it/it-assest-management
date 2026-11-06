"use client";

import { useState, useTransition } from "react";
import { Monitor, AlertCircle, Loader2 } from "lucide-react";
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

interface AssignLicenseFormProps {
  softwareAssetId: string;
  computers: ComputerOptionItem[];
}

export function AssignLicenseForm({
  softwareAssetId,
  computers,
}: AssignLicenseFormProps) {
  const [selectedComputerId, setSelectedComputerId] = useState<string>("");
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

  const handleSubmit = (formData: FormData) => {
    const compId = (formData.get("computerId") as string) || selectedComputerId;

    if (!compId) {
      setValidationError("Please select a Computer to assign this license.");
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
            emptyOptionLabel="-- Select a computer --"
            searchPlaceholder="Type computer name, asset tag (e.g. SPC LT-013), model..."
            icon={<Monitor className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
