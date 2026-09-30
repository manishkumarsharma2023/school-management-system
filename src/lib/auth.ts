import { auth } from "@clerk/nextjs/server";

export type AppRole = "admin" | "coordinator" | "teacher" | "student" | "parent";

export function getCurrentAuth() {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: AppRole })?.role;
  return { userId, role };
}

export function requireRole(allowed: AppRole[]) {
  const { userId, role } = getCurrentAuth();
  if (!userId || !role || !allowed.includes(role)) {
    throw new Error("Unauthorized");
  }
  return { userId, role };
}
