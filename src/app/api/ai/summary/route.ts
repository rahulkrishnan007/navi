import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const requestSchema = z.object({
  title: z.string().trim().max(120).optional(),
  skills: z.array(z.string()).max(30).optional(),
  rawNotes: z
    .string()
    .trim()
    .min(1, "Add a few notes about your experience first")
    .max(2000),
  tone: z.enum(["confident", "concise", "friendly"]).default("confident"),
});

const TONE_GUIDANCE: Record<string, string> = {
  confident: "confident and achievement-focused, using strong action verbs",
  concise: "concise and information-dense, trimming every unnecessary word",
  friendly: "warm and approachable while staying professional",
};

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // AI calls are the most expensive endpoint in the app — rate limit per user.
  const rl = checkRateLimit(`ai-summary:${session.sub}`, { limit: 20, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "You've hit the AI generation limit for this hour. Try again later." },
      { status: 429 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "AI features aren't configured yet. Add ANTHROPIC_API_KEY to your .env file to enable this.",
      },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { title, skills, rawNotes, tone } = parsed.data;

  const userPrompt = [
    `Role/title: ${title || "Not specified"}`,
    `Key skills: ${skills && skills.length ? skills.join(", ") : "Not specified"}`,
    `Notes from the candidate about their background, in their own words:`,
    rawNotes,
  ].join("\n");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system:
          `You write short, first-person professional summaries for resumes and profile pages. ` +
          `Write in a tone that is ${TONE_GUIDANCE[tone]}. ` +
          `Output ONLY the summary text: 3-4 sentences, no headings, no markdown, no quotation marks, ` +
          `no fabricated facts beyond what the candidate provided.`,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("Anthropic API error:", response.status, errText);
      return NextResponse.json(
        { error: "The AI service returned an error. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const summary = (data.content ?? [])
      .filter((block: { type: string }) => block.type === "text")
      .map((block: { text: string }) => block.text)
      .join("\n")
      .trim();

    if (!summary) {
      return NextResponse.json({ error: "The AI didn't return any text. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("AI summary generation failed:", err);
    return NextResponse.json({ error: "Something went wrong generating your summary." }, { status: 500 });
  }
}
