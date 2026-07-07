"use client";

import { useState } from "react";
import { Sparkles, X, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ProfileData {
  title: string | null;
  location: string | null;
  bio: string | null;
  skills: string[];
  websiteUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  careerScore: number;
}

type Tone = "confident" | "concise" | "friendly";

export function ProfileForm({ initial }: { initial: ProfileData }) {
  const [form, setForm] = useState({
    title: initial.title ?? "",
    location: initial.location ?? "",
    bio: initial.bio ?? "",
    websiteUrl: initial.websiteUrl ?? "",
    githubUrl: initial.githubUrl ?? "",
    linkedinUrl: initial.linkedinUrl ?? "",
  });
  const [skills, setSkills] = useState<string[]>(initial.skills);
  const [skillDraft, setSkillDraft] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [aiNotes, setAiNotes] = useState("");
  const [tone, setTone] = useState<Tone>("confident");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  function addSkill() {
    const value = skillDraft.trim();
    if (!value || skills.includes(value) || skills.length >= 30) return;
    setSkills((s) => [...s, value]);
    setSkillDraft("");
  }

  function removeSkill(skill: string) {
    setSkills((s) => s.filter((x) => x !== skill));
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, skills }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error ?? "Couldn't save your profile.");
        return;
      }
      setSaveMessage(`Saved — career score is now ${data.careerScore}.`);
    } catch {
      setSaveError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerateSummary() {
    setAiLoading(true);
    setAiError(null);
    setAiSummary(null);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: form.title, skills, rawNotes: aiNotes, tone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error ?? "Couldn't generate a summary.");
        return;
      }
      setAiSummary(data.summary);
    } catch {
      setAiError("Couldn't reach the AI service. Check your connection and try again.");
    } finally {
      setAiLoading(false);
    }
  }

  function useSummaryAsBio() {
    if (!aiSummary) return;
    setForm((f) => ({ ...f, bio: aiSummary }));
  }

  return (
    <div className="flex flex-col gap-6">
      <GlassCard>
        <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">
          Basic info
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Title / role"
            placeholder="e.g. Frontend Engineer"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Input
            label="Location"
            placeholder="e.g. Kochi, India"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          />
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200" htmlFor="bio">
            Professional summary
          </label>
          <textarea
            id="bio"
            rows={4}
            maxLength={1000}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="A few sentences about your experience and what you're looking for — or generate one with AI below."
            className="rounded-xl border border-ink-200 bg-white/80 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-signal-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-100"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Skills</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 rounded-full bg-trail-400/15 px-3 py-1 text-xs font-medium text-trail-700 dark:text-trail-300"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                  className="rounded-full hover:bg-trail-400/25"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={skillDraft}
              onChange={(e) => setSkillDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add a skill and press Enter"
              className="flex-1 rounded-xl border border-ink-200 bg-white/80 px-3.5 py-2 text-sm text-ink-900 outline-none focus:border-signal-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-100"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addSkill}>
              <Plus size={14} /> Add
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input
            label="Website"
            placeholder="https://…"
            value={form.websiteUrl}
            onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
          />
          <Input
            label="GitHub"
            placeholder="https://github.com/…"
            value={form.githubUrl}
            onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
          />
          <Input
            label="LinkedIn"
            placeholder="https://linkedin.com/in/…"
            value={form.linkedinUrl}
            onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
          />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={handleSave} isLoading={saving}>
            Save changes
          </Button>
          {saveMessage && <p className="text-sm text-trail-600 dark:text-trail-300">{saveMessage}</p>}
          {saveError && (
            <p role="alert" className="text-sm text-danger">
              {saveError}
            </p>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-signal-500" />
          <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">
            AI summary generator
          </h2>
        </div>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
          Jot down rough notes about your background — Claude turns them into a polished summary
          you can use as-is or edit.
        </p>

        <textarea
          rows={4}
          maxLength={2000}
          value={aiNotes}
          onChange={(e) => setAiNotes(e.target.value)}
          placeholder="e.g. 5 years building React apps, led a team of 3, shipped a payments redesign that cut checkout time by 30%…"
          className="mt-4 w-full rounded-xl border border-ink-200 bg-white/80 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-signal-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-100"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="text-sm text-ink-500 dark:text-ink-300" htmlFor="tone">
            Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className="rounded-xl border border-ink-200 bg-white/80 px-3 py-2 text-sm text-ink-900 outline-none focus:border-signal-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-100"
          >
            <option value="confident">Confident</option>
            <option value="concise">Concise</option>
            <option value="friendly">Friendly</option>
          </select>
          <Button
            type="button"
            size="sm"
            onClick={handleGenerateSummary}
            isLoading={aiLoading}
            disabled={!aiNotes.trim()}
          >
            <Sparkles size={14} /> Generate summary
          </Button>
        </div>

        {aiError && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {aiError}
          </p>
        )}

        {aiSummary && (
          <div className="mt-4 rounded-xl border border-signal-400/30 bg-signal-50 p-4 dark:bg-signal-400/10">
            <p className="text-sm text-ink-800 dark:text-ink-100">{aiSummary}</p>
            <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={useSummaryAsBio}>
              Use as my summary
            </Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
