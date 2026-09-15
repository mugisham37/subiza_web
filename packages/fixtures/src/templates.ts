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
  type AgentRule,
  type BusinessTemplate,
  type RuleCategory,
  type AgentStage,
  type RuleEnforcement,
  type RuleMechanism,
  type TemplateKind,
} from "@subiza/domain";

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

function rule(input: {
  id: string;
  cat: RuleCategory;
  stage: AgentStage;
  enf: RuleEnforcement;
  en: string;
  rw: string;
  lock?: boolean;
  mechanism?: RuleMechanism | null;
}): AgentRule {
  const lock = input.lock === true;
  return {
    id: asRuleId(input.id),
    cat: input.cat,
    stage: input.stage,
    enf: lock ? "lock" : input.enf,
    on: true,
    lock,
    en: input.en,
    rw: input.rw,
    text: input.en,
    mechanism: lock ? null : (input.mechanism ?? null),
    knowledgeRef: null,
  };
}

const DISCLOSURE = rule({
  id: "rul_disclosure",
  cat: "always",
  stage: "greeting",
  enf: "lock",
  lock: true,
  en: "Say at the start that this is an assistant, not a person",
  rw: "Tangira uvuge ko uyu ari umufasha, si umuntu",
});

const OUT_OF_SCOPE = rule({
  id: "rul_out_of_scope",
  cat: "never",
  stage: "always",
  enf: "lock",
  lock: true,
  en: "Answer questions that have nothing to do with this business",
  rw: "Subiza ibibazo bitagira aho bihuriye n'iyi nganda",
});

const PRICE_LIST = rule({
  id: "rul_price_list",
  cat: "always",
  stage: "answer",
  enf: "hard",
  mechanism: "typed-field-lookup",
  en: "Give the price only from the price list",
  rw: "Tanga igiciro ku rutonde rw'ibiciro gusa",
});

const UNSURE = rule({
  id: "rul_unsure",
  cat: "escalate",
  stage: "always",
  enf: "hard",
  mechanism: "every-turn-trigger",
  en: "The customer asks twice and it still cannot help",
  rw: "Umukiriya abajije kabiri ntikibashije kumufasha",
});

function withLocked(extra: AgentRule[]): AgentRule[] {
  return [DISCLOSURE, ...extra, PRICE_LIST, UNSURE, OUT_OF_SCOPE];
}

export const businessTemplates: Record<TemplateKind, BusinessTemplate> = {
  salon: {
    kind: "salon",
    persona: "Warm, brief, uses the customer's name",
    greeting: "Muraho, ni {business}. Ndi umufasha wa Aline. Nabafasha nte?",
    rules: [
      PRICE_LIST,
      rule({
        id: "rul_confirm_booking",
        cat: "always",
        stage: "booking",
        enf: "hard",
        mechanism: "required-step-before-commit",
        en: "Confirm a booking by repeating it back",
        rw: "Emeza gahunda uyisubiramo",
      }),
      rule({
        id: "rul_address",
        cat: "always",
        stage: "answer",
        enf: "soft",
        en: "Say the address when someone asks where we are",
        rw: "Vuga aderesi iyo umuntu abajije aho turi",
      }),
      DISCLOSURE,
      rule({
        id: "rul_bridal",
        cat: "never",
        stage: "booking",
        enf: "hard",
        mechanism: "tool-absent",
        en: "Quote for a bridal party — take a message instead",
        rw: "Ntugire igiciro cy'ubukwe — fata ubutumwa",
      }),
      rule({
        id: "rul_discount",
        cat: "never",
        stage: "answer",
        enf: "soft",
        en: "Promise a discount",
        rw: "Sezerera igabanyirizwa",
      }),
      rule({
        id: "rul_medical",
        cat: "never",
        stage: "answer",
        enf: "soft",
        en: "Give hair or skin medical advice",
        rw: "Tanga inama z'ubuvuzi ku misatsi cyangwa ku ruhu",
      }),
      OUT_OF_SCOPE,
      rule({
        id: "rul_upset",
        cat: "escalate",
        stage: "always",
        enf: "hard",
        mechanism: "every-turn-trigger",
        en: "The customer sounds upset",
        rw: "Umukiriya yumvikana arakaye",
      }),
      rule({
        id: "rul_aline",
        cat: "escalate",
        stage: "always",
        enf: "hard",
        mechanism: "every-turn-trigger",
        en: "Anyone asks for Aline by name",
        rw: "Umuntu asabye Aline ku izina",
      }),
      UNSURE,
    ],
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
    rules: withLocked([
      rule({
        id: "rul_stock",
        cat: "always",
        stage: "answer",
        enf: "soft",
        en: "Answer with the price and whether it is in stock",
        rw: "Subiza n'igiciro n'uko bihari",
      }),
      rule({
        id: "rul_delivery",
        cat: "never",
        stage: "answer",
        enf: "soft",
        en: "Promise a delivery time you were not told",
        rw: "Sezerera igihe cyo gutanga utarabwiwe",
      }),
    ]),
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
    rules: withLocked([
      rule({
        id: "rul_confirm_booking",
        cat: "always",
        stage: "booking",
        enf: "hard",
        mechanism: "required-step-before-commit",
        en: "Confirm party size and time before holding a table",
        rw: "Emeza umubare n'igihe mbere yo gufata ameza",
      }),
      rule({
        id: "rul_menu",
        cat: "always",
        stage: "answer",
        enf: "hard",
        mechanism: "typed-field-lookup",
        en: "Give the dish only from the menu",
        rw: "Tanga ifunguro riri ku rutonde gusa",
      }),
    ]),
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
    rules: withLocked([
      rule({
        id: "rul_diagnosis",
        cat: "never",
        stage: "answer",
        enf: "soft",
        en: "Give medical advice or a diagnosis",
        rw: "Tanga inama y'ubuvuzi cyangwa isuzuma",
      }),
      rule({
        id: "rul_confirm_booking",
        cat: "always",
        stage: "booking",
        enf: "hard",
        mechanism: "required-step-before-commit",
        en: "Repeat the appointment time back",
        rw: "Subiramo igihe cy'urugendo",
      }),
    ]),
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
    rules: withLocked([
      rule({
        id: "rul_quote",
        cat: "never",
        stage: "answer",
        enf: "soft",
        en: "Quote a repair without seeing the item",
        rw: "Gira igiciro cyo gusana utarabonye",
      }),
      rule({
        id: "rul_callback",
        cat: "always",
        stage: "message",
        enf: "soft",
        en: "Say when someone will call back",
        rw: "Vuga igihe umuntu azahamagara",
      }),
    ]),
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
    rules: withLocked([
      rule({
        id: "rul_confirmed",
        cat: "always",
        stage: "answer",
        enf: "soft",
        en: "Answer only from what the owner confirmed",
        rw: "Subiza gusa ibyo nyir'uruganda yemeje",
      }),
      rule({
        id: "rul_take_number",
        cat: "always",
        stage: "message",
        enf: "soft",
        en: "Take a name and number when unsure",
        rw: "Fata izina n'umubare iyo utazi",
      }),
    ]),
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
