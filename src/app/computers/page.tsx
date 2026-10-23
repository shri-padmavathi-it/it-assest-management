import { prisma } from "@/lib/prisma";
import { Monitor, Plus, Trash2, Edit2, User } from "lucide-react";
import Link from "next/link";
import { deleteComputer } from "@/app/actions";
import { ImportCSVButton } from "@/components/computers/import-csv-button";
import { ComputerSearch } from "@/components/computers/computer-search";
import { PaginationContainer } from "@/components/ui/pagination-container";

export default async function ComputersPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const query = (resolvedSearchParams.q || '').trim();
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

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

  const [computers, totalComputers] = await Promise.all([
    prisma.computer.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        currentEmployee: true
      },
      orderBy: { assetTag: 'asc' }
    }),
    prisma.computer.count({ where })
  ]);

  const totalPages = Math.ceil(totalComputers / pageSize);

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
          <Link href="/computers/new" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs">
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
              {totalComputers} {totalComputers === 1 ? 'computer' : 'computers'} found
            </span>
          </div>
          <Link
            href="/computers"
            className="text-xs text-primary hover:underline font-medium"
          >
            Clear search
          </Link>
        </div>
      )}

      <PaginationContainer totalPages={totalPages} currentPage={page} basePath="/computers">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3">Asset ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Current User</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {computers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  {query ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-base font-semibold text-foreground">No computers found</p>
                      <p className="text-sm text-muted-foreground">
                        No results matching &ldquo;{query}&rdquo;
                      </p>
                      <Link
                        href="/computers"
                        className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 border transition-colors"
                      >
                        Clear search
                      </Link>
                    </div>
                  ) : (
                    "No computers found."
                  )}
                </td>
              </tr>
            ) : (
              computers.map((comp) => {
                const isInUse = comp.status === "In Use" || Boolean(comp.currentEmployee);
                const isAvailable = comp.status === "Available" && !comp.currentEmployee;

                return (
                  <tr
                    key={comp.id}
                    className={`border-b last:border-0 hover:bg-muted/50 transition-colors ${
                      isInUse ? "bg-indigo-500/[0.02] dark:bg-indigo-500/[0.04]" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/computers/${comp.id}`} className="text-primary hover:underline font-semibold font-mono">
                        {comp.assetTag}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium">{comp.computerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {comp.status === "In Use" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 shadow-2xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                          In Use
                        </span>
                      ) : comp.status === "Available" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          Available
                        </span>
                      ) : comp.status === "Under Repair" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                          Under Repair
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                          {comp.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {comp.currentEmployee ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 shadow-2xs">
                          <User className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>{comp.currentEmployee.name}</span>
                          {comp.currentEmployee.employeeId && (
                            <span className="text-[10px] opacity-75 font-mono px-1 py-0.2 bg-purple-500/15 rounded">
                              {comp.currentEmployee.employeeId}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 text-xs italic flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{comp.location || '—'}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link href={`/computers/${comp.id}/edit`} className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-500/10 transition-colors" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <form action={deleteComputer.bind(null, comp.id)}>
                      <button type="submit" className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-500/10 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </PaginationContainer>
    </div>
  );
}
