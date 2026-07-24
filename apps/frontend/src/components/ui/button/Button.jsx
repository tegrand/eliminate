import { forwardRef } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

/**
 * A highly reusable, production-ready Button component.
 * Supports multiple variants, sizes, and states (loading, disabled).
 */
const Button = forwardRef(
  (
    {
      children,
      variant = "primary", // primary | secondary | outline | ghost | danger | success
      size = "md", // sm | md | lg
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Core structure applied to all variants
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    // Size mappings
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    // Visual stylistic variants
    const variantClasses = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent shadow-sm",
      secondary:
        "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-transparent",
      outline:
        "bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 border border-gray-300 shadow-sm",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border border-transparent",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent shadow-sm",
      success:
        "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border border-transparent shadow-sm",
    };

    // State classes (disabled or loading)
    const disabledClasses =
      disabled || loading ? "opacity-60 cursor-not-allowed pointer-events-none" : "";

    // Width utility
    const widthClasses = fullWidth ? "w-full" : "";

    // Compose the final CSS string safely
    const buttonClasses = clsx(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      disabledClasses,
      widthClasses,
      className
    );

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" aria-hidden="true" />}

        {/* Optional Left Icon (Hidden if loading to prevent layout jump and clutter) */}
        {!loading && leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}

        {/* Text Content */}
        <span>{children}</span>

        {/* Optional Right Icon (Hidden if loading) */}
        {!loading && rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
