export const tenantRoles = ["owner", "manager", "agent", "viewer"] as const;
export type TenantRoleId = (typeof tenantRoles)[number];

export const staffRoles = [
  "supportL1",
  "supportL2",
  "onboarding",
  "billing",
  "engineer",
  "quality",
  "trustSafety",
  "dpo",
  "superAdmin",
] as const;
export type StaffRoleId = (typeof staffRoles)[number];

export type RoleId = TenantRoleId | StaffRoleId;

export const tenantCapabilities = [
  "completeSignupAndActivation",
  "configureAgentPersona",
  "editKnowledgeBase",
  "selectLibraryVoice",
  "initiateVoiceCloning",
  "connectDisconnectChannel",
  "setupCallForwarding",
  "changeLanguageSettings",
  "runTestConversation",
  "takeAgentLiveOrPause",
  "readAllConversations",
  "takeOverLiveConversation",
  "configureEscalationRules",
  "seeAnalytics",
  "exportConversationData",
  "topUpCredit",
  "seeBillingDetail",
  "inviteRemoveTeam",
  "respondToDsar",
  "changeRetentionSettings",
  "deleteAccount",
] as const;
export type TenantCapability = (typeof tenantCapabilities)[number];

export const staffCapabilities = [
  "tenantListStatus",
  "tenantConfigRead",
  "conversationContent",
  "impersonateTenant",
  "creditsAndRefunds",
  "planAndEntitlements",
  "numberInventory",
  "modelPromptConfig",
  "pushPromptToProduction",
  "suspendTenant",
  "voiceConsentQueue",
  "dsarExecution",
  "breachResponse",
  "auditLog",
  "internalRbac",
] as const;
export type StaffCapability = (typeof staffCapabilities)[number];

export type Capability = TenantCapability | StaffCapability;

export type Grade =
  | { kind: "full" }
  | { kind: "readonly" }
  | { kind: "none" }
  | { kind: "scoped"; scope: string };

export const FULL = { kind: "full" } as const satisfies Grade;
export const READONLY = { kind: "readonly" } as const satisfies Grade;
export const NONE = { kind: "none" } as const satisfies Grade;
export const scoped = <S extends string>(scope: S): { readonly kind: "scoped"; readonly scope: S } => ({
  kind: "scoped",
  scope,
});

export const tenantMatrix = {
  owner: {
    completeSignupAndActivation: FULL,
    configureAgentPersona: FULL,
    editKnowledgeBase: FULL,
    selectLibraryVoice: FULL,
    initiateVoiceCloning: FULL,
    connectDisconnectChannel: FULL,
    setupCallForwarding: FULL,
    changeLanguageSettings: FULL,
    runTestConversation: FULL,
    takeAgentLiveOrPause: FULL,
    readAllConversations: FULL,
    takeOverLiveConversation: FULL,
    configureEscalationRules: FULL,
    seeAnalytics: FULL,
    exportConversationData: FULL,
    topUpCredit: FULL,
    seeBillingDetail: FULL,
    inviteRemoveTeam: FULL,
    respondToDsar: FULL,
    changeRetentionSettings: FULL,
    deleteAccount: FULL,
  },
  manager: {
    completeSignupAndActivation: NONE,
    configureAgentPersona: FULL,
    editKnowledgeBase: FULL,
    selectLibraryVoice: FULL,
    initiateVoiceCloning: NONE,
    connectDisconnectChannel: scoped("connect-only"),
    setupCallForwarding: FULL,
    changeLanguageSettings: FULL,
    runTestConversation: FULL,
    takeAgentLiveOrPause: FULL,
    readAllConversations: FULL,
    takeOverLiveConversation: FULL,
    configureEscalationRules: FULL,
    seeAnalytics: FULL,
    exportConversationData: scoped("with-reason"),
    topUpCredit: NONE,
    seeBillingDetail: scoped("balance-only"),
    inviteRemoveTeam: scoped("below-own"),
    respondToDsar: scoped("prepare-only"),
    changeRetentionSettings: NONE,
    deleteAccount: NONE,
  },
  agent: {
    completeSignupAndActivation: NONE,
    configureAgentPersona: NONE,
    editKnowledgeBase: scoped("suggest"),
    selectLibraryVoice: NONE,
    initiateVoiceCloning: NONE,
    connectDisconnectChannel: NONE,
    setupCallForwarding: NONE,
    changeLanguageSettings: NONE,
    runTestConversation: FULL,
    takeAgentLiveOrPause: scoped("pause-only"),
    readAllConversations: scoped("assigned-escalated"),
    takeOverLiveConversation: FULL,
    configureEscalationRules: NONE,
    seeAnalytics: scoped("own"),
    exportConversationData: NONE,
    topUpCredit: NONE,
    seeBillingDetail: NONE,
    inviteRemoveTeam: NONE,
    respondToDsar: NONE,
    changeRetentionSettings: NONE,
    deleteAccount: NONE,
  },
  viewer: {
    completeSignupAndActivation: NONE,
    configureAgentPersona: NONE,
    editKnowledgeBase: NONE,
    selectLibraryVoice: NONE,
    initiateVoiceCloning: NONE,
    connectDisconnectChannel: NONE,
    setupCallForwarding: NONE,
    changeLanguageSettings: NONE,
    runTestConversation: NONE,
    takeAgentLiveOrPause: NONE,
    readAllConversations: NONE,
    takeOverLiveConversation: NONE,
    configureEscalationRules: NONE,
    seeAnalytics: READONLY,
    exportConversationData: NONE,
    topUpCredit: NONE,
    seeBillingDetail: NONE,
    inviteRemoveTeam: NONE,
    respondToDsar: NONE,
    changeRetentionSettings: NONE,
    deleteAccount: NONE,
  },
} as const satisfies Record<TenantRoleId, Record<TenantCapability, Grade>>;

export function tenantGrade(role: TenantRoleId, capability: TenantCapability): Grade {
  return tenantMatrix[role][capability];
}

/** Write-capable access. A readonly grade must not satisfy this. */
export function can(role: TenantRoleId, capability: TenantCapability): boolean {
  const grade = tenantGrade(role, capability);
  return grade.kind === "full" || grade.kind === "scoped";
}

export function canRead(role: TenantRoleId, capability: TenantCapability): boolean {
  return tenantGrade(role, capability).kind !== "none";
}

export function whoCanTenant(capability: TenantCapability): TenantRoleId[] {
  return tenantRoles.filter((role) => can(role, capability));
}

/** Only the Owner may initiate voice cloning. */
export function canInitiateVoiceCloning(role: TenantRoleId): boolean {
  return tenantGrade(role, "initiateVoiceCloning").kind === "full";
}

/** A Manager may connect a channel but never disconnect one. */
export function canDisconnectChannel(role: TenantRoleId): boolean {
  const grade = tenantGrade(role, "connectDisconnectChannel");
  return grade.kind === "full";
}

export function canConnectChannel(role: TenantRoleId): boolean {
  const grade = tenantGrade(role, "connectDisconnectChannel");
  return grade.kind === "full" || (grade.kind === "scoped" && grade.scope === "connect-only");
}

/** Any staff member who can pause; only Owner or Manager may resume. */
export function canPauseAgent(role: TenantRoleId): boolean {
  const grade = tenantGrade(role, "takeAgentLiveOrPause");
  return grade.kind === "full" || (grade.kind === "scoped" && grade.scope === "pause-only");
}

export function canResumeAgent(role: TenantRoleId): boolean {
  return tenantGrade(role, "takeAgentLiveOrPause").kind === "full";
}
