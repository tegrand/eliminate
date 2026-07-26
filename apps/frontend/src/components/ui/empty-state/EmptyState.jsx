import { forwardRef } from "react";
import clsx from "clsx";

/**
 * A highly reusable EmptyState component.
 */
const EmptyState = forwardRef(
  (
    {
      title,
      description,
      icon,
      action,
      illustration,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50",
          className
        )}
        {...props}
      >
        {illustration ? (
          <div className="mb-6">{illustration}</div>
        ) : icon ? (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
            <span className="text-gray-500">{icon}</span>
          </div>
        ) : null}
        
        <h3 className="mt-2 text-lg font-semibold text-gray-900">{title}</h3>
        
        {description && (
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        )}
        
        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export default EmptyState;
