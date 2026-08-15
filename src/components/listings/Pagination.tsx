"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6">
      {/* Previous arrow */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/arrow-left.svg"
          alt="Previous"
          width={24}
          height={24}
        />
      </button>

      {/* Page numbers */}
      <div
        className="flex items-center gap-2 md:gap-3 text-[14px] md:text-[15px]"
        style={{ fontFamily: "'Lato', sans-serif" }}
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-[32px] h-[32px] md:w-[36px] md:h-[36px] flex items-center justify-center transition-all duration-300 ${
              page === currentPage
                ? "gold-gradient-bg text-[#09312a] font-semibold"
                : "text-white/60 hover:text-white border border-white/20 hover:border-white/40"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next arrow */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/arrow-left.svg"
          alt="Next"
          width={24}
          height={24}
          className="scale-x-[-1]"
        />
      </button>
    </div>
  );
}
