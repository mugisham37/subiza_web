import { Button } from "../atoms/Button";
import { Icon } from "../icons/Icon";

export function ForwardingCodeCard({
  number,
  platformNote,
}: {
  number: string;
  platformNote: string;
}) {
  const on = `**61*${number}*11*20#`;
  return (
    <article className="fcode">
      <div className="fcode-h">
        <Icon name="phone-forwarded" size={14} />
        Forwarding code
      </div>
      <div className="fcode-b">
        <p className="fcode-s">
          **61*<b>{number}</b>*11*20#
        </p>
        <p className="fcode-n">Off-switch: ##61#</p>
      </div>
      <div className="fcode-a">
        <Button tone="primary" data-copy={on}>
          Copy
        </Button>
        <Button tone="secondary" asChild>
          <a href={`tel:${encodeURIComponent(on)}`}>Open dialer</a>
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
