import { createHmac, timingSafeEqual } from "node:crypto";
import { enqueueWebhook } from "./channels";

export function verifyMetaSignature(raw: string, header: string | null, secret: string): boolean {
  if (!header?.startsWith("sha256=")) return false;
  const expected = Buffer.from(`sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`);
  const received = Buffer.from(header);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

export function metaHandshake(
  search: URLSearchParams,
  verifyToken: string,
): { ok: true; challenge: string } | { ok: false } {
  if (search.get("hub.mode") !== "subscribe") return { ok: false };
  if (search.get("hub.verify_token") !== verifyToken) return { ok: false };
  const challenge = search.get("hub.challenge");
  if (!challenge) return { ok: false };
  return { ok: true, challenge };
}

type Inbound = {
  id: string;
  timestamp: number;
  tenantId: string;
  kind: string;
};

export function ingestMetaWebhook(raw: string, tenantId: string): { accepted: number; duplicates: number } {
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return { accepted: 0, duplicates: 0 };
  }
  const entries = Array.isArray((body as { entry?: unknown }).entry) ? (body as { entry: unknown[] }).entry : [];
  const rows: Inbound[] = [];
  for (const entry of entries) {
    const changes = Array.isArray((entry as { changes?: unknown }).changes)
      ? (entry as { changes: unknown[] }).changes
      : [];
    for (const change of changes) {
      const value = (change as { value?: { messages?: { id?: string; timestamp?: string }[] } }).value;
      for (const message of value?.messages ?? []) {
        if (!message.id) continue;
        rows.push({
          id: message.id,
          timestamp: Number(message.timestamp ?? 0) * 1000,
          tenantId,
          kind: "whatsapp",
        });
      }
    }
  }
  let accepted = 0;
  let duplicates = 0;
  for (const row of rows) {
    const result = enqueueWebhook(row);
    if (result.duplicate) duplicates += 1;
    else accepted += 1;
  }
  return { accepted, duplicates };
}
