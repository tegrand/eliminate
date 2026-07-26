import { DataTable } from "../../../components/ui/data-table";

export default function WorkerSalaryTable({ salaries }) {
  const columns = [
    { key: "worker", title: "Worker", render: (row) => <span className="font-medium text-gray-900">{row.worker}</span> },
    { key: "assignment", title: "Assignment", render: (row) => row.assignment },
    { key: "regularHours", title: "Reg Hours", render: (row) => row.regularHours },
    { key: "overtimeHours", title: "OT Hours", render: (row) => row.overtimeHours },
    { key: "grossPay", title: "Gross Pay", render: (row) => row.grossPay },
    { key: "deductions", title: "Deductions", render: (row) => <span className="text-red-600">{row.deductions}</span> },
    { key: "netPay", title: "Net Pay", render: (row) => <span className="font-semibold text-green-700">{row.netPay}</span> },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">Worker Salaries Breakdown</h3>
      </div>
      <DataTable 
        columns={columns} 
        data={salaries || []} 
        rowKey="id" 
      />
    </div>
  );
}
