import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session";

export async function POST() {
  const refreshToken = cookies().get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    // Best-effort revoke; ignore if it's already gone.
    await db.session.deleteMany({ where: { refreshToken } }).catch(() => {});
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ACCESS_COOKIE);
  res.cookies.delete(REFRESH_COOKIE);
  return res;
}
