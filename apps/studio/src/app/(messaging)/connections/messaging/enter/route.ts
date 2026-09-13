import { elevateForChannelConnect } from "@subiza/auth-tenant";
import { redirect } from "next/navigation";
import { requireStudioContext, setStudioSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await requireStudioContext();
  const next = new URL(request.url).searchParams.get("next") ?? "/connections";
  const safe = next.startsWith("/connections") ? next : "/connections";
  try {
    const stepped = elevateForChannelConnect(ctx);
    if (stepped.sessionId) await setStudioSession(stepped.sessionId);
  } catch {
    redirect(safe as never);
  }
  redirect(safe as never);
}
