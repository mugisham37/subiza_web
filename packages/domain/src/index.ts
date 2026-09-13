export * from "./ids";
export * from "./week-grid";
export * from "./agent-config";
export * from "./knowledge";
export * from "./voice";
export * from "./test-call";
export * from "./escalation";
export * from "./phone-channel";
export * from "./channel";
export * from "./go-live";
export * from "./cursor";
export * from "./template";
export * from "./checklist";
export * from "./events";
export * from "./resume";
export * from "./transitions";

/** The twelve document schemas Prompts 05–11 must import. */
export const DOMAIN_DOCUMENTS = [
  "AgentConfig",
  "Knowledge",
  "VoiceSelection",
  "TestCall",
  "EscalationRota",
  "PhoneChannel",
  "MessagingChannels",
  "GoLive",
  "ActivationCursor",
  "BusinessTemplate",
  "WeekGrid",
  "ChecklistState",
] as const;
