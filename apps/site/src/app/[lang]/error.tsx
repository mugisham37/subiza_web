"use client";

import { Button } from "@subiza/ui";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main id="content" className="sec">
      <div className="sc sc-n">
        <h1>Something went wrong on our side</h1>
        <p>We know, and we are looking. This is not your fault.</p>
        {error.digest ? <p className="hint">{error.digest}</p> : null}
        <Button type="button" tone="primary" onClick={() => retry()}>
          Try again
        </Button>
      </div>
    </main>
  );
}
