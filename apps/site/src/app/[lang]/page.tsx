import { SITE_ORIGIN } from "@subiza/core";
import { ViewTransition } from "react";
import { HomeView } from "@/views/HomeView/HomeView";
import { asSiteLocale } from "@/lib/locale";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "Subiza",
                url: SITE_ORIGIN,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Kigali",
                  addressCountry: "RW",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+250788782492",
                  email: "muraho@subiza.rw",
                  contactType: "customer support",
                },
              },
              {
                "@type": "WebSite",
                name: "Subiza",
                url: SITE_ORIGIN,
              },
            ],
          }),
        }}
      />
      <HomeView lang={asSiteLocale(lang)} />
    </ViewTransition>
  );
}
