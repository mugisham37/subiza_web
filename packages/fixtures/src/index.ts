import { asConversationId, asTenantId, type ViewState } from "@subiza/core";

export const demoTenantId = asTenantId("ten_demo_remera");
export const demoConversationId = asConversationId("con_demo_001");

export const readyGreeting: ViewState<{ name: string }> = {
  status: "ready",
  data: { name: "Claudine" },
};

export const emptyInbox: ViewState<never> = { status: "empty" };
