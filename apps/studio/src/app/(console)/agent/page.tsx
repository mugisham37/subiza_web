import { redirect } from "next/navigation";
import { hrefForAgent } from "@/features/agent/steps";

export const dynamic = "force-dynamic";

export default function Page() {
  redirect(hrefForAgent("behaviour") as never);
}
