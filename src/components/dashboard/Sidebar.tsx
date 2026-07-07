"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserCircle, FileText, Briefcase, Settings } from "lucide-react";
import clsx from "clsx";
import { TrajectoryMark } from "@/components/ui/TrajectoryMark";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/resume", label: "Resume builder", icon: FileText, comingSoon: true },
  { href: "/dashboard/jobs", label: "Job tracker", icon: Briefcase, comingSoon: true },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, comingSoon: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-100 bg-white/50 px-4 py-6 dark:border-white/10 dark:bg-white/[0.02] md:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <TrajectoryMark className="h-7 w-7 text-signal-400" />
        <span className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">
          Career Navigator
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, comingSoon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={comingSoon ? "#" : href}
              aria-current={active ? "page" : undefined}
              aria-disabled={comingSoon}
              className={clsx(
                "flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-signal-400/15 text-signal-700 dark:text-signal-300"
                  : "text-ink-600 hover:bg-ink-100/60 dark:text-ink-300 dark:hover:bg-white/[0.06]",
                comingSoon && "pointer-events-none opacity-50"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={17} />
                {label}
              </span>
              {comingSoon && (
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold text-ink-500 dark:bg-white/10 dark:text-ink-400">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
