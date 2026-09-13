import { asMemberId, asTenantId } from "@subiza/core";
import { newEntityId } from "./ids";
import type {
  AuditEvent,
  CircuitState,
  ConsentRecord,
  HandoffToken,
  MemberRecord,
  PasskeyCredential,
  Person,
  PreAuthRecord,
  RecoveryRecord,
  SessionRecord,
  TenantRecord,
  VerificationRecord,
} from "./types";

export type AuthStore = {
  people: Map<string, Person>;
  peopleByE164: Map<string, string>;
  tenants: Map<string, TenantRecord>;
  members: Map<string, MemberRecord>;
  verifications: Map<string, VerificationRecord>;
  preauth: Map<string, PreAuthRecord>;
  sessions: Map<string, SessionRecord>;
  consents: Map<string, ConsentRecord>;
  recoveries: Map<string, RecoveryRecord>;
  audits: AuditEvent[];
  passkeys: Map<string, PasskeyCredential>;
  handoffs: Map<string, HandoffToken>;
  buckets: Map<string, { hits: number[] }>;
  verifyFails: Map<string, number[]>;
  lastDevOtp: string | null;
  circuit: CircuitState;
  pages: string[];
  documents: Map<string, import("./activation").TenantBundle>;
  activationEvents: { tenantId: string; at: number; event: import("@subiza/domain").TenantEvent }[];
  onboardingAttempts: { tenantId: string; at: number }[];
  privateReplyClaims: Map<string, import("@subiza/domain").PrivateReplyClaim>;
  webhookInbox: { id: string; timestamp: number; tenantId: string; kind: string }[];
  signupCodes: Map<string, { issuedAt: number; used: boolean }>;
};

function emptyStore(): AuthStore {
  return {
    people: new Map(),
    peopleByE164: new Map(),
    tenants: new Map(),
    members: new Map(),
    verifications: new Map(),
    preauth: new Map(),
    sessions: new Map(),
    consents: new Map(),
    recoveries: new Map(),
    audits: [],
    passkeys: new Map(),
    handoffs: new Map(),
    buckets: new Map(),
    verifyFails: new Map(),
    lastDevOtp: null,
    circuit: {
      smsOpen: false,
      openedAt: null,
      paged: false,
      spendHourRwf: 0,
      spendDayRwf: 0,
    },
    pages: [],
    documents: new Map(),
    activationEvents: [],
    onboardingAttempts: [],
    privateReplyClaims: new Map(),
    webhookInbox: [],
    signupCodes: new Map(),
  };
}

function seed(store: AuthStore): void {
  const now = Date.now();
  const personA = { id: newEntityId("per"), e164: "+250788000111", name: "Aline", createdAt: now };
  const personB = { id: newEntityId("per"), e164: "+250788000222", name: "Jean", createdAt: now };
  const dormant = { id: newEntityId("per"), e164: "+250788000333", name: "Holder", createdAt: now };
  store.people.set(personA.id, personA);
  store.people.set(personB.id, personB);
  store.people.set(dormant.id, dormant);
  store.peopleByE164.set(personA.e164, personA.id);
  store.peopleByE164.set(personB.e164, personB.id);
  store.peopleByE164.set(dormant.e164, dormant.id);

  const salon = {
    id: asTenantId(newEntityId("tnt")),
    name: "Salon Ubwiza",
    type: "salon" as const,
    ownerPersonId: personA.id,
    language: "rw",
    createdAt: now - 40 * 86400000,
    lastActiveAt: now - 2 * 86400000,
    recycledSuspect: false,
  };
  const garage = {
    id: asTenantId(newEntityId("tnt")),
    name: "Garage Kimironko",
    type: "other" as const,
    ownerPersonId: personA.id,
    language: "rw",
    createdAt: now - 20 * 86400000,
    lastActiveAt: now - 1 * 86400000,
    recycledSuspect: false,
  };
  const clinic = {
    id: asTenantId(newEntityId("tnt")),
    name: "Clinique Nyamirambo",
    type: "clinic" as const,
    ownerPersonId: personB.id,
    language: "rw",
    createdAt: now - 10 * 86400000,
    lastActiveAt: now - 1 * 86400000,
    recycledSuspect: false,
  };
  const old = {
    id: asTenantId(newEntityId("tnt")),
    name: "Dormant Shop",
    type: "other" as const,
    ownerPersonId: dormant.id,
    language: "rw",
    createdAt: now - 200 * 86400000,
    lastActiveAt: now - 100 * 86400000,
    recycledSuspect: true,
  };
  for (const tenant of [salon, garage, clinic, old]) store.tenants.set(tenant.id, tenant);

  const addMember = (tenant: TenantRecord, personId: string, role: MemberRecord["role"]) => {
    const member: MemberRecord = {
      id: asMemberId(newEntityId("mem")),
      tenantId: tenant.id,
      personId,
      role,
      removedAt: null,
    };
    store.members.set(member.id, member);
  };
  addMember(salon, personA.id, "owner");
  addMember(garage, personA.id, "agent");
  addMember(clinic, personB.id, "owner");
  addMember(old, dormant.id, "owner");
}

const globalStore = globalThis as typeof globalThis & { __subizaAuth?: AuthStore };

export function getStore(): AuthStore {
  if (!globalStore.__subizaAuth) {
    const store = emptyStore();
    seed(store);
    globalStore.__subizaAuth = store;
  }
  return globalStore.__subizaAuth;
}

export function resetStore(): AuthStore {
  const store = emptyStore();
  seed(store);
  globalStore.__subizaAuth = store;
  return store;
}
