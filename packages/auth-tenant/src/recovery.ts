import { newEntityId } from "./ids";
import { getStore } from "./store";
import { writeAudit } from "./audit";
import type { RecoveryKind, RecoveryRecord } from "./types";

const HOUR = 60 * 60 * 1000;

export function cooldownHours(evidenceTier: RecoveryRecord["evidenceTier"]): number {
  return evidenceTier === "a" ? 72 : 7 * 24;
}

export function openRecovery(input: {
  e164: string;
  kind: RecoveryKind;
  evidenceTier?: RecoveryRecord["evidenceTier"];
}): RecoveryRecord {
  const hours = cooldownHours(input.evidenceTier ?? "none");
  const row: RecoveryRecord = {
    id: newEntityId("rec"),
    e164: input.e164,
    kind: input.kind,
    createdAt: Date.now(),
    earliestExecuteAt: Date.now() + hours * HOUR,
    evidenceTier: input.evidenceTier ?? "none",
    status: "hold",
    cooldownHours: hours,
  };
  getStore().recoveries.set(row.id, row);
  writeAudit({
    tenantId: null,
    actorType: "human",
    actorId: input.e164,
    onBehalfOf: null,
    action: "recovery.open",
    capability: null,
    outcome: "allowed",
    before: null,
    after: { id: row.id, kind: row.kind },
    reason: "notify-original-and-team",
  });
  return row;
}

export function lengthenCooldown(id: string, hours: number): RecoveryRecord {
  const row = getStore().recoveries.get(id);
  if (!row) throw new Error("notFound");
  if (hours < row.cooldownHours) {
    throw new Error("cooldown-immutable");
  }
  row.cooldownHours = hours;
  row.earliestExecuteAt = row.createdAt + hours * HOUR;
  return row;
}

export function executeNumberChange(input: {
  id: string;
  actor: "superAdmin";
  second: "approver";
  now?: number;
}): RecoveryRecord {
  const row = getStore().recoveries.get(input.id);
  if (!row) throw new Error("notFound");
  if (input.actor !== "superAdmin" || input.second !== "approver") {
    throw new Error("two-actors-required");
  }
  const now = input.now ?? Date.now();
  if (now < row.earliestExecuteAt) throw new Error("hold");
  row.status = "executed";
  return row;
}

export function refuseRecovery(id: string): RecoveryRecord {
  const row = getStore().recoveries.get(id);
  if (!row) throw new Error("notFound");
  row.status = "refused";
  return row;
}
