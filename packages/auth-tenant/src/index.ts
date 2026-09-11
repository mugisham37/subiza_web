/** Tenant-session types. Enforcement against real sessions arrives in Prompt 03. */
export type TenantSession = {
  tenantId: string;
  memberId: string;
  role: "owner" | "manager" | "agent" | "viewer";
};
