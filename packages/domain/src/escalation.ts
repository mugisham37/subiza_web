import { z } from "zod";

export const NO_ANSWER_FALLBACKS = ["message-with-time", "try-next"] as const;
export type NoAnswerFallback = (typeof NO_ANSWER_FALLBACKS)[number];

export const escalationRotaSchema = z.object({
  primaryE164: z.string().regex(/^\+2507[2-9]\d{7}$/),
  noAnswer: z.enum(NO_ANSWER_FALLBACKS),
  confirmedAt: z.number(),
});
export type EscalationRota = z.infer<typeof escalationRotaSchema>;
