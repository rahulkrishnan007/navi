import Link from "next/link";
import { Target, ListChecks, Sparkles, ArrowRight } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default async function DashboardOverviewPage() {
  const session = await getSessionUser();
  const profile = session
    ? await db.profile.findUnique({ where: { userId: session.sub } })
    : null;

  const careerScore = profile?.careerScore ?? 0;
  const skills: string[] = profile ? JSON.parse(profile.skillsJson) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard label="Career score" value={`${careerScore}`} icon={Target} accent="signal" />
        <StatCard label="Skills listed" value={`${skills.length}`} icon={ListChecks} accent="trail" />
        <StatCard
          label="Profile status"
          value={careerScore >= 80 ? "Strong" : careerScore >= 40 ? "Building" : "Just started"}
          icon={Sparkles}
          accent="signal"
        />
      </div>

      <GlassCard>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">
              {careerScore < 100 ? "Finish setting up your profile" : "Your profile is complete"}
            </h2>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
              {careerScore < 100
                ? "A complete profile improves your career score and gives the AI summary generator more to work with."
                : "Great foundation — the resume builder will pull straight from this profile once it ships."}
            </p>
          </div>
          <Link href="/dashboard/profile">
            <Button size="sm">
              Go to profile <ArrowRight size={15} />
            </Button>
          </Link>
        </div>

        {/* Career score progress bar */}
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-signal-400 transition-all duration-700"
            style={{ width: `${careerScore}%` }}
            role="progressbar"
            aria-valuenow={careerScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Career score"
          />
        </div>
      </GlassCard>

      <div className="grid gap-5 sm:grid-cols-2">
        <GlassCard className="opacity-70">
          <h3 className="font-display text-base font-semibold">Resume builder</h3>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
            Coming next: generate an ATS-friendly resume straight from this profile.
          </p>
          <span className="mt-3 inline-block rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold text-ink-500 dark:bg-white/10 dark:text-ink-400">
            Planned
          </span>
        </GlassCard>
        <GlassCard className="opacity-70">
          <h3 className="font-display text-base font-semibold">Job tracker</h3>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
            Coming next: save jobs, track applications, and get an AI match score.
          </p>
          <span className="mt-3 inline-block rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold text-ink-500 dark:bg-white/10 dark:text-ink-400">
            Planned
          </span>
        </GlassCard>
      </div>
    </div>
  );
}
