import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { motionInitScript, themeInitScript } from "@subiza/ui/preferences";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Subiza Studio",
  description: "The business console.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="rw"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
      </head>
      <body>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
