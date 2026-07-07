import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "signal",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "signal" | "trail";
}) {
  return (
    <GlassCard className="flex items-center gap-4">
      <div
        className={
          accent === "signal"
            ? "flex h-11 w-11 items-center justify-center rounded-xl bg-signal-400/15 text-signal-600 dark:text-signal-300"
            : "flex h-11 w-11 items-center justify-center rounded-xl bg-trail-400/15 text-trail-600 dark:text-trail-300"
        }
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="font-mono text-2xl font-semibold text-ink-900 dark:text-ink-100">{value}</p>
        <p className="text-xs text-ink-400">{label}</p>
      </div>
    </GlassCard>
  );
}
