import type { ReactNode } from "react";
import { Icon } from "../icons/Icon";
import { cx } from "../lib/cx";

export type VoiceOption = {
  id: string;
  title: string;
  detail: string;
  suggested?: boolean;
  src?: string;
  transcript: string;
};

export function VoiceLibrary({
  voices,
  name = "voice",
  selected,
  hearingNothing,
  playLabel,
}: {
  voices: readonly VoiceOption[];
  name?: string;
  selected?: string;
  hearingNothing?: ReactNode;
  playLabel: string;
}) {
  return (
    <div className="voices">
      {voices.map((voice) => (
        <label key={voice.id} className="voice">
          <input type="radio" name={name} value={voice.id} defaultChecked={selected === voice.id} />
          <span className="vb">
            <span className="vm">
              <b>{voice.title}</b>
              <span>{voice.detail}</span>
            </span>
            <audio className="v-audio" controls preload="none" aria-label={`${playLabel}: ${voice.title}`}>
              {voice.src ? <source src={voice.src} type="audio/wav" /> : null}
            </audio>
            <span className="vw" aria-hidden="true">
              <i style={{ ["--h" as string]: "40%" }} />
              <i style={{ ["--h" as string]: "70%" }} />
              <i style={{ ["--h" as string]: "30%" }} />
            </span>
          </span>
          <p className="v-transcript">{voice.transcript}</p>
        </label>
      ))}
      {hearingNothing ? <div className="hear-none">{hearingNothing}</div> : null}
    </div>
  );
}

export function VoicePlayHint({ children }: { children: ReactNode }) {
  return (
    <div className="banner banner-info hear-guide">
      <Icon name="volume-2" size={16} />
      <div>{children}</div>
    </div>
  );
}

export function voiceClass(playing: boolean): string {
  return cx("vplay", playing && "playing");
}
