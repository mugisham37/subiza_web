import {
  asPronunciationId,
  asQaPairId,
  asRuleId,
  clinicWeek,
  emptyWeek,
  repairWeek,
  restaurantWeek,
  salonWeek,
  shopWeek,
  type BusinessTemplate,
  type TemplateKind,
} from "@subiza/domain";

function rules(visible: readonly string[], locked: readonly string[]) {
  return [
    ...visible.map((text, i) => ({ id: asRuleId(`rul_v_${i}`), text, locked: false })),
    ...locked.map((text, i) => ({ id: asRuleId(`rul_l_${i}`), text, locked: true })),
  ];
}

function qa(pairs: readonly [string, string][]) {
  return pairs.map(([question, answer], i) => ({
    id: asQaPairId(`qa_t_${i}`),
    question,
    answer,
    blank: answer.length === 0,
  }));
}

function prons(words: readonly string[]) {
  return words.map((surface, i) => ({
    id: asPronunciationId(`prn_t_${i}`),
    surface,
    spoken: surface,
  }));
}

export const businessTemplates: Record<TemplateKind, BusinessTemplate> = {
  salon: {
    kind: "salon",
    persona: "Warm, brief, uses the customer's name",
    greeting: "Muraho, ni {business}. Nabafasha nte?",
    rules: rules(
      [
        "Always confirm a booking by repeating it back",
        "Never quote for a bridal party — fetch a person",
        "Never give hair or skin medical advice",
      ],
      ["Never invent a price", "Fetch a person when unsure"],
    ),
    questions: qa([
      ["Are you open now?", ""],
      ["How much for braids?", ""],
      ["Can I book Saturday?", ""],
      ["Where are you?", ""],
      ["Do you do relaxers?", ""],
      ["How long does it take?", ""],
      ["Do you take walk-ins?", ""],
      ["What time do you close on Saturday?", ""],
    ]),
    suggestedVoice: "warm-female",
    pronunciations: prons(["Remera", "Nyabugogo", "Kimironko"]),
    week: salonWeek(),
    afterHours: "answer-and-message",
  },
  shop: {
    kind: "shop",
    persona: "Brisk, clear, names the item and the price",
    greeting: "Muraho, ni {business}. Mushaka iki?",
    rules: rules(
      [
        "Answer with the price and whether it is in stock",
        "Never promise a delivery time you were not told",
        "Take a name and number when the item is out",
      ],
      ["Never invent a price", "Fetch a person when unsure"],
    ),
    questions: qa([
      ["Are you open now?", ""],
      ["How much is this?", ""],
      ["Do you have it in stock?", ""],
      ["Where are you?", ""],
      ["Do you deliver?", ""],
      ["What time do you close?", ""],
      ["Do you take Mobile Money?", ""],
      ["Can I reserve it?", ""],
    ]),
    suggestedVoice: "brisk-male",
    pronunciations: prons(["Nyabugogo", "Kimironko", "Gisozi"]),
    week: shopWeek(),
    afterHours: "answer-and-message",
  },
  restaurant: {
    kind: "restaurant",
    persona: "Warm, short answers, takes a booking without overpromising a table",
    greeting: "Muraho, ni {business}. Muraaza kurya?",
    rules: rules(
      [
        "Confirm party size and time before holding a table",
        "Never say a dish is available unless it is on the list",
        "Take a message when the kitchen is closed",
      ],
      ["Never invent a price", "Fetch a person when unsure"],
    ),
    questions: qa([
      ["Are you open now?", ""],
      ["Do you have a table for four?", ""],
      ["What do you serve?", ""],
      ["Where are you?", ""],
      ["Do you deliver?", ""],
      ["How much is a plate?", ""],
      ["Are you open on Sunday?", ""],
      ["Do you take bookings?", ""],
    ]),
    suggestedVoice: "warm-male",
    pronunciations: prons(["Kiyovu", "Nyarutarama", "Kimihurura"]),
    week: restaurantWeek(),
    afterHours: "answer-and-book",
  },
  clinic: {
    kind: "clinic",
    persona: "Calm, precise, never gives a diagnosis",
    greeting: "Muraho, ni {business}. Mwifuza gahunda?",
    rules: rules(
      [
        "Never give medical advice or a diagnosis",
        "Always offer to book or take a callback",
        "Repeat the appointment time back",
      ],
      ["Never invent a price", "Fetch a person when unsure"],
    ),
    questions: qa([
      ["Are you open now?", ""],
      ["Can I book today?", ""],
      ["How much is a consultation?", ""],
      ["Where are you?", ""],
      ["Do you have a pharmacist?", ""],
      ["What time do you close?", ""],
      ["Do you take insurance?", ""],
      ["Is there a doctor on Saturday?", ""],
    ]),
    suggestedVoice: "calm-female",
    pronunciations: prons(["Nyamirambo", "Kanombe", "Gikondo"]),
    week: clinicWeek(),
    afterHours: "message-only",
  },
  repair: {
    kind: "repair",
    persona: "Direct, names the job, never quotes a repair sight-unseen",
    greeting: "Muraho, ni {business}. Ni iki cyangiritse?",
    rules: rules(
      [
        "Never quote a repair without seeing the item",
        "Take a name, number, and what broke",
        "Say when someone will call back",
      ],
      ["Never invent a price", "Fetch a person when unsure"],
    ),
    questions: qa([
      ["Are you open now?", ""],
      ["Do you fix this?", ""],
      ["How much to look at it?", ""],
      ["Where are you?", ""],
      ["How long does it take?", ""],
      ["Do you have spare parts?", ""],
      ["Can I drop it today?", ""],
      ["Do you come to me?", ""],
    ]),
    suggestedVoice: "brisk-male",
    pronunciations: prons(["Gatsata", "Kicukiro", "Gisozi"]),
    week: repairWeek(),
    afterHours: "answer-and-message",
  },
  generic: {
    kind: "generic",
    persona: "Warm, brief, fetches a person when the answer is not on the list",
    greeting: "Muraho, ni {business}. Nabafasha nte?",
    rules: rules(
      [
        "Answer only from what the owner confirmed",
        "Take a name and number when unsure",
        "Never invent a price or a promise",
      ],
      ["Never invent a price", "Fetch a person when unsure"],
    ),
    questions: qa([
      ["Are you open now?", ""],
      ["What do you do?", ""],
      ["Where are you?", ""],
      ["How much is it?", ""],
      ["Can I book?", ""],
      ["What time do you close?", ""],
      ["Do you take Mobile Money?", ""],
      ["Who should I talk to?", ""],
    ]),
    suggestedVoice: "warm-female",
    pronunciations: prons(["Kigali", "Remera", "Nyabugogo"]),
    week: emptyWeek(),
    afterHours: "answer-and-message",
  },
};

export function templateFor(kind: TemplateKind): BusinessTemplate {
  return businessTemplates[kind];
}
