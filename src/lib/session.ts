import { cookies } from "next/headers";
import { verifyAccessToken, type AccessTokenPayload } from "@/lib/jwt";

export const ACCESS_COOKIE = "cn_access_token";
export const REFRESH_COOKIE = "cn_refresh_token";

/**
 * Reads and verifies the access token from the request cookies.
 * Returns null if missing/expired/invalid — callers decide how to react
 * (redirect to /login, return 401, etc.) rather than this helper throwing.
 */
export async function getSessionUser(): Promise<AccessTokenPayload | null> {
  const token = cookies().get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}
