import { z } from "zod";

export const LIBRARY_VOICES = ["warm-female", "calm-female", "warm-male", "brisk-male"] as const;
export type LibraryVoiceId = (typeof LIBRARY_VOICES)[number];
export const libraryVoiceSchema = z.enum(LIBRARY_VOICES);

export const voiceSelectionSchema = z.object({
  voiceId: libraryVoiceSchema.nullable(),
  language: z.enum(["rw", "en"]),
  confirmedAt: z.number().nullable(),
  /** Cloning is Prompt 09. Activation only links out. */
  cloneOffered: z.literal(false),
});
export type VoiceSelection = z.infer<typeof voiceSelectionSchema>;

export function emptyVoiceSelection(language: "rw" | "en"): VoiceSelection {
  return {
    voiceId: null,
    language,
    confirmedAt: null,
    cloneOffered: false,
  };
}

export const VOICE_SUGGESTIONS: Record<string, LibraryVoiceId> = {
  salon: "warm-female",
  clinic: "calm-female",
  restaurant: "warm-male",
  shop: "brisk-male",
  repair: "brisk-male",
  generic: "warm-female",
};
