import type { InputHTMLAttributes, ReactNode } from "react";

export function LadderOption({
  n,
  title,
  detail,
  recommended,
  id,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  n: number;
  title: ReactNode;
  detail: string;
  recommended?: string;
}) {
  return (
    <label className="ladderopt" htmlFor={id}>
      <input id={id} type="radio" {...props} />
      <span className="lb">
        <span className="ln">{n}</span>
        <span>
          <b>
            {title}
            {recommended ? <span className="lrec">{recommended}</span> : null}
          </b>
          <span className="ld">{detail}</span>
        </span>
      </span>
    </label>
  );
}
