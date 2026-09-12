import { Icon } from "@subiza/ui";

export function FaqList({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>
            {item.q}
            <Icon name="chevron-down" size={16} />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
