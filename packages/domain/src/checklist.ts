import { z } from "zod";
import type { TenantDocuments } from "./cursor";

export const CHECKLIST_ITEMS = [
  "account",
  "business-hours",
  "prices",
  "voice",
  "heard",
  "phone",
  "whatsapp",
  "clone-voice",
  "more-knowledge",
  "invite-team",
  "add-credit",
] as const;
export type ChecklistItemId = (typeof CHECKLIST_ITEMS)[number];

export const checklistItemSchema = z.object({
  id: z.enum(CHECKLIST_ITEMS),
  done: z.boolean(),
  highlight: z.boolean(),
  href: z.string(),
});
export type ChecklistItem = z.infer<typeof checklistItemSchema>;

export const checklistStateSchema = z.object({
  items: z.array(checklistItemSchema),
  doneCount: z.number().int().nonnegative(),
  total: z.literal(11),
});
export type ChecklistState = z.infer<typeof checklistStateSchema>;

export function deriveChecklist(docs: TenantDocuments, accountCreated: boolean): ChecklistState {
  const heard = docs.testCall?.transcriptViewedAt != null;
  const phone = docs.phone?.verification.verifiedAt != null;
  const prices = (docs.knowledge?.prices.length ?? 0) > 0 && docs.knowledge?.priceSource !== "skipped";
  const items: ChecklistItem[] = [
    { id: "account", done: accountCreated, highlight: false, href: "/home" },
    { id: "business-hours", done: docs.agent?.hoursConfirmedAt != null, highlight: false, href: "/agent" },
    { id: "prices", done: prices, highlight: false, href: "/agent/knowledge" },
    { id: "voice", done: docs.voice?.confirmedAt != null, highlight: false, href: "/agent/voice" },
    { id: "heard", done: heard, highlight: false, href: "/activate/review" },
    { id: "phone", done: phone, highlight: false, href: "/connections/phone" },
    { id: "whatsapp", done: docs.channels?.whatsapp.connectedAt != null, highlight: false, href: "/connections/messaging/whatsapp/wa1" },
    { id: "clone-voice", done: false, highlight: false, href: "/agent/voice" },
    { id: "more-knowledge", done: false, highlight: false, href: "/agent/knowledge" },
    { id: "invite-team", done: false, highlight: false, href: "/settings" },
    { id: "add-credit", done: false, highlight: false, href: "/credit" },
  ];
  const firstOpen = items.find((item) => !item.done);
  if (firstOpen) firstOpen.highlight = true;
  return {
    items,
    doneCount: items.filter((item) => item.done).length,
    total: 11,
  };
}
