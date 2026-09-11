import { Empty } from "../molecules/Empty";

export function DeniedState({ title, body }: { title: string; body: string }) {
  return <Empty title={title}>{body}</Empty>;
}
