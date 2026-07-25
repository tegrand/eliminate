import { Checkbox } from "../../../components/ui/checkbox";
import { Badge } from "../../../components/ui/badge";

export default function AvailableWorkersTable({ workers, selectedWorkerIds, onToggleSelect, onSelectAll }) {
  const isAllSelected = workers.length > 0 && selectedWorkerIds.length === workers.length;
  const isSomeSelected = selectedWorkerIds.length > 0 && selectedWorkerIds.length < workers.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-12">
                <input 
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                  checked={isAllSelected}
                  ref={input => { if (input) input.indeterminate = isSomeSelected }}
                  onChange={onSelectAll}
                />
              </th>
              <th className="px-4 py-3">Worker Info</th>
              <th className="px-4 py-3">Primary Skill</th>
              <th className="px-4 py-3">Agency</th>
              <th className="px-4 py-3">Availability</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {workers.map((worker) => {
              const isSelected = selectedWorkerIds.includes(worker.id);
              return (
                <tr 
                  key={worker.id} 
                  className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}
                  onClick={() => onToggleSelect(worker.id)}
                >
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                      checked={isSelected}
                      onChange={() => onToggleSelect(worker.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{worker.name}</div>
                    <div className="text-xs text-gray-500">{worker.id}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{worker.skill}</td>
                  <td className="px-4 py-3 text-gray-600">{worker.agency}</td>
                  <td className="px-4 py-3 text-gray-600">{worker.availabilityDate}</td>
                  <td className="px-4 py-3">
                    <Badge variant={worker.status === "AVAILABLE" ? "success" : "warning"}>
                      {worker.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
            {workers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No workers found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
