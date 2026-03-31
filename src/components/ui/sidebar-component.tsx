import * as React from "react";
import { cn } from "@/lib/utils";

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col", className)} {...props} />
  )
);
Sidebar.displayName = "Sidebar";
