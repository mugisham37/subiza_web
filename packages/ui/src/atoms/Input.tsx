import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cx } from "../lib/cx";
import { Hint } from "./Eyebrow";

type FieldProps = {
  id: string;
  label: string;
  optional?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ id, label, optional, hint, error, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-err` : undefined;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional ? <span className="opt">{optional}</span> : null}
      </label>
      {children}
      {error ? (
        <p className="err" id={errorId} role="alert">
          {error}
        </p>
      ) : hint ? (
        <Hint {...(hintId ? { id: hintId } : {})}>{hint}</Hint>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={cx("inp", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      className={cx("inp", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function InputWrap({
  lead,
  trail,
  children,
}: {
  lead?: ReactNode;
  trail?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="inpwrap">
      {lead ? <span className="lead">{lead}</span> : null}
      {children}
      {trail ? <span className="trail">{trail}</span> : null}
    </div>
  );
}
