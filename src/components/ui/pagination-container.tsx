"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, TouchEvent } from "react";

interface PaginationContainerProps {
  children: React.ReactNode;
  totalPages: number;
  currentPage: number;
  basePath: string;
}

export function PaginationContainer({ children, totalPages, currentPage, basePath }: PaginationContainerProps) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const minSwipeDistance = 50;

  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(`${basePath}?page=${page}`);
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swiped left -> Go to next page
      navigateToPage(currentPage + 1);
    } else if (isRightSwipe) {
      // Swiped right -> Go to previous page
      navigateToPage(currentPage - 1);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="space-y-4">
      {/* Swipeable Table Wrapper */}
      <div 
        className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="p-0 overflow-x-auto">
          {children}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 rounded-md border px-3 py-1 text-sm hover:bg-muted disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 rounded-md border px-3 py-1 text-sm hover:bg-muted disabled:opacity-50 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
