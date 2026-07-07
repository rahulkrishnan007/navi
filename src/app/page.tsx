import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { TrajectoryMark } from "@/components/ui/TrajectoryMark";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink-900 dark:bg-ink dark:text-ink-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <TrajectoryMark className="h-8 w-8 text-signal-400" />
          <span className="font-display text-lg font-semibold">Career Navigator</span>
        </div>
        <nav className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-24 pt-12 sm:pt-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-trajectory-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          aria-hidden="true"
        />

        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-400/40 bg-signal-50 px-3 py-1 text-xs font-medium text-signal-700 dark:bg-signal-400/10 dark:text-signal-300">
            <Sparkles size={12} /> AI-assisted, not AI-automated
          </span>

          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            Plot a bearing for your career, not just another resume.
          </h1>

          <p className="max-w-xl text-lg text-ink-600 dark:text-ink-300">
            Career Navigator gives you one place to build your profile, get an honest
            completeness score, and draft a professional summary with AI — the foundation
            for the resume builder, job tracker, and interview prep coming next.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/register">
              <Button>
                Create your profile <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">I already have an account</Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-3">
          <GlassCard className="animate-rise">
            <h3 className="font-display text-lg font-semibold">Secure by default</h3>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
              Hashed passwords, short-lived signed sessions, rate-limited auth endpoints, and
              CSRF-safe cookies — the same primitives a production app needs.
            </p>
          </GlassCard>
          <GlassCard className="animate-rise [animation-delay:80ms]">
            <h3 className="font-display text-lg font-semibold">A real profile, not a form dump</h3>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
              Title, location, skills, and links roll up into a transparent career score you can
              watch move as you fill things in.
            </p>
          </GlassCard>
          <GlassCard className="animate-rise [animation-delay:160ms]">
            <h3 className="font-display text-lg font-semibold">AI that drafts, you decide</h3>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
              Turn rough notes about your background into a polished professional summary in
              your chosen tone — edit or discard freely.
            </p>
          </GlassCard>
        </div>
      </section>

      <footer className="border-t border-ink-100 px-6 py-8 text-center text-xs text-ink-400 dark:border-white/10">
        AI Career Navigator — MVP build. More modules (resume builder, job tracker, interview
        prep) ship incrementally on top of this foundation.
      </footer>
    </main>
  );
}
