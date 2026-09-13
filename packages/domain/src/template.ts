import { z } from "zod";
import { agentRuleSchema, templateKindSchema } from "./agent-config";
import { pronunciationEntrySchema, qaPairSchema } from "./knowledge";
import { libraryVoiceSchema } from "./voice";
import { afterHoursSchema, weekGridSchema } from "./week-grid";

export const businessTemplateSchema = z.object({
  kind: templateKindSchema,
  persona: z.string().min(1),
  greeting: z.string().min(1),
  rules: z.array(agentRuleSchema).min(5),
  questions: z.array(qaPairSchema).min(6).max(10),
  suggestedVoice: libraryVoiceSchema,
  pronunciations: z.array(pronunciationEntrySchema).min(1),
  week: weekGridSchema,
  afterHours: afterHoursSchema,
});
export type BusinessTemplate = z.infer<typeof businessTemplateSchema>;

export function interpolateGreeting(template: string, businessName: string): string {
  return template.replaceAll("{business}", businessName);
}
