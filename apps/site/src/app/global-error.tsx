"use client";

import { motionInitScript, themeInitScript } from "@subiza/ui/preferences";
import "./globals.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
      </head>
      <body>
        <main className="wrap">
          <h1>Something went wrong on our side</h1>
          <p>We know, and we are looking. This is not your fault.</p>
          {error.digest ? <p className="hint">{error.digest}</p> : null}
          <button type="button" className="btn btn-primary" onClick={() => retry()}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
