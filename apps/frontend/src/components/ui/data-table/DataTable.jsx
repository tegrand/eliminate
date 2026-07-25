import { forwardRef } from "react";
import clsx from "clsx";
import DataTableLoading from "./DataTableLoading";
import DataTableEmpty from "./DataTableEmpty";

const DataTable = forwardRef(
  (
    {
      columns = [],
      data = [],
      loading = false,
      rowKey = "id",
      striped = false,
      hover = true,
      bordered = false,
      compact = false,
      className,
      ...props
    },
    ref
  ) => {
    // Styling base
    const tableClasses = clsx(
      "w-full text-left text-sm text-gray-700",
      bordered && "border border-gray-200"
    );

    const theadClasses = clsx(
      "bg-indigo-50/40 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-gray-200 sticky top-0 z-10"
    );

    const thClasses = clsx(
      "font-semibold",
      compact ? "px-3 py-2" : "px-4 py-4",
      bordered && "border-r border-gray-200 last:border-r-0"
    );

    const trClasses = (index) =>
      clsx(
        "border-b border-gray-100 last:border-b-0 transition-colors h-[65px]",
        hover && "hover:bg-gray-50",
        striped && index % 2 !== 0 && "bg-gray-50/50"
      );

    const tdClasses = clsx(
      compact ? "px-3 py-2" : "px-4 py-4",
      bordered && "border-r border-gray-200 last:border-r-0"
    );

    return (
      <div className={clsx("w-full overflow-x-auto", className)}>
        <table ref={ref} className={tableClasses} {...props}>
          <thead className={theadClasses}>
            <tr>
              {columns.map((col, index) => (
                <th key={col.key || index} scope="col" className={thClasses}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <DataTableLoading columnsCount={columns.length} compact={compact} />
            ) : data.length === 0 ? (
              <DataTableEmpty columnsCount={columns.length} />
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row[rowKey] || rowIndex} className={trClasses(rowIndex)}>
                  {columns.map((col, colIndex) => (
                    <td key={col.key || colIndex} className={tdClasses}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

DataTable.displayName = "DataTable";

export default DataTable;
