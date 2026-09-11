import { themeInitScript } from "@subiza/ui/preferences";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <main className="wrap">
          <h1>We cannot find that page</h1>
          <p>It may have moved. Go back to the design system.</p>
          <a className="btn btn-primary" href="/en/design-system">
            Design system
          </a>
        </main>
      </body>
    </html>
  );
}
