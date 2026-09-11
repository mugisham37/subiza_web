import type { InputHTMLAttributes, ReactNode } from "react";
import { Input } from "../atoms/Input";

type PhoneFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  countryCode?: string;
  countryControl?: ReactNode;
};

export function PhoneField({
  countryCode = "+250",
  countryControl,
  id,
  ...props
}: PhoneFieldProps) {
  return (
    <div className="phonefield">
      {countryControl ?? (
        <button type="button" className="cc" aria-label="Country code">
          {countryCode}
        </button>
      )}
      <Input id={id} inputMode="tel" autoComplete="tel" {...props} />
    </div>
  );
}
