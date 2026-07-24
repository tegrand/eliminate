import { forwardRef } from "react";
import clsx from "clsx";

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={clsx("text-sm text-gray-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export default CardDescription;
