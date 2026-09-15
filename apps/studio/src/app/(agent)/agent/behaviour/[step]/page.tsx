import { AGENT_STEPS } from "@subiza/domain";
import { ViewTransition } from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isAgentStep } from "@/features/agent/steps";
import { AgentView } from "@/views/AgentView/AgentView";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return AGENT_STEPS.map((step) => ({ step }));
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ step: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { step } = await params;
  if (!isAgentStep(step)) notFound();
  const search = await searchParams;
  return (
    <Suspense>
      <ViewTransition>
        <AgentView step={step} search={search as Record<string, string | string[] | undefined>} />
      </ViewTransition>
    </Suspense>
  );
}
