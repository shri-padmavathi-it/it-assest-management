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
  searchParams: Promise<{ page?: string; q?: string; location?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialPage = parseInt(resolvedSearchParams.page || "1");
  const query = (resolvedSearchParams.q || "").trim();
  const locationParam = (resolvedSearchParams.location || "in-house").toLowerCase();
  const isABB = locationParam === "abb";

  // Location filter: ABB vs In-House SPC (all non-ABB machines)
  const locationCondition = isABB
    ? {
        OR: [
          { location: { contains: "ABB" } },
          { location: { contains: "abb" } },
        ],
      }
    : {
        NOT: {
          OR: [
            { location: { contains: "ABB" } },
            { location: { contains: "abb" } },
          ],
        },
      };

  const where: any = query
    ? {
        AND: [
          locationCondition,
          {
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
          },
        ],
      }
    : locationCondition;

  const [computers, totalInHouse, totalABB] = await Promise.all([
    prisma.computer.findMany({
      where,
      include: {
        currentEmployee: true,
      },
      orderBy: { assetTag: "asc" },
    }),
    prisma.computer.count({
      where: {
        NOT: {
          OR: [
            { location: { contains: "ABB" } },
            { location: { contains: "abb" } },
          ],
        },
      },
    }),
    prisma.computer.count({
      where: {
        OR: [
          { location: { contains: "ABB" } },
          { location: { contains: "abb" } },
        ],
      },
    }),
  ]);

  const serializedComputers = computers.map((c) => ({
    id: c.id,
    assetTag: c.assetTag,
    computerName: c.computerName,
    status: c.status,
    location: c.location || (isABB ? "ABB" : "In-House SPC"),
    currentEmployee: c.currentEmployee
      ? {
          id: c.currentEmployee.id,
          name: c.currentEmployee.name,
          employeeId: c.currentEmployee.employeeId,
        }
      : null,
  }));

  const totalCount = isABB ? totalABB : totalInHouse;
  const basePath = isABB ? "/computers?location=abb" : "/computers?location=in-house";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-3xl font-bold tracking-tight">
              {isABB ? "ABB Computers" : "In-House SPC Computers"}
            </h2>
            <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
              {totalCount} Items
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            {isABB
              ? "Manage company computers and laptops deployed at ABB."
              : "Manage company computers and workstations located In-House (SPC)."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ComputerSearch initialQuery={query} basePath={basePath} />
          <ImportCSVButton />
          <Link
            href={`/computers/new?location=${isABB ? "abb" : "in-house"}`}
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
          <Link href={basePath} className="text-xs text-primary hover:underline font-medium">
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
