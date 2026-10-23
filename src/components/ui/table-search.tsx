"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2, ArrowRight } from "lucide-react";

interface TableSearchProps {
  basePath: string;
  placeholder?: string;
  initialQuery?: string;
}

export function TableSearch({
  basePath,
  placeholder = "Search...",
  initialQuery = "",
}: TableSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(
    initialQuery || searchParams.get("q") || ""
  );

  // Sync state if searchParams changes externally
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [searchParams]);

  const executeSearch = useCallback((queryToSearch: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    const trimmed = queryToSearch.trim();

    if (trimmed) {
      params.set("q", trimmed);
      params.delete("page"); // Reset to page 1 on new search
    } else {
      params.delete("q");
      params.delete("page");
    }

    startTransition(() => {
      const qs = params.toString();
      router.push(`${basePath}${qs ? `?${qs}` : ""}`);
    });
  }, [basePath, router, searchParams]);

  // Debounced live search as user types
  useEffect(() => {
    const currentQ = (searchParams.get("q") || "").trim();
    if (searchQuery.trim() === currentQ) return;

    const timer = setTimeout(() => {
      executeSearch(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, executeSearch, searchParams]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.delete("q");
    params.delete("page");

    startTransition(() => {
      const qs = params.toString();
      router.push(`${basePath}${qs ? `?${qs}` : ""}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center">
      <div className="group relative flex items-center h-10 rounded-full border border-border/80 bg-background/90 dark:bg-card/70 backdrop-blur-xl pl-3.5 pr-1.5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:bg-background focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 focus-within:shadow-md">
        {/* Search Icon */}
        <Search className="h-4 w-4 text-muted-foreground/70 group-focus-within:text-primary transition-all duration-200 shrink-0 pointer-events-none group-focus-within:scale-105" />

        {/* Input Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="h-full w-52 sm:w-64 md:w-72 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 mr-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted/80 rounded-full transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Premium Embedded Search Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`group/btn flex items-center gap-1.5 h-[30px] rounded-full px-3.5 text-xs font-semibold transition-all duration-200 shadow-xs active:scale-95 cursor-pointer shrink-0 ${
            searchQuery.trim()
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          } disabled:opacity-60`}
          title="Search"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          )}
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
