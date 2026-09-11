import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { routing } from "@/i18n/routing";
import { motionInitScript, themeInitScript } from "@subiza/ui/preferences";
import "../globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: true,
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: true,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  adjustFontFallback: true,
});

function spriteMarkup() {
  try {
    return readFileSync(
      join(process.cwd(), "../../packages/ui/src/icons/sprite.svg"),
      "utf8",
    );
  } catch {
    return "";
  }
}

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Subiza",
  description: "The system that answers.",
};

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) notFound();
  setRequestLocale(lang);
  const messages = await getMessages();

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
      </head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: spriteMarkup() }} hidden />
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
