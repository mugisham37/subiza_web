import type { TenantId } from "@subiza/core";
import { newEntityId } from "./ids";
import { getStore } from "./store";
import type { AuditEvent } from "./types";

export type AuditWrite = Omit<AuditEvent, "id" | "at">;

export function writeAudit(event: AuditWrite): AuditEvent {
  const row: AuditEvent = {
    ...event,
    id: newEntityId("aud"),
    at: Date.now(),
  };
  getStore().audits.push(row);
  return row;
}

export function withAudit<T>(event: AuditWrite, mutate: () => T): T {
  const result = mutate();
  writeAudit(event);
  return result;
}

export function deniedAsNotFound(tenantId: TenantId | null, action: string, actorId: string): never {
  writeAudit({
    tenantId,
    actorType: "human",
    actorId,
    onBehalfOf: null,
    action,
    capability: null,
    outcome: "notFound",
    before: null,
    after: null,
    reason: "cross-tenant-or-missing",
  });
  throw Object.assign(new Error("notFound"), { code: "notFound" as const });
}

export function listAudit(tenantId: TenantId): AuditEvent[] {
  return getStore().audits.filter((row) => row.tenantId === tenantId);
}
