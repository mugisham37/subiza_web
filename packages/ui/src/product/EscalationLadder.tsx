import { cx } from "../lib/cx";

export type LadderRung = {
  title: string;
  detail: string;
  time?: string;
  state?: "done" | "now";
};

export function EscalationLadder({ rungs }: { rungs: readonly LadderRung[] }) {
  return (
    <ol className="ladder">
      {rungs.map((rung) => (
        <li key={rung.title} className={cx("rung", rung.state)}>
          <div className="rb">
            <b>{rung.title}</b>
            <span>{rung.detail}</span>
          </div>
          {rung.time ? <span className="rt">{rung.time}</span> : null}
        </li>
      ))}
    </ol>
  );
}
