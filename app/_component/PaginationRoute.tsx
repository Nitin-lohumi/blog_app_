"use client";
import React from "react";
type Props = {
  page: number;
  setPageAction: (value: number | ((prev: number) => number)) => void;
  totalPages: number;
};
export default function Pagination({
  page = 10,
  setPageAction,
  totalPages = 10,
}: Props) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page > 3) {
        pages.push(1);
        if (page > 4) pages.push("...");
      }
      const start = Math.max(1, page - 1);
      const end = Math.min(totalPages, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) {
        if (page < totalPages - 3) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="p-2">
      <div className="flex w-full md:justify-between justify-center gap-3">
        <button
          onClick={() => setPageAction((prev) => Math.max(1, prev - 1))}
          className="cursor-pointer border bg-blue-400 
          dark:bg-blue-40 disabled:bg-gray-200 dark:disabled:bg-gray-600 rounded-lg p-1 pl-2 pr-2 disabled:cursor-not-allowed"
          disabled={page === 1}
        >
          Prev
        </button>
        <div className="flex md:gap-7">
          {getPageNumbers().map((num, index) =>
            num === "..." ? (
              <span key={index}>...</span>
            ) : (
              <button
                onClick={() => setPageAction(Number(num))}
                key={index}
                className={`px-3 py-1 rounded ${
                  num === page
                    ? "dark:bg-green-700/60 bg-gray-400 dark:text-white border"
                    : "border"
                }`}
              >
                {num}
              </button>
            )
          )}
        </div>
        <button
          className="cursor-pointer border bg-blue-400 
           dark:bg-blue-400 disabled:bg-gray-200 dark:disabled:bg-gray-600 rounded-lg pl-2 pr-2 disabled:cursor-not-allowed"
          onClick={() =>
            setPageAction((prev) => (page < totalPages ? prev + 1 : prev))
          }
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
