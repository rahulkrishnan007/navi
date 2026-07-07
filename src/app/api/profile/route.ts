import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { profileUpdateSchema } from "@/lib/validation";

/**
 * Career score is a simple, transparent completeness metric for the MVP:
 * each meaningfully-filled field is worth a fixed number of points, capped
 * at 100. This is deliberately not an AI/ML score yet — it's an honest
 * "how complete is your profile" signal that the AI Career Analysis module
 * can later replace or augment with a real model.
 */
function computeCareerScore(profile: {
  title: string | null;
  location: string | null;
  bio: string | null;
  skillsJson: string;
  websiteUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
}): number {
  let score = 0;
  if (profile.title) score += 20;
  if (profile.location) score += 10;
  if (profile.bio && profile.bio.length > 40) score += 25;
  const skills: string[] = JSON.parse(profile.skillsJson || "[]");
  score += Math.min(skills.length, 5) * 6; // up to 30 pts for 5+ skills
  if (profile.githubUrl || profile.linkedinUrl || profile.websiteUrl) score += 15;
  return Math.min(score, 100);
}

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const profile = await db.profile.findUnique({ where: { userId: session.sub } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  return NextResponse.json({ ...profile, skills: JSON.parse(profile.skillsJson) });
}

export async function PATCH(req: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { skills, ...rest } = parsed.data;

  const existing = await db.profile.findUnique({ where: { userId: session.sub } });
  const merged = {
    title: rest.title ?? existing?.title ?? null,
    location: rest.location ?? existing?.location ?? null,
    bio: rest.bio ?? existing?.bio ?? null,
    websiteUrl: rest.websiteUrl ?? existing?.websiteUrl ?? null,
    githubUrl: rest.githubUrl ?? existing?.githubUrl ?? null,
    linkedinUrl: rest.linkedinUrl ?? existing?.linkedinUrl ?? null,
    skillsJson: JSON.stringify(skills ?? (existing ? JSON.parse(existing.skillsJson) : [])),
  };

  const careerScore = computeCareerScore(merged);

  const profile = await db.profile.upsert({
    where: { userId: session.sub },
    update: { ...merged, careerScore },
    create: { userId: session.sub, ...merged, careerScore },
  });

  return NextResponse.json({ ...profile, skills: JSON.parse(profile.skillsJson) });
}
