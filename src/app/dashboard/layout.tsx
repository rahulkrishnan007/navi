import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { Topbar } from "@/components/dashboard/Topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-suspenders: middleware already redirects unauthenticated
  // requests away from /dashboard/*, but this layout re-checks server-side
  // so it never renders authenticated-only data without a verified session.
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.sub },
    select: { name: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-paper dark:bg-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userName={user.name} />
        <main className="flex-1 px-6 py-8 pb-24 md:pb-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
