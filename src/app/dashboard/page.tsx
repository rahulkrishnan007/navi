import Link from "next/link";
import {
  Target,
  ListChecks,
  Sparkles,
  ArrowRight,
  FileText,
  Briefcase,
} from "lucide-react";
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

  const profileStatus =
    careerScore >= 80 ? "Strong" : careerScore >= 40 ? "Building" : "Just started";

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-[fadeIn_.45s_ease-out]">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="transition duration-300 hover:-translate-y-1">
            <StatCard label="Career score" value={`${careerScore}`} icon={Target} accent="signal" />
          </div>

          <div className="transition duration-300 hover:-translate-y-1">
            <StatCard label="Skills listed" value={`${skills.length}`} icon={ListChecks} accent="trail" />
          </div>

          <div className="transition duration-300 hover:-translate-y-1">
            <StatCard
              label="Profile status"
              value={profileStatus}
              icon={Sparkles}
              accent="signal"
            />
          </div>
        </div>
      </div>

      <GlassCard className="relative overflow-hidden border-white/40 shadow-xl shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-signal-500/10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal-300 to-transparent" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-signal-400/10 px-3 py-1 text-xs font-semibold text-signal-700 dark:text-signal-300">
              <Sparkles size={13} />
              Profile momentum
            </div>

            <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-100">
              {careerScore < 100 ? "Finish setting up your profile" : "Your profile is complete"}
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-500 dark:text-ink-300">
              {careerScore < 100
                ? "A complete profile improves your career score and gives the AI summary generator more to work with."
                : "Great foundation. The resume builder will pull straight from this profile once it ships."}
            </p>
          </div>

          <Link href="/dashboard/profile" className="group">
            <Button size="sm">
              Go to profile
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Button>
          </Link>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink-500 dark:text-ink-300">
            <span>Career score</span>
            <span>{careerScore}%</span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-ink-100 shadow-inner dark:bg-white/10">
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-signal-300 via-signal-400 to-trail-400 transition-all duration-1000 ease-out"
              style={{ width: `${careerScore}%` }}
              role="progressbar"
              aria-valuenow={careerScore}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Career score"
            >
              <div className="absolute inset-0 animate-pulse bg-white/25" />
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-5 sm:grid-cols-2">
        <GlassCard className="group relative overflow-hidden opacity-80 transition duration-300 hover:-translate-y-1 hover:opacity-100 hover:shadow-xl hover:shadow-black/5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 text-ink-700 transition duration-300 group-hover:scale-105 dark:bg-white/10 dark:text-ink-100">
            <FileText size={18} />
          </div>

          <h3 className="font-display text-base font-semibold">Resume builder</h3>

          <p className="mt-1 text-sm leading-6 text-ink-500 dark:text-ink-300">
            Coming next: generate an ATS-friendly resume straight from this profile.
          </p>

          <span className="mt-4 inline-flex items-center rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold text-ink-500 dark:bg-white/10 dark:text-ink-400">
            Planned
          </span>
        </GlassCard>

        <GlassCard className="group relative overflow-hidden opacity-80 transition duration-300 hover:-translate-y-1 hover:opacity-100 hover:shadow-xl hover:shadow-black/5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 text-ink-700 transition duration-300 group-hover:scale-105 dark:bg-white/10 dark:text-ink-100">
            <Briefcase size={18} />
          </div>

          <h3 className="font-display text-base font-semibold">Job tracker</h3>

          <p className="mt-1 text-sm leading-6 text-ink-500 dark:text-ink-300">
            Coming next: save jobs, track applications, and get an AI match score.
          </p>

          <span className="mt-4 inline-flex items-center rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold text-ink-500 dark:bg-white/10 dark:text-ink-400">
            Planned
          </span>
        </GlassCard>
      </div>
    </div>
  );
}