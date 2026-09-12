import { ButtonLink } from "@subiza/ui";

export default function NotFound() {
  return (
    <main id="content" className="sec">
      <title>We cannot find that page — Subiza</title>
      <div className="sc sc-n">
        <h1>We cannot find that page</h1>
        <p>It is not the homepage in disguise. The address is wrong, or the page has moved.</p>
        <ButtonLink href="/en" tone="primary">
          Back to Subiza
        </ButtonLink>
        <ButtonLink href="/en/how" tone="secondary">
          See how it works
        </ButtonLink>
      </div>
    </main>
  );
}
