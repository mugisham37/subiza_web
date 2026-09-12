import { cx } from "../lib/cx";

const SLOTS = [0, 1, 2, 3, 4, 5] as const;

export function OtpField({
  id,
  name = "code",
  invalid,
  disabled,
  describedBy,
  defaultValue,
}: {
  id: string;
  name?: string;
  invalid?: boolean;
  disabled?: boolean;
  describedBy?: string;
  defaultValue?: string;
}) {
  return (
    <div className={cx("otp", invalid && "is-invalid")} data-otp={invalid ? "invalid" : ""}>
      <input
        type="text"
        id={id}
        name={name}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        enterKeyHint="done"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...(describedBy ? { "aria-describedby": describedBy } : {})}
        {...(defaultValue !== undefined ? { defaultValue } : {})}
      />
      <span className="slots" aria-hidden="true">
        {SLOTS.map((slot) => (
          <span key={slot} className="slot" />
        ))}
      </span>
    </div>
  );
}
