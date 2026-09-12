import {
  asTenantId,
  mintGrant,
  type AccessMode,
  type AuthStrength,
  type CapabilityScope,
  type Grant,
  type TenantCapability,
  type TenantRoleId,
} from "@subiza/core";
import type { MemberId, TenantId } from "@subiza/core";
import { writeAudit } from "./audit";
import { createTenantContext, type TenantContext } from "./context";
import { newEntityId } from "./ids";
import { mintSession } from "./sessions";
import { getStore } from "./store";
import type { BusinessType, ConsentRecord, Person, TenantRecord } from "./types";

export { createTenantContext, type TenantContext } from "./context";

export function resolveTenantContext(sessionId: string): TenantContext | null {
  const store = getStore();
  const session = store.sessions.get(sessionId);
  if (!session || !session.tenantId || !session.memberId) return null;
  const member = store.members.get(session.memberId);
  if (!member || member.removedAt || member.tenantId !== session.tenantId) return null;
  if (member.personId !== session.personId) return null;
  return createTenantContext({
    tenantId: session.tenantId,
    memberId: member.id,
    personId: session.personId,
    role: member.role,
    strength: session.strength,
    actorType: "human",
  });
}

export function grant<C extends TenantCapability, M extends AccessMode>(
  ctx: TenantContext,
  capability: C,
  mode: M,
): Grant<C, CapabilityScope<C>, M> | null {
  return mintGrant(ctx.role, capability, mode, ctx.strength);
}

export function requireGrant<C extends TenantCapability, S extends CapabilityScope<C>>(
  ctx: TenantContext,
  capability: C,
  mode: "write",
  scope: S,
): Grant<C, S, "write"> {
  const minted = grant(ctx, capability, mode);
  if (!minted || minted.scope !== scope) {
    writeAudit({
      tenantId: ctx.tenantId,
      actorType: ctx.actorType,
      actorId: ctx.personId,
      onBehalfOf: null,
      action: capability,
      capability,
      outcome: "denied",
      before: null,
      after: null,
      reason: "missing-grant",
    });
    throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  }
  return minted as Grant<C, S, "write">;
}

function owned(ctx: TenantContext, tenantId: TenantId): boolean {
  return ctx.tenantId === tenantId;
}

export function getTenant(ctx: TenantContext): TenantRecord {
  const tenant = getStore().tenants.get(ctx.tenantId);
  if (!tenant) throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  return tenant;
}

export function readConversation(ctx: TenantContext, conversationId: string): { id: string; tenantId: TenantId } {
  if (!grant(ctx, "readAllConversations", "read")) {
    throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  }
  const parts = conversationId.split(":");
  const tenantId = asTenantId(parts[0] ?? "");
  if (!owned(ctx, tenantId)) {
    writeAudit({
      tenantId: ctx.tenantId,
      actorType: ctx.actorType,
      actorId: ctx.personId,
      onBehalfOf: null,
      action: "readConversation",
      capability: "readAllConversations",
      outcome: "notFound",
      before: null,
      after: null,
      reason: "cross-tenant",
    });
    throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  }
  return { id: conversationId, tenantId };
}

export function pauseAgent(ctx: TenantContext): void {
  const minted = grant(ctx, "takeAgentLiveOrPause", "write");
  if (!minted || (minted.scope !== "full" && minted.scope !== "pause-only")) {
    throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  }
  writeAudit({
    tenantId: ctx.tenantId,
    actorType: ctx.actorType,
    actorId: ctx.personId,
    onBehalfOf: null,
    action: "pauseAgent",
    capability: "takeAgentLiveOrPause",
    outcome: "allowed",
    before: { live: true },
    after: { live: false },
    reason: null,
  });
}

export function resumeAgent(ctx: TenantContext): void {
  requireGrant(ctx, "takeAgentLiveOrPause", "write", "full");
  writeAudit({
    tenantId: ctx.tenantId,
    actorType: ctx.actorType,
    actorId: ctx.personId,
    onBehalfOf: null,
    action: "resumeAgent",
    capability: "takeAgentLiveOrPause",
    outcome: "allowed",
    before: { live: false },
    after: { live: true },
    reason: null,
  });
}

export function disconnectChannel(ctx: TenantContext): void {
  requireGrant(ctx, "connectDisconnectChannel", "write", "full");
}

export function connectChannel(ctx: TenantContext): void {
  const minted = grant(ctx, "connectDisconnectChannel", "write");
  if (!minted || (minted.scope !== "full" && minted.scope !== "connect-only")) {
    throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  }
}

export function initiateVoiceCloning(ctx: TenantContext): void {
  requireGrant(ctx, "initiateVoiceCloning", "write", "full");
}

export function grantsForAgentA10(ctx: TenantContext): TenantCapability[] {
  const allowed: TenantCapability[] = ["readAllConversations", "runTestConversation"];
  return allowed.filter((capability) => mintGrant(ctx.role, capability, "read", "otp"));
}

export function createAccount(input: {
  e164: string;
  name: string;
  business: string;
  type: BusinessType;
  language: string;
  marketing: boolean;
  ip: string;
  textVersion: string;
}): { person: Person; tenant: TenantRecord; sessionId: string } {
  const store = getStore();
  let personId = store.peopleByE164.get(input.e164);
  if (!personId) {
    const person: Person = {
      id: newEntityId("per"),
      e164: input.e164,
      name: input.name,
      createdAt: Date.now(),
    };
    store.people.set(person.id, person);
    store.peopleByE164.set(input.e164, person.id);
    personId = person.id;
  }
  const person = store.people.get(personId);
  if (!person) throw new Error("person");
  person.name = input.name;

  const tenant: TenantRecord = {
    id: asTenantId(newEntityId("tnt")),
    name: input.business,
    type: input.type,
    ownerPersonId: person.id,
    language: input.language,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    recycledSuspect: false,
  };
  store.tenants.set(tenant.id, tenant);
  const memberId = newEntityId("mem") as MemberId;
  store.members.set(memberId, {
    id: memberId,
    tenantId: tenant.id,
    personId: person.id,
    role: "owner" as TenantRoleId,
    removedAt: null,
  });

  const consents: ConsentRecord[] = [
    {
      id: newEntityId("cns"),
      personId: person.id,
      tenantId: tenant.id,
      purpose: "contract",
      textVersion: input.textVersion,
      language: input.language,
      grantedAt: Date.now(),
      ip: input.ip,
      action: "signup.consent",
      revokedAt: null,
    },
  ];
  if (input.marketing) {
    consents.push({
      ...consents[0]!,
      id: newEntityId("cns"),
      purpose: "marketing",
    });
  }
  for (const row of consents) store.consents.set(row.id, row);

  writeAudit({
    tenantId: tenant.id,
    actorType: "human",
    actorId: person.id,
    onBehalfOf: null,
    action: "tenant.created",
    capability: "completeSignupAndActivation",
    outcome: "allowed",
    before: null,
    after: { tenantId: tenant.id },
    reason: null,
  });

  const session = mintSession({
    personId: person.id,
    tenantId: tenant.id,
    memberId,
    strength: "otp",
  });
  return { person, tenant, sessionId: session.id };
}

export function signInExisting(e164: string, tenantId: TenantId): string {
  const store = getStore();
  const personId = store.peopleByE164.get(e164);
  if (!personId) throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  const member = [...store.members.values()].find(
    (row) => row.personId === personId && row.tenantId === tenantId && !row.removedAt,
  );
  if (!member) throw Object.assign(new Error("notFound"), { code: "notFound" as const });
  return mintSession({
    personId,
    tenantId,
    memberId: member.id,
    strength: "otp",
  }).id;
}

export function revokeConsent(ctx: TenantContext, purpose: "contract" | "marketing"): void {
  for (const row of getStore().consents.values()) {
    if (row.tenantId === ctx.tenantId && row.purpose === purpose && !row.revokedAt) {
      row.revokedAt = Date.now();
    }
  }
}
