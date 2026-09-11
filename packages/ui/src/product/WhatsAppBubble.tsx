import { Icon } from "../icons/Icon";

export function WhatsAppBubble({
  name,
  outcome,
  weakness,
  href,
  time,
}: {
  name: string;
  outcome: string;
  weakness: string;
  href: string;
  time: string;
}) {
  return (
    <article className="wamsg">
      <div className="wamsg-h">
        <span className="m">
          <Icon name="message-circle" size={15} />
        </span>
        <div>
          <b>Subiza</b>
          <span>Weekly report</span>
        </div>
      </div>
      <div className="wamsg-b">
        <div className="wabub">
          Muraho {name}.
          <span className="big">{outcome}</span>
          {weakness}{" "}
          <a href={href}>Open the week</a>
          <time>{time}</time>
        </div>
      </div>
    </article>
  );
}
