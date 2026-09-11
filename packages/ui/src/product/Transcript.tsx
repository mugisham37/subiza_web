import { cx } from "../lib/cx";

export type TranscriptTurn = {
  id: string;
  speaker: "ai" | "human";
  name: string;
  time: string;
  text: string;
  original?: string;
  confidence?: "hi" | "mid" | "lo";
  mark?: string;
};

const CONF = { hi: "Clear", mid: "Partly clear", lo: "Unclear" } as const;

export function Transcript({ turns }: { turns: readonly TranscriptTurn[] }) {
  return (
    <ol className="tscript">
      {turns.map((turn) => (
        <li key={turn.id} className={cx("turn", turn.speaker)}>
          <span className="tav">{turn.speaker === "ai" ? "AI" : turn.name.slice(0, 1)}</span>
          <div className="tb">
            <div className="tmeta">
              <b>{turn.name}</b>
              <time>{turn.time}</time>
              {turn.confidence ? (
                <span className={cx("conf", turn.confidence)}>
                  <i>
                    <b />
                    <b />
                    <b />
                  </i>
                  {CONF[turn.confidence]}
                </span>
              ) : null}
            </div>
            <p className="tt">{turn.text}</p>
            {turn.original ? <p className="torig">{turn.original}</p> : null}
            {turn.mark ? (
              <div className="tmark">
                <span>{turn.mark}</span>
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
