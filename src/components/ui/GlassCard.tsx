import { HTMLAttributes } from "react";
import clsx from "clsx";

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("glass-panel p-6", className)} {...props} />;
}
