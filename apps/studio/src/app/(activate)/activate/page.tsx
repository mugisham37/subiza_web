import { currentStep } from "@subiza/auth-tenant";
import { redirect } from "next/navigation";
import { requireStudioContext } from "@/lib/session";
import { hrefFor } from "@/features/activation/steps";

export default async function Page() {
  const ctx = await requireStudioContext();
  redirect(hrefFor(currentStep(ctx)) as never);
}
