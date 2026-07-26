import { Inbox } from "lucide-react";

export default function DataTableEmpty({ columnsCount }) {
  return (
    <tr>
      <td colSpan={columnsCount} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Inbox className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-gray-900">No data available</p>
          <p className="text-sm text-gray-500">
            There are currently no records to display in this table.
          </p>
        </div>
      </td>
    </tr>
  );
}
