import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportCSVButton } from "@/components/computers/import-csv-button";
import { ComputerSearch } from "@/components/computers/computer-search";
import { ComputersTableClient } from "@/components/computers/computers-table-client";

export const revalidate = 60;

export default async function ComputersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialPage = parseInt(resolvedSearchParams.page || "1");
  const query = (resolvedSearchParams.q || "").trim();

  const where = query
    ? {
        OR: [
          { assetTag: { contains: query } },
          { computerName: { contains: query } },
          { brand: { contains: query } },
          { model: { contains: query } },
          { serialNumber: { contains: query } },
          { location: { contains: query } },
          { department: { contains: query } },
          { processor: { contains: query } },
          { operatingSystem: { contains: query } },
          { status: { contains: query } },
          { macId: { contains: query } },
          { currentEmployee: { name: { contains: query } } },
          { currentEmployee: { employeeId: { contains: query } } },
          { currentEmployee: { email: { contains: query } } },
        ],
      }
    : {};

  const computers = await prisma.computer.findMany({
    where,
    include: {
      currentEmployee: true,
    },
    orderBy: { assetTag: "asc" },
  });

  const serializedComputers = computers.map((c) => ({
    id: c.id,
    assetTag: c.assetTag,
    computerName: c.computerName,
    status: c.status,
    location: c.location,
    currentEmployee: c.currentEmployee
      ? {
          id: c.currentEmployee.id,
          name: c.currentEmployee.name,
          employeeId: c.currentEmployee.employeeId,
        }
      : null,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Computers</h2>
          <p className="text-muted-foreground">Manage all company computers and laptops.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ComputerSearch initialQuery={query} />
          <ImportCSVButton />
          <Link
            href="/computers/new"
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Add Computer
          </Link>
        </div>
      </div>

      {query && (
        <div className="flex items-center justify-between bg-muted/40 border rounded-lg px-4 py-2.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Search results for <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>
            </span>
            <span className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-0.5 rounded-full">
              {serializedComputers.length} {serializedComputers.length === 1 ? "computer" : "computers"} found
            </span>
          </div>
          <Link href="/computers" className="text-xs text-primary hover:underline font-medium">
            Clear search
          </Link>
        </div>
      )}

      <ComputersTableClient
        computers={serializedComputers}
        query={query}
        initialPage={initialPage}
        pageSize={10}
      />
    </div>
  );
}
