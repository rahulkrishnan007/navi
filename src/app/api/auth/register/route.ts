import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/password";
import { signAccessToken, generateOpaqueToken, REFRESH_TOKEN_TTL_SECONDS } from "@/lib/jwt";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`register:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    // Same message as "wrong password" elsewhere would leak account
    // existence either way at register time, so a direct message here is fine
    // — but we still don't reveal *which* field of an existing account differs.
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      profile: { create: {} }, // empty profile row, filled in later
    },
  });

  const accessToken = await signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = generateOpaqueToken();

  await db.session.create({
    data: {
      userId: user.id,
      refreshToken,
      userAgent: req.headers.get("user-agent") ?? undefined,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
    },
  });

  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  setSessionCookies(res, accessToken, refreshToken);
  return res;
}

function setSessionCookies(res: NextResponse, accessToken: string, refreshToken: string) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
  res.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });
}
