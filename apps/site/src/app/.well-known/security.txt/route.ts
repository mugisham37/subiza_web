import { CONTACT_EMAIL, DPO_EMAIL, SITE_ORIGIN } from "@subiza/core";

export function GET() {
  const body = [
    `Contact: mailto:${DPO_EMAIL}`,
    `Contact: mailto:${CONTACT_EMAIL}`,
    `Expires: 2027-09-11T00:00:00.000Z`,
    `Canonical: ${SITE_ORIGIN}/.well-known/security.txt`,
    `Preferred-Languages: rw, en`,
  ].join("\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
