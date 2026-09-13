import type { InputHTMLAttributes } from "react";
import { Input } from "../atoms/Input";

type PhoneFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  countryCode?: string;
  invalid?: boolean;
};

export function PhoneField({
  countryCode = "+250",
  id,
  invalid,
  ...props
}: PhoneFieldProps) {
  return (
    <div className="phonefield">
      <span className="cc" aria-hidden="true">
        🇷🇼 {countryCode}
      </span>
      <Input id={id} inputMode="numeric" autoComplete="tel-national" {...(invalid ? { invalid } : {})} {...props} />
    </div>
  );
}
