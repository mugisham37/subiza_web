import type { ReactNode } from "react";
import { Banner } from "../molecules/Banner";

export function PartialState({
  missing,
  children,
}: {
  missing: readonly string[];
  children: ReactNode;
}) {
  return (
    <div>
      {children}
      <Banner tone="info" title="Some of this is missing">
        {missing.join(" · ")}
      </Banner>
    </div>
  );
}
