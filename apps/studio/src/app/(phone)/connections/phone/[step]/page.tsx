import { PHONE_STEPS } from "@subiza/domain";
import { ViewTransition } from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isPhoneStep } from "@/features/phone/steps";
import { PhoneView } from "@/views/PhoneView/PhoneView";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return PHONE_STEPS.map((step) => ({ step }));
}

export default async function Page({
  params,
  searchParams,
}: PageProps<"/connections/phone/[step]">) {
  const { step } = await params;
  if (!isPhoneStep(step)) notFound();
  const search = await searchParams;
  return (
    <Suspense>
      <ViewTransition>
        <PhoneView step={step} search={search as Record<string, string | string[] | undefined>} />
      </ViewTransition>
    </Suspense>
  );
}
