import type { ReactNode } from "react";
import { Icon } from "../icons/Icon";
import { Tag } from "../atoms/Tag";
import { cx } from "../lib/cx";

export function ReviewTurn({
  speaker,
  name,
  time,
  text,
  translation,
  flagged,
  why,
  sources,
  vote,
  voteAction,
  turnId,
  fix,
}: {
  speaker: "ai" | "human";
  name: string;
  time: string;
  text: string;
  translation?: string | undefined;
  flagged?: boolean;
  why?: string | undefined;
  sources?: readonly string[] | undefined;
  vote?: "up" | "down" | null;
  voteAction?: string;
  turnId?: string;
  fix?: ReactNode;
}) {
  return (
    <article className={cx("rturn", speaker === "human" ? "you" : "ai", flagged && "flagged")}>
      <div className="rh">
        <span className="ra">{speaker === "ai" ? "AI" : "YOU"}</span>
        <b>{name}</b>
        <time>{time}</time>
        {flagged ? <Tag tone="warn">Heard you less clearly</Tag> : null}
        {speaker === "ai" && voteAction ? (
          <span className="rv">
            <button className={cx("vote", "up", vote === "up" && "on")} formAction={voteAction} name="vote" value={`${turnId}:up`} aria-label="Good answer" type="submit">
              <Icon name="thumbs-up" size={14} />
            </button>
            <button className={cx("vote", "down", vote === "down" && "on")} formAction={voteAction} name="vote" value={`${turnId}:down`} aria-label="Wrong answer" type="submit">
              <Icon name="thumbs-down" size={14} />
            </button>
          </span>
        ) : null}
      </div>
      <div className="rb">
        <p>{text}</p>
        {translation ? <p className="ro">{translation}</p> : null}
      </div>
      {why ? (
        <details className="whysaid">
          <summary>
            <Icon name="chevron-right" size={14} />
            <span>{why}</span>
          </summary>
          <div className="wb">
            {sources?.map((source) => (
              <span key={source} className="srcchip">
                <Icon name="list-checks" size={12} />
                {source}
              </span>
            ))}
          </div>
        </details>
      ) : null}
      {fix}
    </article>
  );
}
