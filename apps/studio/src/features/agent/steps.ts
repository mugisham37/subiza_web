import { AGENT_STEPS, isAgentStep, isAgentView, type AgentStep, type AgentView } from "@subiza/domain";

export { isAgentStep, isAgentView };

export function hrefForAgent(step: AgentStep, view: AgentView = "simple", from?: AgentView): string {
  const base = `/agent/behaviour/${step}`;
  const params = new URLSearchParams();
  if (view === "advanced") params.set("view", "advanced");
  if (from && from !== view) params.set("from", from);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function agentSteps() {
  return AGENT_STEPS;
}
