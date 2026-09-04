"use client";

import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { syncEmployeesFromEMS } from "@/app/actions";

export function SyncEMSButton() {
  const [isPending, setIsPending] = useState(false);

  const handleSync = async () => {
    setIsPending(true);
    try {
      const result = await syncEmployeesFromEMS();
      if (result.success) {
        alert(`Successfully synced ${result.count} employees from EMS!`);
      }
    } catch (error: any) {
      alert(`Error syncing from EMS: ${error.message}`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isPending}
      className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 transition-colors"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
      {isPending ? "Syncing..." : "Sync from EMS"}
    </button>
  );
}
