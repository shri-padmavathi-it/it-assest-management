"use client";

import { TableSearch } from "@/components/ui/table-search";

export function ComputerSearch({ 
  initialQuery = "",
  basePath = "/computers" 
}: { 
  initialQuery?: string;
  basePath?: string;
}) {
  return (
    <TableSearch
      basePath={basePath}
      placeholder="Search computers, user..."
      initialQuery={initialQuery}
    />
  );
}
