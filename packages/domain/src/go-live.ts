import { z } from "zod";

export const GO_LIVE_RUNGS = ["sandbox", "closed-only", "no-answer", "all-calls"] as const;
export type GoLiveRung = (typeof GO_LIVE_RUNGS)[number];
export const goLiveRungSchema = z.enum(GO_LIVE_RUNGS);

/** The recommended live rung is the narrowest that still answers someone. */
export const RECOMMENDED_RUNG: GoLiveRung = "closed-only";

export const goLiveSchema = z.object({
  rung: goLiveRungSchema,
  chosenAt: z.number().nullable(),
  pausedAt: z.number().nullable(),
});
export type GoLive = z.infer<typeof goLiveSchema>;

export function emptyGoLive(): GoLive {
  return { rung: "sandbox", chosenAt: null, pausedAt: null };
}

export function isLive(goLive: GoLive): boolean {
  return goLive.rung !== "sandbox" && goLive.pausedAt === null;
}
