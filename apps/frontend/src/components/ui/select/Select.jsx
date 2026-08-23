import { forwardRef, useId } from "react";
import clsx from "clsx";

/**
 * A highly reusable, production-ready Select component using the native <select> element.
 * Automatically handles labels, helper text, error states, and accessibility.
 */
const Select = forwardRef(
  (
    {
      label,
      options = [],
      placeholder,
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
      <div className={clsx("w-full flex flex-col gap-1.5", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Native Select Element */}
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperTextId : undefined
            }
            className={clsx(
              "block w-full rounded-lg sm:text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed px-3 py-1.5 appearance-none bg-white",
              // Error vs Normal state styling
              error
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 border"
                : "border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-orange-500 border"
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom Dropdown Arrow (Replaces the native one hidden via appearance-none) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Helper Text (Only show if no error exists) */}
        {!error && helperText && (
          <p id={helperTextId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
