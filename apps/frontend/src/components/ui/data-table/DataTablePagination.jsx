import clsx from "clsx";

export default function DataTablePagination({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between border-t border-gray-200 py-3",
        className
      )}
      {...props}
    >
      {/* Placeholder for pagination controls */}
      {children}
    </div>
  );
}
