"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NAV_ITEMS } from "@/components/dashboard/Sidebar";

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-ink-100 bg-white/90 px-2 py-2 backdrop-blur-glass dark:border-white/10 dark:bg-ink-900/90 md:hidden"
      aria-label="Primary"
    >
      {NAV_ITEMS.filter((i) => !i.comingSoon).map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] font-medium",
              active ? "text-signal-600 dark:text-signal-300" : "text-ink-400"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
