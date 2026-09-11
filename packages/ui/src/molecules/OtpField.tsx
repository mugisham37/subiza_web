"use client";

import { OTPInput, type SlotProps } from "input-otp";
import { cx } from "../lib/cx";

function Slot({ char, isActive, hasFakeCaret }: SlotProps) {
  return (
    <span className={cx("slot", char && "filled", isActive && "cursor")}>
      {char}
      {hasFakeCaret ? null : null}
    </span>
  );
}

export function OtpField({
  id,
  value,
  onChange,
  invalid,
  disabled,
}: {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
}) {
  return (
    <OTPInput
      {...(id ? { id } : {})}
      maxLength={6}
      {...(value !== undefined ? { value } : {})}
      {...(onChange ? { onChange } : {})}
      {...(disabled !== undefined ? { disabled } : {})}
      containerClassName={cx("otp", invalid && "is-invalid")}
      inputMode="numeric"
      autoComplete="one-time-code"
      textAlign="left"
      render={({ slots }) => (
        <span className="slots" aria-hidden>
          {slots.map((slot, index) => (
            <Slot key={index} {...slot} />
          ))}
        </span>
      )}
    />
  );
}
