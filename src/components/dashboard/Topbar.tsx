"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/profile": "Profile",
};

export function Topbar({ userName }: { userName: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Dashboard";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-ink-100 bg-white/50 px-6 py-4 dark:border-white/10 dark:bg-white/[0.02]">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-100">
          {title}
        </h1>
        <p className="text-sm text-ink-400">Welcome back, {userName}</p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut size={15} /> Log out
        </Button>
      </div>
    </header>
  );
}
