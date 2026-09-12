import { ImageResponse } from "next/og";
import { siteLocales } from "@subiza/i18n";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return siteLocales.map((lang) => ({ lang }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const title =
    lang === "rw" ? "Nta mukiriya wongera gutakara." : "Nobody misses a call again.";
  const lede =
    lang === "rw"
      ? "Isubiza telefone n'ubutumwa, mu Kinyarwanda."
      : "Answers the phone and the messages, in Kinyarwanda.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#F4F1EA",
          color: "#1C2A12",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, textTransform: "uppercase" }}>
          Subiza
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 600, maxWidth: 900 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: "#4A5A3C" }}>{lede}</div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#4A5A3C" }}>Kigali · 0788 782 492</div>
      </div>
    ),
    size,
  );
}
