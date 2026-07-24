import clsx from "clsx";

export default function DataTableToolbar({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between",
        className
      )}
      {...props}
    >
      {/* Placeholder for Search, Filters, Bulk Actions */}
      {children}
    </div>
  );
}
