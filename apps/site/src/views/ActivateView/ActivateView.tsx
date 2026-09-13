import { SESSION_COOKIE, issueHandoff, resolveTenantContext } from "@subiza/auth-tenant";
import type { SiteLocale } from "@subiza/i18n";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const STUDIO = process.env["NEXT_PUBLIC_STUDIO_ORIGIN"] ?? "http://localhost:3001";

export async function ActivateView({ lang }: { lang: SiteLocale }): Promise<never> {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!session) redirect(`/${lang}/start` as never);
  const ctx = resolveTenantContext(session);
  if (!ctx) redirect(`/${lang}/start` as never);
  const token = issueHandoff(session, ctx.tenantId);
  redirect(`${STUDIO}/handoff?token=${encodeURIComponent(token)}` as never);
}
