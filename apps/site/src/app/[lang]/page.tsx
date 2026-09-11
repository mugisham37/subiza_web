import { ViewTransition } from "react";
import { ButtonLink } from "@subiza/ui";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <main id="content" className="wrap">
        <p className="eyebrow">Subiza</p>
        <h1 className="h0">Foundation is up.</h1>
        <p className="docint">
          Phase 1 ships the design system, not a marketing page. That is Prompt 02.
        </p>
        <ButtonLink href={`/${lang}/design-system`}>Open the design system</ButtonLink>
      </main>
    </ViewTransition>
  );
}
