import { SESSION_COOKIE, hostCookie, readSession, resolveTenantContext, type TenantContext } from "@subiza/auth-tenant";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function sessionId(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function requireStudioContext(): Promise<TenantContext> {
  const id = await sessionId();
  if (!id) redirect("/sign-in");
  const ctx = resolveTenantContext(id);
  if (!ctx) redirect("/sign-in");
  return ctx;
}

export async function setStudioSession(id: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, id, hostCookie(14 * 24 * 60 * 60));
}

export function hasSessionCookie(value: string | undefined): boolean {
  return Boolean(value && readSession(value));
}
