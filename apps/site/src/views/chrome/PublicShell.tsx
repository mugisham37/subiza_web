import type { SiteLocale } from "@subiza/i18n";
import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { StickyCta } from "./StickyCta";

export function PublicShell({
  lang,
  path,
  children,
}: {
  lang: SiteLocale;
  path: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader lang={lang} path={path} />
      <div className="public-main" id="content">
        {children}
      </div>
      <SiteFooter />
      <StickyCta />
    </>
  );
}
