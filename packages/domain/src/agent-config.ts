import { z } from "zod";
import { afterHoursSchema, weekGridSchema, type AfterHoursPolicy, type WeekGrid } from "./week-grid";

export const TEMPLATE_KINDS = ["shop", "salon", "restaurant", "clinic", "repair", "generic"] as const;
export type TemplateKind = (typeof TEMPLATE_KINDS)[number];
export const templateKindSchema = z.enum(TEMPLATE_KINDS);

export const agentRuleSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  locked: z.boolean(),
});
export type AgentRule = z.infer<typeof agentRuleSchema>;

export const agentConfigSchema = z.object({
  templateKind: templateKindSchema.nullable(),
  otherDescription: z.string().nullable(),
  persona: z.string(),
  greeting: z.string(),
  rules: z.array(agentRuleSchema),
  hours: weekGridSchema,
  afterHours: afterHoursSchema,
  hoursConfirmedAt: z.number().nullable(),
  needsConflictCheck: z.boolean(),
});
export type AgentConfig = z.infer<typeof agentConfigSchema>;

export function emptyAgentConfig(hours: WeekGrid, afterHours: AfterHoursPolicy = "answer-and-message"): AgentConfig {
  return {
    templateKind: null,
    otherDescription: null,
    persona: "",
    greeting: "",
    rules: [],
    hours,
    afterHours,
    hoursConfirmedAt: null,
    needsConflictCheck: false,
  };
}
