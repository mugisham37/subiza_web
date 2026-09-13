import { z } from "zod";

export const TEST_CALL_ROUTES = ["outbound", "browser", "inbound"] as const;
export type TestCallRoute = (typeof TEST_CALL_ROUTES)[number];
export const testCallRouteSchema = z.enum(TEST_CALL_ROUTES);

export const TEST_CALL_STATES = [
  "ready",
  "ringing",
  "live",
  "ended",
  "no-answer",
  "voicemail-detected",
  "carrier-failed",
  "rate-limited",
  "platform-outage",
  "offline",
] as const;
export type TestCallState = (typeof TEST_CALL_STATES)[number];
export const testCallStateSchema = z.enum(TEST_CALL_STATES);

export const transcriptTurnSchema = z.object({
  id: z.string().min(1),
  speaker: z.enum(["ai", "human"]),
  text: z.string(),
  translation: z.string().nullable(),
  atSeconds: z.number().nonnegative(),
  interim: z.boolean(),
  /** Used after the call only. Never shown while live. */
  asrConfidence: z.number().min(0).max(1).nullable(),
  sourceKind: z.enum(["price", "hours", "rule", "pronunciation", "unknown"]).nullable(),
  sourceLabel: z.string().nullable(),
  vote: z.enum(["up", "down"]).nullable(),
  correctedText: z.string().nullable(),
});
export type TranscriptTurn = z.infer<typeof transcriptTurnSchema>;

export const testCallSchema = z.object({
  id: z.string().min(1),
  route: testCallRouteSchema,
  status: testCallStateSchema,
  startedAt: z.number().nullable(),
  endedAt: z.number().nullable(),
  durationSeconds: z.number().nonnegative().nullable(),
  pricesQuoted: z.array(z.string()),
  turns: z.array(transcriptTurnSchema),
  transcriptViewedAt: z.number().nullable(),
  retryAfterMs: z.number().nullable(),
  spendRwf: z.number().nonnegative(),
});
export type TestCall = z.infer<typeof testCallSchema>;

export function emptyTestCall(route: TestCallRoute = "outbound"): TestCall {
  return {
    id: "",
    route,
    status: "ready",
    startedAt: null,
    endedAt: null,
    durationSeconds: null,
    pricesQuoted: [],
    turns: [],
    transcriptViewedAt: null,
    retryAfterMs: null,
    spendRwf: 0,
  };
}

export function callCompleted(call: TestCall): boolean {
  return call.status === "ended" && call.endedAt !== null && call.turns.length > 0;
}

export function canFireActivated(call: TestCall): boolean {
  return callCompleted(call) && call.transcriptViewedAt !== null;
}
