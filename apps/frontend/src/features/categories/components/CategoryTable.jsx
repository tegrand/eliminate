import { Edit, Trash2 } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";

export default function CategoryTable({ data, loading, onEdit, onDelete }) {
  const columns = [
    { key: "name", title: "Category Name", render: (row) => row.name },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(row)} className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(row.id)} className="p-1 text-gray-400 hover:text-red-600 focus:outline-none">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <DataTable columns={columns} data={data || []} loading={loading} rowKey="id" hover />
    </div>
  );
}
