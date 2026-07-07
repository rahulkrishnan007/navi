import bcrypt from "bcryptjs";

// Deliberately separate from jwt.ts: bcryptjs uses Node APIs (process.nextTick,
// setImmediate) that don't exist in the Edge runtime. Keeping it out of any
// module that middleware.ts imports keeps the Edge bundle Node-free.

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
