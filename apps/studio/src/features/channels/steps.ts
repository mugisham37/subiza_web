import {
  isMessagingChannel,
  isMessagingStep,
  stepBelongsTo,
  type MessagingChannel,
  type MessagingStep,
} from "@subiza/domain";

export function hrefForChannel(channel: MessagingChannel, step: MessagingStep): string {
  return `/connections/messaging/${channel}/${step}`;
}

export { isMessagingChannel, isMessagingStep, stepBelongsTo };
