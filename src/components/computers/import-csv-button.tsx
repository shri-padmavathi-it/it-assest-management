"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { importComputersFromCSV } from "@/app/actions";

export function ImportCSVButton() {
  const [isPending, setIsPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPending(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await importComputersFromCSV(formData);
      if (result.success) {
        alert(`Successfully imported ${result.count} computers!`);
      }
    } catch (error: any) {
      alert(`Error importing CSV: ${error.message}`);
    } finally {
      setIsPending(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {isPending ? "Importing..." : "Import CSV"}
      </button>
    </>
  );
}
