import { forwardRef, useId } from "react";
import clsx from "clsx";

/**
 * A highly reusable, production-ready Input component.
 * Automatically handles labels, helper text, error states, and accessibility.
 */
const Input = forwardRef(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      className,
      disabled = false,
      required = false,
      id: externalId,
      type = "text",
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

        <div className="relative flex items-center">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 flex items-center text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperTextId : undefined
            }
            className={clsx(
              "block w-full rounded-lg sm:text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
              // Dynamic padding logic based on presence of icons
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              "py-1.5",
              // Error vs Normal state styling
              error
                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 border"
                : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 border"
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-gray-400">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";

export default Input;
