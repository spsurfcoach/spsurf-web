import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-full border border-black/15 px-3 py-1 text-xs font-medium", className)} {...props} />;
}

export { Badge };
