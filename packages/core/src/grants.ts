import {
  can,
  canRead,
  tenantGrade,
  type Grade,
  type TenantCapability,
  type TenantRoleId,
} from "./capabilities";

export const authStrengths = ["otp", "elevated", "recovered"] as const;
export type AuthStrength = (typeof authStrengths)[number];

export type AccessMode = "read" | "write";

export type CapabilityScope<C extends TenantCapability> = C extends "takeAgentLiveOrPause"
  ? "full" | "pause-only"
  : C extends "connectDisconnectChannel"
    ? "full" | "connect-only"
    : C extends "exportConversationData"
      ? "full" | "with-reason"
      : C extends "seeBillingDetail"
        ? "full" | "balance-only"
        : C extends "inviteRemoveTeam"
          ? "full" | "below-own"
          : C extends "respondToDsar"
            ? "full" | "prepare-only"
            : C extends "editKnowledgeBase"
              ? "full" | "suggest"
              : C extends "readAllConversations"
                ? "full" | "assigned-escalated"
                : C extends "seeAnalytics"
                  ? "full" | "own" | "readonly"
                  : "full";

declare const GrantBrand: unique symbol;

/**
 * A grant is structurally incompatible across capability, scope, and mode.
 * `Grant<"takeAgentLiveOrPause", "pause-only", "write">` cannot be passed
 * where `Grant<"takeAgentLiveOrPause", "full", "write">` is required.
 * A `read` grant cannot be passed to a write.
 */
export type Grant<
  C extends TenantCapability = TenantCapability,
  S extends CapabilityScope<C> = CapabilityScope<C>,
  M extends AccessMode = AccessMode,
  A extends AuthStrength = AuthStrength,
> = {
  readonly [GrantBrand]: {
    capability: C;
    scope: S;
    mode: M;
    strength: A;
  };
  readonly capability: C;
  readonly scope: S;
  readonly mode: M;
  readonly strength: A;
};

export const elevatedCapabilities = [
  "setupCallForwarding",
  "topUpCredit",
  "seeBillingDetail",
  "inviteRemoveTeam",
  "exportConversationData",
  "deleteAccount",
  "respondToDsar",
  "changeRetentionSettings",
  "initiateVoiceCloning",
  "connectDisconnectChannel",
] as const satisfies readonly TenantCapability[];

export type ElevatedCapability = (typeof elevatedCapabilities)[number];

/** A recovered session may do ordinary daily work, and nothing that walks off with the business. */
export const recoveredDeniedCapabilities = [
  "exportConversationData",
  "deleteAccount",
  "changeRetentionSettings",
  "respondToDsar",
  "inviteRemoveTeam",
  "initiateVoiceCloning",
  "connectDisconnectChannel",
  "topUpCredit",
] as const satisfies readonly TenantCapability[];

export function requiresElevated(capability: TenantCapability): boolean {
  return (elevatedCapabilities as readonly TenantCapability[]).includes(capability);
}

export function recoveredAllows(capability: TenantCapability): boolean {
  return !(recoveredDeniedCapabilities as readonly TenantCapability[]).includes(capability);
}

export function strengthSatisfies(have: AuthStrength, capability: TenantCapability): boolean {
  if (have === "recovered") return recoveredAllows(capability);
  if (requiresElevated(capability)) return have === "elevated";
  return true;
}

function scopeFromGrade<C extends TenantCapability>(
  capability: C,
  grade: Grade,
): CapabilityScope<C> | null {
  if (grade.kind === "none") return null;
  if (grade.kind === "readonly") return "readonly" as CapabilityScope<C>;
  if (grade.kind === "full") return "full" as CapabilityScope<C>;
  return grade.scope as CapabilityScope<C>;
}

export function mintGrant<C extends TenantCapability, M extends AccessMode>(
  role: TenantRoleId,
  capability: C,
  mode: M,
  strength: AuthStrength,
): Grant<C, CapabilityScope<C>, M> | null {
  if (mode === "write" && !can(role, capability)) return null;
  if (mode === "read" && !canRead(role, capability)) return null;
  if (!strengthSatisfies(strength, capability)) return null;
  const grade = tenantGrade(role, capability);
  if (mode === "write" && grade.kind === "readonly") return null;
  const scope = scopeFromGrade(capability, grade);
  if (!scope) return null;
  return {
    capability,
    scope,
    mode,
    strength,
  } as Grant<C, CapabilityScope<C>, M>;
}

export function assertWriteGrant<C extends TenantCapability, S extends CapabilityScope<C>>(
  grant: Grant<C, S, "write">,
): Grant<C, S, "write"> {
  return grant;
}

export function assertResumeGrant(
  grant: Grant<"takeAgentLiveOrPause", "full", "write">,
): Grant<"takeAgentLiveOrPause", "full", "write"> {
  return grant;
}

export function assertDisconnectGrant(
  grant: Grant<"connectDisconnectChannel", "full", "write">,
): Grant<"connectDisconnectChannel", "full", "write"> {
  return grant;
}

/** Every capability must have at least one named enforcement site. CI fails on an orphan. */
export const enforcementSites: Record<TenantCapability, readonly string[]> = {
  completeSignupAndActivation: ["dal.createTenant"],
  configureAgentPersona: ["dal.updatePersona"],
  editKnowledgeBase: ["dal.writeKnowledge"],
  selectLibraryVoice: ["dal.selectVoice"],
  initiateVoiceCloning: ["dal.initiateVoiceCloning"],
  connectDisconnectChannel: ["dal.connectChannel", "dal.disconnectChannel"],
  setupCallForwarding: ["dal.changeForwarding"],
  changeLanguageSettings: ["dal.changeLanguage"],
  runTestConversation: ["dal.runTestConversation"],
  takeAgentLiveOrPause: ["dal.pauseAgent", "dal.resumeAgent"],
  readAllConversations: ["dal.listConversations", "dal.readConversation"],
  takeOverLiveConversation: ["dal.takeOverConversation"],
  configureEscalationRules: ["dal.configureEscalation"],
  seeAnalytics: ["dal.readAnalytics"],
  exportConversationData: ["dal.exportConversations"],
  topUpCredit: ["dal.topUpCredit"],
  seeBillingDetail: ["dal.readBilling"],
  inviteRemoveTeam: ["dal.inviteMember", "dal.removeMember"],
  respondToDsar: ["dal.respondToDsar"],
  changeRetentionSettings: ["dal.changeRetention"],
  deleteAccount: ["dal.deleteAccount"],
};
