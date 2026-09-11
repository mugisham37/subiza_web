import type { InputHTMLAttributes } from "react";
import { cx } from "../lib/cx";

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function Toggle({ label, className, id, ...props }: ToggleProps) {
  return (
    <label className={cx("tgl", className)} htmlFor={id}>
      <input id={id} type="checkbox" {...props} />
      <span className="track" />
      <span className="tl">{label}</span>
    </label>
  );
}
