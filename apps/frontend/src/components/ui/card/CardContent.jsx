import { forwardRef } from "react";
import clsx from "clsx";

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export default CardContent;
