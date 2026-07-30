import { forwardRef, useId } from "react";
import clsx from "clsx";

/**
 * A highly reusable, production-ready Textarea component.
 * Automatically handles labels, helper text, error states, and accessibility.
 */
const Textarea = forwardRef(
  (
    {
      label,
      helperText,
      error,
      className,
      disabled = false,
      required = false,
      fullWidth = true,
      rows = 4,
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
      <div className={clsx("flex flex-col gap-1.5", fullWidth ? "w-full" : "", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
          </label>
        )}

        {/* Textarea Element */}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperTextId : undefined
          }
          className={clsx(
            "block rounded-lg sm:text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed resize-y px-3 py-1.5",
            fullWidth ? "w-full" : "",
            // Error vs Normal state styling
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 border"
              : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 border"
          )}
          {...props}
        />

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

Textarea.displayName = "Textarea";

export default Textarea;
