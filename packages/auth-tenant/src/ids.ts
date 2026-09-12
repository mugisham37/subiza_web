import { randomBytes } from "node:crypto";

export function opaqueId(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function newEntityId(prefix: string): string {
  return `${prefix}_${opaqueId(16)}`;
}
