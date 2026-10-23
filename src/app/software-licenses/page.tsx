import { prisma } from "@/lib/prisma";
import { PackageSearch, Plus, Trash2, Edit2, Monitor, User } from "lucide-react";
import Link from "next/link";
import { deleteSoftwareAsset } from "@/app/actions";
import { TableSearch } from "@/components/ui/table-search";

export default async function SoftwareLicensesPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const query = (resolvedSearchParams?.q || '').trim();

  const where = query
    ? {
      OR: [
        { name: { contains: query } },
        { vendor: { contains: query } },
        { category: { contains: query } },
        { licenseType: { contains: query } },
        { credentials: { contains: query } },
        { status: { contains: query } },
        {
          assignments: {
            some: {
              status: 'Active',
              OR: [
                { computer: { computerName: { contains: query } } },
                { computer: { assetTag: { contains: query } } },
                { employee: { name: { contains: query } } },
                { employee: { employeeId: { contains: query } } },
              ]
            }
          }
        }
      ],
    }
    : {};

  const assets = await prisma.softwareAsset.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      assignments: {
        where: { status: 'Active' },
        include: {
          computer: true,
          employee: true
        }
      }
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Software & Licenses</h2>
          <p className="text-muted-foreground">Manage your entire software portfolio and license keys.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <TableSearch basePath="/software-licenses" placeholder="Search software, vendor, key..." initialQuery={query} />
          <Link href="/software-licenses/new" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs">
            <Plus className="h-4 w-4" />
            Add Software
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
              {assets.length} {assets.length === 1 ? 'license' : 'licenses'} found
            </span>
          </div>
          <Link
            href="/software-licenses"
            className="text-xs text-primary hover:underline font-medium"
          >
            Clear search
          </Link>
        </div>
      )}

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase bg-muted/40 border-b">
              <tr>
                <th className="px-5 py-3.5">Software</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">License Type</th>
                <th className="px-4 py-3.5">Key / Credentials</th>
                <th className="px-4 py-3.5">Expiry</th>
                <th className="px-4 py-3.5 text-center">Installs</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5">Assigned To</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <PackageSearch className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      {query ? (
                        <div className="flex flex-col items-center space-y-2">
                          <p className="text-base font-semibold text-foreground">No software or licenses found</p>
                          <p className="text-sm text-muted-foreground">
                            No results matching &ldquo;{query}&rdquo;
                          </p>
                          <Link
                            href="/software-licenses"
                            className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 border transition-colors"
                          >
                            Clear search
                          </Link>
                        </div>
                      ) : (
                        "No software or licenses found."
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                assets.map((asset) => {
                  const activeAssignments = asset.assignments || [];
                  const isFullyAssigned = activeAssignments.length >= asset.allowedInstallations;
                  const isPartiallyAssigned = activeAssignments.length > 0 && !isFullyAssigned;

                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Software Details */}
                      <td className="px-5 py-3.5">
                        <Link href={`/software-licenses/${asset.id}`} className="font-semibold text-foreground hover:text-primary transition-colors block leading-tight">
                          {asset.name}
                        </Link>
                        {asset.vendor && <div className="text-[11px] text-muted-foreground mt-0.5">{asset.vendor}</div>}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {asset.category ? (
                          <span className="px-2 py-0.5 rounded-md bg-muted/70 text-foreground/80 font-medium text-[11px]">
                            {asset.category}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>

                      {/* License Type */}
                      <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {asset.licenseType}
                      </td>

                      {/* Key / Credentials (truncated cleanly so it doesn't break rows) */}
                      <td className="px-4 py-3.5 text-xs font-mono text-muted-foreground max-w-[130px] truncate" title={asset.credentials || ""}>
                        {asset.credentials || <span className="text-muted-foreground/40">—</span>}
                      </td>

                      {/* Expiry */}
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                        {asset.neverExpires ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                            Perpetual
                          </span>
                        ) : asset.expiryDate ? (
                          new Date(asset.expiryDate).toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>

                      {/* Installations Count */}
                      <td className="px-4 py-3.5 text-xs text-center whitespace-nowrap">
                        <span className={`font-semibold ${isFullyAssigned ? "text-foreground" : "text-muted-foreground"}`}>
                          {activeAssignments.length}
                        </span>
                        <span className="text-muted-foreground/50"> / {asset.allowedInstallations}</span>
                      </td>

                      {/* Status - Clean, elegant pill badge */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        {isFullyAssigned ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                            Assigned
                          </span>
                        ) : isPartiallyAssigned ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                            Partial ({activeAssignments.length}/{asset.allowedInstallations})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Available
                          </span>
                        )}
                      </td>

                      {/* Assigned To - Clean, compact text with subtle icon indicators */}
                      <td className="px-5 py-3.5">
                        {activeAssignments.length === 0 ? (
                          <span className="text-muted-foreground/35 text-xs select-none">—</span>
                        ) : (
                          <div className="flex flex-col gap-1 min-w-[150px]">
                            {activeAssignments.map((assignment) => (
                              <div key={assignment.id} className="space-y-0.5">
                                {assignment.computer && (
                                  <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                                    <Monitor className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                    <span className="truncate max-w-[140px]" title={assignment.computer.computerName}>
                                      {assignment.computer.computerName}
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground bg-muted/80 px-1 py-0.2 rounded shrink-0">
                                      {assignment.computer.assetTag}
                                    </span>
                                  </div>
                                )}
                                {assignment.employee && (
                                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                    <User className="h-3 w-3 text-purple-600 dark:text-purple-400 shrink-0" />
                                    <span className="truncate max-w-[140px]" title={assignment.employee.name}>
                                      {assignment.employee.name}
                                    </span>
                                    {assignment.employee.employeeId && (
                                      <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0">
                                        ({assignment.employee.employeeId})
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Actions - Clean, quiet buttons that don't overwhelm the table */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex justify-end items-center gap-1">
                          {isFullyAssigned ? (
                            <Link
                              href={`/software-licenses/${asset.id}/assign`}
                              className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                              title="Manage assignment"
                            >
                              Manage
                            </Link>
                          ) : (
                            <Link
                              href={`/software-licenses/${asset.id}/assign`}
                              className="px-2 py-1 text-xs font-semibold text-primary hover:text-primary/90 hover:bg-primary/10 rounded transition-colors"
                              title="Assign license"
                            >
                              Assign
                            </Link>
                          )}
                          <Link
                            href={`/software-licenses/${asset.id}/edit`}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>
                          <form action={deleteSoftwareAsset.bind(null, asset.id)}>
                            <button
                              type="submit"
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
