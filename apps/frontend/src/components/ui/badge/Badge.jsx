import { forwardRef } from "react";
import clsx from "clsx";

/**
 * A highly reusable, production-ready Badge component.
 */
const Badge = forwardRef(
  (
    {
      children,
      variant = "default",
      size = "md",
      outlined = false,
      rounded = false,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    // Size mappings
    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-sm",
      lg: "px-3 py-1 text-sm",
    };

    // Shape mappings
    const shapeClasses = rounded ? "rounded-full" : "rounded-md";

    // Variant mappings (Solid vs Outlined)
    const variantClasses = {
      default: outlined 
        ? "border border-gray-500 text-gray-700 bg-transparent" 
        : "bg-gray-100 text-gray-800 border border-transparent",
      primary: outlined 
        ? "border border-blue-600 text-blue-700 bg-transparent" 
        : "bg-blue-100 text-blue-800 border border-transparent",
      secondary: outlined 
        ? "border border-gray-300 text-gray-600 bg-transparent" 
        : "bg-gray-50 text-gray-600 border border-transparent",
      success: outlined 
        ? "border border-green-600 text-green-700 bg-transparent" 
        : "bg-green-100 text-green-800 border border-transparent",
      warning: outlined 
        ? "border border-yellow-600 text-yellow-800 bg-transparent" 
        : "bg-yellow-100 text-yellow-800 border border-transparent",
      danger: outlined 
        ? "border border-red-600 text-red-700 bg-transparent" 
        : "bg-red-100 text-red-800 border border-transparent",
      info: outlined 
        ? "border border-sky-500 text-sky-700 bg-transparent" 
        : "bg-sky-100 text-sky-800 border border-transparent",
    };

    const badgeClasses = clsx(
      baseClasses,
      sizeClasses[size],
      shapeClasses,
      variantClasses[variant],
      className
    );

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {icon && <span className="mr-1.5 flex items-center">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
