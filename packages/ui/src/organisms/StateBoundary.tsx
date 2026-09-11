import type { ReactNode } from "react";
import type { ViewState } from "@subiza/core";
import { LoadingState } from "../states/LoadingState";
import { EmptyState } from "../states/EmptyState";
import { OfflineState } from "../states/OfflineState";
import { PartialState } from "../states/PartialState";
import { DeniedState } from "../states/DeniedState";
import { NotFoundState } from "../states/NotFoundState";
import { RateLimitedState } from "../states/RateLimitedState";
import { ErrorState } from "../states/ErrorState";

export function StateBoundary<T>({
  state,
  renderReady,
  copy,
}: {
  state: ViewState<T>;
  renderReady: (data: T, missing?: readonly string[]) => ReactNode;
  copy: {
    emptyTitle: string;
    emptyBody: string;
    emptyAction: ReactNode;
    offline: string;
    deniedTitle: string;
    deniedBody: (whoCan: readonly string[]) => string;
    notFoundTitle: string;
    rateLimited: (minutes: number) => string;
    errorTitle: string;
    errorBody: string;
    support: string;
  };
}) {
  switch (state.status) {
    case "loading":
      return <LoadingState />;
    case "empty":
      return (
        <EmptyState title={copy.emptyTitle} action={copy.emptyAction}>
          {copy.emptyBody}
        </EmptyState>
      );
    case "ready":
      return renderReady(state.data);
    case "partial":
      return (
        <PartialState missing={state.missing}>{renderReady(state.data, state.missing)}</PartialState>
      );
    case "offline":
      return <OfflineState queued={state.queued} message={copy.offline} />;
    case "denied":
      return (
        <DeniedState
          title={copy.deniedTitle}
          body={copy.deniedBody(state.whoCan)}
        />
      );
    case "notFound":
      return (
        <NotFoundState
          title={copy.notFoundTitle}
          what={state.what}
          href={state.goInstead.href}
          label={state.goInstead.label}
        />
      );
    case "rateLimited":
      return <RateLimitedState message={copy.rateLimited(state.retryAfterMinutes)} />;
    case "error":
      return (
        <ErrorState
          title={copy.errorTitle}
          body={copy.errorBody}
          {...(state.digest ? { digest: state.digest } : {})}
          support={copy.support}
        />
      );
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
