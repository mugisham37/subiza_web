import { env } from "./env";

/**
 * Alphanumeric sender IDs must be registered separately with MTN and Airtel
 * (~3 weeks each). Until that clears, codes arrive from a numeric shortcode
 * or a random number — which looks like the vishing the product warns about.
 *
 * Confirm in writing: real SMS latency on both carriers, whether RURA
 * requires sender-ID registration in addition to the carriers, and the
 * WhatsApp OTP template approval path.
 */
export type DeliveryChannel = "sms" | "whatsapp" | "voice";

export type SenderConfig = {
  smsSenderId: string;
  whatsappSender: string;
  voiceCallerId: string;
  provider: "test" | "africas-talking" | "twilio";
};

export function senderConfig(): SenderConfig {
  const provider = env("OTP_PROVIDER");
  return {
    smsSenderId: env("SMS_SENDER_ID") ?? "SUBIZA",
    whatsappSender: env("WA_SENDER") ?? "+250788782492",
    voiceCallerId: env("VOICE_CALLER_ID") ?? "+250788782492",
    provider:
      provider === "africas-talking" || provider === "twilio" ? provider : "test",
  };
}
