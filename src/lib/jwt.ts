import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  // Fail loudly in production rather than silently signing tokens with
  // `undefined`, which would make every token forgeable.
  throw new Error("JWT_SECRET is not set. Refusing to start in production.");
}

const SECRET_KEY = new TextEncoder().encode(JWT_SECRET ?? "dev-only-insecure-secret");

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 15; // 15 minutes
export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface AccessTokenPayload {
  sub: string; // user id
  email: string;
  role: string;
}

// jose (not jsonwebtoken) is used deliberately: middleware.ts runs on the
// Edge runtime, which doesn't have Node's `crypto` module that
// jsonwebtoken depends on. jose is built on Web Crypto, so this exact code
// works in both route handlers (Node runtime) and middleware (Edge runtime).
//
// This file must stay free of Node-only dependencies (bcryptjs, etc.) —
// anything it imports gets bundled into the Edge middleware. Password
// hashing lives in ./password.ts instead, imported only by route handlers.

export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(SECRET_KEY);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return { sub: payload.sub, email: payload.email as string, role: (payload.role as string) ?? "CANDIDATE" };
  } catch {
    return null;
  }
}

export function generateOpaqueToken(): string {
  // Used for refresh tokens stored in the Session table. Random, unguessable,
  // and unrelated to the JWT signing secret so a leaked refresh token can't
  // be used to forge access tokens.
  const bytes = new Uint8Array(48);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64url");
}
