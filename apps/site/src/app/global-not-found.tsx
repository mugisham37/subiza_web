import { themeInitScript } from "@subiza/ui/preferences";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <title>We cannot find that page — Subiza</title>
        <main id="content" className="sec">
          <div className="sc sc-n">
            <h1>We cannot find that page</h1>
            <p>It is not the homepage in disguise. The address is wrong, or the page has moved.</p>
            <a className="btn btn-primary" href="/en">
              Back to Subiza
            </a>
            <a className="btn btn-secondary" href="/en/how">
              See how it works
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
