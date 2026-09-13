import { asTenantId, type TenantId } from "@subiza/core";

type Brand<T, B extends string> = T & { readonly __brand: B };

export type PriceRowId = Brand<string, "PriceRowId">;
export type QaPairId = Brand<string, "QaPairId">;
export type PronunciationId = Brand<string, "PronunciationId">;
export type TestCallId = Brand<string, "TestCallId">;
export type TurnId = Brand<string, "TurnId">;
export type RuleId = Brand<string, "RuleId">;

export function asPriceRowId(value: string): PriceRowId {
  return value as PriceRowId;
}
export function asQaPairId(value: string): QaPairId {
  return value as QaPairId;
}
export function asPronunciationId(value: string): PronunciationId {
  return value as PronunciationId;
}
export function asTestCallId(value: string): TestCallId {
  return value as TestCallId;
}
export function asTurnId(value: string): TurnId {
  return value as TurnId;
}
export function asRuleId(value: string): RuleId {
  return value as RuleId;
}

export function requireTenantId(value: string): TenantId {
  return asTenantId(value);
}
