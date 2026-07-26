import { forwardRef, useId } from "react";
import clsx from "clsx";

/**
 * A highly reusable, production-ready Checkbox component.
 * Automatically handles labels, helper text, error states, and accessibility.
 */
const Checkbox = forwardRef(
  (
    {
      label,
      helperText,
      error,
      className,
      disabled = false,
      required = false,
      id: externalId,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID for accessibility mapping if one isn't provided natively
    const generatedId = useId();
    const id = externalId || generatedId;
    
    // IDs for aria-describedby binding
    const helperTextId = `${id}-helper-text`;
    const errorId = `${id}-error`;

    return (
      <div className={clsx("relative flex items-start", className)}>
        <div className="flex h-6 items-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperTextId : undefined
            }
            className={clsx(
              "h-4 w-4 rounded border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              error ? "border-red-500 ring-red-500 focus:ring-red-500" : "",
              disabled ? "cursor-not-allowed opacity-50 bg-gray-100" : "cursor-pointer"
            )}
            {...props}
          />
        </div>
        
        {/* Text Content Area */}
        {(label || helperText || error) && (
          <div className="ml-3 text-sm leading-6">
            {/* Label */}
            {label && (
              <label 
                htmlFor={id} 
                className={clsx(
                  "font-medium", 
                  disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-900 cursor-pointer"
                )}
              >
                {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
              </label>
            )}
            
            {/* Feedback Message */}
            {error ? (
              <p id={errorId} className="text-red-600" role="alert">
                {error}
              </p>
            ) : helperText ? (
              <p id={helperTextId} className="text-gray-500">
                {helperText}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
