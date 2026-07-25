import AttendanceRow from "./AttendanceRow";

export default function AttendanceWorkerTable({ workers, onUpdateWorker }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm lg:col-span-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 min-w-[200px]">Worker</th>
              <th className="px-4 py-3 min-w-[150px]">Status</th>
              <th className="px-4 py-3 min-w-[140px]">Check-In</th>
              <th className="px-4 py-3 min-w-[140px]">Check-Out</th>
              <th className="px-4 py-3 min-w-[200px]">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {workers.map((worker) => (
              <AttendanceRow 
                key={worker.id} 
                worker={worker} 
                onUpdate={onUpdateWorker} 
              />
            ))}
            {workers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No workers assigned to this requirement.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
