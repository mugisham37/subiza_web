import type { AuthStrength, TenantRoleId } from "@subiza/core";
import type { MemberId, TenantId } from "@subiza/core";

const tenantBrand = Symbol("TenantContext");

export type TenantContext = {
  readonly [tenantBrand]: true;
  readonly tenantId: TenantId;
  readonly memberId: MemberId;
  readonly personId: string;
  readonly role: TenantRoleId;
  readonly strength: AuthStrength;
  readonly actorType: "human" | "ai" | "staff" | "impersonated";
};

export function createTenantContext(input: Omit<TenantContext, typeof tenantBrand>): TenantContext {
  return { ...input, [tenantBrand]: true };
}

export function isTenantContext(value: unknown): value is TenantContext {
  return Boolean(value && typeof value === "object" && tenantBrand in value);
}
