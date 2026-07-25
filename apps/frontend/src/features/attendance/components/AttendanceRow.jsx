import { Select } from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";

export default function AttendanceRow({ worker, onUpdate }) {
  const handleStatusChange = (e) => {
    const status = e.target.value;
    let updates = { status };
    if (status === "ABSENT" || status === "LEAVE") {
      updates = { ...updates, checkIn: "", checkOut: "" };
    }
    onUpdate(worker.id, updates);
  };

  const isEditable = worker.status === "PRESENT" || worker.status === "HALF_DAY";

  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
            {worker.name.charAt(0)}{worker.name.split(' ')[1]?.[0] || ''}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{worker.name}</div>
            <div className="text-xs text-gray-500">{worker.id}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <Select 
          value={worker.status} 
          onChange={handleStatusChange}
          className="w-36 h-9 py-1"
        >
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
          <option value="HALF_DAY">Half Day</option>
          <option value="LEAVE">Leave</option>
        </Select>
      </td>
      <td className="px-4 py-4">
        <Input 
          type="time" 
          value={worker.checkIn} 
          onChange={(e) => onUpdate(worker.id, { checkIn: e.target.value })}
          disabled={!isEditable}
          className="w-32 h-9 py-1 disabled:bg-gray-100 disabled:opacity-50"
        />
      </td>
      <td className="px-4 py-4">
        <Input 
          type="time" 
          value={worker.checkOut} 
          onChange={(e) => onUpdate(worker.id, { checkOut: e.target.value })}
          disabled={!isEditable}
          className="w-32 h-9 py-1 disabled:bg-gray-100 disabled:opacity-50"
        />
      </td>
      <td className="px-4 py-4">
        <Input 
          type="text" 
          placeholder="Optional notes..." 
          value={worker.remarks} 
          onChange={(e) => onUpdate(worker.id, { remarks: e.target.value })}
          className="w-full min-w-[150px] h-9 py-1"
        />
      </td>
    </tr>
  );
}
