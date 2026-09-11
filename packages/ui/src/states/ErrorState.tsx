import { Banner } from "../molecules/Banner";

export function ErrorState({
  title,
  body,
  digest,
  support,
}: {
  title: string;
  body: string;
  digest?: string;
  support: string;
}) {
  return (
    <Banner tone="risk" title={title}>
      {body} {support}
      {digest ? <small> {digest}</small> : null}
    </Banner>
  );
}
