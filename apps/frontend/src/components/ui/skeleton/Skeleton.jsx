import clsx from "clsx";

/**
 * A highly reusable, production-ready Skeleton component for loading states.
 */
function Skeleton({
  className,
  width,
  height,
  rounded = true,
  circle = false,
  ...props
}) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200",
        rounded && !circle && "rounded-md",
        circle && "rounded-full",
        className
      )}
      style={{
        width,
        height,
      }}
      {...props}
    />
  );
}

// Reusable Presets

function SkeletonText({ className, lines = 1, ...props }) {
  return (
    <div className={clsx("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx(
            "h-4 w-full",
            // Make the last line shorter for a realistic text block look
            i === lines - 1 && lines > 1 ? "w-2/3" : ""
          )}
        />
      ))}
    </div>
  );
}

function SkeletonAvatar({ className, size = "md", ...props }) {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };
  
  return (
    <Skeleton
      circle
      className={clsx(sizeMap[size] || "h-10 w-10", className)}
      {...props}
    />
  );
}

function SkeletonCard({ className, ...props }) {
  return (
    <div className={clsx("rounded-xl border border-gray-200 p-6 space-y-4", className)} {...props}>
      <div className="flex items-center space-x-4">
        <SkeletonAvatar size="md" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

function SkeletonTableRow({ className, columns = 4, ...props }) {
  return (
    <div className={clsx("flex items-center space-x-4 py-3", className)} {...props}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx("h-4", i === 0 ? "w-1/3" : "w-1/4")}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTableRow };
