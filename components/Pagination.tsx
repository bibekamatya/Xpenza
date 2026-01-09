"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  loadMore?: () => void;
}

const Pagination = ({
  totalPages,
  currentPage,
  handlePageChange,
  hasMore,
  isLoadingMore,
  loadMore,
}: PaginationProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMore || isLoadingMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, isLoadingMore, hasMore]);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      {/* Mobile: Infinite Scroll */}
      <div className="md:hidden">
        {isLoadingMore && (
          <div className="p-4 text-center">
            <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div ref={loadMoreRef} className="h-4" />
      </div>

      {/* Desktop: Pagination */}
      <div className="hidden md:flex p-6 gap-2 items-center justify-center">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-lg text-sm border transition-all active:scale-95 ${
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

export default Pagination;
