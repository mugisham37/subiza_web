import { Tag } from "../atoms/Tag";
import { Toast } from "../molecules/Toast";

export function OfflineState({ queued, message }: { queued: number; message: string }) {
  return (
    <div>
      <Toast>{message}</Toast>
      <Tag tone="warn">Pending {queued}</Tag>
    </div>
  );
}
