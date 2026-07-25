import { Input } from "../../../components/ui/input";

export default function WorkerToolbar({ totalWorkers }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Workers</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalWorkers !== undefined ? `Total ${totalWorkers} workers found` : "Loading workers..."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-64">
          <Input 
            placeholder="Search workers..." 
            aria-label="Search workers"
          />
        </div>
      </div>
    </div>
  );
}
