import { forwardRef } from "react";
import clsx from "clsx";

const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "rounded-2xl border border-gray-100 bg-white text-gray-950 shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export default Card;
