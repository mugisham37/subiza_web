import { ButtonLink } from "../atoms/Button";
import { Empty } from "../molecules/Empty";

export function NotFoundState({
  title,
  what,
  href,
  label,
}: {
  title: string;
  what: string;
  href: string;
  label: string;
}) {
  return (
    <Empty title={title} action={<ButtonLink href={href}>{label}</ButtonLink>}>
      {what}
    </Empty>
  );
}
