import { Button } from "../atoms/Button";
import { StatusDot } from "../atoms/StatusDot";
import { Waveform } from "./Waveform";

export function LiveCallCard({
  who,
  line,
  elapsed,
  compact,
  liveLabel = "On a call now",
  primaryLabel = "Take the call",
  secondaryLabel = "Listen in",
}: {
  who: string;
  line: string;
  elapsed: string;
  compact?: boolean;
  liveLabel?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  return (
    <article className="callcard">
      <div className="cc-top">
        <span className="cc-live">
          <i />
          {liveLabel}
        </span>
        <span className="cc-time">{elapsed}</span>
      </div>
      <div className="cc-who">
        <span className="cc-av">{who.slice(0, 1)}</span>
        <div>
          <b>{who}</b>
          {compact ? null : <span>{line}</span>}
        </div>
      </div>
      <Waveform />
      <div className="cc-acts">
        <Button tone="primary" block={compact}>
          {primaryLabel}
        </Button>
        {compact ? null : <Button tone="secondary">{secondaryLabel}</Button>}
      </div>
      {compact ? null : <StatusDot tone="live">Live</StatusDot>}
    </article>
  );
}
