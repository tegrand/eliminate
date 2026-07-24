import { forwardRef, useId } from "react";
import clsx from "clsx";

/**
 * A highly reusable, production-ready Switch component.
 * Uses a native visually hidden checkbox for seamless accessibility and form integration.
 */
const Switch = forwardRef(
  (
    {
      label,
      helperText,
      error,
      className,
      disabled = false,
      required = false,
      checked,
      onChange,
      id: externalId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = externalId || generatedId;
    
    const helperTextId = `${id}-helper-text`;
    const errorId = `${id}-error`;

    return (
      <div className={clsx("relative flex items-start", className)}>
        <div className="flex h-6 items-center">
          <label
            htmlFor={id}
            className={clsx(
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
              checked ? "bg-blue-600" : "bg-gray-200",
              disabled ? "cursor-not-allowed opacity-50" : "",
              error && !checked ? "bg-red-200 ring-2 ring-red-500" : ""
            )}
          >
            <input
              ref={ref}
              type="checkbox"
              id={id}
              role="switch"
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              required={required}
              aria-checked={checked}
              aria-invalid={!!error}
              aria-describedby={
                error ? errorId : helperText ? helperTextId : undefined
              }
              className="sr-only"
              {...props}
            />
            <span
              aria-hidden="true"
              className={clsx(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                checked ? "translate-x-5" : "translate-x-0"
              )}
            />
          </label>
        </div>
        
        {/* Text Content Area */}
        {(label || helperText || error) && (
          <div className="ml-3 text-sm leading-6">
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

Switch.displayName = "Switch";

export default Switch;
