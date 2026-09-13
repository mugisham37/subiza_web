import { derivePhoneStep, normalizePhoneChannel, emptyPhoneChannel } from "@subiza/domain";
import { SUBIZA_FORWARD_NUMBER, bundleOf } from "@subiza/auth-tenant";
import { redirect } from "next/navigation";
import { requireStudioContext } from "@/lib/session";
import { hrefForPhone } from "@/features/phone/steps";

export const dynamic = "force-dynamic";

export default async function Page() {
  const ctx = await requireStudioContext();
  const phone = normalizePhoneChannel(
    bundleOf(ctx).phone ?? emptyPhoneChannel(SUBIZA_FORWARD_NUMBER),
    SUBIZA_FORWARD_NUMBER,
  );
  redirect(hrefForPhone(derivePhoneStep(phone)) as never);
}
