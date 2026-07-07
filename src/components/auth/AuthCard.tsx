import Link from "next/link";
import { ReactNode } from "react";
import { TrajectoryMark } from "@/components/ui/TrajectoryMark";
import { GlassCard } from "@/components/ui/GlassCard";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6 py-12 dark:bg-ink">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <TrajectoryMark className="h-7 w-7 text-signal-400" />
          <span className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">
            Career Navigator
          </span>
        </Link>
        <GlassCard className="animate-rise">
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-100">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </GlassCard>
        <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-300">{footer}</p>
      </div>
    </main>
  );
}
