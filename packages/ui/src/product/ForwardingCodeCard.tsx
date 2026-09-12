import { Button } from "../atoms/Button";
import { Icon } from "../icons/Icon";

export function ForwardingCodeCard({
  number,
  platformNote,
  heading = "Forwarding code",
  offNote = "Off-switch: ##61#",
  copyLabel = "Copy",
  dialLabel = "Open dialer",
}: {
  number: string;
  platformNote: string;
  heading?: string;
  offNote?: string;
  copyLabel?: string;
  dialLabel?: string;
}) {
  const on = `**61*${number}*11*20#`;
  return (
    <article className="fcode">
      <div className="fcode-h">
        <Icon name="phone-forwarded" size={14} />
        {heading}
      </div>
      <div className="fcode-b">
        <p className="fcode-s">
          **61*<b>{number}</b>*11*20#
        </p>
        <p className="fcode-n">{offNote}</p>
      </div>
      <div className="fcode-a">
        <Button tone="primary" data-copy={on}>
          {copyLabel}
        </Button>
        <Button tone="secondary" asChild>
          <a href={`tel:${encodeURIComponent(on)}`}>{dialLabel}</a>
        </Button>
      </div>
      <p className="fcode-plat">
        <Icon name="smartphone" size={14} />
        <span>
          <b>Copy is the action that works.</b> {platformNote}
        </span>
      </p>
    </article>
  );
}
