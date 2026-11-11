"use client";

import { useState, useRef, TouchEvent, useMemo } from "react";
import Link from "next/link";
import { 
  Monitor, 
  Printer, 
  Wind, 
  Boxes, 
  Tv, 
  Zap, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Plus, 
  Building2, 
  Building, 
  UserCheck,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { deleteOfficeAsset } from "@/app/actions";
import { EditOfficeAssetModal } from "./edit-office-asset-modal";

export interface OfficeAssetItem {
  id: string;
  assetTag: string;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  location: string | null;
  status: string;
  assignedTo: string | null;
  purchaseDate: string | Date | null;
  warrantyExpiry: string | Date | null;
  notes: string | null;
  createdAt?: string | Date;
}

interface OfficeAssetsTableClientProps {
  assets: OfficeAssetItem[];
}

export function OfficeAssetsTableClient({ assets }: OfficeAssetsTableClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Category counts
  const counts = useMemo(() => {
    return {
      all: assets.length,
      monitors: assets.filter((a) => a.category?.toLowerCase().includes("monitor")).length,
      printers: assets.filter(
        (a) => a.category?.toLowerCase().includes("printer") || a.category?.toLowerCase().includes("scanner")
      ).length,
      acs: assets.filter(
        (a) => a.category?.toLowerCase().includes("ac") || a.category?.toLowerCase().includes("air")
      ).length,
      other: assets.filter((a) => {
        const c = a.category?.toLowerCase() || "";
        return (
          !c.includes("monitor") &&
          !c.includes("printer") &&
          !c.includes("scanner") &&
          !c.includes("ac") &&
          !c.includes("air")
        );
      }).length,
    };
  }, [assets]);

  // Filter items based on selected category card and search query
  const filteredAssets = useMemo(() => {
    return assets.filter((item) => {
      // Category filter
      if (selectedCategory !== "All") {
        if (selectedCategory === "Monitors" && !item.category?.toLowerCase().includes("monitor")) {
          return false;
        }
        if (
          selectedCategory === "Printers" &&
          !item.category?.toLowerCase().includes("printer") &&
          !item.category?.toLowerCase().includes("scanner")
        ) {
          return false;
        }
        if (
          selectedCategory === "Air Conditioners" &&
          !item.category?.toLowerCase().includes("ac") &&
          !item.category?.toLowerCase().includes("air")
        ) {
          return false;
        }
        if (selectedCategory === "Other Equipment") {
          const isKnown =
            item.category?.toLowerCase().includes("monitor") ||
            item.category?.toLowerCase().includes("printer") ||
            item.category?.toLowerCase().includes("scanner") ||
            item.category?.toLowerCase().includes("ac") ||
            item.category?.toLowerCase().includes("air");
          if (isKnown) return false;
        }
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.assetTag?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.model?.toLowerCase().includes(q) ||
        item.serialNumber?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.assignedTo?.toLowerCase().includes(q) ||
        item.status?.toLowerCase().includes(q)
      );
    });
  }, [assets, selectedCategory, searchQuery]);

  const totalAssets = filteredAssets.length;
  const totalPages = Math.max(1, Math.ceil(totalAssets / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const displayedAssets = filteredAssets.slice(startIndex, startIndex + pageSize);

  const navigateToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      navigateToPage(safePage + 1);
    } else if (distance < -minSwipeDistance) {
      navigateToPage(safePage - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getCategoryIcon = (category: string) => {
    const c = category?.toLowerCase() || "";
    if (c.includes("monitor") || c.includes("screen") || c.includes("display")) {
      return <Tv className="h-4 w-4 text-blue-500" />;
    }
    if (c.includes("printer") || c.includes("scanner")) {
      return <Printer className="h-4 w-4 text-purple-500" />;
    }
    if (c.includes("ac") || c.includes("air") || c.includes("conditioner")) {
      return <Wind className="h-4 w-4 text-teal-500" />;
    }
    if (c.includes("ups") || c.includes("power") || c.includes("battery")) {
      return <Zap className="h-4 w-4 text-amber-500" />;
    }
    return <Boxes className="h-4 w-4 text-primary" />;
  };

  // Interactive Category Card Definition
  const categoryCards = [
    {
      id: "All",
      label: "Total Assets",
      count: counts.all,
      icon: Boxes,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      activeBorder: "border-primary ring-2 ring-primary/20 bg-primary/5",
    },
    {
      id: "Monitors",
      label: "Monitors",
      count: counts.monitors,
      icon: Tv,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      activeBorder: "border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5",
    },
    {
      id: "Printers",
      label: "Printers",
      count: counts.printers,
      icon: Printer,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
      activeBorder: "border-purple-500 ring-2 ring-purple-500/20 bg-purple-500/5",
    },
    {
      id: "Air Conditioners",
      label: "Air Conditioners",
      count: counts.acs,
      icon: Wind,
      iconColor: "text-teal-500",
      iconBg: "bg-teal-500/10",
      activeBorder: "border-teal-500 ring-2 ring-teal-500/20 bg-teal-500/5",
    },
    {
      id: "Other Equipment",
      label: "Other Equipment",
      count: counts.other,
      icon: Zap,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
      activeBorder: "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Category Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {categoryCards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedCategory === card.id;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => {
                setSelectedCategory(card.id);
                setCurrentPage(1);
              }}
              className={`relative text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group overflow-hidden ${
                isSelected
                  ? card.activeBorder + " shadow-md"
                  : "bg-card/70 backdrop-blur-xl border-border/50 hover:border-border hover:bg-card/90 hover:shadow-sm"
              }`}
            >
              {/* Header row inside card */}
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl transition-all ${card.iconBg} ${card.iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              {/* Count */}
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {card.count}
                </span>

                {isSelected && (
                  <span className="inline-flex items-center text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Active Filter
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            {selectedCategory === "All" ? "All Office Assets" : `Filtered: ${selectedCategory}`}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-foreground border border-border/50">
            {filteredAssets.length}
          </span>
          {selectedCategory !== "All" && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setCurrentPage(1);
              }}
              className="text-xs text-primary hover:underline ml-1 font-medium cursor-pointer"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by tag, name, brand, location..."
            className="w-full pl-9 pr-3 py-2 bg-card/70 backdrop-blur-xl border border-border/60 rounded-xl text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Main Content: Table OR Beautiful Empty State */}
      {assets.length === 0 ? (
        /* Empty State when no assets have been added yet */
        <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-xl p-8 sm:p-12 text-center shadow-xs">
          <div className="relative mx-auto w-20 h-20 mb-5 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-primary/10 animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-primary/15 border border-primary/25 text-primary flex items-center justify-center shadow-inner">
              <Boxes className="h-8 w-8" />
            </div>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-foreground">
            No Office Assets Registered Yet
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed">
            Keep track of your physical office hardware, monitors, printers, air conditioners, and equipment in one organized inventory.
          </p>

          {/* Quick Start Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/office-assets/new?category=Monitor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 transition-all shadow-2xs hover:-translate-y-0.5"
            >
              <Tv className="h-4 w-4" />
              Add Monitor
            </Link>

            <Link
              href="/office-assets/new?category=Printer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 transition-all shadow-2xs hover:-translate-y-0.5"
            >
              <Printer className="h-4 w-4" />
              Add Printer
            </Link>

            <Link
              href="/office-assets/new?category=Air Conditioner"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 hover:bg-teal-500/15 border border-teal-500/20 transition-all shadow-2xs hover:-translate-y-0.5"
            >
              <Wind className="h-4 w-4" />
              Add Air Conditioner
            </Link>

            <Link
              href="/office-assets/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Register Any Asset
            </Link>
          </div>
        </div>
      ) : displayedAssets.length === 0 ? (
        /* Empty State for Search Filter Result */
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-10 text-center shadow-xs">
          <Search className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <h4 className="text-base font-bold text-foreground">No matching assets found</h4>
          <p className="text-xs text-muted-foreground mt-1">
            No items matched your search query &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Populated Table Container */
        <div
          className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-xs overflow-hidden relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] uppercase tracking-wider font-semibold bg-muted/40 text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="px-5 py-3.5">Asset Tag</th>
                  <th className="px-5 py-3.5">Item Name</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Brand & Model</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Assigned To</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {displayedAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-muted/40 transition-colors group text-xs select-none"
                  >
                    {/* Asset Tag */}
                    <td className="px-5 py-3.5 font-semibold text-primary">
                      <Link
                        href={`/office-assets/${asset.id}`}
                        className="hover:underline flex items-center gap-1.5 font-mono"
                      >
                        {asset.assetTag}
                      </Link>
                    </td>

                    {/* Item Name */}
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-muted/60 shrink-0">
                          {getCategoryIcon(asset.category)}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{asset.name}</span>
                          {asset.serialNumber && (
                            <span className="block text-[11px] text-muted-foreground font-mono">
                              S/N: {asset.serialNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-muted/70 text-foreground border border-border/40">
                        {asset.category}
                      </span>
                    </td>

                    {/* Brand & Model */}
                    <td className="px-5 py-3.5 text-foreground whitespace-nowrap">
                      {asset.brand || asset.model ? (
                        <div>
                          <span className="font-medium">{asset.brand || "—"}</span>
                          {asset.model && (
                            <span className="text-muted-foreground ml-1.5 text-[11px]">
                              {asset.model}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60 italic">—</span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {asset.location ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            asset.location.toLowerCase().includes("in-house") ||
                            asset.location.toUpperCase().includes("spc")
                              ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                              : asset.location.toUpperCase().includes("abb")
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-muted text-muted-foreground border"
                          }`}
                        >
                          {asset.location.toUpperCase().includes("abb") ? (
                            <Building className="h-3 w-3" />
                          ) : (
                            <Building2 className="h-3 w-3" />
                          )}
                          {asset.location}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 italic">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          asset.status === "Available"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : asset.status === "In Use"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                            : asset.status === "Under Repair"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>

                    {/* Assigned To */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-foreground">
                      {asset.assignedTo ? (
                        <span className="inline-flex items-center gap-1.5 text-xs">
                          <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                          {asset.assignedTo}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/office-assets/${asset.id}`}
                          prefetch={true}
                          className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <EditOfficeAssetModal asset={asset} />
                        <form
                          action={async () => {
                            if (confirm(`Are you sure you want to delete ${asset.name} (${asset.assetTag})?`)) {
                              await deleteOfficeAsset(asset.id);
                            }
                          }}
                        >
                          <button
                            type="submit"
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pt-1 select-none">
          <div className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{startIndex + 1}</strong> to{" "}
            <strong className="text-foreground">{Math.min(startIndex + pageSize, totalAssets)}</strong> of{" "}
            <strong className="text-foreground">{totalAssets}</strong> assets
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigateToPage(safePage - 1)}
              disabled={safePage <= 1}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            {/* Numeric page pills */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                if (
                  totalPages > 7 &&
                  pageNum !== 1 &&
                  pageNum !== totalPages &&
                  Math.abs(pageNum - safePage) > 1
                ) {
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return (
                      <span
                        key={pageNum}
                        className="h-7 w-7 flex items-center justify-center text-xs text-muted-foreground select-none"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => navigateToPage(pageNum)}
                    className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors ${
                      safePage === pageNum
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => navigateToPage(safePage + 1)}
              disabled={safePage >= totalPages}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
