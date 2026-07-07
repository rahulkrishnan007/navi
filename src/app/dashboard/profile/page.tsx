import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default async function ProfilePage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const profile = await db.profile.findUnique({ where: { userId: session.sub } });
  if (!profile) redirect("/login");

  return (
    <ProfileForm
      initial={{
        title: profile.title,
        location: profile.location,
        bio: profile.bio,
        skills: JSON.parse(profile.skillsJson),
        websiteUrl: profile.websiteUrl,
        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl,
        careerScore: profile.careerScore,
      }}
    />
  );
}
