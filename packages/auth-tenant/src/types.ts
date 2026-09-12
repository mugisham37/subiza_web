import type { AuthStrength, TenantRoleId } from "@subiza/core";
import type { MemberId, TenantId } from "@subiza/core";
import type { DeliveryChannel } from "./sender";

export type BusinessType = "salon" | "clinic" | "hotel" | "other";

export type AuthStep =
  | "phone"
  | "code"
  | "profile"
  | "language"
  | "consent"
  | "done"
  | "choose"
  | "blocked"
  | "recycled";

export type EntryKind = "landing" | "demo" | "referral" | "invite" | "field";

export type RecoveryKind =
  | "delivery"
  | "unavailable"
  | "lost"
  | "changed"
  | "recycled"
  | "not-me"
  | "dispute";

export type Person = {
  id: string;
  e164: string;
  name: string;
  createdAt: number;
};

export type TenantRecord = {
  id: TenantId;
  name: string;
  type: BusinessType;
  ownerPersonId: string;
  language: string;
  createdAt: number;
  lastActiveAt: number;
  recycledSuspect: boolean;
};

export type MemberRecord = {
  id: MemberId;
  tenantId: TenantId;
  personId: string;
  role: TenantRoleId;
  removedAt: number | null;
};

export type VerificationRecord = {
  id: string;
  e164: string;
  hmac: string;
  channel: DeliveryChannel;
  createdAt: number;
  expiresAt: number;
  consumedAt: number | null;
  attempts: number;
  smsSends: number;
  smsFailures: number;
  voiceSends: number;
};

export type PreAuthRecord = {
  id: string;
  e164: string;
  verificationId: string;
  step: AuthStep;
  entry: EntryKind;
  locale: string;
  inviteTenantId: TenantId | null;
  profile: { name: string; business: string; type: BusinessType } | null;
  language: string | null;
  createdAt: number;
  verifyFails: number;
};

export type SessionRecord = {
  id: string;
  personId: string;
  tenantId: TenantId | null;
  memberId: MemberId | null;
  strength: AuthStrength;
  recoveredAt: number | null;
  createdAt: number;
  expiresAt: number;
};

export type ConsentRecord = {
  id: string;
  personId: string;
  tenantId: TenantId;
  purpose: "contract" | "marketing";
  textVersion: string;
  language: string;
  grantedAt: number;
  ip: string;
  action: string;
  revokedAt: number | null;
};

export type RecoveryRecord = {
  id: string;
  e164: string;
  kind: RecoveryKind;
  createdAt: number;
  earliestExecuteAt: number;
  evidenceTier: "none" | "a" | "b";
  status: "open" | "hold" | "approved" | "refused" | "executed";
  cooldownHours: number;
};

export type AuditEvent = {
  id: string;
  at: number;
  tenantId: TenantId | null;
  actorType: "human" | "ai" | "staff" | "impersonated";
  actorId: string;
  onBehalfOf: string | null;
  action: string;
  capability: string | null;
  outcome: "allowed" | "denied" | "notFound";
  before: unknown;
  after: unknown;
  reason: string | null;
};

export type PasskeyCredential = {
  id: string;
  personId: string;
  publicKey: string;
  createdAt: number;
};

export type HandoffToken = {
  id: string;
  sessionId: string;
  tenantId: TenantId;
  expiresAt: number;
  usedAt: number | null;
};

export type Bucket = { count: number; resetAt: number; hits: number[] };

export type CircuitState = {
  smsOpen: boolean;
  openedAt: number | null;
  paged: boolean;
  spendHourRwf: number;
  spendDayRwf: number;
};
