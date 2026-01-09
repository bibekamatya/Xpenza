import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
}

const Pagination = ({
  totalPages,
  currentPage,
  handlePageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-6 flex gap-2 items-center justify-center">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {/* Page Numbers */}
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

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-1"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
