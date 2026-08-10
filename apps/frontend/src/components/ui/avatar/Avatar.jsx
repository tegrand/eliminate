import { forwardRef, useState } from "react";
import clsx from "clsx";
import { User } from "lucide-react";

/**
 * A highly reusable Avatar component.
 * Automatically handles image fallbacks to initials or a default user icon.
 */
const Avatar = forwardRef(
  (
    {
      src,
      alt,
      name,
      size = "md",
      shape = "circle",
      fallback,
      className,
      ...props
    },
    ref
  ) => {
    const [hasError, setHasError] = useState(false);

    // Size mappings
    const sizeClasses = {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-sm",
      md: "h-10 w-10 text-base",
      lg: "h-12 w-12 text-lg",
      xl: "h-16 w-16 text-xl",
    };

    // Shape mappings
    const shapeClasses = {
      circle: "rounded-full",
      rounded: "rounded-lg",
      square: "rounded-none",
    };

    const containerClasses = clsx(
      "relative inline-flex items-center justify-center overflow-hidden bg-gray-200 text-gray-700 font-medium shrink-0",
      sizeClasses[size],
      shapeClasses[shape],
      className
    );

    // Extract initials from name if available
    const getInitials = (str) => {
      if (!str) return "";
      const parts = str.split(" ").filter(Boolean);
      if (parts.length === 0) return "";
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const initials = name ? getInitials(name) : "";

    // Determine what to show
    const shouldShowImage = src && !hasError;
    const shouldShowInitials = !shouldShowImage && initials;
    const shouldShowFallbackNode = !shouldShowImage && !shouldShowInitials && fallback;
    const shouldShowDefaultIcon = !shouldShowImage && !shouldShowInitials && !fallback;

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {shouldShowImage && (
          <img
            src={src?.startsWith('http') || src?.startsWith('data:') ? src : `http://localhost:5000${src?.startsWith('/') ? '' : '/'}${src}`}
            alt={alt || name || "Avatar"}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        )}

        {shouldShowInitials && (
          <span className="select-none" aria-hidden="true">{initials}</span>
        )}

        {shouldShowFallbackNode && fallback}

        {shouldShowDefaultIcon && (
          <User className="h-1/2 w-1/2 opacity-60" aria-hidden="true" />
        )}
        
        {/* Screen reader only text for context if image fails and no explicit alt provided */}
        {!shouldShowImage && (alt || name) && (
          <span className="sr-only">{alt || name}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
