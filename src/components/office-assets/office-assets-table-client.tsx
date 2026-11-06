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
  SlidersHorizontal,
  Building2,
  Building,
  UserCheck
} from "lucide-react";
import { deleteOfficeAsset } from "@/app/actions";

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

  // Filter items based on selected category tab and search query
  const filteredAssets = useMemo(() => {
    return assets.filter((item) => {
      // Category filter
      if (selectedCategory !== "All") {
        if (selectedCategory === "Monitors" && !item.category?.toLowerCase().includes("monitor")) {
          return false;
        }
        if (selectedCategory === "Printers" && !item.category?.toLowerCase().includes("printer") && !item.category?.toLowerCase().includes("scanner")) {
          return false;
        }
        if (
          selectedCategory === "Air Conditioners (ACs)" && 
          !item.category?.toLowerCase().includes("ac") && 
          !item.category?.toLowerCase().includes("air conditioner")
        ) {
          return false;
        }
        if (selectedCategory === "Other Equipment") {
          const isKnown = 
            item.category?.toLowerCase().includes("monitor") ||
            item.category?.toLowerCase().includes("printer") ||
            item.category?.toLowerCase().includes("scanner") ||
            item.category?.toLowerCase().includes("ac") ||
            item.category?.toLowerCase().includes("air conditioner");
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

  // Ensure current page is valid when filter results shrink
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

  return (
    <div className="space-y-4">
      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { label: "All", count: assets.length },
            { 
              label: "Monitors", 
              count: assets.filter(a => a.category?.toLowerCase().includes("monitor")).length 
            },
            { 
              label: "Printers", 
              count: assets.filter(a => a.category?.toLowerCase().includes("printer") || a.category?.toLowerCase().includes("scanner")).length 
            },
            { 
              label: "Air Conditioners (ACs)", 
              count: assets.filter(a => a.category?.toLowerCase().includes("ac") || a.category?.toLowerCase().includes("air conditioner")).length 
            },
            { 
              label: "Other Equipment", 
              count: assets.filter(a => {
                const c = a.category?.toLowerCase() || "";
                return !c.includes("monitor") && !c.includes("printer") && !c.includes("scanner") && !c.includes("ac") && !c.includes("air conditioner");
              }).length 
            },
          ].map((tab) => {
            const isSelected = selectedCategory === tab.label;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => {
                  setSelectedCategory(tab.label);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold"
                    : "bg-card/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search assets, brand, serial..."
            className="w-full pl-9 pr-3 py-1.5 bg-card/60 border border-border/60 rounded-xl text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Table Container */}
      <div
        className="rounded-xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-xs overflow-hidden relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/40 border-b border-border/60">
              <tr>
                <th className="px-5 py-3 font-semibold text-muted-foreground">Asset Tag</th>
                <th className="px-5 py-3 font-semibold text-muted-foreground">Item Name</th>
                <th className="px-5 py-3 font-semibold text-muted-foreground">Category</th>
                <th className="px-5 py-3 font-semibold text-muted-foreground">Brand & Model</th>
                <th className="px-5 py-3 font-semibold text-muted-foreground">Location</th>
                <th className="px-5 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-semibold text-muted-foreground">Assigned To</th>
                <th className="px-5 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {displayedAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-muted-foreground">
                    <Boxes className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-base font-medium text-foreground/80">No office assets found</p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      {searchQuery
                        ? "Try clearing your search query."
                        : "Click 'Add Office Asset' above to register your first office appliance or equipment."}
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/office-assets/new"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add First Asset
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedAssets.map((asset) => {
                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-muted/40 transition-colors group text-xs select-none"
                    >
                      {/* Asset Tag */}
                      <td className="px-5 py-3.5 font-semibold text-primary">
                        <Link
                          href={`/office-assets/${asset.id}`}
                          className="hover:underline flex items-center gap-1.5"
                        >
                          {asset.assetTag}
                        </Link>
                      </td>

                      {/* Item Name */}
                      <td className="px-5 py-3.5 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-muted/60 shrink-0">
                            {getCategoryIcon(asset.category)}
                          </div>
                          <div>
                            <span className="font-semibold">{asset.name}</span>
                            {asset.serialNumber && (
                              <span className="block text-[11px] text-muted-foreground/80 font-mono">
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
                            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/office-assets/${asset.id}/edit`}
                            className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-500/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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

            {/* Numeric page pills with smart ellipsis */}
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

