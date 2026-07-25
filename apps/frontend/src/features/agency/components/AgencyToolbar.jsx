import { Search, Filter } from "lucide-react";

export default function AgencyToolbar() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Agencies</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage and monitor your agencies
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
            placeholder="Search agencies..."
            aria-label="Search agencies"
          />
        </div>
        <button className="flex-shrink-0 bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
