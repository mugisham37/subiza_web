import { ACTIVATION_STEPS } from "@subiza/domain";
import { ViewTransition } from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isActivationStep } from "@/features/activation/steps";
import { ActivateView } from "@/views/ActivateView/ActivateView";

export function generateStaticParams() {
  return ACTIVATION_STEPS.map((step) => ({ step }));
}

export default async function Page({
  params,
  searchParams,
}: PageProps<"/activate/[step]">) {
  const { step } = await params;
  if (!isActivationStep(step)) notFound();
  const search = await searchParams;
  return (
    <Suspense>
      <ViewTransition>
        <ActivateView step={step} search={search as Record<string, string | string[] | undefined>} />
      </ViewTransition>
    </Suspense>
  );
}
