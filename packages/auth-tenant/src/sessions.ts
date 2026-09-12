import type { AuthStrength } from "@subiza/core";
import type { MemberId, TenantId } from "@subiza/core";
import { opaqueId } from "./ids";
import { getStore } from "./store";
import type { SessionRecord } from "./types";

const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const PREAUTH_TTL_MS = 30 * 60 * 1000;

export function mintSession(input: {
  personId: string;
  tenantId: TenantId | null;
  memberId: MemberId | null;
  strength: AuthStrength;
  recoveredAt?: number | null;
}): SessionRecord {
  const now = Date.now();
  const session: SessionRecord = {
    id: opaqueId(32),
    personId: input.personId,
    tenantId: input.tenantId,
    memberId: input.memberId,
    strength: input.strength,
    recoveredAt: input.recoveredAt ?? null,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
  getStore().sessions.set(session.id, session);
  return session;
}

export function deleteSession(id: string): void {
  getStore().sessions.delete(id);
}

export function readSession(id: string): SessionRecord | null {
  const session = getStore().sessions.get(id);
  if (!session || session.expiresAt < Date.now()) {
    if (session) getStore().sessions.delete(id);
    return null;
  }
  return session;
}

export function revokePersonSessions(personId: string): void {
  const store = getStore();
  for (const [id, session] of store.sessions) {
    if (session.personId === personId) store.sessions.delete(id);
  }
}

export function revokeMemberSessions(memberId: MemberId): void {
  const store = getStore();
  for (const [id, session] of store.sessions) {
    if (session.memberId === memberId) store.sessions.delete(id);
  }
}

export function switchTenant(sessionId: string, tenantId: TenantId, memberId: MemberId): SessionRecord | null {
  const current = readSession(sessionId);
  if (!current) return null;
  deleteSession(sessionId);
  return mintSession({
    personId: current.personId,
    tenantId,
    memberId,
    strength: current.strength,
    recoveredAt: current.recoveredAt,
  });
}

export { PREAUTH_TTL_MS, SESSION_TTL_MS };
