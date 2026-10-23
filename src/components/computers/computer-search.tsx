"use client";

import { TableSearch } from "@/components/ui/table-search";

export function ComputerSearch({ initialQuery = "" }: { initialQuery?: string }) {
  return (
    <TableSearch
      basePath="/computers"
      placeholder="Search computers, user..."
      initialQuery={initialQuery}
    />
  );
}
