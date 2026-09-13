import { ButtonLink } from "@subiza/ui";

const SITE = process.env["NEXT_PUBLIC_SITE_ORIGIN"] ?? "http://localhost:3000";

export default function SignInPage() {
  return (
    <main id="content" className="authbody" style={{ padding: "4rem 1.5rem" }}>
      <h1>Sign in on the public site</h1>
      <p>Studio opens after you confirm the number you already use.</p>
      <ButtonLink href={`${SITE}/rw/signin`} tone="primary" size="lg">
        Continue to sign in
      </ButtonLink>
    </main>
  );
}
