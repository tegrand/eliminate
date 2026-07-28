import { Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

export default function WorkerToolbar() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Workers</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage and monitor your workforce
        </p>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            placeholder="Search workers..."
            aria-label="Search workers"
          />
        </div>
        <button className="flex-shrink-0 bg-white border border-gray-200 text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm font-medium" onClick={() => toast.success("Export started")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export
        </button>
        <button className="flex-shrink-0 bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
