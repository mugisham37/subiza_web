import { createHmac, timingSafeEqual } from "node:crypto";
import type { TenantId } from "@subiza/core";
import { env } from "./env";
import { opaqueId } from "./ids";
import { getStore } from "./store";

function secret(): string {
  return env("HANDOFF_SECRET") ?? "dev-only-handoff-secret";
}

export function signHandoff(id: string): string {
  const mac = createHmac("sha256", secret()).update(id).digest("base64url");
  return `${id}.${mac}`;
}

export function issueHandoff(sessionId: string, tenantId: TenantId): string {
  const id = opaqueId(24);
  getStore().handoffs.set(id, {
    id,
    sessionId,
    tenantId,
    expiresAt: Date.now() + 60_000,
    usedAt: null,
  });
  return signHandoff(id);
}

export function consumeHandoff(token: string): { sessionId: string; tenantId: TenantId } | null {
  const [id, mac] = token.split(".");
  if (!id || !mac) return null;
  const expected = createHmac("sha256", secret()).update(id).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const row = getStore().handoffs.get(id);
  if (!row || row.usedAt || row.expiresAt < Date.now()) return null;
  row.usedAt = Date.now();
  return { sessionId: row.sessionId, tenantId: row.tenantId };
}
