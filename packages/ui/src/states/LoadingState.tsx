import { Skeleton } from "../atoms/Skeleton";

export function LoadingState() {
  return (
    <div aria-busy="true" aria-live="polite">
      <Skeleton height={18} />
      <div style={{ height: 12 }} />
      <Skeleton height={48} />
      <div style={{ height: 12 }} />
      <Skeleton height={48} />
    </div>
  );
}
