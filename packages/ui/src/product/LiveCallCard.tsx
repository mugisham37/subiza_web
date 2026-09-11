import { Button } from "../atoms/Button";
import { StatusDot } from "../atoms/StatusDot";
import { Waveform } from "./Waveform";

export function LiveCallCard({
  who,
  line,
  elapsed,
  compact,
}: {
  who: string;
  line: string;
  elapsed: string;
  compact?: boolean;
}) {
  return (
    <article className="callcard">
      <div className="cc-top">
        <span className="cc-live">
          <i />
          On a call now
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
          Take the call
        </Button>
        {compact ? null : <Button tone="secondary">Listen in</Button>}
      </div>
      {compact ? null : <StatusDot tone="live">Live</StatusDot>}
    </article>
  );
}
