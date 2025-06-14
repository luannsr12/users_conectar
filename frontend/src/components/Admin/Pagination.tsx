import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const generatePages = () => {
        const pages: (number | string)[] = [];

        pages.push(1);

        if (currentPage - 1 > 2) {
            pages.push("left-ellipsis");
        }

        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i);
            }
        }

        if (currentPage + 1 < totalPages - 1) {
            pages.push("right-ellipsis");
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = generatePages();

    return (
        <div className="flex items-center justify-center mt-4">
            {/* Prev */}
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
                &laquo;
            </button>

            {pages.map((page, idx) => {
                if (page === "left-ellipsis" || page === "right-ellipsis") {
                    return (
                        <span key={page + idx} className="px-2 text-gray-500">
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 cursor-pointer py-1 mx-1 rounded ${page === currentPage
                            ? "bg-black text-white font-bold"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next */}
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
                &raquo;
            </button>
        </div>
    );
}
