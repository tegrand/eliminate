import { forwardRef } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";

/**
 * A highly reusable Pagination component.
 */
const Pagination = forwardRef(
  (
    {
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      className,
      ...props
    },
    ref
  ) => {
    // Generate page numbers
    const getPageNumbers = () => {
      const pages = [];
      const showMax = 5; 
      
      if (totalPages <= showMax) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
        }
      }
      return pages;
    };

    const pages = getPageNumbers();

    const handlePageClick = (page) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange?.(page);
      }
    };

    const ButtonClass = "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50";

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="pagination"
        className={clsx("flex items-center justify-center space-x-1", className)}
        {...props}
      >
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          className={clsx(ButtonClass, "hover:bg-gray-100 hover:text-gray-900 hidden sm:inline-flex")}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(ButtonClass, "hover:bg-gray-100 hover:text-gray-900")}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center space-x-1">
          {pages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="flex h-9 w-9 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                  <span className="sr-only">More pages</span>
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={clsx(
                  ButtonClass,
                  currentPage === page
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                    : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(ButtonClass, "hover:bg-gray-100 hover:text-gray-900")}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          className={clsx(ButtonClass, "hover:bg-gray-100 hover:text-gray-900 hidden sm:inline-flex")}
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;
