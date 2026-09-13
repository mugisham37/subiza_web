import { canConnectChannel } from "@subiza/core";
import { MESSAGING_CHANNELS, stepsFor } from "@subiza/domain";
import { ViewTransition } from "react";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { isMessagingChannel, isMessagingStep, stepBelongsTo } from "@/features/channels/steps";
import { requireStudioContext } from "@/lib/session";
import { ChannelsView } from "@/views/ChannelsView/ChannelsView";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return MESSAGING_CHANNELS.flatMap((channel) =>
    stepsFor(channel).map((step) => ({ channel, step })),
  );
}

export default async function Page({
  params,
  searchParams,
}: PageProps<"/connections/messaging/[channel]/[step]">) {
  const { channel, step } = await params;
  if (!isMessagingChannel(channel) || !isMessagingStep(step) || !stepBelongsTo(channel, step)) {
    notFound();
  }
  const search = await searchParams;
  const ctx = await requireStudioContext();
  if (canConnectChannel(ctx.role) && ctx.strength !== "recovered" && ctx.strength !== "elevated") {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(search as Record<string, string | string[] | undefined>)) {
      if (typeof value === "string") qs.set(key, value);
    }
    const next = `/connections/messaging/${channel}/${step}${qs.size ? `?${qs}` : ""}`;
    redirect(`/connections/messaging/enter?next=${encodeURIComponent(next)}` as never);
  }
  return (
    <Suspense>
      <ViewTransition>
        <ChannelsView channel={channel} step={step} search={search as Record<string, string | string[] | undefined>} />
      </ViewTransition>
    </Suspense>
  );
}
