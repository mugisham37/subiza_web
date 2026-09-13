import { createHmac, timingSafeEqual } from "node:crypto";
import type { AuthStrength, TenantRoleId } from "@subiza/core";
import type { MemberId, TenantId } from "@subiza/core";
import { asMemberId, asTenantId } from "@subiza/core";
import { env } from "./env";
import { opaqueId } from "./ids";
import { mintSession } from "./sessions";
import { getStore } from "./store";
import type { BusinessType } from "./types";

function secret(): string {
  return env("HANDOFF_SECRET") ?? "dev-only-handoff-secret";
}

export type HandoffSnapshot = {
  id: string;
  sessionId: string;
  personId: string;
  e164: string;
  personName: string;
  tenantId: TenantId;
  tenantName: string;
  tenantType: BusinessType;
  language: string;
  memberId: MemberId;
  role: TenantRoleId;
  strength: AuthStrength;
  expiresAt: number;
};

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(snapshot: HandoffSnapshot): string {
  const body = Buffer.from(JSON.stringify(snapshot)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string): HandoffSnapshot | null {
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = sign(body);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as HandoffSnapshot;
  } catch {
    return null;
  }
}

export function issueHandoff(sessionId: string, tenantId: TenantId): string {
  const store = getStore();
  const session = store.sessions.get(sessionId);
  const tenant = store.tenants.get(tenantId);
  const member = session?.memberId ? store.members.get(session.memberId) : undefined;
  const person = session ? store.people.get(session.personId) : undefined;
  const snapshot: HandoffSnapshot = {
    id: opaqueId(24),
    sessionId,
    personId: person?.id ?? session?.personId ?? "per_handoff",
    e164: person?.e164 ?? "+250788000000",
    personName: person?.name ?? "Owner",
    tenantId,
    tenantName: tenant?.name ?? "Business",
    tenantType: tenant?.type ?? "other",
    language: tenant?.language ?? "rw",
    memberId: member?.id ?? asMemberId("mem_handoff"),
    role: member?.role ?? "owner",
    strength: session?.strength ?? "otp",
    expiresAt: Date.now() + 60_000,
  };
  store.handoffs.set(snapshot.id, {
    id: snapshot.id,
    sessionId,
    tenantId,
    expiresAt: snapshot.expiresAt,
    usedAt: null,
  });
  return encode(snapshot);
}

export function consumeHandoff(token: string): HandoffSnapshot | null {
  const snapshot = decode(token);
  if (!snapshot || snapshot.expiresAt < Date.now()) return null;
  const store = getStore();
  const row = store.handoffs.get(snapshot.id);
  if (row) {
    if (row.usedAt || row.expiresAt < Date.now()) return null;
    row.usedAt = Date.now();
  } else {
    store.handoffs.set(snapshot.id, {
      id: snapshot.id,
      sessionId: snapshot.sessionId,
      tenantId: snapshot.tenantId,
      expiresAt: snapshot.expiresAt,
      usedAt: Date.now(),
    });
  }
  return snapshot;
}

export function materializeHandoff(snapshot: HandoffSnapshot): string {
  const store = getStore();
  const tenantId = asTenantId(snapshot.tenantId);
  const memberId = asMemberId(snapshot.memberId);
  if (!store.people.get(snapshot.personId)) {
    store.people.set(snapshot.personId, {
      id: snapshot.personId,
      e164: snapshot.e164,
      name: snapshot.personName,
      createdAt: Date.now(),
    });
    store.peopleByE164.set(snapshot.e164, snapshot.personId);
  }
  if (!store.tenants.get(tenantId)) {
    store.tenants.set(tenantId, {
      id: tenantId,
      name: snapshot.tenantName,
      type: snapshot.tenantType,
      ownerPersonId: snapshot.personId,
      language: snapshot.language,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      recycledSuspect: false,
    });
  }
  if (!store.members.get(memberId)) {
    store.members.set(memberId, {
      id: memberId,
      tenantId,
      personId: snapshot.personId,
      role: snapshot.role,
      removedAt: null,
    });
  }
  return mintSession({
    personId: snapshot.personId,
    tenantId,
    memberId,
    strength: snapshot.strength,
  }).id;
}
