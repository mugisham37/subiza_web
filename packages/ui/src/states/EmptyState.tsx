import type { ReactNode } from "react";
import { Empty } from "../molecules/Empty";

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Empty title={title} action={action}>
      {children}
    </Empty>
  );
}
