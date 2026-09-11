import type { Capability, RoleId } from "./capabilities";

export type Fidelity = "full" | "lite";

export type ViewState<T> =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "ready"; data: T }
  | { status: "partial"; data: T; missing: readonly string[] }
  | { status: "offline"; queued: number }
  | { status: "denied"; requiredCapability: Capability; whoCan: readonly RoleId[] }
  | { status: "notFound"; what: string; goInstead: { href: string; label: string } }
  | { status: "rateLimited"; retryAfterMinutes: number }
  | { status: "error"; digest?: string };

export function isReady<T>(
  state: ViewState<T>,
): state is { status: "ready"; data: T } | { status: "partial"; data: T; missing: readonly string[] } {
  return state.status === "ready" || state.status === "partial";
}
