import { PackageSearch, Plus, Trash2, Edit2, Monitor, User, Key, RefreshCw, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { deleteSoftwareAsset } from "@/app/actions";
import { TableSearch } from "@/components/ui/table-search";

interface SoftwareAssetWithAssignments {
  id: string;
  name: string;
  vendor: string | null;
  category: string | null;
  licenseType: string;
  credentials: string | null;
  status: string;
  expiryDate: Date | null;
  neverExpires: boolean;
  allowedInstallations: number;
  description: string | null;
  createdAt: Date;
  assignments: Array<{
    id: string;
    computer: {
      id: string;
      computerName: string;
      assetTag: string;
    } | null;
    employee: {
      id: string;
      name: string;
      employeeId: string;
    } | null;
  }>;
}

interface SoftwareLicenseListProps {
  type: "permanent" | "subscriptions";
  assets: SoftwareAssetWithAssignments[];
  query: string;
  permanentCount: number;
  subscriptionCount: number;
}

function getLicenseStartDate(asset: { createdAt: Date; description: string | null }): string {
  if (asset.description) {
    const match = asset.description.match(/\[START_DATE:([\d-]+)\]/);
    if (match && match[1]) {
      const parts = match[1].split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
  }
  const d = new Date(asset.createdAt);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function SoftwareLicenseList({
  type,
  assets,
  query,
}: SoftwareLicenseListProps) {
  const isPermanent = type === "permanent";
  const basePath = isPermanent ? "/software-licenses/permanent" : "/software-licenses/subscriptions";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-3xl font-bold tracking-tight">
              {isPermanent ? "Permanent Licenses" : "Subscription Licenses"}
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {assets.length} {assets.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            {isPermanent
              ? "Manage perpetual, standalone, node-locked, and network licenses."
              : "Manage recurring software subscriptions, cloud seat accounts, and renewals."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <TableSearch
            basePath={basePath}
            placeholder={isPermanent ? "Search permanent software, keys..." : "Search subscriptions, accounts..."}
            initialQuery={query}
          />
          <Link
            href={`/software-licenses/new?type=${type}`}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            {isPermanent ? "Add Permanent Software" : "Add Subscription"}
          </Link>
        </div>
      </div>

      {/* Query Banner */}
      {query && (
        <div className="flex items-center justify-between bg-muted/40 border rounded-lg px-4 py-2.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Search results for <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>
            </span>
            <span className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-0.5 rounded-full">
              {assets.length} found
            </span>
          </div>
          <Link href={basePath} className="text-xs text-primary hover:underline font-medium">
            Clear search
          </Link>
        </div>
      )}

      {/* Software Table */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase bg-muted/40 border-b">
              <tr>
                <th className="px-5 py-3.5">Software</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">License Type</th>
                <th className="px-4 py-3.5">License Start</th>
                <th className="px-4 py-3.5">License End</th>
                <th className="px-5 py-3.5">Assigned To</th>
                <th className="px-4 py-3.5 text-center">Installs</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <PackageSearch className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      {query ? (
                        <div className="flex flex-col items-center space-y-2">
                          <p className="text-base font-semibold text-foreground">
                            No {isPermanent ? "permanent licenses" : "subscriptions"} found
                          </p>
                          <p className="text-sm text-muted-foreground">
                            No records matching &ldquo;{query}&rdquo;
                          </p>
                          <Link
                            href={basePath}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 border transition-colors"
                          >
                            Clear search
                          </Link>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <p className="text-base font-semibold text-foreground">
                            No {isPermanent ? "permanent licenses" : "subscription licenses"} added yet
                          </p>
                          <p className="text-sm text-muted-foreground max-w-sm">
                            {isPermanent
                              ? "Register your perpetual licenses, dongle keys, and node-locked software here."
                              : "Register your recurring monthly/annual subscriptions, Office 365, and SaaS seats here."}
                          </p>
                          <Link
                            href={`/software-licenses/new?type=${type}`}
                            className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
                          >
                            <Plus className="h-4 w-4" />
                            {isPermanent ? "Add First Permanent Software" : "Add First Subscription"}
                          </Link>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                assets.map((asset) => {
                  const activeAssignments = asset.assignments || [];
                  const isFullyAssigned = activeAssignments.length >= asset.allowedInstallations;

                  // Expiry calculations for subscriptions
                  const now = new Date();
                  const isExpired = asset.expiryDate && new Date(asset.expiryDate) < now;
                  const isExpiringSoon =
                    asset.expiryDate &&
                    !isExpired &&
                    (new Date(asset.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 30;

                  const startDateDisplay = getLicenseStartDate(asset);

                  return (
                    <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
                      {/* 1. Software */}
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/software-licenses/${asset.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors block leading-tight"
                        >
                          {asset.name}
                        </Link>
                        {asset.vendor && <div className="text-[11px] text-muted-foreground mt-0.5">{asset.vendor}</div>}
                      </td>

                      {/* 2. Category */}
                      <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {asset.category ? (
                          <span className="px-2 py-0.5 rounded-md bg-muted/70 text-foreground/80 font-medium text-[11px]">
                            {asset.category}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>

                      {/* 3. License Type */}
                      <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {isPermanent ? (
                          <span className="inline-flex items-center gap-1 font-medium text-foreground/90">
                            <Key className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                            {asset.licenseType}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-[11px]">
                            <RefreshCw className="h-3 w-3 shrink-0" />
                            Subscription
                          </span>
                        )}
                      </td>

                      {/* 4. License Start */}
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap text-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span>{startDateDisplay}</span>
                        </div>
                      </td>

                      {/* 5. License End (Never Ending for Permanent, Expiry for Subscription) */}
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                        {isPermanent ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Never Ending
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/80 dark:border-red-800/50">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            Expired ({new Date(asset.expiryDate!).toLocaleDateString()})
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            Expiring ({new Date(asset.expiryDate!).toLocaleDateString()})
                          </span>
                        ) : asset.expiryDate ? (
                          <div className="flex items-center gap-1.5 text-foreground font-medium">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>{new Date(asset.expiryDate).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Never Ending
                          </span>
                        )}
                      </td>

                      {/* 6. Assigned To */}
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

                      {/* 7. Installs */}
                      <td className="px-4 py-3.5 text-xs text-center whitespace-nowrap">
                        <span
                          className={`font-semibold ${isFullyAssigned ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {activeAssignments.length}
                        </span>
                        <span className="text-muted-foreground/50"> / {asset.allowedInstallations}</span>
                      </td>

                      {/* 8. Actions */}
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
