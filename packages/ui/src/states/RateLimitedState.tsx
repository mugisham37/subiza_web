import { Banner } from "../molecules/Banner";

export function RateLimitedState({ message }: { message: string }) {
  return (
    <Banner tone="warn" title="Try again shortly">
      {message}
    </Banner>
  );
}
