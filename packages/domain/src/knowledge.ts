import { z } from "zod";
import { asPriceRowId, asPronunciationId, asQaPairId } from "./ids";

export const PRICE_CONFIDENCE_FLAG = 0.82;

export const priceRowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** Null means unread (`?`). That service escalates until filled. Never infer. */
  amount: z.number().nonnegative().nullable(),
  currency: z.literal("RWF"),
  confidence: z.number().min(0).max(1),
  confirmed: z.boolean(),
  escalateIfUnknown: z.boolean(),
});
export type PriceRow = z.infer<typeof priceRowSchema>;

export const qaPairSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string(),
  blank: z.boolean(),
});
export type QaPair = z.infer<typeof qaPairSchema>;

export const pronunciationEntrySchema = z.object({
  id: z.string().min(1),
  surface: z.string().min(1),
  spoken: z.string().min(1),
});
export type PronunciationEntry = z.infer<typeof pronunciationEntrySchema>;

export const knowledgeSchema = z.object({
  prices: z.array(priceRowSchema),
  questions: z.array(qaPairSchema),
  pronunciations: z.array(pronunciationEntrySchema),
  pricesConfirmedAt: z.number().nullable(),
  priceSource: z.enum(["photo", "type", "import", "template", "skipped"]).nullable(),
  retrievalMode: z.boolean(),
});
export type Knowledge = z.infer<typeof knowledgeSchema>;

export function emptyKnowledge(): Knowledge {
  return {
    prices: [],
    questions: [],
    pronunciations: [],
    pricesConfirmedAt: null,
    priceSource: null,
    retrievalMode: false,
  };
}

export function unreadPrice(name: string, index: number): PriceRow {
  return {
    id: asPriceRowId(`prc_unread_${index}`),
    name,
    amount: null,
    currency: "RWF",
    confidence: 0,
    confirmed: false,
    escalateIfUnknown: true,
  };
}

export function flagLowConfidence(row: PriceRow): boolean {
  return row.amount === null || row.confidence < PRICE_CONFIDENCE_FLAG;
}

export function confirmPrices(knowledge: Knowledge, prices: readonly PriceRow[], now: number): Knowledge {
  const confirmed = prices.map((row) => ({
    ...row,
    confirmed: true,
    escalateIfUnknown: row.amount === null,
  }));
  return {
    ...knowledge,
    prices: confirmed,
    pricesConfirmedAt: now,
    retrievalMode: confirmed.length > 40,
  };
}

export function newPriceId(index: number): string {
  return asPriceRowId(`prc_${index}_${Date.now().toString(36)}`);
}

export function newQaId(index: number): string {
  return asQaPairId(`qa_${index}_${Date.now().toString(36)}`);
}

export function newPronId(index: number): string {
  return asPronunciationId(`prn_${index}_${Date.now().toString(36)}`);
}
