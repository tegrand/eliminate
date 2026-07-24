import { forwardRef } from "react";
import clsx from "clsx";

const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export default Card;
