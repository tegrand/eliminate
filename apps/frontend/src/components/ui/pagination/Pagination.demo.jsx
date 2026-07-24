import { useState } from "react";
import { Pagination } from "./index";

export default function PaginationDemo() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(5);
  const [page3, setPage3] = useState(10);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pagination Component Demo</h1>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Start of List (Few Pages)</h2>
        <Pagination 
          currentPage={page1} 
          totalPages={5} 
          onPageChange={setPage1} 
        />
        <p className="mt-4 text-sm text-gray-500 text-center">Current Page: {page1}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Middle of List (Many Pages)</h2>
        <Pagination 
          currentPage={page2} 
          totalPages={20} 
          onPageChange={setPage2} 
        />
        <p className="mt-4 text-sm text-gray-500 text-center">Current Page: {page2}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">End of List (Many Pages)</h2>
        <Pagination 
          currentPage={page3} 
          totalPages={10} 
          onPageChange={setPage3} 
        />
        <p className="mt-4 text-sm text-gray-500 text-center">Current Page: {page3}</p>
      </section>
    </div>
  );
}
