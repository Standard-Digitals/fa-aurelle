import { cn } from "@/lib/utils";
import type { WithChildren, WithClassName } from "@/types";

type ContainerProps = WithChildren & WithClassName;

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1316px] px-6", className)}>
      {children}
    </div>
  );
}
