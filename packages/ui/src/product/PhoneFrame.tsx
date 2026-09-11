import type { ReactNode } from "react";

export function PhoneFrame({
  time = "09:41",
  children,
}: {
  time?: string;
  children: ReactNode;
}) {
  return (
    <div className="phone">
      <div className="phone-top">
        <span>{time}</span>
        <span>Subiza</span>
      </div>
      <div className="phone-bd">{children}</div>
    </div>
  );
}
