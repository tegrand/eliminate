import { SkeletonTableRow } from "../skeleton";

export default function DataTableLoading({ columnsCount, rowsCount = 5, compact }) {
  return (
    <>
      {Array.from({ length: rowsCount }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 last:border-b-0">
          <td colSpan={columnsCount} className={compact ? "px-4 py-2" : "px-6 py-4"}>
            <SkeletonTableRow columns={columnsCount} />
          </td>
        </tr>
      ))}
    </>
  );
}
