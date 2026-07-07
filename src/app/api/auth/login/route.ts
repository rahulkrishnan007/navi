import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { verifyPassword } from "@/lib/password";
import { signAccessToken, generateOpaqueToken, REFRESH_TOKEN_TTL_SECONDS } from "@/lib/jwt";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  // Rate limit by IP to slow down credential-stuffing / brute force attempts.
  const rl = checkRateLimit(`login:${ip}`, { limit: 15, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in a few minutes." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });

  // Deliberately identical error for "no such user" and "wrong password" so
  // the response can't be used to enumerate which emails have accounts.
  const invalidCredentialsResponse = NextResponse.json(
    { error: "Invalid email or password." },
    { status: 401 }
  );

  if (!user) return invalidCredentialsResponse;

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) return invalidCredentialsResponse;

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

  return res;
}
