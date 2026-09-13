import type { AgentConfig } from "./agent-config";
import type { Knowledge, PriceRow, QaPair, PronunciationEntry } from "./knowledge";
import { newPronId, newQaId } from "./knowledge";
import type { BusinessTemplate } from "./template";
import { interpolateGreeting } from "./template";
import type { TestCall, TranscriptTurn } from "./test-call";
import { WEEKDAYS, type Weekday } from "./week-grid";

export function applyTemplate(
  template: BusinessTemplate,
  businessName: string,
): { agent: AgentConfig; knowledge: Knowledge } {
  const greeting = interpolateGreeting(template.greeting, businessName);
  return {
    agent: {
      templateKind: template.kind,
      otherDescription: template.kind === "generic" ? template.persona : null,
      persona: template.persona,
      greeting,
      rules: template.rules.map((rule) => ({ ...rule })),
      hours: template.week,
      afterHours: template.afterHours,
      hoursConfirmedAt: null,
      needsConflictCheck: false,
    },
    knowledge: {
      prices: [],
      questions: template.questions.map((row) => ({ ...row })),
      pronunciations: template.pronunciations.map((row) => ({ ...row })),
      pricesConfirmedAt: null,
      priceSource: null,
      retrievalMode: false,
    },
  };
}

export type CorrectionTarget = "knowledge" | "rule" | "pronunciation";

export type CorrectionResult = {
  knowledge: Knowledge;
  agent: AgentConfig;
  targets: CorrectionTarget[];
};

const WEEKDAY_HINT: Record<string, Weekday> = {
  monday: "mon",
  tuesday: "tue",
  wednesday: "wed",
  thursday: "thu",
  friday: "fri",
  saturday: "sat",
  sunday: "sun",
  "ku wa mbere": "mon",
  "ku wa kabiri": "tue",
  "ku wa gatatu": "wed",
  "ku wa kane": "thu",
  "ku wa gatanu": "fri",
  "ku wa gatandatu": "sat",
  "ku cyumweru": "sun",
};

function detectWeekday(text: string): Weekday | null {
  const lower = text.toLowerCase();
  for (const [hint, day] of Object.entries(WEEKDAY_HINT)) {
    if (lower.includes(hint)) return day;
  }
  return null;
}

function looksLikePrice(text: string): boolean {
  return /\d{3,}/.test(text) && /(frw|rwf|angahe|price|franc)/i.test(text);
}

export function applyCorrection(input: {
  turn: TranscriptTurn;
  correctedText: string;
  knowledge: Knowledge;
  agent: AgentConfig;
}): CorrectionResult {
  const text = input.correctedText.trim();
  const targets: CorrectionTarget[] = [];
  let knowledge = input.knowledge;
  let agent = input.agent;

  const day = detectWeekday(`${input.turn.text} ${text}`);
  if (day && WEEKDAYS.includes(day)) {
    const match = /(\d{1,2})(?::(\d{2}))?/.exec(text);
    const current = agent.hours[day];
    const nextHours = match
      ? {
          ...current,
          end: `${match[1]!.padStart(2, "0")}:${(match[2] ?? "00").padStart(2, "0")}`,
        }
      : current;
    agent = {
      ...agent,
      hours: { ...agent.hours, [day]: nextHours },
      needsConflictCheck: true,
    };
    targets.push("rule");
  }

  if (looksLikePrice(text) || input.turn.sourceKind === "price") {
    const amountMatch = text.replace(/[^\d]/g, "");
    const amount = amountMatch ? Number(amountMatch) : null;
    const existing = knowledge.prices.find((row) =>
      input.turn.sourceLabel?.toLowerCase().includes(row.name.toLowerCase()),
    );
    if (existing && amount !== null) {
      knowledge = {
        ...knowledge,
        prices: knowledge.prices.map((row) =>
          row.id === existing.id ? { ...row, amount, escalateIfUnknown: false, confirmed: true } : row,
        ),
      };
    } else {
      const pair: QaPair = {
        id: newQaId(knowledge.questions.length),
        question: input.turn.text,
        answer: text,
        blank: false,
      };
      knowledge = { ...knowledge, questions: [...knowledge.questions, pair] };
    }
    targets.push("knowledge");
  } else if (!targets.includes("rule")) {
    const pair: QaPair = {
      id: newQaId(knowledge.questions.length),
      question: input.turn.text,
      answer: text,
      blank: false,
    };
    knowledge = { ...knowledge, questions: [...knowledge.questions, pair] };
    targets.push("knowledge");
  }

  const spoken = text.slice(0, 80);
  const entry: PronunciationEntry = {
    id: newPronId(knowledge.pronunciations.length),
    surface: spoken,
    spoken,
  };
  knowledge = { ...knowledge, pronunciations: [...knowledge.pronunciations, entry] };
  targets.push("pronunciation");

  return { knowledge, agent, targets: [...new Set(targets)] };
}

export function markTurnViewed(call: TestCall, now: number): TestCall {
  return { ...call, transcriptViewedAt: call.transcriptViewedAt ?? now };
}

export function replaceInterim(turns: readonly TranscriptTurn[], next: TranscriptTurn): TranscriptTurn[] {
  if (next.interim) {
    const without = turns.filter((turn) => !(turn.interim && turn.speaker === next.speaker));
    return [...without, next];
  }
  return [...turns.filter((turn) => !turn.interim), next];
}

export function unreadableBecomesUnknown(row: PriceRow): PriceRow {
  if (row.confidence < 0.45) {
    return { ...row, amount: null, escalateIfUnknown: true };
  }
  return row;
}
