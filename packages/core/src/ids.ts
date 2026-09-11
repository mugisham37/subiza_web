type Brand<T, B extends string> = T & { readonly __brand: B };

export type TenantId = Brand<string, "TenantId">;
export type ConversationId = Brand<string, "ConversationId">;
export type MemberId = Brand<string, "MemberId">;
export type ChannelId = Brand<string, "ChannelId">;
export type VoiceId = Brand<string, "VoiceId">;

export function asTenantId(value: string): TenantId {
  return value as TenantId;
}
export function asConversationId(value: string): ConversationId {
  return value as ConversationId;
}
export function asMemberId(value: string): MemberId {
  return value as MemberId;
}
export function asChannelId(value: string): ChannelId {
  return value as ChannelId;
}
export function asVoiceId(value: string): VoiceId {
  return value as VoiceId;
}
