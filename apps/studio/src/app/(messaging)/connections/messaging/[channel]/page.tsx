import { deriveChannelStep, emptyChannels, normalizeChannels } from "@subiza/domain";
import { bundleOf } from "@subiza/auth-tenant";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { requireStudioContext } from "@/lib/session";
import { hrefForChannel, isMessagingChannel } from "@/features/channels/steps";

export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps<"/connections/messaging/[channel]">) {
  const { channel } = await params;
  if (!isMessagingChannel(channel)) notFound();
  const ctx = await requireStudioContext();
  const channels = normalizeChannels(bundleOf(ctx).channels ?? emptyChannels());
  redirect(hrefForChannel(channel, deriveChannelStep(channels, channel)) as never);
}
