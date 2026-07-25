import { Search } from "lucide-react";

export default function WorkerToolbar({ totalWorkers }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Workers</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalWorkers !== undefined ? `Total ${totalWorkers} workers found` : "Loading workers..."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Search workers..."
            aria-label="Search workers"
          />
        </div>
      </div>
    </div>
  );
}
