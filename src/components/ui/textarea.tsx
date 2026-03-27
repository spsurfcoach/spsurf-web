import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return <textarea ref={ref} className={cn("ds-input min-h-24 py-3", className)} {...props} />;
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
